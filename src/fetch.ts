import { FetchResponse, RequestConfig, ProgressEvent, ResponseType } from './types';
import { createError } from './utils';
import { DEFAULT_HEADERS } from './constants';
import { RESPONSE_TYPES } from './types';

export class FetchSmart {
  private baseURL?: string;
  private headers?: HeadersInit;

  constructor(baseURL?: string, headers: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  private serializeParams(params?: Record<string, string>): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    return `?${searchParams.toString()}`;
  }

  private async createResponse<T>(
    response: Response,
    data: T | null,
    error: string | null,
    requestTime: number,
    retries: number,
    maxRetries: number,
    requestId?: string
  ): Promise<FetchResponse<T>> {
    const responseTime = Date.now();
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: response.headers,
      requestTime,
      responseTime,
      duration: responseTime - requestTime,
      error,
      retries,
      maxRetries,
      requestId,
      isCached: response.headers.get('age') !== null || 
                response.headers.get('x-cache') !== null
    };
  }

  private async fetchWithTimeout(
    resource: string,
    options: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout, ...fetchOptions } = options;
    
    if (!timeout) {
      return fetch(resource, fetchOptions);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(resource, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw createError('timeout', String(timeout));
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetch(
    fullUrl: string,
    options: RequestInit & { timeout?: number },
    retry?: number,
    retryDelay?: number,
    exponentialDelay = true,
    retryCondition?: () => boolean
  ): Promise<FetchResponse<unknown>> {
    let attempts = 0;
    const maxAttempts = (retry ?? 0) + 1;
    let lastError: Error | null = null;
    const requestTime = Date.now();

    while (attempts < maxAttempts) {
      try {
        const response = await this.fetchWithTimeout(fullUrl, options);
        
        if (response.ok) {
          try {
            const data = await response.json();
            return this.createResponse(
              response,
              data,
              null,
              requestTime,
              attempts,
              maxAttempts - 1
            );
          } catch (jsonError) {
            lastError = createError('parse', (jsonError as Error).message);
            if (attempts === maxAttempts - 1) {
              return this.createResponse(
                response,
                null,
                lastError.message,
                requestTime,
                attempts,
                maxAttempts - 1
              );
            }
          }
        }

        lastError = createError('http', String(response.status));
        
        if (retryCondition && !retryCondition()) {
          return this.createResponse(
            response,
            null,
            lastError.message,
            requestTime,
            attempts,
            maxAttempts - 1
          );
        }
        
        if (attempts === maxAttempts - 1) {
          return this.createResponse(
            response,
            null,
            lastError.message,
            requestTime,
            attempts,
            maxAttempts - 1
          );
        }
      } catch (error) {
        if (error instanceof Error && 
            (error.message.startsWith('HTTP Error:') ||
             error.message.startsWith('Request timeout'))) {
          lastError = error;
        } else {
          lastError = createError('network', (error as Error).message);
        }

        if ((retryCondition && !retryCondition()) || attempts === maxAttempts - 1) {
          throw lastError;
        }
      }

      attempts++;
      
      if (retryDelay) {
        const delay = exponentialDelay
          ? retryDelay * 2 ** (attempts - 1)
          : retryDelay;
        await this.delay(delay);
      }
    }

    throw lastError ?? createError('network', 'Request failed');
  }

  private createProgressEvent(loaded: number, total: number): ProgressEvent {
    return {
      loaded,
      total,
      progress: total ? (loaded / total) * 100 : 0
    };
  }

  private async handleResponseType<T>(
    response: Response, 
    responseType?: ResponseType
  ): Promise<T> {
    const type = responseType ?? RESPONSE_TYPES.JSON;
    
    switch (type) {
      case RESPONSE_TYPES.JSON:
        return response.json();
      case RESPONSE_TYPES.TEXT:
        return response.text() as Promise<T>;
      case RESPONSE_TYPES.BLOB:
        return response.blob() as Promise<T>;
      case RESPONSE_TYPES.ARRAY_BUFFER:
        return response.arrayBuffer() as Promise<T>;
      case RESPONSE_TYPES.FORM_DATA:
        return response.formData() as Promise<T>;
      default:
        return response.json();
    }
  }

  private async trackProgress(
    response: Response,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<Response> {
    if (!onProgress || !response.body) return response;

    const reader = response.body.getReader();
    const contentLength = Number(response.headers.get('Content-Length')) || 0;
    let loaded = 0;
    const createProgressEvent = this.createProgressEvent.bind(this);

    const stream = new ReadableStream({
      async start(controller) {
        while (!reader.closed) {
          const { done, value } = await reader.read();
          
          if (done) {
            controller.close();
            break;
          }

          loaded += value.length;
          onProgress(createProgressEvent(loaded, contentLength));
          controller.enqueue(value);
        }
      },
    });

    return new Response(stream, response);
  }

  private async trackUploadProgress(
    body: BodyInit,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<BodyInit> {
    if (!onProgress || typeof body === 'string' || body instanceof FormData) {
      return body;
    }

    const contentLength = body instanceof Blob ? body.size : body.toString().length;
    let loaded = 0;
    const createProgressEvent = this.createProgressEvent.bind(this);

    const stream = body instanceof ReadableStream ? body : new Response(body).body;
    if (!stream) {
      throw new Error('Failed to create readable stream');
    }
    const reader = stream.getReader();

    return new ReadableStream({
      start(controller) {
        return pump();

        function pump(): Promise<void> {
          return reader.read().then(({done, value}) => {
            if (done) {
              controller.close();
              return;
            }
            loaded += value.length;
            if (onProgress) {
              onProgress(createProgressEvent(loaded, contentLength));
            }
            controller.enqueue(value);
            return pump();
          });
        }
      }
    });
  }

  private async request<T>(
    method: string,
    url: string,
    config: RequestConfig = {}
  ): Promise<FetchResponse<T>> {
    const {
      body,
      params,
      timeout,
      headers: extraHeaders,
      retry,
      retryDelay,
      exponentialDelay = true,
      retryCondition,
      cache,
      redirect,
      credentials,
      mode,
      referrer,
      referrerPolicy,
      integrity,
      withCredentials,
      signal,
      requestId,
      responseType,
      priority,
      onDownloadProgress,
      onUploadProgress,
      json,
      form
    } = config;

    const fullUrl = this.baseURL 
      ? `${this.baseURL}${url}${this.serializeParams(params)}`
      : `${url}${this.serializeParams(params)}`;

    let requestBody: BodyInit | undefined;
    const headers: Record<string, string> = {
      ...this.headers as Record<string, string>,
      ...extraHeaders as Record<string, string>,
      ...DEFAULT_HEADERS
    };

    if (json) {
      requestBody = JSON.stringify(json);
      headers['Content-Type'] = 'application/json';
    } else if (form) {
      requestBody = form;
      delete headers['Content-Type'];
    } else if (body) {
      requestBody = typeof body === 'object' ? JSON.stringify(body) : body as BodyInit;
    }

    if (requestId) {
      headers['X-Request-ID'] = requestId;
    }

    if (priority && 'priority' in Request.prototype) {
      headers['Priority'] = priority;
    }

    if (requestBody && onUploadProgress) {
      requestBody = await this.trackUploadProgress(requestBody, onUploadProgress);
    }

    const options: RequestInit & { timeout?: number } = {
      method,
      headers,
      body: requestBody,
      timeout,
      cache,
      redirect,
      credentials: withCredentials ? 'include' : credentials,
      mode,
      referrer,
      referrerPolicy,
      integrity,
      signal
    };

    try {
      const fetchResponse = await this.fetch(
        fullUrl,
        options,
        retry,
        retryDelay,
        exponentialDelay,
        retryCondition
      );

      const response = await this.trackProgress(
        new Response(fetchResponse.data ? JSON.stringify(fetchResponse.data) : null, {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: fetchResponse.headers
        }),
        onDownloadProgress
      );

      const data = await this.handleResponseType<T>(response, responseType);

      return {
        ...fetchResponse,
        data,
        requestId: config.requestId
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw createError('network', String(error));
    }
  }

  get<T>(url: string, config?: RequestConfig) {
    return this.request<T>("GET", url, config);
  }

  post<T>(url: string, body: unknown, config?: Omit<RequestConfig, 'body'>) {
    return this.request<T>("POST", url, { ...config, body });
  }

  put<T>(url: string, body: unknown, config?: Omit<RequestConfig, 'body'>) {
    return this.request<T>("PUT", url, { ...config, body });
  }

  delete<T>(url: string, config?: RequestConfig) {
    return this.request<T>("DELETE", url, config);
  }
} 