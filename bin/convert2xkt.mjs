#!/usr/bin/env node

// Set up polyfills and environment
import { TextEncoder, TextDecoder } from 'node:util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import '@loaders.gl/polyfills';
import { installFilePolyfills } from '@loaders.gl/polyfills';
installFilePolyfills();

// Import dependencies
import WebIFC from "web-ifc/web-ifc-api-node.js";
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Import converter functionality
import { convert2xkt } from '../src/convert2xkt.js';
import defaultConfigs from './convert2xkt.conf.js';

// Import shared CLI functionality
import { 
    setupCLI, 
    validateOptions, 
    createLogger, 
    mainConvert 
} from './cli.js';

// Setup environment
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageInfo = JSON.parse(
    readFileSync(resolve(__dirname, '../package.json'), 'utf8')
);

// Setup CLI
const program = setupCLI(packageInfo);
program.parse(process.argv);
const options = program.opts();

// Validate options
validateOptions(options, program);

// Create logger
const log = createLogger(options);

// Run conversion
mainConvert({ 
    options, 
    configs: defaultConfigs, 
    log, 
    WebIFC, 
    convert2xkt,
    packageInfo
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});