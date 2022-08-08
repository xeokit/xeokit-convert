import {utils} from "../XKTModel/lib/utils.js";
import {math} from "../lib/math.js";

import {parse} from '@loaders.gl/core';
import {GLTFLoader} from '@loaders.gl/gltf';
import {
    ClampToEdgeWrapping,
    LinearFilter,
    LinearMipMapLinearFilter,
    LinearMipMapNearestFilter,
    MirroredRepeatWrapping,
    NearestFilter,
    NearestMipMapLinearFilter,
    NearestMipMapNearestFilter,
    RepeatWrapping
} from "../../assets/lib/xeokit-sdk.es";

/**
 * @desc Parses glTF into an {@link XKTModel}, supporting ````.glb```` and textures.
 *
 * * Supports ````.glb```` and textures
 * * For a lightweight glTF JSON parser that ignores textures, see {@link parseGLTFJSONIntoXKTModel}.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load a binary glTF model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("../assets/models/gltf/HousePlan/glTF-Binary/HousePlan.glb", async (data) => {
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
 * @param {ArrayBuffer} params.data The glTF.
 * @param {String} [params.baseUri] The base URI used to load this glTF, if any. For resolving relative uris to linked resources.
 * @param {Object} [params.metaModelData] Metamodel JSON. If this is provided, then parsing is able to ensure that the XKTObjects it creates will fit the metadata properly.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Boolean} [params.includeTextures=false] Whether to parse textures.
 * @param {Boolean} [params.includeNormals=false] Whether to parse normals. When false, the parser will ignore the glTF
 * geometry normals, and the glTF data will rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded representation of the glTF.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when glTF has been parsed.
 */
function parseGLTFIntoXKTModel({
                                   data,
                                   baseUri,
                                   xktModel,
                                   metaModelData,
                                   includeTextures,
                                   includeNormals,
                                   getAttachment,
                                   stats = {},
                                   log
                               }) {

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
        stats.numNormals = 0;
        stats.numUVs = 0;
        stats.numTextures = 0;
        stats.numObjects = 0;
        stats.numGeometries = 0;

        parse(data, GLTFLoader, {
            baseUri
        }).then((gltfData) => {

            const ctx = {
                gltfData,
                metaModelCorrections: metaModelData ? getMetaModelCorrections(metaModelData) : null,
                getAttachment: getAttachment || (() => {
                    throw new Error('You must define getAttachment() method to convert glTF with external resources')
                }),
                log: (log || function (msg) {
                }),
                error: function (msg) {
                    console.error(msg);
                },
                xktModel,
                includeNormals,
                includeTextures,
                geometryCreated: {},
                nextId: 0,
                stats
            };

            ctx.log("Using parser: parseGLTFIntoXKTModel");
            ctx.log(`Parsing normals: ${ctx.includeNormals ? "enabled" : "disabled"}`);
            ctx.log(`Parsing textures: ${ctx.includeTextures ? "enabled" : "disabled"}`);

            if (ctx.includeTextures) {
                parseTextures(ctx);
            }
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
    return {
        metaObjectsMap,
        eachRootStats,
        eachChildRoot
    };
}

function parseTextures(ctx) {
    const gltfData = ctx.gltfData;
    const textures = gltfData.textures;
    if (textures) {
        for (let i = 0, len = textures.length; i < len; i++) {
            parseTexture(ctx, textures[i]);
            ctx.stats.numTextures++;
        }
    }
}

function parseTexture(ctx, texture) {
    if (!texture.source || !texture.source.image) {
        return;
    }
    const textureId = `texture-${ctx.nextId++}`;

    let minFilter = NearestMipMapLinearFilter;
    switch (texture.sampler.minFilter) {
        case 9728:
            minFilter = NearestFilter;
            break;
        case 9729:
            minFilter = LinearFilter;
            break;
        case 9984:
            minFilter = NearestMipMapNearestFilter;
            break;
        case 9985:
            minFilter = LinearMipMapNearestFilter;
            break;
        case 9986:
            minFilter = NearestMipMapLinearFilter;
            break;
        case 9987:
            minFilter = LinearMipMapLinearFilter;
            break;
    }

    let magFilter = LinearFilter;
    switch (texture.sampler.magFilter) {
        case 9728:
            magFilter = NearestFilter;
            break;
        case 9729:
            magFilter = LinearFilter;
            break;
    }

    let wrapS = RepeatWrapping;
    switch (texture.sampler.wrapS) {
        case 33071:
            wrapS = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapS = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapS = RepeatWrapping;
            break;
    }

    let wrapT = RepeatWrapping;
    switch (texture.sampler.wrapT) {
        case 33071:
            wrapT = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapT = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapT = RepeatWrapping;
            break;
    }

    let wrapR = RepeatWrapping;
    switch (texture.sampler.wrapR) {
        case 33071:
            wrapR = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapR = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapR = RepeatWrapping;
            break;
    }

    ctx.xktModel.createTexture({
        textureId: textureId,
        imageData: texture.source.image,
        mediaType: texture.source.mediaType,
        compressed: true,
        width: texture.source.image.width,
        height: texture.source.image.height,
        minFilter,
        magFilter,
        wrapS,
        wrapT,
        wrapR,
        flipY: !!texture.flipY,
        //     encoding: "sRGB"
    });
    texture._textureId = textureId;
}

function parseMaterials(ctx) {
    const gltfData = ctx.gltfData;
    const materials = gltfData.materials;
    if (materials) {
        for (let i = 0, len = materials.length; i < len; i++) {
            const material = materials[i];
            material._textureSetId = ctx.includeTextures ? parseTextureSet(ctx, material) : null;
            material._attributes = parseMaterialAttributes(ctx, material);
        }
    }
}

function parseTextureSet(ctx, material) {
    const textureSetCfg = {};
    if (material.normalTexture) {
        textureSetCfg.normalTextureId = material.normalTexture.texture._textureId;
    }
    if (material.occlusionTexture) {
        textureSetCfg.occlusionTextureId = material.occlusionTexture.texture._textureId;
    }
    if (material.emissiveTexture) {
        textureSetCfg.emissiveTextureId = material.emissiveTexture.texture._textureId;
    }
    // const alphaMode = material.alphaMode;
    // switch (alphaMode) {
    //     case "NORMAL_OPAQUE":
    //         materialCfg.alphaMode = "opaque";
    //         break;
    //     case "MASK":
    //         materialCfg.alphaMode = "mask";
    //         break;
    //     case "BLEND":
    //         materialCfg.alphaMode = "blend";
    //         break;
    //     default:
    // }
    // const alphaCutoff = material.alphaCutoff;
    // if (alphaCutoff !== undefined) {
    //     materialCfg.alphaCutoff = alphaCutoff;
    // }
    const metallicPBR = material.pbrMetallicRoughness;
    if (material.pbrMetallicRoughness) {
        const pbrMetallicRoughness = material.pbrMetallicRoughness;
        const baseColorTexture = pbrMetallicRoughness.baseColorTexture || pbrMetallicRoughness.colorTexture;
        if (baseColorTexture) {
            if (baseColorTexture.texture) {
                textureSetCfg.colorTextureId = baseColorTexture.texture._textureId;
            } else {
                textureSetCfg.colorTextureId = ctx.gltfData.textures[baseColorTexture.index]._textureId;
            }
        }
        if (metallicPBR.metallicRoughnessTexture) {
            textureSetCfg.metallicRoughnessTextureId = metallicPBR.metallicRoughnessTexture.texture._textureId;
        }
    }
    const extensions = material.extensions;
    if (extensions) {
        const specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
        if (specularPBR) {
            const specularTexture = specularPBR.specularTexture;
            if (specularTexture !== null && specularTexture !== undefined) {
                //  textureSetCfg.colorTextureId = ctx.gltfData.textures[specularColorTexture.index]._textureId;
            }
            const specularColorTexture = specularPBR.specularColorTexture;
            if (specularColorTexture !== null && specularColorTexture !== undefined) {
                textureSetCfg.colorTextureId = ctx.gltfData.textures[specularColorTexture.index]._textureId;
            }
        }
    }
    if (textureSetCfg.normalTextureId !== undefined ||
        textureSetCfg.occlusionTextureId !== undefined ||
        textureSetCfg.emissiveTextureId !== undefined ||
        textureSetCfg.colorTextureId !== undefined ||
        textureSetCfg.metallicRoughnessTextureId !== undefined) {
        textureSetCfg.textureSetId = `textureSet-${ctx.nextId++};`
        ctx.xktModel.createTextureSet(textureSetCfg);
        ctx.stats.numTextureSets++;
        return textureSetCfg.textureSetId;
    }
    return null;
}

function parseMaterialAttributes(ctx, material) { // Substitute RGBA for material, to use fast flat shading instead
    const extensions = material.extensions;
    const materialAttributes = {
        color: new Float32Array([1, 1, 1, 1]),
        opacity: 1,
        metallic: 0,
        roughness: 1
    };
    if (extensions) {
        const specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
        if (specularPBR) {
            const diffuseFactor = specularPBR.diffuseFactor;
            if (diffuseFactor !== null && diffuseFactor !== undefined) {
                materialAttributes.color.set(diffuseFactor);
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
                    materialAttributes.color.set(diffuse);
                }
            }
            const transparency = values.transparency;
            if (transparency !== null && transparency !== undefined) {
                materialAttributes.opacity = transparency;
            }
            const transparent = values.transparent;
            if (transparent !== null && transparent !== undefined) {
                materialAttributes.opacity = transparent;
            }
        }
    }
    const metallicPBR = material.pbrMetallicRoughness;
    if (metallicPBR) {
        const baseColorFactor = metallicPBR.baseColorFactor;
        if (baseColorFactor) {
            materialAttributes.color[0] = baseColorFactor[0];
            materialAttributes.color[1] = baseColorFactor[1];
            materialAttributes.color[2] = baseColorFactor[2];
            materialAttributes.opacity = baseColorFactor[3];
        }
        const metallicFactor = metallicPBR.metallicFactor;
        if (metallicFactor !== null && metallicFactor !== undefined) {
            materialAttributes.metallic = metallicFactor;
        }
        const roughnessFactor = metallicPBR.roughnessFactor;
        if (roughnessFactor !== null && roughnessFactor !== undefined) {
            materialAttributes.roughness = roughnessFactor;
        }
    }
    return materialAttributes;
}

function parseDefaultScene(ctx) {
    const gltfData = ctx.gltfData;
    const scene = gltfData.scene || gltfData.scenes[0];
    if (!scene) {
        ctx.error("glTF has no default scene");
        return;
    }
    parseScene(ctx, scene);
}

function parseScene(ctx, scene) {
    const nodes = scene.nodes;
    if (!nodes) {
        return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        countMeshUsage(ctx, node);
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        parseNode(ctx, node, 0, null);
    }
}

function countMeshUsage(ctx, node) {
    const mesh = node.mesh;
    if (mesh) {
        mesh.instances = mesh.instances ? mesh.instances + 1 : 1;
    }
    if (node.children) {
        const children = node.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (!childNode) {
                ctx.error("Node not found: " + i);
                continue;
            }
            countMeshUsage(ctx, childNode);
        }
    }
}

const deferredMeshIds = [];

function parseNode(ctx, node, depth, matrix) {

    const xktModel = ctx.xktModel;

    // Pre-order visit scene node

    let localMatrix;
    if (node.matrix) {
        localMatrix = node.matrix;
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.translation) {
        localMatrix = math.translationMat4v(node.translation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.rotation) {
        localMatrix = math.quaternionToMat4(node.rotation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.scale) {
        localMatrix = math.scalingMat4v(node.scale);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }

    if (node.mesh) {

        const mesh = node.mesh;
        const numPrimitives = mesh.primitives.length;

        if (numPrimitives > 0) {
            for (let i = 0; i < numPrimitives; i++) {
                const primitive = mesh.primitives[i];
                if (!primitive._xktGeometryId) {
                    const xktGeometryId = "geometry-" + ctx.nextId++;
                    const geometryCfg = {
                        geometryId: xktGeometryId
                    };
                    switch (primitive.mode) {
                        case 0: // POINTS
                            geometryCfg.primitiveType = "points";
                            break;
                        case 1: // LINES
                            geometryCfg.primitiveType = "lines";
                            break;
                        case 2: // LINE_LOOP
                            geometryCfg.primitiveType = "lines";
                            break;
                        case 3: // LINE_STRIP
                            geometryCfg.primitiveType = "lines";
                            break;
                        case 4: // TRIANGLES
                            geometryCfg.primitiveType = "triangles";
                            break;
                        case 5: // TRIANGLE_STRIP
                            geometryCfg.primitiveType = "triangles";
                            break;
                        case 6: // TRIANGLE_FAN
                            geometryCfg.primitiveType = "triangles";
                            break;
                        default:
                            geometryCfg.primitiveType = "triangles";
                    }
                    const POSITION = primitive.attributes.POSITION;
                    if (!POSITION) {
                        continue;
                    }
                    geometryCfg.positions = primitive.attributes.POSITION.value;
                    ctx.stats.numVertices += geometryCfg.positions.length / 3;
                    if (ctx.includeNormals) {
                        if (primitive.attributes.NORMAL) {
                            geometryCfg.normals = primitive.attributes.NORMAL.value;
                            ctx.stats.numNormals += geometryCfg.normals.length / 3;
                        }
                    }
                    if (primitive.attributes.COLOR_0) {
                        geometryCfg.colorsCompressed = primitive.attributes.COLOR_0.value;
                    }
                    if (ctx.includeTextures) {
                        if (primitive.attributes.TEXCOORD_0) {
                            geometryCfg.uvs = primitive.attributes.TEXCOORD_0.value;
                            ctx.stats.numUVs += geometryCfg.uvs.length / 2;
                        }
                    }
                    if (primitive.indices) {
                        geometryCfg.indices = primitive.indices.value;
                        if (primitive.mode === 4) {
                            ctx.stats.numTriangles += geometryCfg.indices.length / 3;
                        }
                    }
                    xktModel.createGeometry(geometryCfg);
                    primitive._xktGeometryId = xktGeometryId;
                    ctx.stats.numGeometries++;
                }

                const xktMeshId = ctx.nextId++;
                const meshCfg = {
                    meshId: xktMeshId,
                    geometryId: primitive._xktGeometryId,
                    matrix: matrix ? matrix.slice() : math.identityMat4()
                };
                const material = primitive.material;
                if (material) {
                    meshCfg.textureSetId = material._textureSetId;
                    meshCfg.color = material._attributes.color;
                    meshCfg.opacity = material._attributes.opacity;
                    meshCfg.metallic = material._attributes.metallic;
                    meshCfg.roughness = material._attributes.roughness;
                } else {
                    meshCfg.color = [1.0, 1.0, 1.0];
                    meshCfg.opacity = 1.0;
                }
                xktModel.createMesh(meshCfg);
                deferredMeshIds.push(xktMeshId);
            }
        }
    }

    // Visit child scene nodes

    if (node.children) {
        const children = node.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            parseNode(ctx, childNode, depth + 1, matrix);
        }
    }

    // Post-order visit scene node

    const nodeName = node.name;
    if (((nodeName !== undefined && nodeName !== null) || depth === 0) && deferredMeshIds.length > 0) {
        let xktEntityId = nodeName || math.createUUID();
        if (xktModel.entities[xktEntityId]) {
            ctx.error("Two or more glTF nodes found with same 'name' attribute: '" + nodeName + "'");
        }
        while (!xktEntityId || xktModel.entities[xktEntityId]) {
            xktEntityId = "entity-" + ctx.nextId++;
        }
        if (ctx.metaModelCorrections) {
            // Merging meshes into XKTObjects that map to metaobjects
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
            xktModel.createEntity({
                entityId: xktEntityId,
                meshIds: deferredMeshIds
            });
            ctx.stats.numObjects++;
            deferredMeshIds.length = 0;
        }
    }
}

export {parseGLTFIntoXKTModel};
