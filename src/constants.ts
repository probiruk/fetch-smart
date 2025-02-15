export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
} as const; 