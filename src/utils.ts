export type ErrorType = 'http' | 'network' | 'timeout' | 'parse';

export function createError(type: ErrorType, details: string): Error {
  switch (type) {
    case 'http':
      return new Error(`HTTP Error: ${details}`);
    case 'network':
      return new Error(`Network Error: ${details}`);
    case 'timeout':
      return new Error(`Request timeout after ${details}ms`);
    case 'parse':
      return new Error(`Failed to parse JSON response - ${details}`);
    default:
      return new Error(details);
  }
} 