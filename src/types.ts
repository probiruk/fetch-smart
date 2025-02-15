export interface FetchResponse<T> {
  data: T | null;
  status: number;
  statusText: string;
  ok: boolean;
  url: string;
  headers: Headers;
  requestTime: number;
  responseTime: number;
  duration: number;
  error: string | null;
  retries: number;
  maxRetries: number;
  requestId?: string;
  isCached: boolean;
}

export type CacheMode = 'default' | 'no-store' | 'reload' | 'force-cache' | 'only-if-cached';
export type RedirectMode = 'follow' | 'error' | 'manual';
export type CredentialsMode = 'omit' | 'same-origin' | 'include';
export type RequestMode = 'cors' | 'no-cors' | 'same-origin';
export type ReferrerPolicy = 
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export type RequestPriority = 'high' | 'low' | 'auto';

export const RESPONSE_TYPES = {
  JSON: 'json',
  TEXT: 'text',
  BLOB: 'blob',
  ARRAY_BUFFER: 'arraybuffer',
  FORM_DATA: 'formdata'
} as const;

export type ResponseType = (typeof RESPONSE_TYPES)[keyof typeof RESPONSE_TYPES];

export interface ProgressEvent {
  loaded: number;
  total: number;
  progress: number;
}

export interface RequestConfig {
  body?: unknown;
  params?: Record<string, string>;
  timeout?: number;
  headers?: HeadersInit;
  retry?: number;
  retryDelay?: number;
  exponentialDelay?: boolean;
  retryCondition?: () => boolean;
  cache?: CacheMode;
  redirect?: RedirectMode;
  credentials?: CredentialsMode;
  mode?: RequestMode;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  withCredentials?: boolean;
  signal?: AbortSignal;
  requestId?: string;
  responseType?: ResponseType;
  priority?: RequestPriority;
  onDownloadProgress?: (progress: ProgressEvent) => void;
  onUploadProgress?: (progress: ProgressEvent) => void;
  json?: object;
  form?: FormData;
}
