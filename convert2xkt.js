#!/usr/bin/env node

const commander = require('commander');
const npmPackage = require('./package.json');
const {convert2xkt, XKT_INFO} = require("./dist/xeokit-convert.cjs.js");
const fs = require('fs');
const defaultConfigs = require(`./convert2xkt.conf.js`);

const WebIFC = require("web-ifc/web-ifc-api-node.js");
const path = require("path");
const {createValidator} = require("@typeonly/validator");

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

    if (options.sourcemanifest) {

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
            outputDir,
            xktFiles: []
        };

        const sourceConfigs =  configs.sourceConfigs || {};
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

            let modelAABB;
            // if (manifest.modelBoundsMin && manifest.modelBoundsMax) {
            //     modelAABB= [
            //         manifest.modelBoundsMin[0],
            //         manifest.modelBoundsMin[1],
            //         manifest.modelBoundsMin[2],
            //         manifest.modelBoundsMax[0],
            //         manifest.modelBoundsMax[1],
            //         manifest.modelBoundsMax[2]
            //     ];
            // }
            convert2xkt({
                WebIFC,
                configs,
                source,
                format: "gltf",
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
                    convertNextFile();
                }

            }).catch((err) => {
                console.error(`[convert2xkt] [ERROR]: ${err}`);
                process.exit(1);
            });
        }

        convertNextFile();

    } else {

        if (options.output) {
            const outputDir = path.dirname(options.output);
            if (outputDir !== "" && !fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }
        }

        log(`[convert2xkt] Converting single input file ${options.source}...`);

        convert2xkt({
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
            log
        }).then(() => {
            log(`[convert2xkt] Done.`);
            process.exit(0);
        }).catch((err) => {
            console.error(`[convert2xkt] [ERROR]: ${err}`);
            process.exit(1);
        });
    }
}

function getFileNameWithoutExtension(filePath) {
    const baseName = path.basename(filePath);
    const fileNameWithoutExtension = path.parse(baseName).name;
    return fileNameWithoutExtension;
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
