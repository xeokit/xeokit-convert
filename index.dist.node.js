import '@loaders.gl/polyfills';
import {installFilePolyfills} from '@loaders.gl/polyfills';

installFilePolyfills();

export * from "./src/index.js";
export {convert2xkt} from "./src/convert2xkt.js"; // convert2xkt is only bundled for Node.js
