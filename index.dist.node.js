import '@loaders.gl/polyfills';
import { installFilePolyfills } from '@loaders.gl/polyfills';
installFilePolyfills();
import { TextEncoder } from 'node:util';
global.TextEncoder = TextEncoder;
// Use the V8's TextEncoder impl., otherwise the @loaders.gl/polyfill's one gets used, which is failing (at Array::push) for large metadata


export * from "./src/index.js";
export { convert2xkt } from "./src/convert2xkt.js"; // convert2xkt is only bundled for Node.js
