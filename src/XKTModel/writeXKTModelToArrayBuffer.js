import {XKT_INFO} from "../XKT_INFO.js";
import * as pako from 'pako';

const XKT_VERSION = XKT_INFO.xktVersion;
const NUM_TEXTURE_ATTRIBUTES = 9;
const NUM_MATERIAL_ATTRIBUTES = 6;

/**
 * Writes an {@link XKTModel} to an {@link ArrayBuffer}.
 *
 * @param {XKTModel} xktModel The {@link XKTModel}.
 * @param {String} metaModelJSON The metamodel JSON in a string.
 * @param {Object} [stats] Collects statistics.
 * @param {Object} options Options for how the XKT is written.
 * @param {Boolean} [options.zip=true] ZIP the contents?
 * @returns {ArrayBuffer} The {@link ArrayBuffer}.
 */
function writeXKTModelToArrayBuffer(xktModel, metaModelJSON, stats, options) {
    if (! options.zip) {
        return writeXKTModelToArrayBufferUncompressed(xktModel, metaModelJSON, stats);
    }
    const data = getModelData(xktModel, metaModelJSON, stats);
    const deflatedData = deflateData(data, metaModelJSON, options);
    stats.texturesSize += deflatedData.textureData.byteLength;
    const arrayBuffer = createArrayBuffer(deflatedData);
    return arrayBuffer;
}

// V11
function writeXKTModelToArrayBufferUncompressed(xktModel, metaModelJSON, stats) {
    const data = getModelData(xktModel, metaModelJSON, stats);
    stats.texturesSize += data.textureData.byteLength;

    const object2Array = (function() {
        const encoder = new TextEncoder();
        return obj => encoder.encode(JSON.stringify(obj));
    })();

    const arrays = [
        object2Array(metaModelJSON || data.metadata),
        data.textureData,
        data.eachTextureDataPortion,
        data.eachTextureAttributes,
        data.positions,
        data.normals,
        data.colors,
        data.uvs,
        data.indices,
        data.edgeIndices,
        data.eachTextureSetTextures,
        data.matrices,
        data.reusedGeometriesDecodeMatrix,
        data.eachGeometryPrimitiveType,
        object2Array(data.eachGeometryAxisLabel),
        data.eachGeometryPositionsPortion,
        data.eachGeometryNormalsPortion,
        data.eachGeometryColorsPortion,
        data.eachGeometryUVsPortion,
        data.eachGeometryIndicesPortion,
        data.eachGeometryEdgeIndicesPortion,
        data.eachMeshGeometriesPortion,
        data.eachMeshMatricesPortion,
        data.eachMeshTextureSet,
        data.eachMeshMaterialAttributes,
        object2Array(data.eachEntityId),
        data.eachEntityMeshesPortion,
        data.eachTileAABB,
        data.eachTileEntitiesPortion
    ];

    const arraysCnt = arrays.length;
    const dataView = new DataView(new ArrayBuffer((1 + 2 * arraysCnt) * 4));

    dataView.setUint32(0, 0 << 31 | XKT_VERSION, true);

    let byteOffset = dataView.byteLength;
    const offsets = [ ];

    // Store arrays' offsets and lengths
    for (let i = 0; i < arraysCnt; i++) {
        const arr = arrays[i];
        const BPE = arr.BYTES_PER_ELEMENT;
        // align to BPE, so the arrayBuffer can be used for a typed array
        byteOffset = Math.ceil(byteOffset / BPE) * BPE;
        const byteLength = arr.byteLength;

        const idx = 1 + 2 * i;
        dataView.setUint32(idx       * 4, byteOffset, true);
        dataView.setUint32((idx + 1) * 4, byteLength, true);

        offsets.push(byteOffset);
        byteOffset += byteLength;
    }

    const dataArray = new Uint8Array(byteOffset);
    dataArray.set(new Uint8Array(dataView.buffer), 0);

    const requiresSwapToLittleEndian = (function() {
        const buffer = new ArrayBuffer(2);
        new Uint16Array(buffer)[0] = 1;
        return new Uint8Array(buffer)[0] !== 1;
    })();

    // Store arrays themselves
    for (let i = 0; i < arraysCnt; i++) {
        const arr = arrays[i];
        const subarray = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);

        const BPE = arr.BYTES_PER_ELEMENT;
        if (requiresSwapToLittleEndian && (BPE > 1)) {
            const swaps = BPE / 2;
            const cnt = subarray.length / BPE;
            for (let b = 0; b < cnt; b++) {
                const offset = b * BPE;
                for (let j = 0; j < swaps; j++) {
                    const i1 = offset + j;
                    const i2 = offset - j + BPE - 1;
                    const tmp = subarray[i1];
                    subarray[i1] = subarray[i2];
                    subarray[i2] = tmp;
                }
            }
        }

        dataArray.set(subarray, offsets[i]);
    }

    return dataArray.buffer;
}

function getModelData(xktModel, metaModelDataStr, stats) {

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
        eachGeometryPrimitiveType: new Uint8Array(numGeometries), // Primitive type for each geometry (0=solid triangles, 1=surface triangles, 2=lines, 3=points, 4=line-strip)
        eachGeometryAxisLabel: [], //for each primitive, an axis label
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
        eachTileEntitiesPortion: new Uint32Array(numTiles) // For each tile, the index of the first element of eachEntityId, eachEntityMeshesPortion and eachEntityMatricesPortion used by the tile
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

    if (!metaModelDataStr) {
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
        let primitiveType = 1;
        switch (geometry.primitiveType) {
            case "triangles":
                primitiveType = geometry.solid ? 0 : 1;
                break;
            case "points":
                primitiveType = 2;
                break;
            case "lines":
                primitiveType = 3;
                break;
            case "line-strip":
            case "line-loop":
                primitiveType = 4;
                break;
            case "triangle-strip":
                primitiveType = 5;
                break;
            case "triangle-fan":
                primitiveType = 6;
                break;
            case "axis-label":
                primitiveType = 7;
                break;
            default:
                primitiveType = 1
        }
        data.eachGeometryPrimitiveType [geometryIndex] = primitiveType;
        data.eachGeometryAxisLabel [geometryIndex] = geometry.axisLabel;
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

function deflateData(data, metaModelJSON, options) {

    function deflate(buffer) {
        return (options.zip !== false) ? pako.deflate(buffer) : buffer;
    }

    let metaModelBytes;
    if (metaModelJSON) {
        const deflatedJSON = deflateJSON(metaModelJSON);
        metaModelBytes = deflate(deflatedJSON)
    } else {
        const deflatedJSON = deflateJSON(data.metadata);
        metaModelBytes = deflate(deflatedJSON)
    }

    return {
        metadata: metaModelBytes,
        textureData: deflate(data.textureData.buffer),
        eachTextureDataPortion: deflate(data.eachTextureDataPortion.buffer),
        eachTextureAttributes: deflate(data.eachTextureAttributes.buffer),
        positions: deflate(data.positions.buffer),
        normals: deflate(data.normals.buffer),
        colors: deflate(data.colors.buffer),
        uvs: deflate(data.uvs.buffer),
        indices: deflate(data.indices.buffer),
        edgeIndices: deflate(data.edgeIndices.buffer),
        eachTextureSetTextures: deflate(data.eachTextureSetTextures.buffer),
        matrices: deflate(data.matrices.buffer),
        reusedGeometriesDecodeMatrix: deflate(data.reusedGeometriesDecodeMatrix.buffer),
        eachGeometryPrimitiveType: deflate(data.eachGeometryPrimitiveType.buffer),
        eachGeometryAxisLabel: deflate(JSON.stringify(data.eachGeometryAxisLabel)
        .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        })),
        eachGeometryPositionsPortion: deflate(data.eachGeometryPositionsPortion.buffer),
        eachGeometryNormalsPortion: deflate(data.eachGeometryNormalsPortion.buffer),
        eachGeometryColorsPortion: deflate(data.eachGeometryColorsPortion.buffer),
        eachGeometryUVsPortion: deflate(data.eachGeometryUVsPortion.buffer),
        eachGeometryIndicesPortion: deflate(data.eachGeometryIndicesPortion.buffer),
        eachGeometryEdgeIndicesPortion: deflate(data.eachGeometryEdgeIndicesPortion.buffer),
        eachMeshGeometriesPortion: deflate(data.eachMeshGeometriesPortion.buffer),
        eachMeshMatricesPortion: deflate(data.eachMeshMatricesPortion.buffer),
        eachMeshTextureSet: deflate(data.eachMeshTextureSet.buffer),
        eachMeshMaterialAttributes: deflate(data.eachMeshMaterialAttributes.buffer),
        eachEntityId: deflate(JSON.stringify(data.eachEntityId)
            .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
            })),
        eachEntityMeshesPortion: deflate(data.eachEntityMeshesPortion.buffer),
        eachTileAABB: deflate(data.eachTileAABB.buffer),
        eachTileEntitiesPortion: deflate(data.eachTileEntitiesPortion.buffer)
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
        deflatedData.eachGeometryAxisLabel,
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
    const headerSize = (2 + elements.length) * 4;

    const dataView = new DataView(new ArrayBuffer(headerSize));
    dataView.setUint32(0, 1 << 31 | XKT_VERSION, true);
    dataView.setUint32(4, elements.length, true);

    let dataLen = 0;
    for(let i=0;i<elements.length;i++){
        const elementSize = elements[i].length;
        dataView.setUint32((i+2)*4, elementSize, true);
        dataLen += elementSize;
    }

    const dataArray = new Uint8Array(headerSize + dataLen);
    dataArray.set(new Uint8Array(dataView.buffer));
    
    let offset = headerSize;
    for(let i=0; i < elements.length;i++) {
        const element = elements[i];
        dataArray.set(element, offset);
        offset += element.length;
    }
    return dataArray.buffer;
}

export {writeXKTModelToArrayBuffer};