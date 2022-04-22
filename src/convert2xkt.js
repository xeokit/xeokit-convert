import {parseMetaModelIntoXKTModel} from "./parsers/parseMetaModelIntoXKTModel.js";
import {parseCityJSONIntoXKTModel} from "./parsers/parseCityJSONIntoXKTModel.js";
import {parseGLTFIntoXKTModel} from "./parsers/parseGLTFIntoXKTModel.js";
import {parseIFCIntoXKTModel} from "./parsers/parseIFCIntoXKTModel.js";
import {parseLASIntoXKTModel} from "./parsers/parseLASIntoXKTModel.js";
import {parsePCDIntoXKTModel} from "./parsers/parsePCDIntoXKTModel.js";
import {parsePLYIntoXKTModel} from "./parsers/parsePLYIntoXKTModel.js";
import {parseSTLIntoXKTModel} from "./parsers/parseSTLIntoXKTModel.js";
import {parse3DXMLIntoXKTModel} from "./parsers/parse3DXMLIntoXKTModel.js";
import {writeXKTModelToArrayBuffer} from "./XKTModel/writeXKTModelToArrayBuffer.js";
import {XKTModel} from "./XKTModel/XKTModel.js";
import {XKT_INFO} from "./XKT_INFO.js";

const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;

/**
 * Converts model files into xeokit's native XKT format.
 *
 * Supported source formats are: IFC, CityJSON, 3DXML, glTF, LAZ and LAS.
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
 * @param {String} [params.source] Path to source file. Alternative to ````sourceData````.
 * @param {ArrayBuffer|JSON} [params.sourceData] Source file data. Alternative to ````source````.
 * @param {String} [params.sourceFormat] Format of source file/data. Always needed with ````sourceData````, but not normally needed with ````source````, because convert2xkt will determine the format automatically from the file extension of ````source````.
 * @param {ArrayBuffer|JSON} [params.metaModelData] Source file data. Overrides metadata from ````metaModelSource````, ````sourceData```` and ````source````.
 * @param {String} [params.metaModelSource] Path to source metaModel file. Overrides metadata from ````sourceData```` and ````source````. Overridden by ````metaModelData````.
 * @param {String} [params.output] Path to destination XKT file. Directories on this path are automatically created if not existing.
 * @param {Function} [params.outputXKTModel] Callback to collect the ````XKTModel```` that is internally build by this method.
 * @param {Function} [params.outputXKT] Callback to collect XKT file data.
 * @param {String[]} [params.includeTypes] Option to only convert objects of these types.
 * @param {String[]} [params.excludeTypes] Option to never convert objects of these types.
 * @param {Object} [stats] Collects conversion statistics. Statistics are attached to this object if provided.
 * @param {Function} [params.outputStats] Callback to collect statistics.
 * @param {Boolean} [params.rotateX=false] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary. Applies to CityJSON and LAS/LAZ models.
 * @param {Boolean} [params.reuseGeometries=true] When true, will enable geometry reuse within the XKT. When false,
 * will automatically "expand" all reused geometries into duplicate copies. This has the drawback of increasing the XKT
 * file size (~10-30% for typical models), but can make the model more responsive in the xeokit Viewer, especially if the model
 * has excessive geometry reuse. An example of excessive geometry reuse would be when a model (eg. glTF) has 4000 geometries that are
 * shared amongst 2000 objects, ie. a large number of geometries with a low amount of reuse, which can present a
 * pathological performance case for xeokit's underlying graphics APIs (WebGL, WebGPU etc).
 * @param {Function} [params.log] Logging callback.
 * @return {Promise<number>}
 */
function convert2xkt({
                         source,
                         sourceData,
                         sourceFormat,
                         metaModelSource,
                         metaModelData,
                         output,
                         outputXKTModel,
                         outputXKT,
                         includeTypes,
                         excludeTypes,
                         reuseGeometries,
                         stats = {},
                         outputStats,
                         rotateX,
                         log = (msg) => {
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
    stats.numObjects = 0;
    stats.numGeometries = 0;
    stats.sourceSize = 0;
    stats.xktSize = 0;
    stats.xktVersion = "";
    stats.compressionRatio = 0;
    stats.conversionTime = 0;
    stats.aabb = null;

    return new Promise(function (resolve, reject) {

        const _log = log;
        log = (msg) => {
            _log("[convert2xkt] " + msg)
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

        const ext = sourceFormat || source.split('.').pop();

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

        if (!metaModelData && metaModelSource) {
            log('Reading input metadata file: ' + metaModelSource);
            try {
                const metaModelFileData = fs.readFileSync(metaModelSource);
                metaModelData = JSON.parse(metaModelFileData);
            } catch (err) {
                reject(err);
                return;
            }
        }

        if (reuseGeometries === false) {
            log("Geometry reuse is disabled");
        }

        log("Converting...");

        const xktModel = new XKTModel();

        if (metaModelData) {

            parseMetaModelIntoXKTModel({metaModelData, xktModel}).then(
                () => {
                    convertForFormat();
                },
                (errMsg) => {
                    reject(errMsg);
                });
        } else {
            convertForFormat();
        }

        function convertForFormat() {

            switch (ext) {
                case "json":
                    convert(parseCityJSONIntoXKTModel, {
                        data: JSON.parse(sourceData),
                        xktModel,
                        stats,
                        rotateX,
                        log
                    });
                    break;

                case "gltf":
                    const gltfBasePath = source ? getBasePath(source) : "";
                    convert(parseGLTFIntoXKTModel, {
                        data: JSON.parse(sourceData),
                        reuseGeometries,
                        metaModelData,
                        xktModel,
                        getAttachment: async (name) => {
                            return fs.readFileSync(gltfBasePath + name);
                        },
                        stats,
                        log
                    });
                    break;

                case "ifc":
                    convert(parseIFCIntoXKTModel, {
                        data: sourceData,
                        xktModel,
                        wasmPath: "./",
                        includeTypes,
                        excludeTypes,
                        stats,
                        log
                    });
                    break;

                case "laz":
                    convert(parseLASIntoXKTModel, {
                        data: sourceData,
                        xktModel,
                        stats,
                        rotateX,
                        log
                    });
                    break;

                case "las":
                    convert(parseLASIntoXKTModel, {
                        data: sourceData,
                        xktModel,
                        stats,
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

                case "3dxml":
                    const domParser = new DOMParser();
                    convert(parse3DXMLIntoXKTModel, {
                        data: sourceData,
                        domParser,
                        xktModel,
                        stats,
                        log
                    });
                    break;

                default:
                    reject('Error: unsupported source format: "${ext}".');
                    return;
            }
        }

        function convert(parser, converterParams) {

            parser(converterParams).then(() => {

                xktModel.createDefaultMetaObjects();

                xktModel.finalize();

                const xktArrayBuffer = writeXKTModelToArrayBuffer(xktModel);
                const xktContent = Buffer.from(xktArrayBuffer);

                const targetFileSizeBytes = xktArrayBuffer.byteLength;

                stats.sourceSize = (sourceFileSizeBytes / 1000).toFixed(2);
                stats.xktSize = (targetFileSizeBytes / 1000).toFixed(2);
                stats.xktVersion = XKT_INFO.xktVersion;
                stats.compressionRatio = (sourceFileSizeBytes / targetFileSizeBytes).toFixed(2);
                stats.conversionTime = ((new Date() - startTime) / 1000.0).toFixed(2);
                stats.aabb = xktModel.aabb;
                log("Converted to: XKT v9");
                if (includeTypes) {
                    log("Include types: " + (includeTypes ? includeTypes : "(include all)"));
                }
                if (excludeTypes) {
                    log("Exclude types: " + (excludeTypes ? excludeTypes : "(exclude none)"));
                }
                log("XKT size: " + stats.xktSize + " kB");
                log("Compression ratio: " + stats.compressionRatio);
                log("Conversion time: " + stats.conversionTime + " s");
                log("Converted metaobjects: " + stats.numMetaObjects);
                log("Converted property sets: " + stats.numPropertySets);
                log("Converted drawable objects: " + stats.numObjects);
                log("Converted geometries: " + stats.numGeometries);
                log("Converted triangles: " + stats.numTriangles);
                log("Converted vertices: " + stats.numVertices);

                if (output) {
                    const outputDir = getBasePath(output).trim();
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

            }, (err) => {
                reject(err);
            });
        }
    });
}

function getBasePath(src) {
    const i = src.lastIndexOf("/");
    return (i !== 0) ? src.substring(0, i + 1) : "";
}

export default convert2xkt;