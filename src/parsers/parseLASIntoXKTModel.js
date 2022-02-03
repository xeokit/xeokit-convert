import {parse} from '@loaders.gl/core';
import {LASLoader} from '@loaders.gl/las';
import {math} from "../lib/math.js";


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
 * @param {Boolean} [params.rotateX=false] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary.
 * @param {Number|String} [params.colorDepth=8] Whether colors encoded using 8 or 16 bits. Can be set to 'auto'. LAS specification recommends 16 bits.
 * @param {Number} [params.skip=1] Read one from every n points.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 */
async function parseLASIntoXKTModel({
                                        data,
                                        xktModel,
                                        rotateX = false,
                                        colorDepth = 8,
                                        skip = 1,
                                        stats,
                                        log = () => {
                                        }
                                    }) {

    if (!data) {
        throw "Argument expected: data";
    }

    if (!xktModel) {
        throw "Argument expected: xktModel";
    }

    if (log) {
        log("Converting LAZ/LAS");
        if (rotateX) {
            log("Rotating model 90 degrees about X-axis");
        }
    }

    let parsedData;
    try {
        parsedData = await parse(data, LASLoader, {las: {colorDepth, skip}});
    } catch (e) {
        if (log) {
            log("Error: " + e);
        }
        return;
    }

    const loaderData = parsedData.loaderData;
    const loaderDataHeader = loaderData.header;
    const pointsFormatId = loaderDataHeader.pointsFormatId;

    const attributes = parsedData.attributes;

    if (!attributes.POSITION) {
        log("No positions found in file (expected for all LAS point formats)");
        return;
    }

    let positionsValue
    let colorsCompressed;

    switch (pointsFormatId) {
        case 0:
            if (!attributes.intensity) {
                log("No intensities found in file (expected for LAS point format 0)");
                return;
            }
            positionsValue = readPositions(attributes.POSITION, rotateX);
            colorsCompressed = readIntensities(attributes.intensity);
            break;
        case 1:
            if (!attributes.intensity) {
                log("No intensities found in file (expected for LAS point format 1)");
                return;
            }
            positionsValue = readPositions(attributes.POSITION, rotateX);
            colorsCompressed = readIntensities(attributes.intensity);
            break;
        case 2:
            if (!attributes.intensity) {
                log("No intensities found in file (expected for LAS point format 2)");
                return;
            }
            positionsValue = readPositions(attributes.POSITION, rotateX);
            colorsCompressed = readColorsAndIntensities(attributes.COLOR_0, attributes.intensity);
            break;
        case 3:
            if (!attributes.intensity) {
                log("No intensities found in file (expected for LAS point format 3)");
                return;
            }
            positionsValue = readPositions(attributes.POSITION, rotateX);
            colorsCompressed = readColorsAndIntensities(attributes.COLOR_0, attributes.intensity);
            break;
    }

    xktModel.createGeometry({
        geometryId: "pointsGeometry",
        primitiveType: "points",
        positions: positionsValue,
        colorsCompressed: colorsCompressed
    });

    xktModel.createMesh({
        meshId: "pointsMesh",
        geometryId: "pointsGeometry"
    });

    const entityId = math.createUUID();

    xktModel.createEntity({
        entityId: entityId,
        meshIds: ["pointsMesh"]
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
        stats.numVertices = positionsValue.length / 3;
    }
}

function readPositions(attributesPosition, rotateX) {
    const positionsValue = attributesPosition.value;
    if (rotateX) {
        if (positionsValue) {
            for (let i = 0, len = positionsValue.length; i < len; i += 3) {
                const temp = positionsValue[i + 1];
                positionsValue[i + 1] = positionsValue[i + 2];
                positionsValue[i + 2] = temp;
            }
        }
    }
    return positionsValue;
}

function readColorsAndIntensities(attributesColor, attributesIntensity) {
    const colors = attributesColor.value;
    const colorSize = attributesColor.size;
    const intensities = attributesIntensity.value;
    const colorsCompressedSize = intensities.length * 4;
    const colorsCompressed = new Uint8Array(colorsCompressedSize);
    for (let i = 0, j = 0, k = 0, len = intensities.length; i < len; i++, k += colorSize, j += 4) {
        colorsCompressed[j + 0] = colors[k + 0];
        colorsCompressed[j + 1] = colors[k + 1];
        colorsCompressed[j + 2] = colors[k + 2];
        colorsCompressed[j + 3] = Math.round((intensities[i] / 65536) * 255);
    }
    return colorsCompressed;
}

function readIntensities(attributesIntensity) {
    const intensities = attributesIntensity.intensity;
    const colorsCompressedSize = intensities.length * 4;
    const colorsCompressed = new Uint8Array(colorsCompressedSize);
    for (let i = 0, j = 0, k = 0, len = intensities.length; i < len; i++, k += 3, j += 4) {
        colorsCompressed[j + 0] = 0;
        colorsCompressed[j + 1] = 0;
        colorsCompressed[j + 2] = 0;
        colorsCompressed[j + 3] = Math.round((intensities[i] / 65536) * 255);
    }
    return colorsCompressed;
}

export {parseLASIntoXKTModel};