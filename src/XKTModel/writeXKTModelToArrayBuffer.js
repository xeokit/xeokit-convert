import {XKT_INFO} from "../XKT_INFO.js";
import * as pako from 'pako';

const XKT_VERSION = XKT_INFO.xktVersion;
const NUM_TEXTURE_ATTRIBUTES = 9;
const NUM_MATERIAL_ATTRIBUTES = 6;

/**
 * Writes an {@link XKTModel} to an {@link ArrayBuffer}.
 *
 * @param {XKTModel} xktModel The {@link XKTModel}.
 * @param {ArrayBuffer} metaModelData The metamodel JSON in an ArrayBuffer.
 * @param {Object} [stats] Collects statistics.
 * @returns {ArrayBuffer} The {@link ArrayBuffer}.
 */
function writeXKTModelToArrayBuffer(xktModel, metaModelData, stats = {}) {
    const data = getModelData(xktModel, metaModelData, stats);
    const deflatedData = deflateData(data, metaModelData);
    stats.texturesSize += deflatedData.textureData.byteLength;
    const arrayBuffer = createArrayBuffer(deflatedData);
    return arrayBuffer;
}

function getModelData(xktModel, metaModelData, stats) {

    //------------------------------------------------------------------------------------------------------------------
    // Allocate data
    //------------------------------------------------------------------------------------------------------------------

    const propertySetsList = xktModel.propertySetsList;
    const metaObjectsList = xktModel.metaObjectsList;
    const geometriesList = xktModel.geometriesList;
    const texturesList = xktModel.texturesList;
    const textureSetsList = xktModel.textureSetsList;
    const meshesList = xktModel.meshesList;
    const entitiesList = xktModel.entitiesList;
    const tilesList = xktModel.tilesList;

    const numPropertySets = propertySetsList.length;
    const numMetaObjects = metaObjectsList.length;
    const numGeometries = geometriesList.length;
    const numTextures = texturesList.length;
    const numTextureSets = textureSetsList.length;
    const numMeshes = meshesList.length;
    const numEntities = entitiesList.length;
    const numTiles = tilesList.length;

    let lenPositions = 0;
    let lenNormals = 0;
    let lenColors = 0;
    let lenUVs = 0;
    let lenIndices = 0;
    let lenEdgeIndices = 0;
    let lenMatrices = 0;
    let lenTextures = 0;

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
        if (geometry.uvs) {
            lenUVs += geometry.uvs.length;
        }
        if (geometry.indices) {
            lenIndices += geometry.indices.length;
        }
        if (geometry.edgeIndices) {
            lenEdgeIndices += geometry.edgeIndices.length;
        }
    }

    for (let textureIndex = 0; textureIndex < numTextures; textureIndex++) {
        const xktTexture = texturesList[textureIndex];
        const imageData = xktTexture.imageData;
        lenTextures += imageData.byteLength;

        if (xktTexture.compressed) {
            stats.numCompressedTextures++;
        }
    }

    for (let meshIndex = 0; meshIndex < numMeshes; meshIndex++) {
        const mesh = meshesList[meshIndex];
        if (mesh.geometry.numInstances > 1) {
            lenMatrices += 16;
        }
    }

    const data = {
        metadata: {},
        textureData: new Uint8Array(lenTextures), // All textures
        eachTextureDataPortion: new Uint32Array(numTextures), // For each texture, an index to its first element in textureData
        eachTextureAttributes: new Uint16Array(numTextures * NUM_TEXTURE_ATTRIBUTES),
        positions: new Uint16Array(lenPositions), // All geometry arrays
        normals: new Int8Array(lenNormals),
        colors: new Uint8Array(lenColors),
        uvs: new Float32Array(lenUVs),
        indices: new Uint32Array(lenIndices),
        edgeIndices: new Uint32Array(lenEdgeIndices),
        eachTextureSetTextures: new Int32Array(numTextureSets * 5), // For each texture set, a set of five Texture indices [color, metal/roughness,normals,emissive,occlusion]; each index has value -1 if no texture
        matrices: new Float32Array(lenMatrices), // Modeling matrices for entities that share geometries. Each entity either shares all it's geometries, or owns all its geometries exclusively. Exclusively-owned geometries are pre-transformed into World-space, and so their entities don't have modeling matrices in this array.
        reusedGeometriesDecodeMatrix: new Float32Array(xktModel.reusedGeometriesDecodeMatrix), // A single, global vertex position de-quantization matrix for all reused geometries. Reused geometries are quantized to their collective Local-space AABB, and this matrix is derived from that AABB.
        eachGeometryPrimitiveType: new Uint8Array(numGeometries), // Primitive type for each geometry (0=solid triangles, 1=surface triangles, 2=lines, 3=points)
        eachGeometryPositionsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.positions. Every primitive type has positions.
        eachGeometryNormalsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.normals. If the next geometry has the same index, then this geometry has no normals.
        eachGeometryColorsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.colors. If the next geometry has the same index, then this geometry has no colors.
        eachGeometryUVsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.uvs. If the next geometry has the same index, then this geometry has no UVs.
        eachGeometryIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.indices. If the next geometry has the same index, then this geometry has no indices.
        eachGeometryEdgeIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.edgeIndices. If the next geometry has the same index, then this geometry has no edge indices.
        eachMeshGeometriesPortion: new Uint32Array(numMeshes), // For each mesh, an index into the eachGeometry* arrays
        eachMeshMatricesPortion: new Uint32Array(numMeshes), // For each mesh that shares its geometry, an index to its first element in data.matrices, to indicate the modeling matrix that transforms the shared geometry Local-space vertex positions. This is ignored for meshes that don't share geometries, because the vertex positions of non-shared geometries are pre-transformed into World-space.
        eachMeshTextureSet: new Int32Array(numMeshes), // For each mesh, the index of its texture set in data.eachTextureSetTextures; this array contains signed integers so that we can use -1 to indicate when a mesh has no texture set
        eachMeshMaterialAttributes: new Uint8Array(numMeshes * NUM_MATERIAL_ATTRIBUTES), // For each mesh, an RGBA integer color of format [0..255, 0..255, 0..255, 0..255], and PBR metallic and roughness factors, of format [0..255, 0..255]
        eachEntityId: [], // For each entity, an ID string
        eachEntityMeshesPortion: new Uint32Array(numEntities), // For each entity, the index of the first element of meshes used by the entity
        eachTileAABB: new Float64Array(numTiles * 6), // For each tile, an axis-aligned bounding box
        eachTileEntitiesPortion: new Uint32Array(numTiles) // For each tile, the index of the the first element of eachEntityId, eachEntityMeshesPortion and eachEntityMatricesPortion used by the tile
    };

    let countPositions = 0;
    let countNormals = 0;
    let countColors = 0;
    let countUVs = 0;
    let countIndices = 0;
    let countEdgeIndices = 0;

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

    // Property sets

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

    // Metaobjects

    if (!metaModelData) {
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
            if (metaObject.external) {
                metaObjectJSON.external = metaObject.external;
            }
            data.metadata.metaObjects.push(metaObjectJSON);
        }
    }

    // Geometries

    for (let geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {
        const geometry = geometriesList [geometryIndex];
        const primitiveType = (geometry.primitiveType === "triangles") ? (geometry.solid ? 0 : 1) : (geometry.primitiveType === "points" ? 2 : 3)
        data.eachGeometryPrimitiveType [geometryIndex] = primitiveType;
        data.eachGeometryPositionsPortion [geometryIndex] = countPositions;
        data.eachGeometryNormalsPortion [geometryIndex] = countNormals;
        data.eachGeometryColorsPortion [geometryIndex] = countColors;
        data.eachGeometryUVsPortion [geometryIndex] = countUVs;
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
        if (geometry.uvs) {
            data.uvs.set(geometry.uvs, countUVs);
            countUVs += geometry.uvs.length;
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

    // Textures

    for (let textureIndex = 0, numTextures = xktModel.texturesList.length, portionIdx = 0; textureIndex < numTextures; textureIndex++) {
        const xktTexture = xktModel.texturesList[textureIndex];
        const imageData = xktTexture.imageData;
        data.textureData.set(imageData, portionIdx);
        data.eachTextureDataPortion[textureIndex] = portionIdx;

        portionIdx += imageData.byteLength;

        let textureAttrIdx = textureIndex * NUM_TEXTURE_ATTRIBUTES;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.compressed ? 1 : 0;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.mediaType; // GIFMediaType | PNGMediaType | JPEGMediaType
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.width;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.height;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.minFilter; // LinearMipmapLinearFilter | LinearMipMapNearestFilter | NearestMipMapNearestFilter | NearestMipMapLinearFilter | LinearMipMapLinearFilter
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.magFilter; // LinearFilter | NearestFilter
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapS; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapT; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapR; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
    }

    // Texture sets

    for (let textureSetIndex = 0, numTextureSets = xktModel.textureSetsList.length, eachTextureSetTexturesIndex = 0; textureSetIndex < numTextureSets; textureSetIndex++) {
        const textureSet = textureSetsList[textureSetIndex];
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.colorTexture ? textureSet.colorTexture.textureIndex : -1; // Color map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.metallicRoughnessTexture ? textureSet.metallicRoughnessTexture.textureIndex : -1; // Metal/rough map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.normalsTexture ? textureSet.normalsTexture.textureIndex : -1; // Normal map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.emissiveTexture ? textureSet.emissiveTexture.textureIndex : -1; // Emissive map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.occlusionTexture ? textureSet.occlusionTexture.textureIndex : -1; // Occlusion map
    }

    // Tiles -> Entities -> Meshes

    let entityIndex = 0;
    let countEntityMeshesPortion = 0;
    let eachMeshMaterialAttributesIndex = 0;
    let matricesIndex = 0;
    let meshIndex = 0;

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

                if (mesh.geometry.numInstances > 1) {
                    data.matrices.set(mesh.matrix, matricesIndex);
                    data.eachMeshMatricesPortion [meshIndex] = matricesIndex;
                    matricesIndex += 16;
                }

                data.eachMeshTextureSet[meshIndex] = mesh.textureSet ? mesh.textureSet.textureSetIndex : -1;

                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[0] * 255); // Color RGB
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[1] * 255);
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[2] * 255);
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.opacity * 255); // Opacity
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.metallic * 255); // Metallic
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.roughness * 255); // Roughness

                meshIndex++;
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

function deflateData(data, metaModelData) {
    return {
        metadata: metaModelData ? pako.deflate(metaModelData.buffer) : pako.deflate(deflateJSON(data.metadata)),
        textureData: pako.deflate(data.textureData.buffer),
        eachTextureDataPortion: pako.deflate(data.eachTextureDataPortion.buffer),
        eachTextureAttributes: pako.deflate(data.eachTextureAttributes.buffer),
        positions: pako.deflate(data.positions.buffer),
        normals: pako.deflate(data.normals.buffer),
        colors: pako.deflate(data.colors.buffer),
        uvs: pako.deflate(data.uvs.buffer),
        indices: pako.deflate(data.indices.buffer),
        edgeIndices: pako.deflate(data.edgeIndices.buffer),
        eachTextureSetTextures: pako.deflate(data.eachTextureSetTextures.buffer),
        matrices: pako.deflate(data.matrices.buffer),
        reusedGeometriesDecodeMatrix: pako.deflate(data.reusedGeometriesDecodeMatrix.buffer),
        eachGeometryPrimitiveType: pako.deflate(data.eachGeometryPrimitiveType.buffer),
        eachGeometryPositionsPortion: pako.deflate(data.eachGeometryPositionsPortion.buffer),
        eachGeometryNormalsPortion: pako.deflate(data.eachGeometryNormalsPortion.buffer),
        eachGeometryColorsPortion: pako.deflate(data.eachGeometryColorsPortion.buffer),
        eachGeometryUVsPortion: pako.deflate(data.eachGeometryUVsPortion.buffer),
        eachGeometryIndicesPortion: pako.deflate(data.eachGeometryIndicesPortion.buffer),
        eachGeometryEdgeIndicesPortion: pako.deflate(data.eachGeometryEdgeIndicesPortion.buffer),
        eachMeshGeometriesPortion: pako.deflate(data.eachMeshGeometriesPortion.buffer),
        eachMeshMatricesPortion: pako.deflate(data.eachMeshMatricesPortion.buffer),
        eachMeshTextureSet: pako.deflate(data.eachMeshTextureSet.buffer),
        eachMeshMaterialAttributes: pako.deflate(data.eachMeshMaterialAttributes.buffer),
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
        deflatedData.textureData,
        deflatedData.eachTextureDataPortion,
        deflatedData.eachTextureAttributes,
        deflatedData.positions,
        deflatedData.normals,
        deflatedData.colors,
        deflatedData.uvs,
        deflatedData.indices,
        deflatedData.edgeIndices,
        deflatedData.eachTextureSetTextures,
        deflatedData.matrices,
        deflatedData.reusedGeometriesDecodeMatrix,
        deflatedData.eachGeometryPrimitiveType,
        deflatedData.eachGeometryPositionsPortion,
        deflatedData.eachGeometryNormalsPortion,
        deflatedData.eachGeometryColorsPortion,
        deflatedData.eachGeometryUVsPortion,
        deflatedData.eachGeometryIndicesPortion,
        deflatedData.eachGeometryEdgeIndicesPortion,
        deflatedData.eachMeshGeometriesPortion,
        deflatedData.eachMeshMatricesPortion,
        deflatedData.eachMeshTextureSet,
        deflatedData.eachMeshMaterialAttributes,
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