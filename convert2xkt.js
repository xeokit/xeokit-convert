#!/usr/bin/env node

// Set up polyfills and environment
import { TextEncoder, TextDecoder } from 'node:util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import '@loaders.gl/polyfills';
import { installFilePolyfills } from '@loaders.gl/polyfills';
installFilePolyfills();

// Import dependencies
import WebIFC from "web-ifc";
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Command } from 'commander';

// Import converter functionality
import { convert2xkt } from './src/convert2xkt.js';
import defaultConfigs from './convert2xkt.conf.js';
import { XKT_INFO } from "./src/XKT_INFO.js";

// CLI functionality
/**
 * Creates and configures the command line interface
 * @param {Object} packageInfo - The package.json content
 * @returns {Command} The configured Command object
*/
function setupCLI(packageInfo) {
    const program = new Command();

    program.version(packageInfo.version, '-v, --version');

    program
        .option('-c, --configs [file]', 'optional path to JSON configs file; overrides convert2xkt.conf.js')
        .option('-s, --source [file]', 'path to source file')
        .option('-a, --sourcemanifest [file]', 'path to source manifest file (for converting split file output from ifcgltf -s)')
        .option('-f, --format [string]', 'source file format (optional); supported formats are gltf, ifc, laz, las, pcd, ply, stl and cityjson')
        .option('-m, --metamodel [file]', 'path to source metamodel JSON file (optional)')
        .option('-i, --include [types]', 'only convert these types (optional)')
        .option('-x, --exclude [types]', 'never convert these types (optional)')
        .option('-r, --rotatex', 'rotate model 90 degrees about X axis (for las and cityjson)')
        .option('-g, --disablegeoreuse', 'disable geometry reuse (optional)')
        .option('-z, --minTileSize [number]', 'minimum diagonal tile size (optional, default 500)')
        .option('-t, --disabletextures', 'ignore textures (optional)')
        .option('-n, --disablenormals', 'ignore normals (optional)')
        .option('-b, --compressBuffers', 'compress buffers (optional)')
        .option('-e, --maxIndicesForEdge [number]', 'max number of idicies in a mesh (effectivly triangles) above edges are not calculated (optional, default 100000)')
        .option('-o, --output [file]', 'path to target .xkt file when -s option given, or JSON manifest for multiple .xkt files when source manifest file given with -a; creates directories on path automatically if not existing')
        .option('-l, --log', 'enable logging (optional)');

    program.on('--help', () => {
        console.log(`\n\nXKT version: ${XKT_INFO.xktVersion}`);
    });

    return program;
}

/**
 * Validates command line options
 * @param {Object} options - The command line options
 * @param {Command} program - The commander program object
 */
function validateOptions(options, program) {
    if (options.source === undefined && options.sourcemanifest === undefined) {
        console.error('[convert2xkt] [ERROR]: Please specify path to source file or manifest.');
        program.help();
        process.exit(1);
    }

    if (options.source !== undefined && options.sourcemanifest !== undefined) {
        console.error('[convert2xkt] [ERROR]: Can\'t specify path to source file AND manifest - only one of these params allowed.');
        program.help();
        process.exit(1);
    }

    if (options.output === undefined) {
        console.error('[convert2xkt] [ERROR]: Please specify target xkt file path.');
        program.help();
        process.exit(1);
    }
}

/**
 * Creates a logging function
 * @param {Object} options - The command line options
 * @returns {Function} Logging function
 */
function createLogger(options) {
    return function log(msg) {
        if (options.log) {
            console.log(msg);
        }
    };
}

/**
 * Gets the file extension from a file path
 * @param {string} fileName - The file path
 * @returns {string} The file extension without dot
 */
function getFileExtension(fileName) {
    let ext = path.extname(fileName);
    if (ext.charAt(0) === ".") {
        ext = ext.substring(1);
    }
    return ext;
}

/**
 * Gets the file name without extension
 * @param {string} filePath - The file path
 * @returns {string} The file name without extension
 */
function getFileNameWithoutExtension(filePath) {
    const baseName = path.basename(filePath);
    const fileNameWithoutExtension = path.parse(baseName).name;
    return fileNameWithoutExtension;
}

/**
 * Loads configs from file or uses defaults
 * @param {Object} options - Command line options
 * @param {Object} defaultConfigs - Default configs object
 * @param {Function} log - Logging function
 * @returns {Object} The loaded configs
 */
function loadConfigs(options, defaultConfigs, log) {
    let configs = defaultConfigs;

    if (options.configs !== undefined) {
        log(`[convert2xkt] Using JSON configs file: ${options.configs}`);
        try {
            let configsData = fs.readFileSync(options.configs);
            configs = JSON.parse(configsData);
        } catch (e) {
            console.error(`[convert2xkt] [ERROR]: Failed to load custom configs file (specified with -c or --configs) - ${e}`);
            process.exit(1);
        }
    } else {
        log(`[convert2xkt] Using configs in ./convert2xkt.conf.js`);
    }
    configs.sourceConfigs ||= {};

    return configs;
}

/**
 * Main convert function for handling both single files and manifests
 * @param {Object} params - Parameters for conversion
 * @param {Object} params.options - Command line options
 * @param {Object} params.configs - Configuration object
 * @param {Function} params.log - Logging function
 * @param {Object} params.WebIFC - WebIFC implementation
 * @param {Function} params.convert2xkt - The convert2xkt function
 * @param {Object} params.packageInfo - Package information
 */
async function mainConvert({ options, configs, log, WebIFC, convert2xkt, packageInfo }) {
    log(`[convert2xkt] Running convert2xkt v${packageInfo.version}...`);

    configs = loadConfigs(options, configs, log);

    if (options.sourcemanifest) {
        await convertManifest({ options, configs, log, WebIFC, convert2xkt, packageInfo });
    } else {
        await convertSingleFile({ options, configs, log, WebIFC, convert2xkt });
    }
}

/**
 * Convert files specified in a manifest
 * @param {Object} params - Parameters for conversion
 */
async function convertManifest({ options, configs, log, WebIFC, convert2xkt, packageInfo }) {
    log(`[convert2xkt] Converting glTF files in manifest ${options.sourcemanifest}...`);

    let manifestData = fs.readFileSync(options.sourcemanifest);
    let manifest = JSON.parse(manifestData);

    if (!manifest.gltfOutFiles) {
        console.error(`[convert2xkt] [ERROR]: Input manifest invalid - missing field: gltfOutFiles`);
        process.exit(1);
    }

    const numInputFiles = manifest.gltfOutFiles.length;

    if (numInputFiles === 0) {
        console.error(`[convert2xkt] [ERROR]: Input manifest invalid - gltfOutFiles is zero length`);
        process.exit(1);
    }

    const outputDir = path.dirname(options.output);
    if (outputDir !== "" && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    function formatDate(date) {
        return date.toISOString();
    }

    const xktManifest = {
        inputFile: options.sourcemanifest,
        converterApplication: "convert2xkt",
        converterApplicationVersion: `v${packageInfo.version}`,
        conversionDate: formatDate(new Date()),
        outputDir,
        xktFiles: []
    };

    const sourceConfigs = configs.sourceConfigs || {};
    const formatConfig = sourceConfigs["gltf"] || configs["glb"] || {};
    const externalMetadata = (!!formatConfig.externalMetadata);
    if (externalMetadata) {
        xktManifest.metaModelFiles = [];
        for (let i = 0, len = manifest.metadataOutFiles.length; i < len; i++) {
            const metadataSource = manifest.metadataOutFiles[i];
            xktManifest.metaModelFiles.push(path.basename(metadataSource));
        }
    }

    let i = 0;

    const convertNextFile = () => {
        const source = manifest.gltfOutFiles[i];
        const metaModelSource = (i < manifest.metadataOutFiles.length) ? manifest.metadataOutFiles[i] : null;
        const outputFileName = getFileNameWithoutExtension(source);
        const outputFileNameXKT = `${outputFileName}.xkt`;
        const ext = getFileExtension(source);

        let modelAABB;
        return convert2xkt({
            WebIFC,
            configs,
            source,
            format: ext,
            metaModelSource: (!externalMetadata) ? metaModelSource : null,
            modelAABB,
            output: path.join(outputDir, outputFileNameXKT),
            includeTypes: options.include ? options.include.slice(",") : null,
            excludeTypes: options.exclude ? options.exclude.slice(",") : null,
            rotateX: options.rotatex,
            reuseGeometries: (options.disablegeoreuse !== true),
            minTileSize: options.minTileSize,
            includeTextures: !options.disabletextures,
            includeNormals: !options.disablenormals,
            zip: options.compressBuffers,
            maxIndicesForEdge: options.maxIndicesForEdge,
            log
        }).then(() => {
            i++;
            log(`[convert2xkt] Converted model${i}.xkt (${i} of ${numInputFiles})`);
            xktManifest.xktFiles.push(outputFileNameXKT);

            if (i === numInputFiles) {
                fs.writeFileSync(options.output, JSON.stringify(xktManifest));
                log(`[convert2xkt] Done.`);
                process.exit(0);
            } else {
                return convertNextFile();
            }
        });
    };

    try {
        await convertNextFile();
    } catch (err) {
        console.error(`[convert2xkt] [ERROR]: ${err}`);
        process.exit(1);
    }
}

/**
 * Convert a single file
 * @param {Object} params - Parameters for conversion
 */
async function convertSingleFile({ options, configs, log, WebIFC, convert2xkt }) {
    if (options.output) {
        const outputDir = path.dirname(options.output);
        if (outputDir !== "" && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }

    log(`[convert2xkt] Converting single input file ${options.source}...`);

    try {
        await convert2xkt({
            WebIFC,
            configs,
            source: options.source,
            format: options.format,
            metaModelSource: options.metamodel,
            output: options.output,
            includeTypes: options.include ? options.include.slice(",") : null,
            excludeTypes: options.exclude ? options.exclude.slice(",") : null,
            rotateX: options.rotatex,
            reuseGeometries: (options.disablegeoreuse !== true),
            minTileSize: options.minTileSize,
            includeTextures: !options.disabletextures,
            includeNormals: !options.disablenormals,
            maxIndicesForEdge: options.maxIndicesForEdge,
            zip: options.compressBuffers,
            log
        });
        log(`[convert2xkt] Done.`);
        process.exit(0);
    } catch (err) {
        console.error(`[convert2xkt] [ERROR]: ${err}`);
        process.exit(1);
    }
}

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

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