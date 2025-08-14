// Polyfill before loading MSW (use require to control evaluation order)
const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// Web Streams: prefer Node's built-ins, fallback to ponyfill
let ReadableStream, WritableStream, TransformStream;
try {
  ({ ReadableStream, WritableStream, TransformStream } = require('stream/web'));
} catch {
  ({
    ReadableStream,
    WritableStream,
    TransformStream,
  } = require('web-streams-polyfill/ponyfill/es2018'));
}
if (!global.ReadableStream) global.ReadableStream = ReadableStream;
if (!global.WritableStream) global.WritableStream = WritableStream;
if (!global.TransformStream) global.TransformStream = TransformStream;

// Polyfill fetch in jsdom
require('whatwg-fetch');

// Testing Library matchers
require('@testing-library/jest-dom');

// Start MSW
const { server } = require('./test/msw/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
