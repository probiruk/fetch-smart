Research:

Axios:
- Automatic JSON Parsing
- Robust Error Handling
- Request and Response Interceptors: Supports interceptors to modify requests or handle responses globally
- Timeout Support
- Cancellation Support
- Cross-Browser Compatibility

Cons:
Larger Bundle Siz

Fetch:
- Native Support
- Promise-Based
- Configurable: Supports various request options like headers, request methods, and body.
- Streaming Support: Supports reading data as streams, making it suitable for handling large payloads efficiently.

Ky:
- Retry Logic

Superagent:
- Support file upload

Features:

Here's the list with one-line descriptions in basic English:

1. Automatic JSON Parsing: Automatically converts the response into JSON.
2. Request Retries: Automatically retries failed requests with a delay.
3. Interceptors: Modify requests or responses globally before they’re sent or received.
4. Timeout Support: Cancels requests if they take too long.
5. Caching: Saves responses for future use to avoid repeated network requests.
6. Request Deduplication: Prevents sending the same request multiple times.
7. Cancellation: Allows cancelling ongoing requests.
8. Custom Retry Logic: Defines custom rules for retrying failed requests.
9. Global Error Handling: Manages errors in a centralized way for the whole app.
10. Automatic Content-Type Handling: Sets the correct `Content-Type` header based on the data sent.
11. Streaming: Allows receiving large data chunks without blocking the thread.
12. AbortController Support: Lets you abort requests using the `AbortController`.
13. Access-Control (CORS) Management: Helps manage CORS issues for cross-origin requests.
15. HTTP/2 Support: Optimizes requests for faster performance with HTTP/2.

16. Browser and Node.js Compatibility**: Works in both browsers and Node.js.
17. Form Data Handling: Automatically sends form data, including files.
20. Proxy and Retry for Status Codes: Routes requests through a proxy or retries specific error codes.

14. JSON Schema Validation: Validates response data against a predefined structure.


18. Progress Monitoring: Tracks the progress of uploads or downloads.
19. Custom Headers and Authentication: Adds custom headers or tokens for authentication.