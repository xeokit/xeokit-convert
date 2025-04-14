import {math} from "../lib/math.js";
import {geometryCompression} from "./lib/geometryCompression.js";
import {buildEdgeIndices} from "./lib/buildEdgeIndices.js";
import {isTriangleMeshSolid} from "./lib/isTriangleMeshSolid.js";

import {XKTMesh} from './XKTMesh.js';
import {XKTGeometry} from './XKTGeometry.js';
import {XKTEntity} from './XKTEntity.js';
import {XKTTile} from './XKTTile.js';
import {KDNode} from "./KDNode.js";
import {XKTMetaObject} from "./XKTMetaObject.js";
import {XKTPropertySet} from "./XKTPropertySet.js";
import {mergeVertices} from "../lib/mergeVertices.js";
import {XKT_INFO} from "../XKT_INFO.js";
import {XKTTexture} from "./XKTTexture.js";
import {XKTTextureSet} from "./XKTTextureSet.js";
import {encode, load} from "@loaders.gl/core";
import {KTX2BasisWriter} from "@loaders.gl/textures";
import {ImageLoader} from '@loaders.gl/images';

const tempVec4a = math.vec4([0, 0, 0, 1]);
const tempVec4b = math.vec4([0, 0, 0, 1]);

const tempMat4 = math.mat4();
const tempMat4b = math.mat4();

const kdTreeDimLength = new Float64Array(3);

// XKT texture types

const COLOR_TEXTURE = 0;
const METALLIC_ROUGHNESS_TEXTURE = 1;
const NORMALS_TEXTURE = 2;
const EMISSIVE_TEXTURE = 3;
const OCCLUSION_TEXTURE = 4;

// KTX2 encoding options for each texture type

const TEXTURE_ENCODING_OPTIONS = {}
TEXTURE_ENCODING_OPTIONS[COLOR_TEXTURE] = {
    useSRGB: true,
    qualityLevel: 50,
    encodeUASTC: true,
    mipmaps: true
};
TEXTURE_ENCODING_OPTIONS[EMISSIVE_TEXTURE] = {
    useSRGB: true,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};
TEXTURE_ENCODING_OPTIONS[METALLIC_ROUGHNESS_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 50,
    mipmaps: true // Needed for GGX roughness shading
};
TEXTURE_ENCODING_OPTIONS[NORMALS_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};
TEXTURE_ENCODING_OPTIONS[OCCLUSION_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};

/**
 * A document model that represents the contents of an .XKT file.
 *
 * * An XKTModel contains {@link XKTTile}s, which spatially subdivide the model into axis-aligned, box-shaped regions.
 * * Each {@link XKTTile} contains {@link XKTEntity}s, which represent the objects within its region.
 * * Each {@link XKTEntity} has {@link XKTMesh}s, which each have a {@link XKTGeometry}. Each {@link XKTGeometry} can be shared by multiple {@link XKTMesh}s.
 * * Import models into an XKTModel using {@link parseGLTFJSONIntoXKTModel}, {@link parseIFCIntoXKTModel}, {@link parseCityJSONIntoXKTModel} etc.
 * * Build an XKTModel programmatically using {@link XKTModel#createGeometry}, {@link XKTModel#createMesh} and {@link XKTModel#createEntity}.
 * * Serialize an XKTModel to an ArrayBuffer using {@link writeXKTModelToArrayBuffer}.
 *
 * ## Usage
 *
 * See [main docs page](/docs/#javascript-api) for usage examples.
 *
 * @class XKTModel
 */
class XKTModel {

    /**
     * Constructs a new XKTModel.
     *
     * @param {*} [cfg] Configuration
     * @param {Number} [cfg.edgeThreshold=10]
     * @param {Number} [cfg.minTileSize=500]
     */
    constructor(cfg = {}) {

        /**
         * The model's ID, if available.
         *
         * Will be "default" by default.
         *
         * @type {String}
         */
        this.modelId = cfg.modelId || "default";

        /**
         * The project ID, if available.
         *
         * Will be an empty string by default.
         *
         * @type {String}
         */
        this.projectId = cfg.projectId || "";

        /**
         * The revision ID, if available.
         *
         * Will be an empty string by default.
         *
         * @type {String}
         */
        this.revisionId = cfg.revisionId || "";

        /**
         * The model author, if available.
         *
         * Will be an empty string by default.
         *
         * @property author
         * @type {String}
         */
        this.author = cfg.author || "";

        /**
         * The date the model was created, if available.
         *
         * Will be an empty string by default.
         *
         * @property createdAt
         * @type {String}
         */
        this.createdAt = cfg.createdAt || "";

        /**
         * The application that created the model, if available.
         *
         * Will be an empty string by default.
         *
         * @property creatingApplication
         * @type {String}
         */
        this.creatingApplication = cfg.creatingApplication || "";

        /**
         * The model schema version, if available.
         *
         * In the case of IFC, this could be "IFC2x3" or "IFC4", for example.
         *
         * Will be an empty string by default.
         *
         * @property schema
         * @type {String}
         */
        this.schema = cfg.schema || "";

        /**
         * The XKT format version.
         *
         * @property xktVersion;
         * @type {number}
         */
        this.xktVersion = XKT_INFO.xktVersion;

        /**
         *
         * @type {Number|number}
         */
        this.edgeThreshold = cfg.edgeThreshold || 10;

        /**
         * Minimum diagonal size of the boundary of an {@link XKTTile}.
         *
         * @type {Number|number}
         */
        this.minTileSize = cfg.minTileSize || 500;

        /**
         * Optional overall AABB that contains all the {@link XKTEntity}s we'll create in this model, if previously known.
         *
         * This is the AABB of a complete set of input files that are provided as a split-model set for conversion.
         *
         * This is used to help the {@link XKTTile.aabb}s within split models align neatly with each other, as we
         * build them with a k-d tree in {@link XKTModel#finalize}.  Without this, the AABBs of the different parts
         * tend to misalign slightly, resulting in excess number of {@link XKTTile}s, which degrades memory and rendering
         * performance when the XKT is viewer in the xeokit Viewer.
         */
        this.modelAABB = cfg.modelAABB;

        /**
         * Map of {@link XKTPropertySet}s within this XKTModel, each mapped to {@link XKTPropertySet#propertySetId}.
         *
         * Created by {@link XKTModel#createPropertySet}.
         *
         * @type {{String:XKTPropertySet}}
         */
        this.propertySets = {};

        /**
         * {@link XKTPropertySet}s within this XKTModel.
         *
         * Each XKTPropertySet holds its position in this list in {@link XKTPropertySet#propertySetIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTPropertySet[]}
         */
        this.propertySetsList = [];

        /**
         * Map of {@link XKTMetaObject}s within this XKTModel, each mapped to {@link XKTMetaObject#metaObjectId}.
         *
         * Created by {@link XKTModel#createMetaObject}.
         *
         * @type {{String:XKTMetaObject}}
         */
        this.metaObjects = {};

        /**
         * {@link XKTMetaObject}s within this XKTModel.
         *
         * Each XKTMetaObject holds its position in this list in {@link XKTMetaObject#metaObjectIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTMetaObject[]}
         */
        this.metaObjectsList = [];

        /**
         * The positions of all shared {@link XKTGeometry}s are de-quantized using this singular
         * de-quantization matrix.
         *
         * This de-quantization matrix is generated from the collective Local-space boundary of the
         * positions of all shared {@link XKTGeometry}s.
         *
         * @type {Float32Array}
         */
        this.reusedGeometriesDecodeMatrix = new Float32Array(16);

        /**
         * Map of {@link XKTGeometry}s within this XKTModel, each mapped to {@link XKTGeometry#geometryId}.
         *
         * Created by {@link XKTModel#createGeometry}.
         *
         * @type {{Number:XKTGeometry}}
         */
        this.geometries = {};

        /**
         * List of {@link XKTGeometry}s within this XKTModel, in the order they were created.
         *
         * Each XKTGeometry holds its position in this list in {@link XKTGeometry#geometryIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTGeometry[]}
         */
        this.geometriesList = [];

        /**
         * Map of {@link XKTTexture}s within this XKTModel, each mapped to {@link XKTTexture#textureId}.
         *
         * Created by {@link XKTModel#createTexture}.
         *
         * @type {{Number:XKTTexture}}
         */
        this.textures = {};

        /**
         * List of {@link XKTTexture}s within this XKTModel, in the order they were created.
         *
         * Each XKTTexture holds its position in this list in {@link XKTTexture#textureIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTexture[]}
         */
        this.texturesList = [];

        /**
         * Map of {@link XKTTextureSet}s within this XKTModel, each mapped to {@link XKTTextureSet#textureSetId}.
         *
         * Created by {@link XKTModel#createTextureSet}.
         *
         * @type {{Number:XKTTextureSet}}
         */
        this.textureSets = {};

        /**
         * List of {@link XKTTextureSet}s within this XKTModel, in the order they were created.
         *
         * Each XKTTextureSet holds its position in this list in {@link XKTTextureSet#textureSetIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTextureSet[]}
         */
        this.textureSetsList = [];

        /**
         * Map of {@link XKTMesh}s within this XKTModel, each mapped to {@link XKTMesh#meshId}.
         *
         * Created by {@link XKTModel#createMesh}.
         *
         * @type {{Number:XKTMesh}}
         */
        this.meshes = {};

        /**
         * List of {@link XKTMesh}s within this XKTModel, in the order they were created.
         *
         * Each XKTMesh holds its position in this list in {@link XKTMesh#meshIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTMesh[]}
         */
        this.meshesList = [];

        /**
         * Map of {@link XKTEntity}s within this XKTModel, each mapped to {@link XKTEntity#entityId}.
         *
         * Created by {@link XKTModel#createEntity}.
         *
         * @type {{String:XKTEntity}}
         */
        this.entities = {};

        /**
         * {@link XKTEntity}s within this XKTModel.
         *
         * Each XKTEntity holds its position in this list in {@link XKTEntity#entityIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTEntity[]}
         */
        this.entitiesList = [];

        /**
         * {@link XKTTile}s within this XKTModel.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTile[]}
         */
        this.tilesList = [];

        /**
         * The axis-aligned 3D World-space boundary of this XKTModel.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {Float64Array}
         */
        this.aabb = math.AABB3();

        /**
         * Indicates if this XKTModel has been finalized.
         *
         * Set ````true```` by {@link XKTModel#finalize}.
         *
         * @type {boolean}
         */
        this.finalized = false;
    }

    /**
     * Creates an {@link XKTPropertySet} within this XKTModel.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.propertySetId Unique ID for the {@link XKTPropertySet}.
     * @param {String} [params.propertySetType="default"] A meta type for the {@link XKTPropertySet}.
     * @param {String} [params.propertySetName] Human-readable name for the {@link XKTPropertySet}. Defaults to the ````propertySetId```` parameter.
     * @param {String[]} params.properties Properties for the {@link XKTPropertySet}.
     * @returns {XKTPropertySet} The new {@link XKTPropertySet}.
     */
    createPropertySet(params) {

        if (!params) {
            throw "[XKTModel.createPropertySet] Parameters expected: params";
        }

        if (params.propertySetId === null || params.propertySetId === undefined) {
            throw "[XKTModel.createPropertySet] Parameter expected: params.propertySetId";
        }

        if (params.properties === null || params.properties === undefined) {
            throw "[XKTModel.createPropertySet] Parameter expected: params.properties";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more property sets");
            return;
        }

        if (this.propertySets[params.propertySetId]) {
            //          console.error("XKTPropertySet already exists with this ID: " + params.propertySetId);
            return;
        }

        const propertySetId = params.propertySetId;
        const propertySetType = params.propertySetType || "Default";
        const propertySetName = params.propertySetName || params.propertySetId;
        const properties = params.properties || [];

        const propertySet = new XKTPropertySet(propertySetId, propertySetType, propertySetName, properties);

        this.propertySets[propertySetId] = propertySet;
        this.propertySetsList.push(propertySet);

        return propertySet;
    }

    /**
     * Creates an {@link XKTMetaObject} within this XKTModel.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.metaObjectId Unique ID for the {@link XKTMetaObject}.
     * @param {String} params.propertySetIds ID of one or more property sets that contains additional metadata about
     * this {@link XKTMetaObject}. The property sets could be stored externally (ie not managed at all by the XKT file),
     * or could be {@link XKTPropertySet}s within {@link XKTModel#propertySets}.
     * @param {String} [params.metaObjectType="default"] A meta type for the {@link XKTMetaObject}. Can be anything,
     * but is usually an IFC type, such as "IfcSite" or "IfcWall".
     * @param {String} [params.metaObjectName] Human-readable name for the {@link XKTMetaObject}. Defaults to the ````metaObjectId```` parameter.
     * @param {String} [params.parentMetaObjectId] ID of the parent {@link XKTMetaObject}, if any. Defaults to the ````metaObjectId```` parameter.
     * @returns {XKTMetaObject} The new {@link XKTMetaObject}.
     */
    createMetaObject(params) {

        if (!params) {
            throw "[XKTModel.createMetaObject] Parameters expected: params";
        }

        if (params.metaObjectId === null || params.metaObjectId === undefined) {
            throw "[XKTModel.createMetaObject] Parameter expected: params.metaObjectId";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more meta objects");
            return;
        }

        if (this.metaObjects[params.metaObjectId]) {
            //          console.error("XKTMetaObject already exists with this ID: " + params.metaObjectId);
            return;
        }

        const metaObjectId = params.metaObjectId;
        const propertySetIds = params.propertySetIds;
        const metaObjectType = params.metaObjectType || "Default";
        const metaObjectName = params.metaObjectName || params.metaObjectId;
        const parentMetaObjectId = params.parentMetaObjectId;

        const metaObject = new XKTMetaObject(metaObjectId, propertySetIds, metaObjectType, metaObjectName, parentMetaObjectId);

        this.metaObjects[metaObjectId] = metaObject;
        this.metaObjectsList.push(metaObject);

        if (!parentMetaObjectId) {
            if (!this._rootMetaObject) {
                this._rootMetaObject = metaObject;
            }
        }

        return metaObject;
    }

    /**
     * Creates an {@link XKTTexture} within this XKTModel.
     *
     * Registers the new {@link XKTTexture} in {@link XKTModel#textures} and {@link XKTModel#texturesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.textureId Unique ID for the {@link XKTTexture}.
     * @param {String} [params.src] Source of an image file for the texture.
     * @param {Buffer} [params.imageData] Image data for the texture.
     * @param {Number} [params.mediaType] Media type (ie. MIME type) of ````imageData````. Supported values are {@link GIFMediaType}, {@link PNGMediaType} and {@link JPEGMediaType}.
     * @param {Number} [params.width] Texture width, used with ````imageData````. Ignored for compressed textures.
     * @param {Number} [params.height] Texture height, used with ````imageData````. Ignored for compressed textures.
     * @param {Boolean} [params.compressed=true] Whether to compress the texture.
     * @param {Number} [params.minFilter=LinearMipMapNearestFilter] How the texture is sampled when a texel covers less than one pixel. Supported
     * values are {@link LinearMipmapLinearFilter}, {@link LinearMipMapNearestFilter}, {@link NearestMipMapNearestFilter},
     * {@link NearestMipMapLinearFilter} and {@link LinearMipMapLinearFilter}. Ignored for compressed textures.
     * @param {Number} [params.magFilter=LinearMipMapNearestFilter] How the texture is sampled when a texel covers more than one pixel. Supported values
     * are {@link LinearFilter} and {@link NearestFilter}. Ignored for compressed textures.
     * @param {Number} [params.wrapS=RepeatWrapping] Wrap parameter for texture coordinate *S*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * @param {Number} [params.wrapT=RepeatWrapping] Wrap parameter for texture coordinate *T*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * {@param {Number} [params.wrapR=RepeatWrapping] Wrap parameter for texture coordinate *R*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * @returns {XKTTexture} The new {@link XKTTexture}.
     */
    createTexture(params) {

        if (!params) {
            throw "[XKTModel.createTexture] Parameters expected: params";
        }

        if (params.textureId === null || params.textureId === undefined) {
            throw "[XKTModel.createTexture] Parameter expected: params.textureId";
        }

        if (!params.imageData && !params.src) {
            throw "[XKTModel.createTexture] Parameter expected: params.imageData or params.src";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more textures");
            return;
        }

        if (this.textures[params.textureId]) {
            console.error("XKTTexture already exists with this ID: " + params.textureId);
            return;
        }

        if (params.src) {
            const fileExt = params.src.split('.').pop();
            if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
                console.error(`XKTModel does not support image files with extension '${fileExt}' - won't create texture '${params.textureId}`);
                return;
            }
        }

        const textureId = params.textureId;

        const texture = new XKTTexture({
            textureId,
            imageData: params.imageData,
            mediaType: params.mediaType,
            minFilter: params.minFilter,
            magFilter: params.magFilter,
            wrapS: params.wrapS,
            wrapT: params.wrapT,
            wrapR: params.wrapR,
            width: params.width,
            height: params.height,
            compressed: (params.compressed !== false),
            src: params.src
        });

        this.textures[textureId] = texture;
        this.texturesList.push(texture);

        return texture;
    }

    /**
     * Creates an {@link XKTTextureSet} within this XKTModel.
     *
     * Registers the new {@link XKTTextureSet} in {@link XKTModel#textureSets} and {@link XKTModel#.textureSetsList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.textureSetId Unique ID for the {@link XKTTextureSet}.
     * @param {*} [params.colorTextureId] ID of *RGBA* base color {@link XKTTexture}, with color in *RGB* and alpha in *A*.
     * @param {*} [params.metallicRoughnessTextureId] ID of *RGBA* metal-roughness {@link XKTTexture}, with the metallic factor in *R*, and roughness factor in *G*.
     * @param {*} [params.normalsTextureId] ID of *RGBA* normal {@link XKTTexture}, with normal map vectors in *RGB*.
     * @param {*} [params.emissiveTextureId] ID of *RGBA* emissive {@link XKTTexture}, with emissive color in *RGB*.
     * @param {*} [params.occlusionTextureId] ID of *RGBA* occlusion {@link XKTTexture}, with occlusion factor in *R*.
     * @returns {XKTTextureSet} The new {@link XKTTextureSet}.
     */
    createTextureSet(params) {

        if (!params) {
            throw "[XKTModel.createTextureSet] Parameters expected: params";
        }

        if (params.textureSetId === null || params.textureSetId === undefined) {
            throw "[XKTModel.createTextureSet] Parameter expected: params.textureSetId";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more textureSets");
            return;
        }

        if (this.textureSets[params.textureSetId]) {
            console.error("XKTTextureSet already exists with this ID: " + params.textureSetId);
            return;
        }

        let colorTexture;
        if (params.colorTextureId !== undefined && params.colorTextureId !== null) {
            colorTexture = this.textures[params.colorTextureId];
            if (!colorTexture) {
                console.error(`Texture not found: ${params.colorTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            colorTexture.channel = COLOR_TEXTURE;
        }

        let metallicRoughnessTexture;
        if (params.metallicRoughnessTextureId !== undefined && params.metallicRoughnessTextureId !== null) {
            metallicRoughnessTexture = this.textures[params.metallicRoughnessTextureId];
            if (!metallicRoughnessTexture) {
                console.error(`Texture not found: ${params.metallicRoughnessTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            metallicRoughnessTexture.channel = METALLIC_ROUGHNESS_TEXTURE;
        }

        let normalsTexture;
        if (params.normalsTextureId !== undefined && params.normalsTextureId !== null) {
            normalsTexture = this.textures[params.normalsTextureId];
            if (!normalsTexture) {
                console.error(`Texture not found: ${params.normalsTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            normalsTexture.channel = NORMALS_TEXTURE;
        }

        let emissiveTexture;
        if (params.emissiveTextureId !== undefined && params.emissiveTextureId !== null) {
            emissiveTexture = this.textures[params.emissiveTextureId];
            if (!emissiveTexture) {
                console.error(`Texture not found: ${params.emissiveTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            emissiveTexture.channel = EMISSIVE_TEXTURE;
        }

        let occlusionTexture;
        if (params.occlusionTextureId !== undefined && params.occlusionTextureId !== null) {
            occlusionTexture = this.textures[params.occlusionTextureId];
            if (!occlusionTexture) {
                console.error(`Texture not found: ${params.occlusionTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            occlusionTexture.channel = OCCLUSION_TEXTURE;
        }

        const textureSet = new XKTTextureSet({
            textureSetId: params.textureSetId,
            textureSetIndex: this.textureSetsList.length,
            colorTexture,
            metallicRoughnessTexture,
            normalsTexture,
            emissiveTexture,
            occlusionTexture
        });

        this.textureSets[params.textureSetId] = textureSet;
        this.textureSetsList.push(textureSet);

        return textureSet;
    }

    /**
     * Creates an {@link XKTGeometry} within this XKTModel.
     *
     * Registers the new {@link XKTGeometry} in {@link XKTModel#geometries} and {@link XKTModel#geometriesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.geometryId Unique ID for the {@link XKTGeometry}.
     * @param {String} params.primitiveType The type of {@link XKTGeometry}: "triangles", "lines" or "points".
     * @param {Float64Array} params.positions Floating-point Local-space vertex positions for the {@link XKTGeometry}. Required for all primitive types.
     * @param {Number[]} [params.normals] Floating-point vertex normals for the {@link XKTGeometry}. Only used with triangles primitives. Ignored for points and lines.
     * @param {Number[]} [params.colors] Floating-point RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Number[]} [params.colorsCompressed] Integer RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Number[]} [params.uvs] Floating-point vertex UV coordinates for the {@link XKTGeometry}. Alias for ````uv````.
     * @param {Number[]} [params.uv] Floating-point vertex UV coordinates for the {@link XKTGeometry}. Alias for ````uvs````.
     * @param {Number[]} [params.colorsCompressed] Integer RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Uint32Array} [params.indices] Indices for the {@link XKTGeometry}. Required for triangles and lines primitives. Ignored for points.
     * @param {Number} [params.edgeThreshold=10]
     * @returns {XKTGeometry} The new {@link XKTGeometry}.
     */
    createGeometry(params) {

        if (!params) {
            throw "[XKTModel.createGeometry] Parameters expected: params";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "[XKTModel.createGeometry] Parameter expected: params.geometryId";
        }

        if (!params.primitiveType) {
            throw "[XKTModel.createGeometry] Parameter expected: params.primitiveType";
        }

        if (!params.positions) {
            throw "[XKTModel.createGeometry] Parameter expected: params.positions";
        }

        const triangles = params.primitiveType === "triangles";
        const points = params.primitiveType === "points";
        const axis_label = params.primitiveType === "axis-label";
        const lines = params.primitiveType === "lines";
        const line_strip = params.primitiveType === "line-strip";
        const line_loop = params.primitiveType === "line-loop";
        const triangle_strip = params.primitiveType === "triangle-strip";
        const triangle_fan = params.primitiveType === "triangle-fan";

        if (!triangles && !points && !lines && !line_strip && !line_loop && !axis_label) {
            throw "[XKTModel.createGeometry] Unsupported value for params.primitiveType: "
            + params.primitiveType
            + "' - supported values are 'triangles', 'points', 'lines', 'line-strip', 'triangle-strip' and 'triangle-fan";
        }

        if (triangles) {
            if (!params.indices) {
                params.indices = this._createDefaultIndices()
                throw "[XKTModel.createGeometry] Parameter expected for 'triangles' primitive: params.indices";
            }
        }

        if (points) {
            if (!params.colors && !params.colorsCompressed) {
                console.error("[XKTModel.createGeometry] Parameter expected for 'points' primitive: params.colors or params.colorsCompressed");
                return;
            }
        }

        if (lines) {
            if (!params.indices) {
                throw "[XKTModel.createGeometry] Parameter expected for 'lines' primitive: params.indices";
            }
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more geometries");
            return;
        }

        if (this.geometries[params.geometryId]) {
            console.error("XKTGeometry already exists with this ID: " + params.geometryId);
            return;
        }

        const geometryId = params.geometryId;
        const primitiveType = params.primitiveType;
        const axisLabel = params.axisLabel;
        const positions = new Float64Array(params.positions); // May modify in #finalize

        const xktGeometryCfg = {
            geometryId: geometryId,
            geometryIndex: this.geometriesList.length,
            primitiveType: primitiveType,
            axisLabel,
            positions: positions,
            uvs: params.uvs || params.uv
        }

        if (triangles) {
            if (params.normals) {
                xktGeometryCfg.normals = new Float32Array(params.normals);
            }
            if (params.indices) {
                xktGeometryCfg.indices = params.indices;
            } else {
                xktGeometryCfg.indices = this._createDefaultIndices(positions.length / 3);
            }
        }

        if (points) {
            if (params.colorsCompressed) {
                xktGeometryCfg.colorsCompressed = new Uint8Array(params.colorsCompressed);

            } else {
                const colors = params.colors;
                const colorsCompressed = new Uint8Array(colors.length);
                for (let i = 0, len = colors.length; i < len; i++) {
                    colorsCompressed[i] = Math.floor(colors[i] * 255);
                }
                xktGeometryCfg.colorsCompressed = colorsCompressed;
            }
        }

        if (lines) {
            xktGeometryCfg.indices = params.indices;
        }

        if (triangles) {

            if (!params.normals && !params.uv && !params.uvs) {

                // Building models often duplicate positions to allow face-aligned vertex normals; when we're not
                // providing normals for a geometry, it becomes possible to merge duplicate vertex positions within it.

                // TODO: Make vertex merging also merge normals?

                const mergedPositions = [];
                const mergedIndices = [];
                mergeVertices(xktGeometryCfg.positions, xktGeometryCfg.indices, mergedPositions, mergedIndices);
                xktGeometryCfg.positions = new Float64Array(mergedPositions);
                xktGeometryCfg.indices = mergedIndices;
            }

            xktGeometryCfg.edgeIndices = buildEdgeIndices(xktGeometryCfg.positions, xktGeometryCfg.indices, null, params.edgeThreshold || this.edgeThreshold || 10);
        }

        const geometry = new XKTGeometry(xktGeometryCfg);

        this.geometries[geometryId] = geometry;
        this.geometriesList.push(geometry);

        return geometry;
    }

    _createDefaultIndices(numIndices) {
        const indices = [];
        for (let i = 0; i < numIndices; i++) {
            indices.push(i);
        }
        return indices;
    }

    /**
     * Creates an {@link XKTMesh} within this XKTModel.
     *
     * An {@link XKTMesh} can be owned by one {@link XKTEntity}, which can own multiple {@link XKTMesh}es.
     *
     * Registers the new {@link XKTMesh} in {@link XKTModel#meshes} and {@link XKTModel#meshesList}.
     *
     * @param {*} params Method parameters.
     * @param {Number} params.meshId Unique ID for the {@link XKTMesh}.
     * @param {Number} params.geometryId ID of an existing {@link XKTGeometry} in {@link XKTModel#geometries}.
     * @param {Number} [params.textureSetId] Unique ID of an {@link XKTTextureSet} in {@link XKTModel#textureSets}.
     * @param {Float32Array} params.color RGB color for the {@link XKTMesh}, with each color component in range [0..1].
     * @param {Number} [params.metallic=0] How metallic the {@link XKTMesh} is, in range [0..1]. A value of ````0```` indicates fully dielectric material, while ````1```` indicates fully metallic.
     * @param {Number} [params.roughness=1] How rough the {@link XKTMesh} is, in range [0..1]. A value of ````0```` indicates fully smooth, while ````1```` indicates fully rough.
     * @param {Number} params.opacity Opacity factor for the {@link XKTMesh}, in range [0..1].
     * @param {Float64Array} [params.matrix] Modeling matrix for the {@link XKTMesh}. Overrides ````position````, ````scale```` and ````rotation```` parameters.
     * @param {Number[]} [params.position=[0,0,0]] Position of the {@link XKTMesh}. Overridden by the ````matrix```` parameter.
     * @param {Number[]} [params.scale=[1,1,1]] Scale of the {@link XKTMesh}. Overridden by the ````matrix```` parameter.
     * @param {Number[]} [params.rotation=[0,0,0]] Rotation of the {@link XKTMesh} as Euler angles given in degrees, for each of the X, Y and Z axis. Overridden by the ````matrix```` parameter.
     * @returns {XKTMesh} The new {@link XKTMesh}.
     */
    createMesh(params) {

        if (params.meshId === null || params.meshId === undefined) {
            throw "[XKTModel.createMesh] Parameter expected: params.meshId";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "[XKTModel.createMesh] Parameter expected: params.geometryId";
        }

        if (this.finalized) {
            throw "[XKTModel.createMesh] XKTModel has been finalized, can't add more meshes";
        }

        if (this.meshes[params.meshId]) {
            console.error("XKTMesh already exists with this ID: " + params.meshId);
            return;
        }

        const geometry = this.geometries[params.geometryId];

        if (!geometry) {
            console.error("XKTGeometry not found: " + params.geometryId);
            return;
        }

        geometry.numInstances++;

        let textureSet = null;
        if (params.textureSetId) {
            textureSet = this.textureSets[params.textureSetId];
            if (!textureSet) {
                console.error("XKTTextureSet not found: " + params.textureSetId);
                return;
            }
            textureSet.numInstances++;
        }

        let matrix = params.matrix;

        if (!matrix) {

            const position = params.position;
            const scale = params.scale;
            const rotation = params.rotation;

            if (position || scale || rotation) {
                matrix = math.identityMat4();
                const quaternion = math.eulerToQuaternion(rotation || [0, 0, 0], "XYZ", math.identityQuaternion());
                math.composeMat4(position || [0, 0, 0], quaternion, scale || [1, 1, 1], matrix)

            } else {
                matrix = math.identityMat4();
            }
        }

        const meshIndex = this.meshesList.length;

        const mesh = new XKTMesh({
            meshId: params.meshId,
            meshIndex,
            matrix,
            geometry,
            color: params.color,
            metallic: params.metallic,
            roughness: params.roughness,
            opacity: params.opacity,
            textureSet
        });

        this.meshes[mesh.meshId] = mesh;
        this.meshesList.push(mesh);

        return mesh;
    }

    /**
     * Creates an {@link XKTEntity} within this XKTModel.
     *
     * Registers the new {@link XKTEntity} in {@link XKTModel#entities} and {@link XKTModel#entitiesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.entityId Unique ID for the {@link XKTEntity}.
     * @param {String[]} params.meshIds IDs of {@link XKTMesh}es used by the {@link XKTEntity}. Note that each {@link XKTMesh} can only be used by one {@link XKTEntity}.
     * @returns {XKTEntity} The new {@link XKTEntity}.
     */
    createEntity(params) {

        if (!params) {
            throw "[XKTModel.createEntity] Parameters expected: params";
        }

        if (params.entityId === null || params.entityId === undefined) {
            throw "[XKTModel.createEntity] Parameter expected: params.entityId";
        }

        if (!params.meshIds) {
            throw "[XKTModel.createEntity] Parameter expected: params.meshIds";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more entities");
            return;
        }

        if (params.meshIds.length === 0) {
            console.warn("XKTEntity has no meshes - won't create: " + params.entityId);
            return;
        }

        let entityId = params.entityId;

        if (this.entities[entityId]) {
            while (this.entities[entityId]) {
                entityId = math.createUUID();
            }
            console.error("XKTEntity already exists with this ID: " + params.entityId + " - substituting random ID instead: " + entityId);
        }

        const meshIds = params.meshIds;
        const meshes = [];

        for (let meshIdIdx = 0, meshIdLen = meshIds.length; meshIdIdx < meshIdLen; meshIdIdx++) {

            const meshId = meshIds[meshIdIdx];
            const mesh = this.meshes[meshId];

            if (!mesh) {
                console.error("XKTMesh found: " + meshId);
                continue;
            }

            if (mesh.entity) {
                console.error("XKTMesh " + meshId + " already used by XKTEntity " + mesh.entity.entityId);
                continue;
            }

            meshes.push(mesh);
        }

        const entity = new XKTEntity(entityId, meshes);

        for (let i = 0, len = meshes.length; i < len; i++) {
            const mesh = meshes[i];
            mesh.entity = entity;
        }

        this.entities[entityId] = entity;
        this.entitiesList.push(entity);

        return entity;
    }

    /**
     * Creates a default {@link XKTMetaObject} for each {@link XKTEntity} that does not already have one.
     */
    createDefaultMetaObjects() {

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {

            const entity = this.entitiesList[i];
            const metaObjectId = entity.entityId;
            const metaObject = this.metaObjects[metaObjectId];

            if (!metaObject) {

                if (!this._rootMetaObject) {
                    this._rootMetaObject = this.createMetaObject({
                        metaObjectId: this.modelId,
                        metaObjectType: "Default",
                        metaObjectName: this.modelId
                    });
                }

                this.createMetaObject({
                    metaObjectId: metaObjectId,
                    metaObjectType: "Default",
                    metaObjectName: "" + metaObjectId,
                    parentMetaObjectId: this._rootMetaObject.metaObjectId
                });
            }
        }
    }

    /**
     * Finalizes this XKTModel.
     *
     * After finalizing, we may then serialize the model to an array buffer using {@link writeXKTModelToArrayBuffer}.
     *
     * Logs error and does nothing if this XKTModel has already been finalized.
     *
     * Internally, this method:
     *
     * * for each {@link XKTEntity} that doesn't already have a {@link XKTMetaObject}, creates one with {@link XKTMetaObject#metaObjectType} set to "default"
     * * sets each {@link XKTEntity}'s {@link XKTEntity#hasReusedGeometries} true if it shares its {@link XKTGeometry}s with other {@link XKTEntity}s,
     * * creates each {@link XKTEntity}'s {@link XKTEntity#aabb},
     * * creates {@link XKTTile}s in {@link XKTModel#tilesList}, and
     * * sets {@link XKTModel#finalized} ````true````.
     */
    async finalize() {

        if (this.finalized) {
            console.log("XKTModel already finalized");
            return;
        }

        this._removeUnusedTextures();

        await this._compressTextures();

        this._bakeSingleUseGeometryPositions();

        this._bakeAndOctEncodeNormals();

        this._createEntityAABBs();

        const rootKDNode = this._createKDTree();

        this.entitiesList = [];

        this._createTilesFromKDTree(rootKDNode);

        this._createReusedGeometriesDecodeMatrix();

        this._flagSolidGeometries();

        this.aabb.set(rootKDNode.aabb);

        this.finalized = true;
    }

    _removeUnusedTextures() {
        let texturesList = [];
        const textures = {};
        for (let i = 0, leni = this.texturesList.length; i < leni; i++) {
            const texture = this.texturesList[i];
            if (texture.channel !== null) {
                texture.textureIndex = texturesList.length;
                texturesList.push(texture);
                textures[texture.textureId] = texture;
            }
        }
        this.texturesList = texturesList;
        this.textures = textures;
    }

    _compressTextures() {
        let countTextures = this.texturesList.length;
        return new Promise((resolve) => {
            if (countTextures === 0) {
                resolve();
                return;
            }
            for (let i = 0, leni = this.texturesList.length; i < leni; i++) {
                const texture = this.texturesList[i];
                const encodingOptions = TEXTURE_ENCODING_OPTIONS[texture.channel] || {};

                if (texture.src) {

                    // XKTTexture created with XKTModel#createTexture({ src: ... })

                    const src = texture.src;
                    const fileExt = src.split('.').pop();
                    switch (fileExt) {
                        case "jpeg":
                        case "jpg":
                        case "png":
                            load(src, ImageLoader, {
                                image: {
                                    type: "data"
                                }
                            }).then((imageData) => {
                                if (texture.compressed) {
                                    encode(imageData, KTX2BasisWriter, encodingOptions).then((encodedData) => {
                                        const encodedImageData = new Uint8Array(encodedData);
                                        texture.imageData = encodedImageData;
                                        if (--countTextures <= 0) {
                                            resolve();
                                        }
                                    }).catch((err) => {
                                        console.error("[XKTModel.finalize] Failed to encode image: " + err);
                                        if (--countTextures <= 0) {
                                            resolve();
                                        }
                                    });
                                } else {
                                    texture.imageData = new Uint8Array(1);
                                    if (--countTextures <= 0) {
                                        resolve();
                                    }
                                }
                            }).catch((err) => {
                                console.error("[XKTModel.finalize] Failed to load image: " + err);
                                if (--countTextures <= 0) {
                                    resolve();
                                }
                            });
                            break;
                        default:
                            if (--countTextures <= 0) {
                                resolve();
                            }
                            break;
                    }
                }

                if (texture.imageData) {

                    // XKTTexture created with XKTModel#createTexture({ imageData: ... })

                    if (texture.compressed) {
                        encode(texture.imageData, KTX2BasisWriter, encodingOptions)
                            .then((encodedImageData) => {
                                texture.imageData = new Uint8Array(encodedImageData);
                                if (--countTextures <= 0) {
                                    resolve();
                                }
                            }).catch((err) => {
                            console.error("[XKTModel.finalize] Failed to encode image: " + err);
                            if (--countTextures <= 0) {
                                resolve();
                            }
                        });
                    } else {
                        texture.imageData = new Uint8Array(1);
                        if (--countTextures <= 0) {
                            resolve();
                        }
                    }
                }
            }
        });
    }

    _bakeSingleUseGeometryPositions() {

        for (let j = 0, lenj = this.meshesList.length; j < lenj; j++) {

            const mesh = this.meshesList[j];

            const geometry = mesh.geometry;

            if (geometry.numInstances === 1) {

                const matrix = mesh.matrix;

                if (matrix && (!math.isIdentityMat4(matrix))) {

                    const positions = geometry.positions;

                    for (let i = 0, len = positions.length; i < len; i += 3) {

                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        tempVec4a[3] = 1;

                        math.transformPoint4(matrix, tempVec4a, tempVec4b);

                        positions[i + 0] = tempVec4b[0];
                        positions[i + 1] = tempVec4b[1];
                        positions[i + 2] = tempVec4b[2];
                    }
                }
            }
        }
    }

    _bakeAndOctEncodeNormals() {

        for (let i = 0, len = this.meshesList.length; i < len; i++) {

            const mesh = this.meshesList[i];
            const geometry = mesh.geometry;

            if (geometry.normals && !geometry.normalsOctEncoded) {

                geometry.normalsOctEncoded = new Int8Array(geometry.normals.length);

                if (geometry.numInstances > 1) {
                    geometryCompression.octEncodeNormals(geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);

                } else {
                    const modelNormalMatrix = math.inverseMat4(math.transposeMat4(mesh.matrix, tempMat4), tempMat4b);
                    geometryCompression.transformAndOctEncodeNormals(modelNormalMatrix, geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);
                }
            }
        }
    }

    _createEntityAABBs() {

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {

            const entity = this.entitiesList[i];
            const entityAABB = entity.aabb;
            const meshes = entity.meshes;

            math.collapseAABB3(entityAABB);

            for (let j = 0, lenj = meshes.length; j < lenj; j++) {

                const mesh = meshes[j];
                const geometry = mesh.geometry;
                const matrix = mesh.matrix;

                if (geometry.numInstances > 1) {

                    const positions = geometry.positions;
                    for (let i = 0, len = positions.length; i < len; i += 3) {
                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        tempVec4a[3] = 1;
                        math.transformPoint4(matrix, tempVec4a, tempVec4b);
                        math.expandAABB3Point3(entityAABB, tempVec4b);
                    }

                } else {

                    const positions = geometry.positions;
                    for (let i = 0, len = positions.length; i < len; i += 3) {
                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        math.expandAABB3Point3(entityAABB, tempVec4a);
                    }
                }
            }
        }
    }

    _createKDTree() {

        let aabb;
        if (this.modelAABB) {
            aabb = this.modelAABB; // Pre-known uber AABB
        } else {
            aabb = math.collapseAABB3();
            for (let i = 0, len = this.entitiesList.length; i < len; i++) {
                const entity = this.entitiesList[i];
                math.expandAABB3(aabb, entity.aabb);
            }
        }

        const rootKDNode = new KDNode(aabb);

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {
            const entity = this.entitiesList[i];
            this._insertEntityIntoKDTree(rootKDNode, entity);
        }

        return rootKDNode;
    }

    _insertEntityIntoKDTree(kdNode, entity) {

        const nodeAABB = kdNode.aabb;
        const entityAABB = entity.aabb;

        const nodeAABBDiag = math.getAABB3Diag(nodeAABB);

        if (nodeAABBDiag < this.minTileSize) {
            kdNode.entities = kdNode.entities || [];
            kdNode.entities.push(entity);
            math.expandAABB3(nodeAABB, entityAABB);
            return;
        }

        if (kdNode.left) {
            if (math.containsAABB3(kdNode.left.aabb, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.left, entity);
                return;
            }
        }

        if (kdNode.right) {
            if (math.containsAABB3(kdNode.right.aabb, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.right, entity);
                return;
            }
        }

        kdTreeDimLength[0] = nodeAABB[3] - nodeAABB[0];
        kdTreeDimLength[1] = nodeAABB[4] - nodeAABB[1];
        kdTreeDimLength[2] = nodeAABB[5] - nodeAABB[2];

        let dim = 0;

        if (kdTreeDimLength[1] > kdTreeDimLength[dim]) {
            dim = 1;
        }

        if (kdTreeDimLength[2] > kdTreeDimLength[dim]) {
            dim = 2;
        }

        if (!kdNode.left) {
            const aabbLeft = nodeAABB.slice();
            aabbLeft[dim + 3] = ((nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0);
            kdNode.left = new KDNode(aabbLeft);
            if (math.containsAABB3(aabbLeft, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.left, entity);
                return;
            }
        }

        if (!kdNode.right) {
            const aabbRight = nodeAABB.slice();
            aabbRight[dim] = ((nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0);
            kdNode.right = new KDNode(aabbRight);
            if (math.containsAABB3(aabbRight, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.right, entity);
                return;
            }
        }

        kdNode.entities = kdNode.entities || [];
        kdNode.entities.push(entity);

        math.expandAABB3(nodeAABB, entityAABB);
    }

    _createTilesFromKDTree(rootKDNode) {
        this._createTilesFromKDNode(rootKDNode);
    }

    _createTilesFromKDNode(kdNode) {
        if (kdNode.entities && kdNode.entities.length > 0) {
            this._createTileFromEntities(kdNode);
        }
        if (kdNode.left) {
            this._createTilesFromKDNode(kdNode.left);
        }
        if (kdNode.right) {
            this._createTilesFromKDNode(kdNode.right);
        }
    }

    /**
     * Creates a tile from the given entities.
     *
     * For each single-use {@link XKTGeometry}, this method centers {@link XKTGeometry#positions} to make them relative to the
     * tile's center, then quantizes the positions to unsigned 16-bit integers, relative to the tile's boundary.
     *
     * @param kdNode
     */
    _createTileFromEntities(kdNode) {

        const tileAABB = kdNode.aabb;
        const entities = kdNode.entities;

        const tileCenter = math.getAABB3Center(tileAABB);
        const tileCenterNeg = math.mulVec3Scalar(tileCenter, -1, math.vec3());

        const rtcAABB = math.AABB3(); // AABB centered at the RTC origin

        rtcAABB[0] = tileAABB[0] - tileCenter[0];
        rtcAABB[1] = tileAABB[1] - tileCenter[1];
        rtcAABB[2] = tileAABB[2] - tileCenter[2];
        rtcAABB[3] = tileAABB[3] - tileCenter[0];
        rtcAABB[4] = tileAABB[4] - tileCenter[1];
        rtcAABB[5] = tileAABB[5] - tileCenter[2];

        for (let i = 0; i < entities.length; i++) {

            const entity = entities [i];

            const meshes = entity.meshes;

            for (let j = 0, lenj = meshes.length; j < lenj; j++) {

                const mesh = meshes[j];
                const geometry = mesh.geometry;

                if (!geometry.reused) { // Batched geometry

                    const positions = geometry.positions;

                    // Center positions relative to their tile's World-space center

                    for (let k = 0, lenk = positions.length; k < lenk; k += 3) {

                        positions[k + 0] -= tileCenter[0];
                        positions[k + 1] -= tileCenter[1];
                        positions[k + 2] -= tileCenter[2];
                    }

                    // Quantize positions relative to tile's RTC-space boundary

                    geometryCompression.quantizePositions(positions, positions.length, rtcAABB, geometry.positionsQuantized);

                } else { // Instanced geometry

                    // Post-multiply a translation to the mesh's modeling matrix
                    // to center the entity's geometry instances to the tile RTC center

                    //////////////////////////////
                    // Why do we do this?
                    // Seems to break various models
                    /////////////////////////////////

                    math.translateMat4v(tileCenterNeg, mesh.matrix);
                }
            }

            entity.entityIndex = this.entitiesList.length;

            this.entitiesList.push(entity);
        }

        const tile = new XKTTile(tileAABB, entities);

        this.tilesList.push(tile);
    }

    _createReusedGeometriesDecodeMatrix() {

        const tempVec3a = math.vec3();
        const reusedGeometriesAABB = math.collapseAABB3(math.AABB3());
        let countReusedGeometries = 0;

        for (let geometryIndex = 0, numGeometries = this.geometriesList.length; geometryIndex < numGeometries; geometryIndex++) {

            const geometry = this.geometriesList [geometryIndex];

            if (geometry.reused) { // Instanced geometry

                const positions = geometry.positions;

                for (let i = 0, len = positions.length; i < len; i += 3) {

                    tempVec3a[0] = positions[i];
                    tempVec3a[1] = positions[i + 1];
                    tempVec3a[2] = positions[i + 2];

                    math.expandAABB3Point3(reusedGeometriesAABB, tempVec3a);
                }

                countReusedGeometries++;
            }
        }

        if (countReusedGeometries > 0) {

            geometryCompression.createPositionsDecodeMatrix(reusedGeometriesAABB, this.reusedGeometriesDecodeMatrix);

            for (let geometryIndex = 0, numGeometries = this.geometriesList.length; geometryIndex < numGeometries; geometryIndex++) {

                const geometry = this.geometriesList [geometryIndex];

                if (geometry.reused) {
                    geometryCompression.quantizePositions(geometry.positions, geometry.positions.length, reusedGeometriesAABB, geometry.positionsQuantized);
                }
            }

        } else {
            math.identityMat4(this.reusedGeometriesDecodeMatrix); // No need for this matrix, but we'll be tidy and set it to identity
        }
    }

    _flagSolidGeometries() {
        let maxNumPositions = 0;
        let maxNumIndices = 0;
        for (let i = 0, len = this.geometriesList.length; i < len; i++) {
            const geometry = this.geometriesList[i];
            if (geometry.primitiveType === "triangles") {
                if (geometry.positionsQuantized.length > maxNumPositions) {
                    maxNumPositions = geometry.positionsQuantized.length;
                }
                if (geometry.indices.length > maxNumIndices) {
                    maxNumIndices = geometry.indices.length;
                }
            }
        }
        let vertexIndexMapping = new Array(maxNumPositions / 3);
        let edges = new Array(maxNumIndices);
        for (let i = 0, len = this.geometriesList.length; i < len; i++) {
            const geometry = this.geometriesList[i];
            if (geometry.primitiveType === "triangles") {
                geometry.solid = isTriangleMeshSolid(geometry.indices, geometry.positionsQuantized, vertexIndexMapping, edges);
            }
        }
    }
}

export {
    XKTModel
}