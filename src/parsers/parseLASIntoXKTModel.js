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
 * @param {Boolean} [params.rotateX=true] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 */
async function parseLASIntoXKTModel({data, xktModel, rotateX = true, stats, log}) {

    if (!data) {
        throw "Argument expected: data";
    }

    if (!xktModel) {
        throw "Argument expected: xktModel";
    }

    if (log) {
        log("Converting LAZ/LAS");
    }

    let parsedData;
    try {
        parsedData = await parse(data, LASLoader);
    } catch (e) {
        if (log) {
            log("Error: " + e);
        }
        return;
    }

    const attributes = parsedData.attributes;
    const positionsValue = attributes.POSITION.value;
    const colorsValue = attributes.COLOR_0.value;

    if (rotateX) {
        if (log) {
            log("Rotating model about X-axis");
        }
        if (positionsValue) {
            for (let i = 0, len = positionsValue.length; i < len; i += 3) {
                const temp = positionsValue[i + 1];
                positionsValue[i + 1] = positionsValue[i + 2];
                positionsValue[i + 2] = temp;
            }
        }
    }

    xktModel.createGeometry({
        geometryId: "pointsGeometry",
        primitiveType: "points",
        positions: positionsValue,
        colorsCompressed: colorsValue
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

export {parseLASIntoXKTModel};