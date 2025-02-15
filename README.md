# FetcSmart

[![npm version](https://badge.fury.io/js/fetch-smart.svg)](https://badge.fury.io/js/fetch-smart)
[![Build Status](https://github.com/probiruk/fetch-smart/workflows/CI/badge.svg)](https://github.com/probiruk/fetch-smart/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, type-safe HTTP client for modern JavaScript applications. Built on top of the native Fetch API with enhanced features for a better developer experience.

## ✨ Features

- 🔄 **Smart Retries**: Automatic retry with exponential backoff
- ⏱️ **Timeout Control**: Configurable request timeouts
- 📊 **Progress Tracking**: Monitor upload and download progress
- 🎯 **Type Safety**: Full TypeScript support with comprehensive types
- 🔍 **Response Parsing**: Automatic content-type handling
- 🚫 **Cancellation**: Built-in request cancellation support
- 📝 **Rich Response**: Detailed response metadata
- 🌐 **CORS Ready**: Built-in CORS handling
- 🔒 **Security**: Configurable request credentials
- 📦 **Zero Dependencies**: No external runtime dependencies

## 📥 Installation

```bash
npm install fetch-smart
# or
yarn add fetch-smart
# or
pnpm add fetch-smart
```

## 🚀 Quick Start

```typescript
import fetchClient from 'fetch-smart';

// Simple GET request
const { data } = await fetchClient.get('https://api.example.com/users');

// POST with JSON
const response = await fetchClient.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT with retry and timeout
const updated = await fetchClient.put(
  'https://api.example.com/users/1',
  { name: 'Jane Doe' },
  {
    retry: 3,
    timeout: 5000
  }
);
```

## 🛠️ Advanced Usage

### Creating an Instance

```typescript
import { FetchSmart } from 'fetch-smart';

const client = new FetchSmart('https://api.example.com', {
  'Authorization': 'Bearer your-token'
});
```

### Progress Monitoring

```typescript
const response = await client.post(
  '/upload',
  formData,
  {
    onUploadProgress: (progress) => {
      console.log(`Upload: ${progress.progress}%`);
    },
    onDownloadProgress: (progress) => {
      console.log(`Download: ${progress.progress}%`);
    }
  }
);
```

### Retry Configuration

```typescript
const response = await client.get('/data', {
  retry: 3,
  retryDelay: 1000,
  exponentialDelay: true,
  retryCondition: () => true
});
```

### Request Cancellation

```typescript
const controller = new AbortController();

const promise = client.get('/data', {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

## 📚 API Reference

### Request Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `body` | `unknown` | - | Request body data |
| `params` | `Record<string, string>` | - | URL query parameters |
| `timeout` | `number` | - | Request timeout (ms) |
| `headers` | `HeadersInit` | `{}` | Custom headers |
| `retry` | `number` | `0` | Retry attempts |
| `retryDelay` | `number` | `1000` | Delay between retries |
| `exponentialDelay` | `boolean` | `true` | Use exponential backoff |
| `retryCondition` | `() => boolean` | - | Custom retry logic |
| `cache` | `RequestCache` | `'default'` | Cache strategy |
| `mode` | `RequestMode` | `'cors'` | CORS mode |
| `credentials` | `RequestCredentials` | `'same-origin'` | Credentials mode |
| `signal` | `AbortSignal` | - | Cancellation signal |
| `responseType` | `ResponseType` | `'json'` | Response format |
| `onUploadProgress` | `(progress: ProgressEvent) => void` | - | Upload progress |
| `onDownloadProgress` | `(progress: ProgressEvent) => void` | - | Download progress |
| `priority` | `'high'｜'low'｜'auto'` | `'auto'` | Request priority |

### Response Structure

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T ｜ null` | Parsed response data |
| `status` | `number` | HTTP status code |
| `statusText` | `string` | Status message |
| `headers` | `Headers` | Response headers |
| `ok` | `boolean` | Status in 200-299 range |
| `url` | `string` | Final URL after redirects |
| `requestTime` | `number` | Request start time |
| `responseTime` | `number` | Response received time |
| `duration` | `number` | Total request time (ms) |
| `error` | `string ｜ null` | Error message if failed |
| `retries` | `number` | Retry attempts made |
| `maxRetries` | `number` | Maximum retries |
| `isCached` | `boolean` | Response from cache |

## 🧪 TypeScript Support

FetchSmart is written in TypeScript and provides full type definitions:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Types are inferred automatically
const { data } = await client.get<User>('/user/1');
console.log(data.name); // TypeScript knows this is a string

// POST with type checking
const newUser = await client.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`npm run commit`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript for better developer experience
- Inspired by Axios and Ky
- Follows modern JavaScript best practices

## 💬 Support

- 📫 Report issues on [GitHub Issues](https://github.com/probiruk/fetch-smart/issues)
- 🌟 Star the repo if you find it useful
<!-- - 📖 Check out the [documentation](https://probiruk.github.io/fetch-smart) -->

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
