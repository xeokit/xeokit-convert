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

const tempVec4a = math.vec4([0, 0, 0, 1]);
const tempVec4b = math.vec4([0, 0, 0, 1]);

const tempMat4 = math.mat4();
const tempMat4b = math.mat4();

const MIN_TILE_DIAG = 10000;

const kdTreeDimLength = new Float64Array(3);

/**
 * A document model that represents the contents of an .XKT file.
 *
 * * An XKTModel contains {@link XKTTile}s, which spatially subdivide the model into axis-aligned, box-shaped regions.
 * * Each {@link XKTTile} contains {@link XKTEntity}s, which represent the objects within its region.
 * * Each {@link XKTEntity} has {@link XKTMesh}s, which each have a {@link XKTGeometry}. Each {@link XKTGeometry} can be shared by multiple {@link XKTMesh}s.
 * * Import models into an XKTModel using {@link parseGLTFIntoXKTModel}, {@link parseIFCIntoXKTModel}, {@link parse3DXMLIntoXKTModel}, {@link parseCityJSONIntoXKTModel} etc.
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
        this.xktVersion =  XKT_INFO.xktVersion;

        /**
         *
         * @type {Number|number}
         */
        this.edgeThreshold = cfg.edgeThreshold || 10;

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
            throw "Parameters expected: params";
        }

        if (params.propertySetId === null || params.propertySetId === undefined) {
            throw "Parameter expected: params.propertySetId";
        }

        if (params.properties === null || params.properties === undefined) {
            throw "Parameter expected: params.properties";
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
            throw "Parameters expected: params";
        }

        if (params.metaObjectId === null || params.metaObjectId === undefined) {
            throw "Parameter expected: params.metaObjectId";
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
     * Creates an {@link XKTGeometry} within this XKTModel.
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
     * @param {Uint32Array} [params.indices] Indices for the {@link XKTGeometry}. Required for triangles and lines primitives. Ignored for points.
     * @param {Number} [params.edgeThreshold=10]
     * @returns {XKTGeometry} The new {@link XKTGeometry}.
     */
    createGeometry(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "Parameter expected: params.geometryId";
        }

        if (!params.primitiveType) {
            throw "Parameter expected: params.primitiveType";
        }

        if (!params.positions) {
            throw "Parameter expected: params.positions";
        }

        const triangles = params.primitiveType === "triangles";
        const points = params.primitiveType === "points";
        const lines = params.primitiveType === "lines";

        if (!triangles && !points && !lines) {
            throw "Unsupported value for params.primitiveType: " + params.primitiveType + "' - supported values are 'triangles', 'points' and 'lines'";
        }

        if (triangles) {
            if (!params.indices) {
                throw "Parameter expected for 'triangles' primitive: params.indices";
            }
        }

        if (points) {
            if (!params.colors && !params.colorsCompressed) {
                throw "Parameter expected for 'points' primitive: params.colors or params.colorsCompressed";
            }
        }

        if (lines) {
            if (!params.indices) {
                throw "Parameter expected for 'lines' primitive: params.indices";
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
        const positions = new Float64Array(params.positions); // May modify in #finalize

        const xktGeometryCfg = {
            geometryId: geometryId,
            geometryIndex: this.geometriesList.length,
            primitiveType: primitiveType,
            positions: positions
        }

        if (triangles) {
            if (params.normals) {
                xktGeometryCfg.normals = new Float32Array(params.normals);
            }
            xktGeometryCfg.indices = params.indices;
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

            if (!params.normals) {

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

    /**
     * Creates an {@link XKTMesh} within this XKTModel.
     *
     * An {@link XKTMesh} can be owned by one {@link XKTEntity}, which can own multiple {@link XKTMesh}es.
     *
     * @param {*} params Method parameters.
     * @param {Number} params.meshId Unique ID for the {@link XKTMesh}.
     * @param {Number} params.geometryId ID of an existing {@link XKTGeometry} in {@link XKTModel#geometries}.
     * @param {Uint8Array} params.color RGB color for the {@link XKTMesh}, with each color component in range [0..1].
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
            throw "Parameter expected: params.meshId";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "Parameter expected: params.geometryId";
        }

        if (this.finalized) {
            throw "XKTModel has been finalized, can't add more meshes";
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
            meshIndex: meshIndex,
            matrix: matrix,
            geometry: geometry,
            color: params.color,
            metallic: params.metallic,
            roughness: params.roughness,
            opacity: params.opacity
        });

        this.meshes[mesh.meshId] = mesh;
        this.meshesList.push(mesh);

        return mesh;
    }

    /**
     * Creates an {@link XKTEntity} within this XKTModel.
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
            throw "Parameters expected: params";
        }

        if (params.entityId === null || params.entityId === undefined) {
            throw "Parameter expected: params.entityId";
        }

        if (!params.meshIds) {
            throw "Parameter expected: params.meshIds";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more entities");
            return;
        }

        if (params.meshIds.length === 0) {
            console.warn("XKTEntity has no meshes - won't create: " + params.entityId);
            return;
        }

        if (this.entities[params.entityId]) {
            console.error("XKTEntity already exists with this ID: " + params.entityId);
            return;
        }

        const entityId = params.entityId;
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
    finalize() {

        if (this.finalized) {
            console.log("XKTModel already finalized");
            return;
        }

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

        const aabb = math.collapseAABB3();

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {
            const entity = this.entitiesList[i];
            math.expandAABB3(aabb, entity.aabb);
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

        if (nodeAABBDiag < MIN_TILE_DIAG) {
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
            this._createTileFromEntities(kdNode.entities);
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
     * @param entities
     */
    _createTileFromEntities(entities) {

        const tileAABB = math.AABB3(); // A tighter World-space AABB around the entities
        math.collapseAABB3(tileAABB);

        for (let i = 0; i < entities.length; i++) {
            const entity = entities [i];
            math.expandAABB3(tileAABB, entity.aabb);
        }

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

                if (!geometry.reused) {

                    const positions = geometry.positions;

                    // Center positions relative to their tile's World-space center

                    for (let k = 0, lenk = positions.length; k < lenk; k += 3) {

                        positions[k + 0] -= tileCenter[0];
                        positions[k + 1] -= tileCenter[1];
                        positions[k + 2] -= tileCenter[2];
                    }

                    // Quantize positions relative to tile's RTC-space boundary

                    geometryCompression.quantizePositions(positions, positions.length, rtcAABB, geometry.positionsQuantized);

                } else {

                    // Post-multiply a translation to the mesh's modeling matrix
                    // to center the entity's geometry instances to the tile RTC center

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

            if (geometry.reused) {

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
        let vertexIndexMapping = new Array (maxNumPositions / 3);
        let edges = new Array (maxNumIndices);
        for (let i = 0, len = this.geometriesList.length; i < len; i++) {
            const geometry = this.geometriesList[i];
            if (geometry.primitiveType === "triangles") {
                geometry.solid = isTriangleMeshSolid(geometry.indices, geometry.positionsQuantized, vertexIndexMapping, edges);
            }
        }
    }
}

export {XKTModel};