import {XKT_INFO} from "./XKT_INFO.js";
import {XKTModel} from "./XKTModel/XKTModel.js";
import {parseCityJSONIntoXKTModel} from "./parsers/parseCityJSONIntoXKTModel.js";
import {parseGLTFIntoXKTModel} from "./parsers/parseGLTFIntoXKTModel.js";
import {parseIFCIntoXKTModel} from "./parsers/parseIFCIntoXKTModel.js";
import {parseLASIntoXKTModel} from "./parsers/parseLASIntoXKTModel.js";
import {parsePCDIntoXKTModel} from "./parsers/parsePCDIntoXKTModel.js";
import {parsePLYIntoXKTModel} from "./parsers/parsePLYIntoXKTModel.js";
import {parseSTLIntoXKTModel} from "./parsers/parseSTLIntoXKTModel.js";
import {writeXKTModelToArrayBuffer} from "./XKTModel/writeXKTModelToArrayBuffer.js";

import {toArrayBuffer} from "./XKTModel/lib/toArraybuffer.js";
import { TextEncoder, TextDecoder } from 'node:util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import '@loaders.gl/polyfills';
import { installFilePolyfills } from '@loaders.gl/polyfills';
installFilePolyfills();
import fs from 'fs';
import path from 'path';

/**
 * Converts model files into xeokit's native XKT format.
 *
 * Supported source formats are: IFC, CityJSON, glTF, LAZ and LAS.
 *
 * **Only bundled in xeokit-convert.cjs.js.**
 *
 * ## Usage
 *
 * ````javascript
 * const convert2xkt = require("@xeokit/xeokit-convert/dist/convert2xkt.cjs.js");
 * const fs = require('fs');
 *
 * convert2xkt({
 *      sourceData: fs.readFileSync("rme_advanced_sample_project.ifc"),
 *      outputXKT: (xtkArrayBuffer) => {
 *          fs.writeFileSync("rme_advanced_sample_project.ifc.xkt", xtkArrayBuffer);
 *      }
 *  }).then(() => {
 *      console.log("Converted.");
 *  }, (errMsg) => {
 *      console.error("Conversion failed: " + errMsg)
 *  });
 ````
 * @param {Object} params Conversion parameters.
 * @param {Object} [params.WebIFC] The WebIFC library (optional for IFC files). If not provided, the function will
 * try to dynamically import it from 'web-ifc/web-ifc-api-node.js'. Providing it explicitly allows the
 * caller to choose whether to use the Browser or NodeJS version.
 * @param {Object} [params.configs={}] Configurations.
 * @param {String} [params.source] Path to source file. Alternative to ````sourceData````.
 * @param {ArrayBuffer|JSON} [params.sourceData] Source file data. Alternative to ````source````.
 * @param {String} [params.sourceFormat] Format of source file/data. Always needed with ````sourceData````, but not normally needed with ````source````, because convert2xkt will determine the format automatically from the file extension of ````source````.
 * @param {String} [params.metaModelDataStr] Source file data. Overrides metadata from ````metaModelSource````, ````sourceData```` and ````source````.
 * @param {String} [params.metaModelSource] Path to source metaModel file. Overrides metadata from ````sourceData```` and ````source````. Overridden by ````metaModelData````.
 * @param {Object} [params.modelAABB] Optional model axis-aligned bounding box.
 * @param {String} [params.output] Path to destination XKT file. Directories on this path are automatically created if not existing.
 * @param {Function} [params.outputXKTModel] Callback to collect the ````XKTModel```` that is internally build by this method.
 * @param {Function} [params.outputXKT] Callback to collect XKT file data.
 * @param {String[]} [params.includeTypes] Option to only convert objects of these types.
 * @param {String[]} [params.excludeTypes] Option to never convert objects of these types.
 * @param {Boolean} [params.reuseGeometries=true] When true, will enable geometry reuse within the XKT. When false,
 * will automatically "expand" all reused geometries into duplicate copies. This has the drawback of increasing the XKT
 * file size (~10-30% for typical models), but can make the model more responsive in the xeokit Viewer, especially if the model
 * has excessive geometry reuse. An example of excessive geometry reuse would be when a model (eg. glTF) has 4000 geometries that are
 * shared amongst 2000 objects, ie. a large number of geometries with a low amount of reuse, which can present a
 * pathological performance case for xeokit's underlying graphics APIs (WebGL, WebGPU etc).
 * @param {Number} [params.minTileSize=200] Minimum RTC coordinate tile size. Set this to a value between 100 and 10000,
 * depending on how far from the coordinate origin the model's vertex positions are; specify larger tile sizes when close
 * to the origin, and smaller sizes when distant. This compensates for decreasing precision as floats get bigger.
 * @param {Object} [params.stats={}] Collects conversion statistics. Statistics are attached to this object if provided.
 * @param {Function} [params.outputStats] Callback to collect statistics.
 * @param {Boolean} [params.rotateX=false] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary. Applies to CityJSON and LAS/LAZ models.
 * @param {Boolean} [params.includeTextures=true] Whether to convert textures. Only works for ````glTF```` models.
 * @param {Boolean} [params.includeNormals=true] Whether to convert normals. When false, the parser will ignore
 * geometry normals, and the model will rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the model.
 * @param {Boolean} [params.zip=false] Whether to zip the XKT output.
 * @param {Function} [params.log=function(msg){}] Logging callback.
 * @return {Promise<number>}
 */
function convert2xkt({
                         WebIFC,
                         configs = {},
                         source,
                         sourceData,
                         sourceFormat,
                         metaModelSource,
                         metaModelDataStr,
                         modelAABB,
                         output,
                         outputXKTModel,
                         outputXKT,
                         includeTypes,
                         excludeTypes,
                         reuseGeometries = true,
                         minTileSize = 200,
                         stats = {},
                         outputStats,
                         rotateX = false,
                         includeTextures = true,
                         includeNormals = true,
                         maxIndicesForEdge,
                         zip = false,
                         log = function (msg) {
                         }
                     }) {

    stats.sourceFormat = "";
    stats.schemaVersion = "";
    stats.title = "";
    stats.author = "";
    stats.created = "";
    stats.numMetaObjects = 0;
    stats.numPropertySets = 0;
    stats.numTriangles = 0;
    stats.numVertices = 0;
    stats.numNormals = 0;
    stats.numUVs = 0;
    stats.numTextures = 0;
    stats.numTextureSets = 0;
    stats.numObjects = 0;
    stats.numGeometries = 0;
    stats.sourceSize = 0;
    stats.xktSize = 0;
    stats.texturesSize = 0;
    stats.xktVersion = "";
    stats.compressionRatio = 0;
    stats.conversionTime = 0;
    stats.aabb = null;

    function getFileExtension(fileName) {
        let ext = path.extname(fileName);
        if (ext.charAt(0) === ".") {
            ext = ext.substring(1);
        }
        return ext;
    }

    return new Promise(function (resolve, reject) {
        const _log = log;
        log = (msg) => {
            _log(`[convert2xkt] ${msg}`)
        }

        if (!source && !sourceData) {
            reject("Argument expected: source or sourceData");
            return;
        }

        if (!sourceFormat && sourceData) {
            reject("Argument expected: sourceFormat is required with sourceData");
            return;
        }

        if (!output && !outputXKTModel && !outputXKT) {
            reject("Argument expected: output, outputXKTModel or outputXKT");
            return;
        }

        if (source) {
            log('Reading input file: ' + source);
        }

        const startTime = new Date();

        const sourceConfigs = configs.sourceConfigs || {};
        const ext = sourceFormat || getFileExtension(source);

        log(`Input file extension: "${ext}"`);

        let fileTypeConfigs = sourceConfigs[ext];

        if (!fileTypeConfigs) {
            log(`[WARNING] Could not find configs sourceConfigs entry for source format "${ext}". This is derived from the source file name extension. Will use internal default configs.`);
            fileTypeConfigs = {};
        }

        function overrideOption(option1, option2) {
            if (option1 !== undefined) {
                return option1;
            }
            return option2;
        }

        if (!sourceData) {
            try {
                sourceData = fs.readFileSync(source);
            } catch (err) {
                reject(err);
                return;
            }
        }

        const sourceFileSizeBytes = sourceData.byteLength;

        log("Input file size: " + (sourceFileSizeBytes / 1000).toFixed(2) + " kB");

        if (!metaModelDataStr && metaModelSource) {
            log('Reading input metadata file: ' + metaModelSource);
            try {
                metaModelDataStr = fs.readFileSync(metaModelSource);
            } catch (err) {
                reject(err);
                return;
            }
        } else {
            log(`Not embedding metadata in XKT`);
        }

        let metaModelJSON;

        if (metaModelDataStr) {
            try {
                metaModelJSON = JSON.parse(metaModelDataStr);
            } catch (e) {
                metaModelJSON = {};
                log(`Error parsing metadata JSON: ${e}`);
            }
        }

        minTileSize = overrideOption(fileTypeConfigs.minTileSize, minTileSize);
        rotateX = overrideOption(fileTypeConfigs.rotateX, rotateX);
        reuseGeometries = overrideOption(fileTypeConfigs.reuseGeometries, reuseGeometries);
        includeTextures = overrideOption(fileTypeConfigs.includeTextures, includeTextures);
        includeNormals = overrideOption(fileTypeConfigs.includeNormals, includeNormals);
        includeTypes = overrideOption(fileTypeConfigs.includeTypes, includeTypes);
        excludeTypes = overrideOption(fileTypeConfigs.excludeTypes, excludeTypes);
        maxIndicesForEdge = overrideOption(fileTypeConfigs.maxIndicesForEdge, maxIndicesForEdge);

        if (reuseGeometries === false) {
            log("Geometry reuse is disabled");
        }

        const xktModel = new XKTModel({
            minTileSize,
            modelAABB,
            maxIndicesForEdge
        });

        switch (ext) {
            case "json":
                convert(parseCityJSONIntoXKTModel, {
                    data: JSON.parse(sourceData),
                    xktModel,
                    stats,
                    rotateX,
                    center: fileTypeConfigs.center,
                    transform: fileTypeConfigs.transform,
                    log
                });
                break;

            case "glb":
                sourceData = toArrayBuffer(sourceData);
                convert(parseGLTFIntoXKTModel, {
                    data: sourceData,
                    reuseGeometries,
                    includeTextures: true,
                    includeNormals,
                    metaModelData: metaModelJSON,
                    xktModel,
                    stats,
                    log
                });
                break;

            case "gltf":
                sourceData = toArrayBuffer(sourceData);
                const gltfBasePath = source ? path.dirname(source) : "";
                convert(parseGLTFIntoXKTModel, {
                    baseUri: gltfBasePath,
                    data: sourceData,
                    reuseGeometries,
                    includeTextures: true,
                    includeNormals,
                    metaModelData: metaModelJSON,
                    xktModel,
                    stats,
                    log
                });
                break;

            // case "gltf":
            //     const gltfJSON = JSON.parse(sourceData);
            //     const gltfBasePath = source ? getBasePath(source) : "";
            //     convert(parseGLTFIntoXKTModel, {
            //         baseUri: gltfBasePath,
            //         data: gltfJSON,
            //         reuseGeometries,
            //         includeTextures,
            //         includeNormals,
            //         metaModelData: metaModelJSON,
            //         xktModel,
            //         getAttachment: async (name) => {
            //             const filePath = gltfBasePath + name;
            //             log(`Reading attachment file: ${filePath}`);
            //             const buffer = fs.readFileSync(filePath);
            //             const arrayBuf = toArrayBuffer(buffer);
            //             return arrayBuf;
            //         },
            //         stats,
            //         log
            //     });
            //     break;

            case "ifc":
                if (!WebIFC) {
                    try {
                        // Try to dynamically import WebIFC
                        import('web-ifc').then((module) => {
                            const WebIFCImported = module.default;
                            convert(parseIFCIntoXKTModel, {
                                WebIFC: WebIFCImported,
                                data: sourceData,
                                xktModel,
                                wasmPath: "./",
                                includeTypes,
                                excludeTypes,
                                stats,
                                log
                            });
                        }).catch(err => {
                            reject(`Error loading WebIFC: ${err.message}. Please ensure 'web-ifc' is installed or provide WebIFC explicitly.`);
                        });
                        return;
                    } catch (err) {
                        reject(`Error loading WebIFC: ${err.message}. Please ensure 'web-ifc' is installed or provide WebIFC explicitly.`);
                        return;
                    }
                } else {
                    // Use provided WebIFC
                    convert(parseIFCIntoXKTModel, {
                        WebIFC,
                        data: sourceData,
                        xktModel,
                        wasmPath: "./",
                        includeTypes,
                        excludeTypes,
                        stats,
                        log
                    });
                }
                break;

            case "laz":
                convert(parseLASIntoXKTModel, {
                    data: sourceData,
                    xktModel,
                    stats,
                    fp64: fileTypeConfigs.fp64,
                    colorDepth: fileTypeConfigs.colorDepth,
                    center: fileTypeConfigs.center,
                    transform: fileTypeConfigs.transform,
                    skip: overrideOption(fileTypeConfigs.skip, 1),
                    log
                });
                break;

            case "las":
                convert(parseLASIntoXKTModel, {
                    data: sourceData,
                    xktModel,
                    stats,
                    fp64: fileTypeConfigs.fp64,
                    colorDepth: fileTypeConfigs.colorDepth,
                    center: fileTypeConfigs.center,
                    transform: fileTypeConfigs.transform,
                    skip: overrideOption(fileTypeConfigs.skip, 1),
                    log
                });
                break;

            case "pcd":
                convert(parsePCDIntoXKTModel, {
                    data: sourceData,
                    xktModel,
                    stats,
                    log
                });
                break;

            case "ply":
                convert(parsePLYIntoXKTModel, {
                    data: sourceData,
                    xktModel,
                    stats,
                    log
                });
                break;

            case "stl":
                convert(parseSTLIntoXKTModel, {
                    data: sourceData,
                    xktModel,
                    stats,
                    log
                });
                break;

            default:
                reject(`Error: unsupported source format: "${ext}".`);
                return;
        }

        function convert(parser, converterParams) {

            parser(converterParams).then(() => {

                if (!metaModelJSON) {
                    log("Creating default metamodel in XKT");
                    xktModel.createDefaultMetaObjects();
                }

                log("Input file parsed OK. Building XKT document...");

                xktModel.finalize().then(() => {

                    log("XKT document built OK. Writing to XKT file...");

                    const xktArrayBuffer = writeXKTModelToArrayBuffer(xktModel, metaModelJSON, stats, {zip: zip});

                    const xktContent = Buffer.from(xktArrayBuffer);

                    const targetFileSizeBytes = xktArrayBuffer.byteLength;

                    stats.minTileSize = minTileSize || 200;
                    stats.sourceSize = (sourceFileSizeBytes / 1000).toFixed(2);
                    stats.xktSize = (targetFileSizeBytes / 1000).toFixed(2);
                    stats.xktVersion = XKT_INFO.xktVersion;
                    stats.compressionRatio = (sourceFileSizeBytes / targetFileSizeBytes).toFixed(2);
                    stats.conversionTime = ((new Date() - startTime) / 1000.0).toFixed(2);
                    stats.aabb = xktModel.aabb;
                    log(`Converted to: XKT v${stats.xktVersion}`);
                    if (includeTypes) {
                        log("Include types: " + (includeTypes ? includeTypes : "(include all)"));
                    }
                    if (excludeTypes) {
                        log("Exclude types: " + (excludeTypes ? excludeTypes : "(exclude none)"));
                    }
                    log("XKT size: " + stats.xktSize + " kB");
                    log("XKT textures size: " + (stats.texturesSize / 1000).toFixed(2) + "kB");
                    log("Compression ratio: " + stats.compressionRatio);
                    log("Conversion time: " + stats.conversionTime + " s");
                    log("Converted metaobjects: " + stats.numMetaObjects);
                    log("Converted property sets: " + stats.numPropertySets);
                    log("Converted drawable objects: " + stats.numObjects);
                    log("Converted geometries: " + stats.numGeometries);
                    log("Converted textures: " + stats.numTextures);
                    log("Converted textureSets: " + stats.numTextureSets);
                    log("Converted triangles: " + stats.numTriangles);
                    log("Converted vertices: " + stats.numVertices);
                    log("Converted UVs: " + stats.numUVs);
                    log("Converted normals: " + stats.numNormals);
                    log("Converted tiles: " + xktModel.tilesList.length);
                    log("minTileSize: " + stats.minTileSize);

                    if (output) {
                        const outputDir = path.dirname(output);
                        if (outputDir !== "" && !fs.existsSync(outputDir)) {
                            fs.mkdirSync(outputDir, {recursive: true});
                        }
                        log('Writing XKT file: ' + output);
                        fs.writeFileSync(output, xktContent);
                    }

                    if (outputXKTModel) {
                        outputXKTModel(xktModel);
                    }

                    if (outputXKT) {
                        outputXKT(xktContent);
                    }

                    if (outputStats) {
                        outputStats(stats);
                    }

                    resolve();
                });
            }, (err) => {
                reject(err);
            });
        }
    });
}

export {convert2xkt};