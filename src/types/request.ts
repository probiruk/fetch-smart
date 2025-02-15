import {
  CacheMode,
  RedirectMode,
  CredentialsMode,
  RequestMode,
  ReferrerPolicy,
  RequestPriority,
  ResponseType,
  ProgressEvent
} from './common';

/**
 * Configuration options for making HTTP requests
 */
export interface RequestConfig {
  /**
   * Request body data
   */
  body?: unknown;

  /**
   * URL query parameters
   * @example { page: '1', limit: '10' }
   */
  params?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   * @default undefined
   */
  timeout?: number;

  /**
   * Additional headers to send with the request
   */
  headers?: HeadersInit;

  /**
   * Number of retry attempts for failed requests
   * @default 0
   */
  retry?: number;

  /**
   * Delay between retry attempts in milliseconds
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Whether to use exponential backoff for retry delays
   * @default true
   */
  exponentialDelay?: boolean;

  /**
   * Custom condition to determine if a request should be retried
   * @returns boolean indicating if retry should be attempted
   */
  retryCondition?: () => boolean;

  /**
   * Cache mode for the request
   * @default 'default'
   */
  cache?: CacheMode;

  /**
   * Redirect mode for the request
   * @default 'follow'
   */
  redirect?: RedirectMode;

  /**
   * Credentials mode for the request
   * @default 'same-origin'
   */
  credentials?: CredentialsMode;

  /**
   * CORS mode for the request
   * @default 'cors'
   */
  mode?: RequestMode;

  /**
   * Request referrer
   */
  referrer?: string;

  /**
   * Referrer policy for the request
   */
  referrerPolicy?: ReferrerPolicy;

  /**
   * Subresource integrity value
   */
  integrity?: string;

  /**
   * Whether to include credentials for cross-origin requests
   * @default false
   */
  withCredentials?: boolean;

  /**
   * AbortSignal for cancelling the request
   */
  signal?: AbortSignal;

  /**
   * Unique identifier for the request
   */
  requestId?: string;

  /**
   * Expected response type
   * @default 'json'
   */
  responseType?: ResponseType;

  /**
   * Request priority
   * @default 'auto'
   */
  priority?: RequestPriority;

  /**
   * Callback for tracking download progress
   */
  onDownloadProgress?: (progress: ProgressEvent) => void;

  /**
   * Callback for tracking upload progress
   */
  onUploadProgress?: (progress: ProgressEvent) => void;

  /**
   * JSON data to send in the request body
   * Will be automatically stringified
   */
  json?: object;

  /**
   * FormData to send in the request body
   */
  form?: FormData;
} 