#!/usr/bin/env node

const commander = require('commander');
const npmPackage = require('./package.json');
const {convert2xkt, XKT_INFO} = require("./dist/xeokit-convert.cjs.js");
const fs = require('fs');

const WebIFC = require("web-ifc/web-ifc-api-node.js");
const path = require("path");

const program = new commander.Command();

program.version(npmPackage.version, '-v, --version');

program
    .option('-s, --source [file]', 'path to source file')
    .option('-a, --sourcemanifest [file]', 'path to source manifest file')
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

if (options.source === undefined && options.sourcemanifest === undefined) {
    console.error('Error: please specify path to source file or manifest.');
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

    if (options.sourcemanifest) {

        log(`[convert2xkt] Running convert2xkt v${npmPackage.version}...`);
        log(`[convert2xkt] Converting glTF files in manifest ${options.sourcemanifest}...`);

        let manifestData = fs.readFileSync(options.sourcemanifest);
        let manifest = JSON.parse(manifestData);

        if (!manifest.gltfOutFiles) {
            console.error(`Error: Input manifest invalid - missing field: gltfOutFiles`);
            process.exit(1);
        }

        if (!manifest.metadataOutFiles) {
            console.error(`Error: Input manifest invalid - missing field: metadataOutFiles`);
            process.exit(1);
        }

        const numInputFiles = manifest.gltfOutFiles.length;

        if (numInputFiles === 0) {
            console.error(`Error: Input manifest invalid - gltfOutFiles is zero length`);
            process.exit(1);
        }

        if (numInputFiles !== manifest.metadataOutFiles.length) {
            console.error(`Error: Input manifest invalid - length of gltfOutFiles and metadataOutFiles don't match`);
            process.exit(1);
        }

        const outputDir = getBasePath(options.output).trim();
        if (outputDir !== "" && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year}- ${hours}-${minutes}-${seconds}`;
        }

        const xktManifest = {
            inputFile: options.sourcemanifest,
            converterApplication: "convert2xkt",
            converterApplicationVersion: `v${npmPackage.version}`,
            conversionDate: formatDate(new Date()),
            outputDir: options.output,
            xktFiles: []
        };

        let i = 0;

        const convertNextFile = () => {

            const source = manifest.gltfOutFiles[i];
            const metaModelSource = manifest.metadataOutFiles[i];
            const output = path.join(options.output, `model${i}.xkt`);

            convert2xkt({
                WebIFC,
                source,
                format: "gltf",
                metaModelSource,
                output: path.join(options.output, `model${i}.xkt`),
                includeTypes: options.include ? options.include.slice(",") : null,
                excludeTypes: options.exclude ? options.exclude.slice(",") : null,
                rotateX: options.rotatex,
                reuseGeometries: (options.disablegeoreuse !== true),
                minTileSize: options.mintilesize,
                includeTextures: options.textures,
                includeNormals: options.normals,
                log
            }).then(() => {

                i++;

                log(`[convert2xkt] Converted model${i}.xkt (${i} of ${numInputFiles})`);

                xktManifest.xktFiles.push(`model${i}.xkt`);

                if (i === numInputFiles) {
                    fs.writeFileSync(path.join(options.output, `xkt.manifest.json`), JSON.stringify(xktManifest));
                    log(`[convert2xkt] Done.`);
                    process.exit(0);
                } else {
                    convertNextFile();
                }

            }).catch((err) => {
                console.error(`Error: ${err}`);
                process.exit(1);
            });
        }

        convertNextFile();

    } else {

        if (options.output) {
            const outputDir = getBasePath(options.output).trim();
            if (outputDir !== "" && !fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }
        }

        log(`[convert2xkt] Running convert2xkt v${npmPackage.version}...`);
        log(`[convert2xkt] Converting single input file ${options.source}...`);

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
}

function getBasePath(src) {
    const i = src.lastIndexOf("/");
    return (i !== 0) ? src.substring(0, i + 1) : "";
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
