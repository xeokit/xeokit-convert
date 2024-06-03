import {parse} from '@loaders.gl/core';
import {LASLoader} from '@loaders.gl/las';

import {math} from "../lib/math.js";

const MAX_VERTICES = 500000; // TODO: Rough estimate

/**
 * @desc Parses LAS and LAZ point cloud data into an {@link XKTModel}.
 *
 * This parser handles both the LASER file format (LAS) and its compressed version (LAZ),
 * a public format for the interchange of 3-dimensional point cloud data data, developed
 * for LIDAR mapping purposes.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load an LAZ point cloud model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("./models/laz/autzen.laz", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     await parseLASIntoXKTModel({
 *          data,
 *          xktModel,
 *          rotateX: true,
 *          log: (msg) => { console.log(msg); }
 *     }).then(()=>{
 *        xktModel.finalize();
 *     },
 *     (msg) => {
 *         console.error(msg);
 *     });
 * });
 * ````
 *
 * @param {Object} params Parsing params.
 * @param {ArrayBuffer} params.data LAS/LAZ file data.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {boolean} [params.center=false] Set true to center the LAS point positions to [0,0,0]. This is applied before the transformation matrix, if specified.
 * @param {Boolean} [params.transform] 4x4 transformation matrix to transform point positions. Use this to rotate, translate and scale them if neccessary.
 * @param {Number|String} [params.colorDepth=8] Whether colors encoded using 8 or 16 bits. Can be set to 'auto'. LAS specification recommends 16 bits.
 * @param {Boolean} [params.fp64=false] Configures if LASLoaderPlugin assumes that LAS positions are stored in 64-bit floats instead of 32-bit.
 * @param {Number} [params.skip=1] Read one from every n points.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise} Resolves when LAS has been parsed.
 */
function parseLASIntoXKTModel({
                                  data,
                                  xktModel,
                                  center = false,
                                  transform = null,
                                  colorDepth = "auto",
                                  fp64 = false,
                                  skip = 1,
                                  stats,
                                  log = () => {
                                  }
                              }) {

    if (log) {
        log("Using parser: parseLASIntoXKTModel");
    }

    return new Promise(function (resolve, reject) {

        if (!data) {
            reject("Argument expected: data");
            return;
        }

        if (!xktModel) {
            reject("Argument expected: xktModel");
            return;
        }

        log("Converting LAZ/LAS");

        log(`center: ${center}`);
        if (transform) {
            log(`transform: [${transform}]`);
        }
        log(`colorDepth: ${colorDepth}`);
        log(`fp64: ${fp64}`);
        log(`skip: ${skip}`);

        parse(data, LASLoader, {
            las: {
                colorDepth,
                fp64
            }
        }).then((parsedData) => {

            const attributes = parsedData.attributes;

            const loaderData = parsedData.loaderData;
            const pointsFormatId = loaderData.pointsFormatId !== undefined ? loaderData.pointsFormatId : -1;

            if (!attributes.POSITION) {
                log("No positions found in file (expected for all LAS point formats)");
                return;
            }

            let readAttributes = {};

            switch (pointsFormatId) {
                case 0:
                    if (!attributes.intensity) {
                        log("No intensities found in file (expected for LAS point format 0)");
                        return;
                    }

                    readAttributes = readIntensities(attributes.POSITION, attributes.intensity);
                    break;
                case 1:
                    if (!attributes.intensity) {
                        log("No intensities found in file (expected for LAS point format 1)");
                        return;
                    }
                    readAttributes = readIntensities(attributes.POSITION, attributes.intensity);
                    break;
                case 2:
                    if (!attributes.intensity) {
                        log("No intensities found in file (expected for LAS point format 2)");
                        return;
                    }

                    readAttributes = readColorsAndIntensities(attributes.POSITION, attributes.COLOR_0, attributes.intensity);
                    break;
                case 3:
                    if (!attributes.intensity) {
                        log("No intensities found in file (expected for LAS point format 3)");
                        return;
                    }
                    readAttributes = readColorsAndIntensities(attributes.POSITION, attributes.COLOR_0, attributes.intensity);
                    break;
            }

            const pointsChunks = chunkArray(readPositions(readAttributes.positions), MAX_VERTICES * 3);
            const colorsChunks = chunkArray(readAttributes.colors, MAX_VERTICES * 4);

            const meshIds = [];

            for (let j = 0, lenj = pointsChunks.length; j < lenj; j++) {

                const geometryId = `geometry-${j}`;
                const meshId = `mesh-${j}`;

                meshIds.push(meshId);

                xktModel.createGeometry({
                    geometryId: geometryId,
                    primitiveType: "points",
                    positions: pointsChunks[j],
                    colorsCompressed: colorsChunks[j]
                });

                xktModel.createMesh({
                    meshId,
                    geometryId
                });
            }

            const entityId = math.createUUID();

            xktModel.createEntity({
                entityId,
                meshIds
            });

            const rootMetaObjectId = math.createUUID();

            xktModel.createMetaObject({
                metaObjectId: rootMetaObjectId,
                metaObjectType: "Model",
                metaObjectName: "Model"
            });

            xktModel.createMetaObject({
                metaObjectId: entityId,
                metaObjectType: "PointCloud",
                metaObjectName: "PointCloud (LAZ)",
                parentMetaObjectId: rootMetaObjectId
            });

            if (stats) {
                stats.sourceFormat = "LAS";
                stats.schemaVersion = "";
                stats.title = "";
                stats.author = "";
                stats.created = "";
                stats.numMetaObjects = 2;
                stats.numPropertySets = 0;
                stats.numObjects = 1;
                stats.numGeometries = 1;
                stats.numVertices = readAttributes.positions.length / 3;
            }

            resolve();

        }, (errMsg) => {
            reject(errMsg);
        });
    });

    function readPositions(positionsValue) {
        if (positionsValue) {
            if (center) {
                const centerPos = math.vec3();
                const numPoints = positionsValue.length;
                for (let i = 0, len = positionsValue.length; i < len; i += 3) {
                    centerPos[0] += positionsValue[i + 0];
                    centerPos[1] += positionsValue[i + 1];
                    centerPos[2] += positionsValue[i + 2];
                }
                centerPos[0] /= numPoints;
                centerPos[1] /= numPoints;
                centerPos[2] /= numPoints;
                for (let i = 0, len = positionsValue.length; i < len; i += 3) {
                    positionsValue[i + 0] -= centerPos[0];
                    positionsValue[i + 1] -= centerPos[1];
                    positionsValue[i + 2] -= centerPos[2];
                }
            }
            if (transform) {
                const mat = math.mat4(transform);
                const pos = math.vec3();
                for (let i = 0, len = positionsValue.length; i < len; i += 3) {
                    pos[0] = positionsValue[i + 0];
                    pos[1] = positionsValue[i + 1];
                    pos[2] = positionsValue[i + 2];
                    math.transformPoint3(mat, pos, pos);
                    positionsValue[i + 0] = pos[0];
                    positionsValue[i + 1] = pos[1];
                    positionsValue[i + 2] = pos[2];
                }
            }
        }
        return positionsValue;
    }

    function readColorsAndIntensities(attributesPosition, attributesColor, attributesIntensity) {
        const positionsValue = attributesPosition.value;
        const colors = attributesColor.value;
        const colorSize = attributesColor.size;
        const intensities = attributesIntensity.value;
        const colorsCompressedSize = intensities.length * 4;
        const positions = [];
        const colorsCompressed = new Uint8Array(colorsCompressedSize / skip);
        let count = skip;
        for (let i = 0, j = 0, k = 0, l = 0, m = 0, n=0,len = intensities.length; i < len; i++, k += colorSize, j += 4, l += 3) {
            if (count <= 0) {
                colorsCompressed[m++] = colors[k + 0];
                colorsCompressed[m++] = colors[k + 1];
                colorsCompressed[m++] = colors[k + 2];
                colorsCompressed[m++] = Math.round((intensities[i] / 65536) * 255);
                positions[n++] = positionsValue[l + 0];
                positions[n++] = positionsValue[l + 1];
                positions[n++] = positionsValue[l + 2];
                count = skip;
            } else {
                count--;
            }
        }
        return {
            positions,
            colors: colorsCompressed
        };
    }

    function readIntensities(attributesPosition, attributesIntensity) {
        const positionsValue = attributesPosition.value;
        const intensities = attributesIntensity.value;
        const colorsCompressedSize = intensities.length * 4;
        const positions = [];
        const colorsCompressed = new Uint8Array(colorsCompressedSize / skip);
        let count = skip;
        for (let i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, len = intensities.length; i < len; i++, k += 3, j += 4, l += 3) {
            if (count <= 0) {
                colorsCompressed[m++] = 0;
                colorsCompressed[m++] = 0;
                colorsCompressed[m++] = 0;
                colorsCompressed[m++] = Math.round((intensities[i] / 65536) * 255);
                positions[n++] = positionsValue[l + 0];
                positions[n++] = positionsValue[l + 1];
                positions[n++] = positionsValue[l + 2];
                count = skip;
            } else {
                count--;
            }
        }
        return {
            positions,
            colors: colorsCompressed
        };
    }

    function chunkArray(array, chunkSize) {
        if (chunkSize >= array.length) {
            return [array]; // One chunk
        }
        let result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }

}

export {parseLASIntoXKTModel};