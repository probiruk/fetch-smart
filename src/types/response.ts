/**
 * Standard response format for all requests
 */
export interface FetchResponse<T> {
  /** Parsed response data */
  data: T | null;
  
  /** HTTP status code */
  status: number;
  
  /** HTTP status text */
  statusText: string;
  
  /** Whether the request was successful (status in 200-299 range) */
  ok: boolean;
  
  /** Final URL after any redirects */
  url: string;
  
  /** Response headers */
  headers: Headers;
  
  /** Timestamp when request was initiated */
  requestTime: number;
  
  /** Timestamp when response was received */
  responseTime: number;
  
  /** Total duration of the request in milliseconds */
  duration: number;
  
  /** Error message if request failed */
  error: string | null;
  
  /** Number of retry attempts made */
  retries: number;
  
  /** Maximum number of retry attempts allowed */
  maxRetries: number;
  
  /** Request identifier if provided */
  requestId?: string;
  
  /** Whether the response was served from cache */
  isCached: boolean;
} 