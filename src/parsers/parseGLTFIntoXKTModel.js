import {utils} from "../XKTModel/lib/utils.js";
import {math} from "../lib/math.js";

const atob2 = (typeof atob !== 'undefined') ? atob : a => Buffer.from(a, 'base64').toString('binary');

const WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
};

const WEBGL_TYPE_SIZES = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

/**
 * @desc Parses glTF JSON into an {@link XKTModel}.
 *
 * * Supports glTF 2.
 * * Provides option to reduce XKT file size by ignoring STL normals and relying on xeokit to auto-generate them.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load a glTF model into it.
 *
 * ````javascript
 * utils.loadJSON("./models/gltf/duplex/scene.gltf", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseGLTFIntoXKTModel({
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
 * @param {Object} params Parsing parameters.
 * @param {Object} params.data The glTF JSON.
 * @param {Object} [params.metaModelData] Metamodel JSON. If this is provided, then parsing is able to ensure that the XKTObjects it creates will fit the metadata properly.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Boolean} [params.autoNormals=false] When true, the parser will ignore the glTF geometry normals, and the glTF
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the glTF.
 * @param {function} [params.getAttachment] Callback through which to fetch attachments, if the glTF has them.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
function parseGLTFIntoXKTModel({data, xktModel, metaModelData, autoNormals, getAttachment, stats = {}, log}) {

    return new Promise(function (resolve, reject) {

        if (!data) {
            reject("Argument expected: data");
            return;
        }

        if (!xktModel) {
            reject("Argument expected: xktModel");
            return;
        }

        stats.sourceFormat = "glTF";
        stats.schemaVersion = "2.0";
        stats.title = "";
        stats.author = "";
        stats.created = "";
        stats.numTriangles = 0;
        stats.numVertices = 0;
        stats.numObjects = 0;
        stats.numGeometries = 0;

        const ctx = {
            gltf: data,
            metaModelCorrections: metaModelData ? getMetaModelCorrections(metaModelData) : null,
            getAttachment: getAttachment || (() => {
                throw new Error('You must define getAttachment() method to convert glTF with external resources')
            }),
            log: (log || function (msg) {
            }),
            xktModel: xktModel,
            autoNormals: autoNormals,
            geometryCreated: {},
            nextGeometryId: 0,
            nextMeshId: 0,
            nextDefaultEntityId: 0,
            stats
        };

        parseBuffers(ctx).then(() => {

            parseBufferViews(ctx);
            freeBuffers(ctx);
            parseMaterials(ctx);
            parseDefaultScene(ctx);

            resolve();

        }, (errMsg) => {
            reject(errMsg);
        });
    });
}

function getMetaModelCorrections(metaModelData) {
    const eachRootStats = {};
    const eachChildRoot = {};
    const metaObjects = metaModelData.metaObjects || [];
    const metaObjectsMap = {};
    for (let i = 0, len = metaObjects.length; i < len; i++) {
        const metaObject = metaObjects[i];
        metaObjectsMap[metaObject.id] = metaObject;
    }
    for (let i = 0, len = metaObjects.length; i < len; i++) {
        const metaObject = metaObjects[i];
        if (metaObject.parent !== undefined && metaObject.parent !== null) {
            const metaObjectParent = metaObjectsMap[metaObject.parent];
            if (metaObject.type === metaObjectParent.type) {
                let rootMetaObject = metaObjectParent;
                while (rootMetaObject.parent && metaObjectsMap[rootMetaObject.parent].type === rootMetaObject.type) {
                    rootMetaObject = metaObjectsMap[rootMetaObject.parent];
                }
                const rootStats = eachRootStats[rootMetaObject.id] || (eachRootStats[rootMetaObject.id] = {
                    numChildren: 0,
                    countChildren: 0
                });
                rootStats.numChildren++;
                eachChildRoot[metaObject.id] = rootMetaObject;
            } else {

            }
        }
    }
    const metaModelCorrections = {
        metaObjectsMap,
        eachRootStats,
        eachChildRoot
    };
    return metaModelCorrections;
}

function parseBuffers(ctx) {  // Parses geometry buffers into temporary  "_buffer" Unit8Array properties on the glTF "buffer" elements
    const buffers = ctx.gltf.buffers;
    if (buffers) {
        return Promise.all(buffers.map(buffer => parseBuffer(ctx, buffer)));
    } else {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    }
}

function parseBuffer(ctx, bufferInfo) {
    return new Promise(function (resolve, reject) {
        // Allow a shortcut where the glTF buffer is "enrichened" with direct
        // access to the data-arrayBuffer, w/out needing to either:
        // - read the file indicated by the ".uri" component of the buffer
        // - base64-decode the encoded data in the ".uri" component
        if (bufferInfo._arrayBuffer) {
            bufferInfo._buffer = bufferInfo._arrayBuffer;
            resolve(bufferInfo);
            return;
        }
        // Otherwise, proceed with "standard-glTF" .uri component.
        const uri = bufferInfo.uri;
        if (!uri) {
            reject('gltf/handleBuffer missing uri in ' + JSON.stringify(bufferInfo));
            return;
        }
        parseArrayBuffer(ctx, uri).then((arrayBuffer) => {
            bufferInfo._buffer = arrayBuffer;
            resolve(arrayBuffer);
        }, (errMsg) => {
            reject(errMsg);
        })
    });
}

function parseArrayBuffer(ctx, uri) {
    return new Promise(function (resolve, reject) {
        const dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/; // Check for data: URI
        const dataUriRegexResult = uri.match(dataUriRegex);
        if (dataUriRegexResult) { // Safari can't handle data URIs through XMLHttpRequest
            const isBase64 = !!dataUriRegexResult[2];
            let data = dataUriRegexResult[3];
            data = decodeURIComponent(data);
            if (isBase64) {
                data = atob2(data);
            }
            const buffer = new ArrayBuffer(data.length);
            const view = new Uint8Array(buffer);
            for (let i = 0; i < data.length; i++) {
                view[i] = data.charCodeAt(i);
            }
            resolve(buffer);
        } else { // Uri is a path to a file
            ctx.getAttachment(uri).then(
                (arrayBuffer) => {
                    resolve(arrayBuffer);
                },
                (errMsg) => {
                    reject(errMsg);
                });
        }
    });
}

function parseBufferViews(ctx) { // Parses our temporary "_buffer" properties into "_buffer" properties on glTF "bufferView" elements
    const bufferViewsInfo = ctx.gltf.bufferViews;
    if (bufferViewsInfo) {
        for (let i = 0, len = bufferViewsInfo.length; i < len; i++) {
            parseBufferView(ctx, bufferViewsInfo[i]);
        }
    }
}

function parseBufferView(ctx, bufferViewInfo) {
    const buffer = ctx.gltf.buffers[bufferViewInfo.buffer];
    bufferViewInfo._typedArray = null;
    const byteLength = bufferViewInfo.byteLength || 0;
    const byteOffset = bufferViewInfo.byteOffset || 0;
    bufferViewInfo._buffer = buffer._buffer.slice(byteOffset, byteOffset + byteLength);
}

function freeBuffers(ctx) { // Deletes the "_buffer" properties from the glTF "buffer" elements, to save memory
    const buffers = ctx.gltf.buffers;
    if (buffers) {
        for (let i = 0, len = buffers.length; i < len; i++) {
            buffers[i]._buffer = null;
        }
    }
}

function parseMaterials(ctx) {
    const materialsInfo = ctx.gltf.materials;
    if (materialsInfo) {
        for (let i = 0, len = materialsInfo.length; i < len; i++) {
            const materialInfo = materialsInfo[i];
            const material = parseMaterial(ctx, materialInfo);
            materialInfo._materialData = material;
        }
    }
}

function parseMaterial(ctx, materialInfo) { // Attempts to extract an RGBA color for a glTF material
    const material = {
        color: new Float32Array([1, 1, 1]),
        opacity: 1.0,
        metallic: 0,
        roughness: 1
    };
    const extensions = materialInfo.extensions;
    if (extensions) {
        const specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
        if (specularPBR) {
            const diffuseFactor = specularPBR.diffuseFactor;
            if (diffuseFactor !== null && diffuseFactor !== undefined) {
                material.color[0] = diffuseFactor[0];
                material.color[1] = diffuseFactor[1];
                material.color[2] = diffuseFactor[2];
            }
        }
        const common = extensions["KHR_materials_common"];
        if (common) {
            const technique = common.technique;
            const values = common.values || {};
            const blinn = technique === "BLINN";
            const phong = technique === "PHONG";
            const lambert = technique === "LAMBERT";
            const diffuse = values.diffuse;
            if (diffuse && (blinn || phong || lambert)) {
                if (!utils.isString(diffuse)) {
                    material.color[0] = diffuse[0];
                    material.color[1] = diffuse[1];
                    material.color[2] = diffuse[2];
                }
            }
            const transparency = values.transparency;
            if (transparency !== null && transparency !== undefined) {
                material.opacity = transparency;
            }
            const transparent = values.transparent;
            if (transparent !== null && transparent !== undefined) {
                material.opacity = transparent;
            }
        }
    }
    const metallicPBR = materialInfo.pbrMetallicRoughness;
    if (metallicPBR) {
        const baseColorFactor = metallicPBR.baseColorFactor;
        if (baseColorFactor) {
            material.color[0] = baseColorFactor[0];
            material.color[1] = baseColorFactor[1];
            material.color[2] = baseColorFactor[2];
            material.opacity = baseColorFactor[3];
        }
        const metallicFactor = metallicPBR.metallicFactor;
        if (metallicFactor !== null && metallicFactor !== undefined) {
            material.metallic = metallicFactor;
        }
        const roughnessFactor = metallicPBR.roughnessFactor;
        if (roughnessFactor !== null && roughnessFactor !== undefined) {
            material.roughness = roughnessFactor;
        }
    }
    return material;
}

function parseDefaultScene(ctx) {
    const scene = ctx.gltf.scene || 0;
    const defaultSceneInfo = ctx.gltf.scenes[scene];
    if (!defaultSceneInfo) {
        throw new Error("glTF has no default scene");
    }
    parseScene(ctx, defaultSceneInfo);
}


function parseScene(ctx, sceneInfo) {
    const nodes = sceneInfo.nodes;
    if (!nodes) {
        return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const glTFNode = ctx.gltf.nodes[nodes[i]];
        if (glTFNode) {
            parseNode(ctx, glTFNode, null);
        }
    }
}

const deferredMeshIds = [];

function parseNode(ctx, glTFNode, matrix) {

    const gltf = ctx.gltf;
    const xktModel = ctx.xktModel;

    let localMatrix;

    if (glTFNode.matrix) {
        localMatrix = glTFNode.matrix;
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }

    if (glTFNode.translation) {
        localMatrix = math.translationMat4v(glTFNode.translation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, localMatrix);
        } else {
            matrix = localMatrix;
        }
    }

    if (glTFNode.rotation) {
        localMatrix = math.quaternionToMat4(glTFNode.rotation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, localMatrix);
        } else {
            matrix = localMatrix;
        }
    }

    if (glTFNode.scale) {
        localMatrix = math.scalingMat4v(glTFNode.scale);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, localMatrix);
        } else {
            matrix = localMatrix;
        }
    }

    const gltfMeshId = glTFNode.mesh;

    if (gltfMeshId !== undefined) {

        const meshInfo = gltf.meshes[gltfMeshId];

        if (meshInfo) {

            const numPrimitivesInMesh = meshInfo.primitives.length;

            if (numPrimitivesInMesh > 0) {

                const xktMeshIds = [];

                for (let i = 0; i < numPrimitivesInMesh; i++) {

                    const primitiveInfo = meshInfo.primitives[i];
                    const materialIndex = primitiveInfo.material;
                    const materialInfo = (materialIndex !== null && materialIndex !== undefined) ? gltf.materials[materialIndex] : null;
                    const color = materialInfo ? materialInfo._materialData.color : new Float32Array([1.0, 1.0, 1.0, 1.0]);
                    const opacity = materialInfo ? materialInfo._materialData.opacity : 1.0;
                    const metallic = materialInfo ? materialInfo._materialData.metallic : 0.0;
                    const roughness = materialInfo ? materialInfo._materialData.roughness : 1.0;

                    const xktGeometryId = createPrimitiveGeometryHash(primitiveInfo);

                    if (!ctx.geometryCreated[xktGeometryId]) {

                        const geometryArrays = {};

                        parsePrimitiveGeometry(ctx, primitiveInfo, geometryArrays);

                        const colors = geometryArrays.colors;

                        let colorsCompressed;

                        if (geometryArrays.colors) {
                            colorsCompressed = [];
                            for (let j = 0, lenj = colors.length; j < lenj; j += 4) {
                                colorsCompressed.push(colors[j + 0]);
                                colorsCompressed.push(colors[j + 1]);
                                colorsCompressed.push(colors[j + 2]);
                                colorsCompressed.push(255);
                            }
                        }

                        xktModel.createGeometry({
                            geometryId: xktGeometryId,
                            primitiveType: geometryArrays.primitive,
                            positions: geometryArrays.positions,
                            normals: ctx.autoNormals ? null : geometryArrays.normals,
                            colorsCompressed: colorsCompressed,
                            indices: geometryArrays.indices
                        });

                        ctx.stats.numGeometries++;
                        ctx.stats.numVertices += geometryArrays.positions ? geometryArrays.positions.length / 3 : 0;
                        ctx.stats.numTriangles += geometryArrays.indices ? geometryArrays.indices.length / 3 : 0;

                        ctx.geometryCreated[xktGeometryId] = true;
                    }

                    const xktMeshId = ctx.nextMeshId++;

                    xktModel.createMesh({
                        meshId: xktMeshId,
                        geometryId: xktGeometryId,
                        matrix: matrix ? matrix.slice() : math.identityMat4(),
                        color: color,
                        opacity: opacity,
                        metallic: metallic,
                        roughness: roughness
                    });

                    deferredMeshIds.push(xktMeshId);
                }
            }
        }
    }

    if (glTFNode.children) {
        const children = glTFNode.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNodeIdx = children[i];
            const childGLTFNode = gltf.nodes[childNodeIdx];
            if (!childGLTFNode) {
                console.warn('Node not found: ' + i);
                continue;
            }
            parseNode(ctx, childGLTFNode, matrix);
        }
    }

    // Post-order visit scene node

    const nodeName = glTFNode.name;
    if (nodeName !== undefined && nodeName !== null && deferredMeshIds.length > 0) {
        if (ctx.metaModelCorrections) {

            // Merging meshes into XKTObjects that map to metaobjects

            const xktEntityId = nodeName;
            const rootMetaObject = ctx.metaModelCorrections.eachChildRoot[xktEntityId];

            if (rootMetaObject) {
                const rootMetaObjectStats = ctx.metaModelCorrections.eachRootStats[rootMetaObject.id];
                rootMetaObjectStats.countChildren++;
                if (rootMetaObjectStats.countChildren >= rootMetaObjectStats.numChildren) {
                    xktModel.createEntity({
                        entityId: rootMetaObject.id,
                        meshIds: deferredMeshIds
                    });
                    ctx.stats.numObjects++;
                    deferredMeshIds.length = 0;
                }
            } else {
                const metaObject = ctx.metaModelCorrections.metaObjectsMap[xktEntityId];
                if (metaObject) {
                    xktModel.createEntity({
                        entityId: xktEntityId,
                        meshIds: deferredMeshIds
                    });
                    ctx.stats.numObjects++;
                    deferredMeshIds.length = 0;
                }
            }
        } else {

            // Create an XKTObject from the meshes at each named glTF node, don't care about metaobjects

            const xktEntityId = nodeName || ("entity" + ctx.nextDefaultEntityId++);
            xktModel.createEntity({
                entityId: xktEntityId,
                meshIds: deferredMeshIds
            });
            ctx.stats.numObjects++;
            deferredMeshIds.length = 0;
        }
    }
}

function createPrimitiveGeometryHash(primitiveInfo) {
    const attributes = primitiveInfo.attributes;
    if (!attributes) {
        return "empty";
    }
    const positions = primitiveInfo.attributes.POSITION;
    const normals = primitiveInfo.attributes.NORMAL;
    const colors = primitiveInfo.attributes.COLOR;
    return [
        primitiveInfo.mode,
        (primitiveInfo.indices !== null && primitiveInfo.indices !== undefined) ? primitiveInfo.indices : "-",
        (positions !== null && positions !== undefined) ? positions : "-",
        (normals !== null && normals !== undefined) ? normals : "-",
        (colors !== null && colors !== undefined) ? colors : "-",
        (primitiveInfo.material !== null && primitiveInfo.material !== undefined) ? primitiveInfo.material : "-"
    ].join(";");
}

function parsePrimitiveGeometry(ctx, primitiveInfo, geometryArrays) {
    const attributes = primitiveInfo.attributes;
    if (!attributes) {
        return;
    }
    switch (primitiveInfo.mode) {
        case 0: // POINTS
            geometryArrays.primitive = "points";
            break;
        case 1: // LINES
            geometryArrays.primitive = "lines";
            break;
        case 2: // LINE_LOOP
            // TODO: convert
            geometryArrays.primitive = "lines";
            break;
        case 3: // LINE_STRIP
            // TODO: convert
            geometryArrays.primitive = "lines";
            break;
        case 4: // TRIANGLES
            geometryArrays.primitive = "triangles";
            break;
        case 5: // TRIANGLE_STRIP
            // TODO: convert
            geometryArrays.primitive = "triangles";
            break;
        case 6: // TRIANGLE_FAN
            // TODO: convert
            geometryArrays.primitive = "triangles";
            break;
        default:
            geometryArrays.primitive = "triangles";
    }
    const accessors = ctx.gltf.accessors;
    const indicesIndex = primitiveInfo.indices;
    if (indicesIndex !== null && indicesIndex !== undefined) {
        const accessorInfo = accessors[indicesIndex];
        geometryArrays.indices = parseAccessorTypedArray(ctx, accessorInfo);
    }
    const positionsIndex = attributes.POSITION;
    if (positionsIndex !== null && positionsIndex !== undefined) {
        const accessorInfo = accessors[positionsIndex];
        geometryArrays.positions = parseAccessorTypedArray(ctx, accessorInfo);
    }
    const normalsIndex = attributes.NORMAL;
    if (normalsIndex !== null && normalsIndex !== undefined) {
        const accessorInfo = accessors[normalsIndex];
        geometryArrays.normals = parseAccessorTypedArray(ctx, accessorInfo);
    }
    const colorsIndex = attributes.COLOR_0;
    if (colorsIndex !== null && colorsIndex !== undefined) {
        const accessorInfo = accessors[colorsIndex];
        geometryArrays.colors = parseAccessorTypedArray(ctx, accessorInfo);
    }
}

function parseAccessorTypedArray(ctx, accessorInfo) {
    const bufferView = ctx.gltf.bufferViews[accessorInfo.bufferView];
    const itemSize = WEBGL_TYPE_SIZES[accessorInfo.type];
    const TypedArray = WEBGL_COMPONENT_TYPES[accessorInfo.componentType];
    const elementBytes = TypedArray.BYTES_PER_ELEMENT; // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
    const itemBytes = elementBytes * itemSize;
    if (accessorInfo.byteStride && accessorInfo.byteStride !== itemBytes) { // The buffer is not interleaved if the stride is the item size in bytes.
        throw new Error("interleaved buffer!"); // TODO
    } else {
        return new TypedArray(bufferView._buffer, accessorInfo.byteOffset || 0, accessorInfo.count * itemSize);
    }
}


export {parseGLTFIntoXKTModel};
