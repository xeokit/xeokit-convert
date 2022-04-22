import {utils} from "../XKTModel/lib/utils.js";
import {math} from "../lib/math.js";

import {parse} from '@loaders.gl/core';
import {GLTFLoader} from '@loaders.gl/gltf';

/**
 * @desc Experimental function that uses loaders.gl to parse glTF into an {@link XKTModel}.
 *
 * > This only works in the Browser's JavaScript execution environment at the moment, so should be considered
 * > experimental. The loaders.gl library is not quite working right for us in NodeJS, until we fix some polyfills.
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
 * @param {Arraybuffer} params.data The glTF.
 * @param {String} [params.baseUri] The base URI used to load this glTF, if any. For resolving relative uris to linked resources.
 * @param {Object} [params.metaModelData] Metamodel JSON. If this is provided, then parsing is able to ensure that the XKTObjects it creates will fit the metadata properly.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Boolean} [params.autoNormals=false] When true, the parser will ignore the glTF geometry normals, and the glTF
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the glTF.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
function parseGLTFIntoXKTModel2({data, baseUri, xktModel, metaModelData, autoNormals, getAttachment, stats = {}, log}) {

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

        parse(data, GLTFLoader, {
            baseUri
        }).then((gltfData) => {

            const ctx = {
                gltfData,
                metaModelCorrections: metaModelData ? getMetaModelCorrections(metaModelData) : null,
                log: (log || function (msg) {
                }),
                error: function (msg) {
                    console.error(msg);
                },
                xktModel,
                autoNormals,
                nextId: 0,
                stats
            };

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

function parseMaterials(ctx) {
    const gltfData = ctx.gltfData;
    const materials = gltfData.materials;
    if (materials) {
        for (let i = 0, len = materials.length; i < len; i++) {
            const material = materials[i];
            //           material._textureSetId = parseTextureSet(ctx, material);
            material._attributes = parseMaterialAttributes(ctx, material);
        }
    }
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
        parseNode(ctx, node, null);
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

function parseNode(ctx, node, matrix) {

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
                    if (!ctx.autoNormals) {
                        if (primitive.attributes.NORMAL) {
                            geometryCfg.normals = primitive.attributes.NORMAL.value;
                        }
                    }
                    if (primitive.attributes.COLOR_0) {
                        geometryCfg.colorsCompressed = primitive.attributes.COLOR_0.value;
                    }
                    if (primitive.attributes.TEXCOORD_0) {
                        geometryCfg.uv = primitive.attributes.TEXCOORD_0.value;
                    }
                    if (primitive.indices) {
                        geometryCfg.indices = primitive.indices.value;
                    }
                    xktModel.createGeometry(geometryCfg);
                    primitive._xktGeometryId = xktGeometryId;
                }

                const xktMeshId = ctx.nextId++;
                const meshCfg = {
                    meshId: xktMeshId,
                    geometryId: primitive._xktGeometryId,
                    matrix: matrix ? matrix.slice() : math.identityMat4()
                };
                const material = primitive.material;
                if (material) {
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
            parseNode(ctx, childNode, matrix);
        }
    }

    // Post-order visit scene node

    const nodeName = node.name;
    if (nodeName !== undefined && nodeName !== null && deferredMeshIds.length > 0) {
        let xktEntityId = nodeName;
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

export {parseGLTFIntoXKTModel2};
