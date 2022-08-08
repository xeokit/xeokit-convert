#!/usr/bin/env node

const commander = require('commander');
const npmPackage = require('./package.json');
const {convert2xkt, XKT_INFO} = require("./dist/xeokit-convert.cjs.js");
const fs = require('fs');

const WebIFC = require("web-ifc/web-ifc-api-node.js");

const program = new commander.Command();

program.version(npmPackage.version, '-v, --version');

program
    .option('-s, --source [file]', 'path to source file')
    .option('-f, --format [string]', 'source file format (optional); supported formats are gltf, ifc, laz, las, pcd, ply, stl and cityjson')
    .option('-m, --metamodel [file]', 'path to source metamodel JSON file (optional)')
    .option('-i, --include [types]', 'only convert these types (optional)')
    .option('-x, --exclude [types]', 'never convert these types (optional)')
    .option('-r, --rotatex', 'rotate model 90 degrees about X axis (for las and cityjson)')
    .option('-g, --disablegeoreuse', 'disable geometry reuse (optional)')
    .option('-z, --mintilesize [number]', 'minimum diagonal tile size (optional, default 500)')
    .option('-t, --disabletextures', 'ignore textures (optional)')
    .option('-n, --disablenormals', 'ignore normals (optional)')
    .option('-o, --output [file]', 'path to target .xkt file; creates directories on path automatically if not existing')
    .option('-l, --log', 'enable logging (optional)');

program.on('--help', () => {
    console.log(`\n\nXKT version: ${XKT_INFO.xktVersion}`);
});

program.parse(process.argv);

const options = program.opts();

if (options.source === undefined) {
    console.error('Error: please specify source file path.');
    program.help();
    process.exit(1);
}

if (options.output === undefined) {
    console.error('Error: please specify target xkt file path.');
    program.help();
    process.exit(1);
}

function log(msg) {
    if (options.log) {
        console.log(msg);
    }
}

async function main() {
    if (options.output) {
        const outputDir = getBasePath(options.output).trim();
        if (outputDir !== "" && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }
    }
    log(`[convert2xkt] Running convert2xkt v${npmPackage.version}...`);
    convert2xkt({
        WebIFC,
        source: options.source,
        format: options.format,
        metaModelSource: options.metamodel,
        output: options.output,
        includeTypes: options.include ? options.include.slice(",") : null,
        excludeTypes: options.exclude ? options.exclude.slice(",") : null,
        rotateX: options.rotatex,
        reuseGeometries: (options.disablegeoreuse !== true),
        minTileSize: options.mintilesize,
        includeTextures: options.textures,
        includeNormals: options.normals,
        log
    }).then(() => {
        log(`[convert2xkt] Done.`);
        process.exit(0);
    }).catch((err) => {
        console.error(`Error: ${err}`);
        process.exit(1);
    });
}

function getBasePath(src) {
    const i = src.lastIndexOf("/");
    return (i !== 0) ? src.substring(0, i + 1) : "";
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
