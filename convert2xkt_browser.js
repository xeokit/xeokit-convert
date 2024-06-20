#!/usr/bin/env node

const commander = require('commander');
const npmPackage = require('./package.json');
const {convert2xkt, XKT_INFO} = require("./dist/xeokit-convert.cjs.js");
const fs = require('fs');
const defaultConfigs = require(`./convert2xkt.conf.js`);

const WebIFC = require("web-ifc/web-ifc-api-node.js");
const path = require("path");
const {createValidator} = require("@typeonly/validator");
const { save } = require('@loaders.gl/core');

// const validator = createValidator({
//     bundle: require("./types.to.json")
// });

const program = new commander.Command();

program.version(npmPackage.version, '-v, --version');

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
    .option('-o, --output [file]', 'path to target .xkt file when -s option given, or JSON manifest for multiple .xkt files when source manifest file given with -a; creates directories on path automatically if not existing')
    .option('-l, --log', 'enable logging (optional)');

program.on('--help', () => {
    console.log(`\n\nXKT version: ${XKT_INFO.xktVersion}`);
});

program.parse(process.argv);

const options = program.opts();

let configs = defaultConfigs;

let inputArrayBuffer = null;

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

function log(msg) {
    if (options.log) {
        console.log(msg);
    }
}

inputArrayBuffer = fs.readFileSync(options.source);
function saveXKT(arrayBuffer) {
    fs.writeFileSync('./output_browser_xkt.xkt', arrayBuffer);

}
async function main() {

    log(`[convert2xkt] Running convert2xkt v${npmPackage.version}...`);

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



        log(`[convert2xkt] Converting single input file ${options.source}...`);

        convert2xkt({
            outputXKT: saveXKT,
            configs,
            sourceData: inputArrayBuffer,
            sourceFormat: "",
            rotateX: options.rotatex,
            reuseGeometries: (options.disablegeoreuse !== true),
            log
        }).then(() => {
            
            log(`[convert2xkt] Done.`);
            process.exit(0);
        }).catch((err) => {
            console.error(`[convert2xkt] [ERROR]: ${err}`);
            process.exit(1);
        });
    
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
