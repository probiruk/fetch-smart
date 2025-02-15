/**
 * Supported HTTP request methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * Supported response types for parsing response data
 */
export const RESPONSE_TYPES = {
  /** Standard JSON response */
  JSON: 'json',
  /** Plain text response */
  TEXT: 'text',
  /** Binary blob response */
  BLOB: 'blob',
  /** Array buffer for binary data */
  ARRAY_BUFFER: 'arraybuffer',
  /** Form data response */
  FORM_DATA: 'formdata'
} as const;

export type ResponseType = typeof RESPONSE_TYPES[keyof typeof RESPONSE_TYPES];

/**
 * Progress event information for upload/download tracking
 */
export interface ProgressEvent {
  /** Number of bytes transferred */
  loaded: number;
  /** Total number of bytes to transfer */
  total: number;
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Cache modes for request caching behavior
 */
export type CacheMode = 'default' | 'no-store' | 'reload' | 'force-cache' | 'only-if-cached';

/**
 * Redirect modes for handling redirects
 */
export type RedirectMode = 'follow' | 'error' | 'manual';

/**
 * Credentials modes for cross-origin requests
 */
export type CredentialsMode = 'omit' | 'same-origin' | 'include';

/**
 * CORS modes for cross-origin requests
 */
export type RequestMode = 'cors' | 'no-cors' | 'same-origin';

/**
 * Referrer policies for requests
 */
export type ReferrerPolicy = 
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

/**
 * Request priority levels
 */
export type RequestPriority = 'high' | 'low' | 'auto'; 