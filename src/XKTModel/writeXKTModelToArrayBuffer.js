import * as p from "./lib/pako.es.js";
import {XKT_INFO} from "../XKT_INFO.js";

let pako = p;
if (!pako.inflate) {  // See https://github.com/nodeca/pako/issues/97
    pako = pako.default;
}

const XKT_VERSION = XKT_INFO.xktVersion;

/**
 * Writes an {@link XKTModel} to an {@link ArrayBuffer}.
 *
 * @param {XKTModel} xktModel The {@link XKTModel}.
 * @returns {ArrayBuffer} The {@link ArrayBuffer}.
 */
function writeXKTModelToArrayBuffer(xktModel) {

    const data = getModelData(xktModel);

    const deflatedData = deflateData(data);

    const arrayBuffer = createArrayBuffer(deflatedData);

    return arrayBuffer;
}

function getModelData(xktModel) {

    //------------------------------------------------------------------------------------------------------------------
    // Allocate data
    //------------------------------------------------------------------------------------------------------------------

    const propertySetsList = xktModel.propertySetsList;
    const metaObjectsList = xktModel.metaObjectsList;
    const geometriesList = xktModel.geometriesList;
    const meshesList = xktModel.meshesList;
    const entitiesList = xktModel.entitiesList;
    const tilesList = xktModel.tilesList;

    const numPropertySets = propertySetsList.length;
    const numMetaObjects = metaObjectsList.length;
    const numGeometries = geometriesList.length;
    const numMeshes = meshesList.length;
    const numEntities = entitiesList.length;
    const numTiles = tilesList.length;

    let lenPositions = 0;
    let lenNormals = 0;
    let lenColors = 0;
    let lenIndices = 0;
    let lenEdgeIndices = 0;
    let lenMatrices = 0;

    for (let geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {
        const geometry = geometriesList [geometryIndex];
        if (geometry.positionsQuantized) {
            lenPositions += geometry.positionsQuantized.length;
        }
        if (geometry.normalsOctEncoded) {
            lenNormals += geometry.normalsOctEncoded.length;
        }
        if (geometry.colorsCompressed) {
            lenColors += geometry.colorsCompressed.length;
        }
        if (geometry.indices) {
            lenIndices += geometry.indices.length;
        }
        if (geometry.edgeIndices) {
            lenEdgeIndices += geometry.edgeIndices.length;
        }
    }

    for (let meshIndex = 0; meshIndex < numMeshes; meshIndex++) {
        const mesh = meshesList[meshIndex];
        if (mesh.geometry.numInstances > 1) {
            lenMatrices += 16;
        }
    }

    const data = {

        // Metadata

        metadata: {},

        // Geometry data - vertex attributes and indices

        positions: new Uint16Array(lenPositions), // All geometry arrays
        normals: new Int8Array(lenNormals),
        colors: new Uint8Array(lenColors),
        indices: new Uint32Array(lenIndices),
        edgeIndices: new Uint32Array(lenEdgeIndices),

        // Transform matrices shared by meshes

        matrices: new Float32Array(lenMatrices), // Modeling matrices for entities that share geometries. Each entity either shares all it's geometries, or owns all its geometries exclusively. Exclusively-owned geometries are pre-transformed into World-space, and so their entities don't have modeling matrices in this array.

        // De-quantization matrix shared by all rused geometries

        reusedGeometriesDecodeMatrix: new Float32Array(xktModel.reusedGeometriesDecodeMatrix), // A single, global vertex position de-quantization matrix for all reused geometries. Reused geometries are quantized to their collective Local-space AABB, and this matrix is derived from that AABB.

        // Geometries

        eachGeometryPrimitiveType: new Uint8Array(numGeometries), // Primitive type for each geometry (0=solid triangles, 1=surface triangles, 2=lines, 3=points)
        eachGeometryPositionsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.positions. Every primitive type has positions.
        eachGeometryNormalsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.normals. If the next geometry has the same index, then this geometry has no normals.
        eachGeometryColorsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.colors. If the next geometry has the same index, then this geometry has no colors.
        eachGeometryIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.indices. If the next geometry has the same index, then this geometry has no indices.
        eachGeometryEdgeIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.edgeIndices. If the next geometry has the same index, then this geometry has no edge indices.

        // Meshes are grouped in runs that are shared by the same entities.

        // We duplicate materials for meshes, rather than reusing them, because each material is only 6 bytes and an index
        // into a common materials array would be 4 bytes, so it's hardly worth reusing materials, as long as they are that compact.

        eachMeshGeometriesPortion: new Uint32Array(numMeshes), // For each mesh, an index into the eachGeometry* arrays
        eachMeshMatricesPortion: new Uint32Array(numMeshes), // For each mesh that shares its geometry, an index to its first element in data.matrices, to indicate the modeling matrix that transforms the shared geometry Local-space vertex positions. This is ignored for meshes that don't share geometries, because the vertex positions of non-shared geometries are pre-transformed into World-space.
        eachMeshMaterial: new Uint8Array(numMeshes * 6), // For each mesh, an RGBA integer color of format [0..255, 0..255, 0..255, 0..255], and PBR metallic and roughness factors, of format [0..255, 0..255]

        // Entity elements in the following arrays are grouped in runs that are shared by the same tiles

        eachEntityId: [], // For each entity, an ID string
        eachEntityMeshesPortion: new Uint32Array(numEntities), // For each entity, the index of the first element of meshes used by the entity

        eachTileAABB: new Float64Array(numTiles * 6), // For each tile, an axis-aligned bounding box
        eachTileEntitiesPortion: new Uint32Array(numTiles) // For each tile, the index of the the first element of eachEntityId, eachEntityMeshesPortion and eachEntityMatricesPortion used by the tile
    };

    //------------------------------------------------------------------------------------------------------------------
    // Populate the data
    //------------------------------------------------------------------------------------------------------------------

    let countPositions = 0;
    let countNormals = 0;
    let countColors = 0;
    let countIndices = 0;
    let countEdgeIndices = 0;
    let countMeshColors = 0;

    // Metadata

    data.metadata = {

        id: xktModel.modelId,
        projectId: xktModel.projectId,
        revisionId: xktModel.revisionId,
        author: xktModel.author,
        createdAt: xktModel.createdAt,
        creatingApplication: xktModel.creatingApplication,
        schema: xktModel.schema,

        propertySets: [],
        metaObjects: []
    };

    for (let propertySetsIndex = 0; propertySetsIndex < numPropertySets; propertySetsIndex++) {

        const propertySet = propertySetsList[propertySetsIndex];

        const propertySetJSON = {
            id: "" + propertySet.propertySetId,
            name: propertySet.propertySetName,
            type: propertySet.propertySetType,
            properties: propertySet.properties
        };

        data.metadata.propertySets.push(propertySetJSON);
    }

    for (let metaObjectsIndex = 0; metaObjectsIndex < numMetaObjects; metaObjectsIndex++) {

        const metaObject = metaObjectsList[metaObjectsIndex];

        const metaObjectJSON = {
            name: metaObject.metaObjectName,
            type: metaObject.metaObjectType,
            id: "" + metaObject.metaObjectId
        };

        if (metaObject.parentMetaObjectId !== undefined && metaObject.parentMetaObjectId !== null) {
            metaObjectJSON.parent = "" + metaObject.parentMetaObjectId;
        }

        if (metaObject.propertySetIds && metaObject.propertySetIds.length > 0) {
            metaObjectJSON.propertySetIds = metaObject.propertySetIds;
        }

        data.metadata.metaObjects.push(metaObjectJSON);
    }

    // console.log(JSON.stringify(data.metadata, null, "\t"))

    // Geometries

    let matricesIndex = 0;

    for (let geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {

        const geometry = geometriesList [geometryIndex];

        const primitiveType
            = (geometry.primitiveType === "triangles")
            ? (geometry.solid ? 0 : 1)
            : (geometry.primitiveType === "points" ? 2 : 3)

        data.eachGeometryPrimitiveType [geometryIndex] = primitiveType;
        data.eachGeometryPositionsPortion [geometryIndex] = countPositions;
        data.eachGeometryNormalsPortion [geometryIndex] = countNormals;
        data.eachGeometryColorsPortion [geometryIndex] = countColors;
        data.eachGeometryIndicesPortion [geometryIndex] = countIndices;
        data.eachGeometryEdgeIndicesPortion [geometryIndex] = countEdgeIndices;

        if (geometry.positionsQuantized) {
            data.positions.set(geometry.positionsQuantized, countPositions);
            countPositions += geometry.positionsQuantized.length;
        }
        if (geometry.normalsOctEncoded) {
            data.normals.set(geometry.normalsOctEncoded, countNormals);
            countNormals += geometry.normalsOctEncoded.length;
        }
        if (geometry.colorsCompressed) {
            data.colors.set(geometry.colorsCompressed, countColors);
            countColors += geometry.colorsCompressed.length;
        }
        if (geometry.indices) {
            data.indices.set(geometry.indices, countIndices);
            countIndices += geometry.indices.length;
        }
        if (geometry.edgeIndices) {
            data.edgeIndices.set(geometry.edgeIndices, countEdgeIndices);
            countEdgeIndices += geometry.edgeIndices.length;
        }
    }

    // Meshes

    for (let meshIndex = 0; meshIndex < numMeshes; meshIndex++) {

        const mesh = meshesList [meshIndex];

        if (mesh.geometry.numInstances > 1) {

            data.matrices.set(mesh.matrix, matricesIndex);
            data.eachMeshMatricesPortion [meshIndex] = matricesIndex;

            matricesIndex += 16;
        }

        data.eachMeshMaterial[countMeshColors + 0] = Math.floor(mesh.color[0] * 255);
        data.eachMeshMaterial[countMeshColors + 1] = Math.floor(mesh.color[1] * 255);
        data.eachMeshMaterial[countMeshColors + 2] = Math.floor(mesh.color[2] * 255);
        data.eachMeshMaterial[countMeshColors + 3] = Math.floor(mesh.opacity * 255);
        data.eachMeshMaterial[countMeshColors + 4] = Math.floor(mesh.metallic * 255);
        data.eachMeshMaterial[countMeshColors + 5] = Math.floor(mesh.roughness * 255);

        countMeshColors += 6;
    }

    // Entities, geometry instances, and tiles

    let entityIndex = 0;
    let countEntityMeshesPortion = 0;

    for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {

        const tile = tilesList [tileIndex];
        const tileEntities = tile.entities;
        const numTileEntities = tileEntities.length;

        if (numTileEntities === 0) {
            continue;
        }

        data.eachTileEntitiesPortion[tileIndex] = entityIndex;

        const tileAABB = tile.aabb;

        for (let j = 0; j < numTileEntities; j++) {

            const entity = tileEntities[j];
            const entityMeshes = entity.meshes;
            const numEntityMeshes = entityMeshes.length;

            for (let k = 0; k < numEntityMeshes; k++) {

                const mesh = entityMeshes[k];
                const geometry = mesh.geometry;
                const geometryIndex = geometry.geometryIndex;

                data.eachMeshGeometriesPortion [countEntityMeshesPortion + k] = geometryIndex;
            }

            data.eachEntityId [entityIndex] = entity.entityId;
            data.eachEntityMeshesPortion[entityIndex] = countEntityMeshesPortion; // <<<<<<<<<<<<<<<<<<<< Error here? Order/value of countEntityMeshesPortion correct?

            entityIndex++;
            countEntityMeshesPortion += numEntityMeshes;
        }

        const tileAABBIndex = tileIndex * 6;

        data.eachTileAABB.set(tileAABB, tileAABBIndex);
    }

    return data;
}

function deflateData(data) {

    return {

        metadata: pako.deflate(deflateJSON(data.metadata)),

        positions: pako.deflate(data.positions.buffer),
        normals: pako.deflate(data.normals.buffer),
        colors: pako.deflate(data.colors.buffer),
        indices: pako.deflate(data.indices.buffer),
        edgeIndices: pako.deflate(data.edgeIndices.buffer),

        matrices: pako.deflate(data.matrices.buffer),
        reusedGeometriesDecodeMatrix: pako.deflate(data.reusedGeometriesDecodeMatrix.buffer),

        eachGeometryPrimitiveType: pako.deflate(data.eachGeometryPrimitiveType.buffer),
        eachGeometryPositionsPortion: pako.deflate(data.eachGeometryPositionsPortion.buffer),
        eachGeometryNormalsPortion: pako.deflate(data.eachGeometryNormalsPortion.buffer),
        eachGeometryColorsPortion: pako.deflate(data.eachGeometryColorsPortion.buffer),
        eachGeometryIndicesPortion: pako.deflate(data.eachGeometryIndicesPortion.buffer),
        eachGeometryEdgeIndicesPortion: pako.deflate(data.eachGeometryEdgeIndicesPortion.buffer),

        eachMeshGeometriesPortion: pako.deflate(data.eachMeshGeometriesPortion.buffer),
        eachMeshMatricesPortion: pako.deflate(data.eachMeshMatricesPortion.buffer),
        eachMeshMaterial: pako.deflate(data.eachMeshMaterial.buffer),

        eachEntityId: pako.deflate(JSON.stringify(data.eachEntityId)
            .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
            })),
        eachEntityMeshesPortion: pako.deflate(data.eachEntityMeshesPortion.buffer),

        eachTileAABB: pako.deflate(data.eachTileAABB.buffer),
        eachTileEntitiesPortion: pako.deflate(data.eachTileEntitiesPortion.buffer)
    };
}

function deflateJSON(strings) {
    return JSON.stringify(strings)
        .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
}

function createArrayBuffer(deflatedData) {

    return toArrayBuffer([

        deflatedData.metadata,

        deflatedData.positions,
        deflatedData.normals,
        deflatedData.colors,
        deflatedData.indices,
        deflatedData.edgeIndices,

        deflatedData.matrices,
        deflatedData.reusedGeometriesDecodeMatrix,

        deflatedData.eachGeometryPrimitiveType,
        deflatedData.eachGeometryPositionsPortion,
        deflatedData.eachGeometryNormalsPortion,
        deflatedData.eachGeometryColorsPortion,
        deflatedData.eachGeometryIndicesPortion,
        deflatedData.eachGeometryEdgeIndicesPortion,

        deflatedData.eachMeshGeometriesPortion,
        deflatedData.eachMeshMatricesPortion,
        deflatedData.eachMeshMaterial,

        deflatedData.eachEntityId,
        deflatedData.eachEntityMeshesPortion,

        deflatedData.eachTileAABB,
        deflatedData.eachTileEntitiesPortion
    ]);
}

function toArrayBuffer(elements) {
    const indexData = new Uint32Array(elements.length + 2);
    indexData[0] = XKT_VERSION;
    indexData [1] = elements.length;  // Stored Data 1.1: number of stored elements
    let dataLen = 0;    // Stored Data 1.2: length of stored elements
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const elementsize = element.length;
        indexData[i + 2] = elementsize;
        dataLen += elementsize;
    }
    const indexBuf = new Uint8Array(indexData.buffer);
    const dataArray = new Uint8Array(indexBuf.length + dataLen);
    dataArray.set(indexBuf);
    let offset = indexBuf.length;
    for (let i = 0, len = elements.length; i < len; i++) {     // Stored Data 2: the elements themselves
        const element = elements[i];
        dataArray.set(element, offset);
        offset += element.length;
    }
    return dataArray.buffer;
}

export {writeXKTModelToArrayBuffer};