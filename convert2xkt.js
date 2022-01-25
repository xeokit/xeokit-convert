#!/usr/bin/env node

const commander = require('commander');
const package = require('./package.json');
const {XKT_INFO} = require("./dist/xeokit-convert.cjs.js");
const convert2xkt = require('./dist/convert2xkt.cjs.js');
const fs = require('fs');

const program = new commander.Command();

program.version(package.version, '-v, --version');

program
    .option('-s, --source [file]', 'path to source file')
    .option('-f, --format [string]', 'source file format (optional); supported formats are gltf, ifc, laz, las, pcd, ply, stl and cityjson')
    .option('-m, --metamodel [file]', 'path to source metamodel JSON file (optional)')
    .option('-z, --propsmetamodel [file]', 'path to source propsmetamodel JSON file (optional)')
    .option('-i, --include [types]', 'only convert these types (optional)')
    .option('-x, --exclude [types]', 'never convert these types (optional)')
    .option('-o, --output [file]', 'path to target .xkt file; creates directories on path automatically if not existing')
    .option('-p, --outputmetaprops [file]', 'path to target .json file; creates directories on path automatically if not existing')
    .option('-l, --log', 'enable logging');

program.on('--help', () => {
    console.log(`\n\nXKT version: ${XKT_INFO.xktVersion}`);
});

program.parse(process.argv);

const options = program.opts();

if (program.source === undefined) {
    console.error('Error: please specify source file path.');
    program.help();
    process.exit(1);
}

if (program.output === undefined && program.outputmetaprops === undefined) {
    console.error('Error: please specify target xkt or props file path.');
    program.help();
    process.exit(1);
}

function log(msg) {
    if (program.log) {
        console.log(msg);
    }
}

async function main() {

    if (program.output) {
        const outputDir = getBasePath(program.output).trim();
        if (outputDir !== "" && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }
    }

    const result = await convert2xkt({
        source: program.source,
        format: program.format,
        metaModelSource: program.metamodel,
        output: program.output,
        includeTypes: program.include ? program.include.slice(",") : null,
        excludeTypes: program.exclude ? program.exclude.slice(",") : null,
        outputProps: program.outputmetaprops,
        propsMetaSource: program.propsmetamodel,
        log
    });

    if (result < 0) {
        process.exit(1);
    }
}

function getBasePath(src) {
    const i = src.lastIndexOf("/");
    return (i !== 0) ? src.substring(0, i + 1) : "";
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
