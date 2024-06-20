
import {XKTModel} from "./XKTModel/XKTModel.js";
import {parseGLTFIntoXKTModel} from "./parsers/parseGLTFIntoXKTModel.js";
import {writeXKTModelToArrayBuffer} from "./XKTModel/writeXKTModelToArrayBuffer.js";

import {toArrayBuffer} from "./XKTModel/lib/toArraybuffer";

/**
 * Converts model files into xeokit's native XKT format.
 *
 * Supported source formats are: IFC, CityJSON, glTF, LAZ and LAS.
 *
 * **Only bundled in xeokit-convert.cjs.js.**
 *
 * ## Usage
 *
 ````
 * @param {Object} params Conversion parameters.
 * @param {Object} params.WebIFC The WebIFC library. We pass this in as an external dependency, in order to give the
 * caller the choice of whether to use the Browser or NodeJS version.
 * @param {*} [params.configs] Configurations.
 * @param {ArrayBuffer|JSON} [params.sourceData] Source file data. Alternative to ````source````.
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
 * @param {Boolean} [params.includeTextures=true] Whether to convert textures. Only works for ````glTF```` models.
 * @param {Boolean} [params.includeNormals=true] Whether to convert normals. When false, the parser will ignore
 * geometry normals, and the modelwill rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the model.
 * @param {Number} [params.minTileSize=200] Minimum RTC coordinate tile size. Set this to a value between 100 and 10000,
 * depending on how far from the coordinate origin the model's vertex positions are; specify larger tile sizes when close
 * to the origin, and smaller sizes when distant.  This compensates for decreasing precision as floats get bigger.
 * @param {Function} [params.log] Logging callback.
 * @return {Promise<number>}
 */
function convert2xkt({
                         configs = {},
                         sourceData,
                         modelAABB,
                         outputXKTModel,
                         outputXKT,
                         includeTypes,
                         excludeTypes,
                         reuseGeometries = true,
                         minTileSize = 200,
                         stats = {},
                         rotateX = false,
                         includeTextures = true,
                         includeNormals = true,
                         log = function (msg) {
                         }
                     }) {

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

    return new Promise(function (resolve, reject) {
        const _log = log;
        log = (msg) => {
            _log(`[convert2xkt] ${msg}`)
        }

        if (!sourceData) {
            reject("Argument expected: source or sourceData");
            return;
        }

        if (!outputXKTModel && !outputXKT) {
            reject("Argument expected: output, outputXKTModel or outputXKT");
            return;
        }

        const sourceConfigs = configs.sourceConfigs || {};
        const ext = 'glb';

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


        const sourceFileSizeBytes = sourceData.byteLength;

        log("Input file size: " + (sourceFileSizeBytes / 1000).toFixed(2) + " kB");



        minTileSize = overrideOption(fileTypeConfigs.minTileSize, minTileSize);
        rotateX = overrideOption(fileTypeConfigs.rotateX, rotateX);
        reuseGeometries = overrideOption(fileTypeConfigs.reuseGeometries, reuseGeometries);
        includeTextures = overrideOption(fileTypeConfigs.includeTextures, includeTextures);
        includeNormals = overrideOption(fileTypeConfigs.includeNormals, includeNormals);
        includeTypes = overrideOption(fileTypeConfigs.includeTypes, includeTypes);
        excludeTypes = overrideOption(fileTypeConfigs.excludeTypes, excludeTypes);

        if (reuseGeometries === false) {
            log("Geometry reuse is disabled");
        }

        const xktModel = new XKTModel({
            minTileSize,
            modelAABB
        });



        sourceData = toArrayBuffer(sourceData);
        convert(parseGLTFIntoXKTModel, {
            data: sourceData,
            reuseGeometries,
            includeTextures: true,
            includeNormals,
            xktModel,
            stats,
            log
        });


        function convert(parser, converterParams) {

            parser(converterParams).then(() => {


                log("Input file parsed OK. Building XKT document...");

                xktModel.finalize().then(() => {

                    log("XKT document built OK. Writing to XKT file...");

                    const xktArrayBuffer = writeXKTModelToArrayBuffer(xktModel, null, stats, {zip: true});

                    const xktContent = Buffer.from(xktArrayBuffer);


                    if (outputXKT) {
                        outputXKT(xktContent);
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