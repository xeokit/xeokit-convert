import {parse} from '@loaders.gl/core';
import {PLYLoader} from '@loaders.gl/ply';

/**
 * @desc Parses PLY file data into an {@link XKTModel}.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load a PLY model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("./models/ply/test.ply", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parsePLYIntoXKTModel({data, xktModel}).then(()=>{
 *        xktModel.finalize();
 *     },
 *     (msg) => {
 *         console.error(msg);
 *     });
 * });
 * ````
 *
 * @param {Object} params Parsing params.
 * @param {ArrayBuffer} params.data PLY file data.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
async function parsePLYIntoXKTModel({data, xktModel, stats, log}) {

    if (!data) {
        throw "Argument expected: data";
    }

    if (!xktModel) {
        throw "Argument expected: xktModel";
    }

    let parsedData;
    try {
        parsedData = await parse(data, PLYLoader);
    } catch (e) {
        if (log) {
            log("Error: " + e);
        }
        return;
    }

    const attributes = parsedData.attributes;
    const hasColors = !!attributes.COLOR_0;

    if (hasColors) {
        const colorsValue = hasColors ? attributes.COLOR_0.value : null;
        const colorsCompressed = [];
        for (let i = 0, len = colorsValue.length; i < len; i += 4) {
            colorsCompressed.push(colorsValue[i]);
            colorsCompressed.push(colorsValue[i + 1]);
            colorsCompressed.push(colorsValue[i + 2]);
        }
        xktModel.createGeometry({
            geometryId: "plyGeometry",
            primitiveType: "triangles",
            positions: attributes.POSITION.value,
            indices: parsedData.indices ? parsedData.indices.value : [],
            colorsCompressed: colorsCompressed
        });
    } else {
        xktModel.createGeometry({
            geometryId: "plyGeometry",
            primitiveType: "triangles",
            positions: attributes.POSITION.value,
            indices: parsedData.indices ? parsedData.indices.value : []
        });
    }

    xktModel.createMesh({
        meshId: "plyMesh",
        geometryId: "plyGeometry",
        color: (!hasColors) ? [1, 1, 1] : null
    });

    xktModel.createEntity({
        entityId: "ply",
        meshIds: ["plyMesh"]
    });

    if (stats) {
        stats.sourceFormat = "PLY";
        stats.schemaVersion = "";
        stats.title = "";
        stats.author = "";
        stats.created = "";
        stats.numMetaObjects = 2;
        stats.numPropertySets = 0;
        stats.numObjects = 1;
        stats.numGeometries = 1;
        stats.numVertices = attributes.POSITION.value.length / 3;
    }
}

export {parsePLYIntoXKTModel};
