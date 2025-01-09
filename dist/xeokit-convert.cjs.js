(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["convert2xkt"] = factory();
	else
		root["convert2xkt"] = factory();
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/XKTModel/KDNode.js":
/*!********************************!*\
  !*** ./src/XKTModel/KDNode.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KDNode: () => (/* binding */ KDNode)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * A kd-Tree node, used internally by {@link XKTModel}.
 *
 * @private
 */
var KDNode = /*#__PURE__*/_createClass(
/**
 * Create a KDNode with an axis-aligned 3D World-space boundary.
 */
function KDNode(aabb) {
  _classCallCheck(this, KDNode);
  /**
   * The axis-aligned 3D World-space boundary of this KDNode.
   *
   * @type {Float64Array}
   */
  this.aabb = aabb;

  /**
   * The {@link XKTEntity}s within this KDNode.
   */
  this.entities = null;

  /**
   * The left child KDNode.
   */
  this.left = null;

  /**
   * The right child KDNode.
   */
  this.right = null;
});


/***/ }),

/***/ "./src/XKTModel/XKTEntity.js":
/*!***********************************!*\
  !*** ./src/XKTModel/XKTEntity.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTEntity: () => (/* binding */ XKTEntity)
/* harmony export */ });
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


/**
 * An object within an {@link XKTModel}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTModel#entities} and {@link XKTModel#entitiesList}
 * * Has one or more {@link XKTMesh}s, each having an {@link XKTGeometry}
 *
 * @class XKTEntity
 */
var XKTEntity = /*#__PURE__*/_createClass(
/**
 * @private
 * @param entityId
 * @param meshes
 */
function XKTEntity(entityId, meshes) {
  _classCallCheck(this, XKTEntity);
  /**
   * Unique ID of this ````XKTEntity```` in {@link XKTModel#entities}.
   *
   * For a BIM model, this will be an IFC product ID.
   *
   * We can also use {@link XKTModel#createMetaObject} to create an {@link XKTMetaObject} to specify metadata for
   * this ````XKTEntity````. To associate the {@link XKTMetaObject} with our {@link XKTEntity}, we give
   * {@link XKTMetaObject#metaObjectId} the same value as {@link XKTEntity#entityId}.
   *
   * @type {String}
   */
  this.entityId = entityId;

  /**
   * Index of this ````XKTEntity```` in {@link XKTModel#entitiesList}.
   *
   * Set by {@link XKTModel#finalize}.
   *
   * @type {Number}
   */
  this.entityIndex = null;

  /**
   * A list of {@link XKTMesh}s that indicate which {@link XKTGeometry}s are used by this Entity.
   *
   * @type {XKTMesh[]}
   */
  this.meshes = meshes;

  /**
   * World-space axis-aligned bounding box (AABB) that encloses the {@link XKTGeometry#positions} of
   * the {@link XKTGeometry}s that are used by this ````XKTEntity````.
   *
   * Set by {@link XKTModel#finalize}.
   *
   * @type {Float32Array}
   */
  this.aabb = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.AABB3();

  /**
   * Indicates if this ````XKTEntity```` shares {@link XKTGeometry}s with other {@link XKTEntity}'s.
   *
   * Set by {@link XKTModel#finalize}.
   *
   * Note that when an ````XKTEntity```` shares ````XKTGeometrys````, it shares **all** of its ````XKTGeometrys````. An ````XKTEntity````
   * never shares only some of its ````XKTGeometrys```` - it always shares either the whole set or none at all.
   *
   * @type {Boolean}
   */
  this.hasReusedGeometries = false;
});


/***/ }),

/***/ "./src/XKTModel/XKTGeometry.js":
/*!*************************************!*\
  !*** ./src/XKTModel/XKTGeometry.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTGeometry: () => (/* binding */ XKTGeometry)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * An element of reusable geometry within an {@link XKTModel}.
 *
 * * Created by {@link XKTModel#createGeometry}
 * * Stored in {@link XKTModel#geometries} and {@link XKTModel#geometriesList}
 * * Referenced by {@link XKTMesh}s, which belong to {@link XKTEntity}s
 *
 * @class XKTGeometry
 */
var XKTGeometry = /*#__PURE__*/function () {
  /**
   * @private
   * @param {*} cfg Configuration for the XKTGeometry.
   * @param {Number} cfg.geometryId Unique ID of the geometry in {@link XKTModel#geometries}.
   * @param {String} cfg.primitiveType Type of this geometry - "triangles", "points" or "lines" so far.
   * @param {Number} cfg.geometryIndex Index of this XKTGeometry in {@link XKTModel#geometriesList}.
   * @param {Float64Array} cfg.positions Non-quantized 3D vertex positions.
   * @param {Float32Array} cfg.normals Non-compressed vertex normals.
   * @param {Uint8Array} cfg.colorsCompressed Unsigned 8-bit integer RGBA vertex colors.
   * @param {Float32Array} cfg.uvs Non-compressed vertex UV coordinates.
   * @param {Uint32Array} cfg.indices Indices to organize the vertex positions and normals into triangles.
   * @param {Uint32Array} cfg.edgeIndices Indices to organize the vertex positions into edges.
   */
  function XKTGeometry(cfg) {
    _classCallCheck(this, XKTGeometry);
    /**
     * Unique ID of this XKTGeometry in {@link XKTModel#geometries}.
     *
     * @type {Number}
     */
    this.geometryId = cfg.geometryId;

    /**
     * The type of primitive - "triangles" | "points" | "lines".
     *
     * @type {String}
     */
    this.primitiveType = cfg.primitiveType;

    /**
     * Index of this XKTGeometry in {@link XKTModel#geometriesList}.
     *
     * @type {Number}
     */
    this.geometryIndex = cfg.geometryIndex;

    /**
     * The number of {@link XKTMesh}s that reference this XKTGeometry.
     *
     * @type {Number}
     */
    this.numInstances = 0;

    /**
     * Non-quantized 3D vertex positions.
     *
     * Defined for all primitive types.
     *
     * @type {Float64Array}
     */
    this.positions = cfg.positions;

    /**
     * Quantized vertex positions.
     *
     * Defined for all primitive types.
     *
     * This array is later created from {@link XKTGeometry#positions} by {@link XKTModel#finalize}.
     *
     * @type {Uint16Array}
     */
    this.positionsQuantized = new Uint16Array(cfg.positions.length);

    /**
     * Non-compressed 3D vertex normals.
     *
     * Defined only for triangle primitives. Can be null if we want xeokit to auto-generate them. Ignored for points and lines.
     *
     * @type {Float32Array}
     */
    this.normals = cfg.normals;

    /**
     * Compressed vertex normals.
     *
     * Defined only for triangle primitives. Ignored for points and lines.
     *
     * This array is later created from {@link XKTGeometry#normals} by {@link XKTModel#finalize}.
     *
     * Will be null if {@link XKTGeometry#normals} is also null.
     *
     * @type {Int8Array}
     */
    this.normalsOctEncoded = null;

    /**
     * Compressed RGBA vertex colors.
     *
     * Defined only for point primitives. Ignored for triangles and lines.
     *
     * @type {Uint8Array}
     */
    this.colorsCompressed = cfg.colorsCompressed;

    /**
     * Non-compressed vertex UVs.
     *
     * @type {Float32Array}
     */
    this.uvs = cfg.uvs;

    /**
     * Compressed vertex UVs.
     *
     * @type {Uint16Array}
     */
    this.uvsCompressed = cfg.uvsCompressed;

    /**
     * Indices that organize the vertex positions and normals as triangles.
     *
     * Defined only for triangle and lines primitives. Ignored for points.
     *
     * @type {Uint32Array}
     */
    this.indices = cfg.indices;

    /**
     * Indices that organize the vertex positions as edges.
     *
     * Defined only for triangle primitives. Ignored for points and lines.
     *
     * @type {Uint32Array}
     */
    this.edgeIndices = cfg.edgeIndices;

    /**
     * When {@link XKTGeometry#primitiveType} is "triangles", this is ````true```` when this geometry is a watertight mesh.
     *
     * Defined only for triangle primitives. Ignored for points and lines.
     *
     * Set by {@link XKTModel#finalize}.
     *
     * @type {boolean}
     */
    this.solid = false;
  }

  /**
   * Convenience property that is ````true```` when {@link XKTGeometry#numInstances} is greater that one.
   * @returns {boolean}
   */
  _createClass(XKTGeometry, [{
    key: "reused",
    get: function get() {
      return this.numInstances > 1;
    }
  }]);
  return XKTGeometry;
}();


/***/ }),

/***/ "./src/XKTModel/XKTMesh.js":
/*!*********************************!*\
  !*** ./src/XKTModel/XKTMesh.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTMesh: () => (/* binding */ XKTMesh)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * Represents the usage of a {@link XKTGeometry} by an {@link XKTEntity}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTEntity#meshes} and {@link XKTModel#meshesList}
 * * Has an {@link XKTGeometry}, and an optional {@link XKTTextureSet}, both of which it can share with other {@link XKTMesh}es
 * * Has {@link XKTMesh#color}, {@link XKTMesh#opacity}, {@link XKTMesh#metallic} and {@link XKTMesh#roughness} PBR attributes
 * @class XKTMesh
 */
var XKTMesh = /*#__PURE__*/_createClass(
/**
 * @private
 */
function XKTMesh(cfg) {
  _classCallCheck(this, XKTMesh);
  /**
   * Unique ID of this XKTMesh in {@link XKTModel#meshes}.
   *
   * @type {Number}
   */
  this.meshId = cfg.meshId;

  /**
   * Index of this XKTMesh in {@link XKTModel#meshesList};
   *
   * @type {Number}
   */
  this.meshIndex = cfg.meshIndex;

  /**
   * The 4x4 modeling transform matrix.
   *
   * Transform is relative to the center of the {@link XKTTile} that contains this XKTMesh's {@link XKTEntity},
   * which is given in {@link XKTMesh#entity}.
   *
   * When the ````XKTEntity```` shares its {@link XKTGeometry}s with other ````XKTEntity````s, this matrix is used
   * to transform this XKTMesh's XKTGeometry into World-space. When this XKTMesh does not share its ````XKTGeometry````,
   * then this matrix is ignored.
   *
   * @type {Number[]}
   */
  this.matrix = cfg.matrix;

  /**
   * The instanced {@link XKTGeometry}.
   *
   * @type {XKTGeometry}
   */
  this.geometry = cfg.geometry;

  /**
   * RGB color of this XKTMesh.
   *
   * @type {Float32Array}
   */
  this.color = cfg.color || new Float32Array([1, 1, 1]);

  /**
   * PBR metallness of this XKTMesh.
   *
   * @type {Number}
   */
  this.metallic = cfg.metallic !== null && cfg.metallic !== undefined ? cfg.metallic : 0;

  /**
   * PBR roughness of this XKTMesh.
   * The {@link XKTTextureSet} that defines the appearance of this XKTMesh.
   *
   * @type {Number}
   * @type {XKTTextureSet}
   */
  this.roughness = cfg.roughness !== null && cfg.roughness !== undefined ? cfg.roughness : 1;

  /**
   * Opacity of this XKTMesh.
   *
   * @type {Number}
   */
  this.opacity = cfg.opacity !== undefined && cfg.opacity !== null ? cfg.opacity : 1.0;

  /**
   * The {@link XKTTextureSet} that defines the appearance of this XKTMesh.
   *
   * @type {XKTTextureSet}
   */
  this.textureSet = cfg.textureSet;

  /**
   * The owner {@link XKTEntity}.
   *
   * Set by {@link XKTModel#createEntity}.
   *
   * @type {XKTEntity}
   */
  this.entity = null; // Set after instantiation, when the Entity is known
});



/***/ }),

/***/ "./src/XKTModel/XKTMetaObject.js":
/*!***************************************!*\
  !*** ./src/XKTModel/XKTMetaObject.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTMetaObject: () => (/* binding */ XKTMetaObject)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * A meta object within an {@link XKTModel}.
 *
 * These are plugged together into a parent-child hierarchy to represent structural
 * metadata for the {@link XKTModel}.
 *
 * The leaf XKTMetaObjects are usually associated with
 * an {@link XKTEntity}, which they do so by sharing the same ID,
 * ie. where {@link XKTMetaObject#metaObjectId} == {@link XKTEntity#entityId}.
 *
 * * Created by {@link XKTModel#createMetaObject}
 * * Stored in {@link XKTModel#metaObjects} and {@link XKTModel#metaObjectsList}
 * * Has an ID, a type, and a human-readable name
 * * May have a parent {@link XKTMetaObject}
 * * When no children, is usually associated with an {@link XKTEntity}
 *
 * @class XKTMetaObject
 */
var XKTMetaObject = /*#__PURE__*/_createClass(
/**
 * @private
 * @param metaObjectId
 * @param propertySetIds
 * @param metaObjectType
 * @param metaObjectName
 * @param parentMetaObjectId
 */
function XKTMetaObject(metaObjectId, propertySetIds, metaObjectType, metaObjectName, parentMetaObjectId) {
  _classCallCheck(this, XKTMetaObject);
  /**
   * Unique ID of this ````XKTMetaObject```` in {@link XKTModel#metaObjects}.
   *
   * For a BIM model, this will be an IFC product ID.
   *
   * If this is a leaf XKTMetaObject, where it is not a parent to any other XKTMetaObject,
   * then this will be equal to the ID of an {@link XKTEntity} in {@link XKTModel#entities},
   * ie. where {@link XKTMetaObject#metaObjectId} == {@link XKTEntity#entityId}.
   *
   * @type {String}
   */
  this.metaObjectId = metaObjectId;

  /**
   * Unique ID of one or more property sets that contains additional metadata about this
   * {@link XKTMetaObject}. The property sets can be stored in an external system, or
   * within the {@link XKTModel}, as {@link XKTPropertySet}s within {@link XKTModel#propertySets}.
   *
   * @type {String[]}
   */
  this.propertySetIds = propertySetIds;

  /**
   * Indicates the XKTMetaObject meta object type.
   *
   * This defaults to "default".
   *
   * @type {string}
   */
  this.metaObjectType = metaObjectType;

  /**
   * Indicates the XKTMetaObject meta object name.
   *
   * This defaults to {@link XKTMetaObject#metaObjectId}.
   *
   * @type {string}
   */
  this.metaObjectName = metaObjectName;

  /**
   * The parent XKTMetaObject, if any.
   *
   * Will be null if there is no parent.
   *
   * @type {String}
   */
  this.parentMetaObjectId = parentMetaObjectId;
});


/***/ }),

/***/ "./src/XKTModel/XKTModel.js":
/*!**********************************!*\
  !*** ./src/XKTModel/XKTModel.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTModel: () => (/* binding */ XKTModel)
/* harmony export */ });
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");
/* harmony import */ var _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/geometryCompression.js */ "./src/XKTModel/lib/geometryCompression.js");
/* harmony import */ var _lib_buildEdgeIndices_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/buildEdgeIndices.js */ "./src/XKTModel/lib/buildEdgeIndices.js");
/* harmony import */ var _lib_isTriangleMeshSolid_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/isTriangleMeshSolid.js */ "./src/XKTModel/lib/isTriangleMeshSolid.js");
/* harmony import */ var _XKTMesh_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./XKTMesh.js */ "./src/XKTModel/XKTMesh.js");
/* harmony import */ var _XKTGeometry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./XKTGeometry.js */ "./src/XKTModel/XKTGeometry.js");
/* harmony import */ var _XKTEntity_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./XKTEntity.js */ "./src/XKTModel/XKTEntity.js");
/* harmony import */ var _XKTTile_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./XKTTile.js */ "./src/XKTModel/XKTTile.js");
/* harmony import */ var _KDNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./KDNode.js */ "./src/XKTModel/KDNode.js");
/* harmony import */ var _XKTMetaObject_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./XKTMetaObject.js */ "./src/XKTModel/XKTMetaObject.js");
/* harmony import */ var _XKTPropertySet_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./XKTPropertySet.js */ "./src/XKTModel/XKTPropertySet.js");
/* harmony import */ var _lib_mergeVertices_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../lib/mergeVertices.js */ "./src/lib/mergeVertices.js");
/* harmony import */ var _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../XKT_INFO.js */ "./src/XKT_INFO.js");
/* harmony import */ var _XKTTexture__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./XKTTexture */ "./src/XKTModel/XKTTexture.js");
/* harmony import */ var _XKTTextureSet__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./XKTTextureSet */ "./src/XKTModel/XKTTextureSet.js");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @loaders.gl/core */ "@loaders.gl/core");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_core__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _loaders_gl_textures__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @loaders.gl/textures */ "@loaders.gl/textures");
/* harmony import */ var _loaders_gl_textures__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_textures__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _loaders_gl_images__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @loaders.gl/images */ "@loaders.gl/images");
/* harmony import */ var _loaders_gl_images__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_images__WEBPACK_IMPORTED_MODULE_17__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


















var tempVec4a = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec4([0, 0, 0, 1]);
var tempVec4b = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec4([0, 0, 0, 1]);
var tempMat4 = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mat4();
var tempMat4b = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mat4();
var kdTreeDimLength = new Float64Array(3);

// XKT texture types

var COLOR_TEXTURE = 0;
var METALLIC_ROUGHNESS_TEXTURE = 1;
var NORMALS_TEXTURE = 2;
var EMISSIVE_TEXTURE = 3;
var OCCLUSION_TEXTURE = 4;

// KTX2 encoding options for each texture type

var TEXTURE_ENCODING_OPTIONS = {};
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
var XKTModel = /*#__PURE__*/function () {
  /**
   * Constructs a new XKTModel.
   *
   * @param {*} [cfg] Configuration
   * @param {Number} [cfg.edgeThreshold=10]
   * @param {Number} [cfg.minTileSize=500]
   */
  function XKTModel() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, XKTModel);
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
    this.xktVersion = _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_12__.XKT_INFO.xktVersion;

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
    this.aabb = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.AABB3();

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
  _createClass(XKTModel, [{
    key: "createPropertySet",
    value: function createPropertySet(params) {
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
      var propertySetId = params.propertySetId;
      var propertySetType = params.propertySetType || "Default";
      var propertySetName = params.propertySetName || params.propertySetId;
      var properties = params.properties || [];
      var propertySet = new _XKTPropertySet_js__WEBPACK_IMPORTED_MODULE_10__.XKTPropertySet(propertySetId, propertySetType, propertySetName, properties);
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
  }, {
    key: "createMetaObject",
    value: function createMetaObject(params) {
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
      var metaObjectId = params.metaObjectId;
      var propertySetIds = params.propertySetIds;
      var metaObjectType = params.metaObjectType || "Default";
      var metaObjectName = params.metaObjectName || params.metaObjectId;
      var parentMetaObjectId = params.parentMetaObjectId;
      var metaObject = new _XKTMetaObject_js__WEBPACK_IMPORTED_MODULE_9__.XKTMetaObject(metaObjectId, propertySetIds, metaObjectType, metaObjectName, parentMetaObjectId);
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
  }, {
    key: "createTexture",
    value: function createTexture(params) {
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
        var fileExt = params.src.split('.').pop();
        if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
          console.error("XKTModel does not support image files with extension '".concat(fileExt, "' - won't create texture '").concat(params.textureId));
          return;
        }
      }
      var textureId = params.textureId;
      var texture = new _XKTTexture__WEBPACK_IMPORTED_MODULE_13__.XKTTexture({
        textureId: textureId,
        imageData: params.imageData,
        mediaType: params.mediaType,
        minFilter: params.minFilter,
        magFilter: params.magFilter,
        wrapS: params.wrapS,
        wrapT: params.wrapT,
        wrapR: params.wrapR,
        width: params.width,
        height: params.height,
        compressed: params.compressed !== false,
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
  }, {
    key: "createTextureSet",
    value: function createTextureSet(params) {
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
      var colorTexture;
      if (params.colorTextureId !== undefined && params.colorTextureId !== null) {
        colorTexture = this.textures[params.colorTextureId];
        if (!colorTexture) {
          console.error("Texture not found: ".concat(params.colorTextureId, " - ensure that you create it first with createTexture()"));
          return;
        }
        colorTexture.channel = COLOR_TEXTURE;
      }
      var metallicRoughnessTexture;
      if (params.metallicRoughnessTextureId !== undefined && params.metallicRoughnessTextureId !== null) {
        metallicRoughnessTexture = this.textures[params.metallicRoughnessTextureId];
        if (!metallicRoughnessTexture) {
          console.error("Texture not found: ".concat(params.metallicRoughnessTextureId, " - ensure that you create it first with createTexture()"));
          return;
        }
        metallicRoughnessTexture.channel = METALLIC_ROUGHNESS_TEXTURE;
      }
      var normalsTexture;
      if (params.normalsTextureId !== undefined && params.normalsTextureId !== null) {
        normalsTexture = this.textures[params.normalsTextureId];
        if (!normalsTexture) {
          console.error("Texture not found: ".concat(params.normalsTextureId, " - ensure that you create it first with createTexture()"));
          return;
        }
        normalsTexture.channel = NORMALS_TEXTURE;
      }
      var emissiveTexture;
      if (params.emissiveTextureId !== undefined && params.emissiveTextureId !== null) {
        emissiveTexture = this.textures[params.emissiveTextureId];
        if (!emissiveTexture) {
          console.error("Texture not found: ".concat(params.emissiveTextureId, " - ensure that you create it first with createTexture()"));
          return;
        }
        emissiveTexture.channel = EMISSIVE_TEXTURE;
      }
      var occlusionTexture;
      if (params.occlusionTextureId !== undefined && params.occlusionTextureId !== null) {
        occlusionTexture = this.textures[params.occlusionTextureId];
        if (!occlusionTexture) {
          console.error("Texture not found: ".concat(params.occlusionTextureId, " - ensure that you create it first with createTexture()"));
          return;
        }
        occlusionTexture.channel = OCCLUSION_TEXTURE;
      }
      var textureSet = new _XKTTextureSet__WEBPACK_IMPORTED_MODULE_14__.XKTTextureSet({
        textureSetId: params.textureSetId,
        textureSetIndex: this.textureSetsList.length,
        colorTexture: colorTexture,
        metallicRoughnessTexture: metallicRoughnessTexture,
        normalsTexture: normalsTexture,
        emissiveTexture: emissiveTexture,
        occlusionTexture: occlusionTexture
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
  }, {
    key: "createGeometry",
    value: function createGeometry(params) {
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
      var triangles = params.primitiveType === "triangles";
      var points = params.primitiveType === "points";
      var lines = params.primitiveType === "lines";
      var line_strip = params.primitiveType === "line-strip";
      var line_loop = params.primitiveType === "line-loop";
      var triangle_strip = params.primitiveType === "triangle-strip";
      var triangle_fan = params.primitiveType === "triangle-fan";
      if (!triangles && !points && !lines && !line_strip && !line_loop) {
        throw "[XKTModel.createGeometry] Unsupported value for params.primitiveType: " + params.primitiveType + "' - supported values are 'triangles', 'points', 'lines', 'line-strip', 'triangle-strip' and 'triangle-fan";
      }
      if (triangles) {
        if (!params.indices) {
          params.indices = this._createDefaultIndices();
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
      var geometryId = params.geometryId;
      var primitiveType = params.primitiveType;
      var positions = new Float64Array(params.positions); // May modify in #finalize

      var xktGeometryCfg = {
        geometryId: geometryId,
        geometryIndex: this.geometriesList.length,
        primitiveType: primitiveType,
        positions: positions,
        uvs: params.uvs || params.uv
      };
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
          var colors = params.colors;
          var colorsCompressed = new Uint8Array(colors.length);
          for (var i = 0, len = colors.length; i < len; i++) {
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

          var mergedPositions = [];
          var mergedIndices = [];
          (0,_lib_mergeVertices_js__WEBPACK_IMPORTED_MODULE_11__.mergeVertices)(xktGeometryCfg.positions, xktGeometryCfg.indices, mergedPositions, mergedIndices);
          xktGeometryCfg.positions = new Float64Array(mergedPositions);
          xktGeometryCfg.indices = mergedIndices;
        }
        var hasPositions = !xktGeometryCfg.positions || xktGeometryCfg.positions.length === 0;
        var hasIndices = !xktGeometryCfg.indices || xktGeometryCfg.indices.length === 0;
        if (!hasIndices || !hasPositions) {
          if (!hasIndices) {
            // console.error("XKTGeometry with triangles has no indices - won't make edge indices");
          } else {
            // console.error("XKTGeometry with triangles has no positions - won't make edge indices")
          }
        } else {
          xktGeometryCfg.edgeIndices = (0,_lib_buildEdgeIndices_js__WEBPACK_IMPORTED_MODULE_2__.buildEdgeIndices)(xktGeometryCfg.positions, xktGeometryCfg.indices, null, params.edgeThreshold || this.edgeThreshold || 10);
        }
      }
      var geometry = new _XKTGeometry_js__WEBPACK_IMPORTED_MODULE_5__.XKTGeometry(xktGeometryCfg);
      this.geometries[geometryId] = geometry;
      this.geometriesList.push(geometry);
      return geometry;
    }
  }, {
    key: "_createDefaultIndices",
    value: function _createDefaultIndices(numIndices) {
      var indices = [];
      for (var i = 0; i < numIndices; i++) {
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
  }, {
    key: "createMesh",
    value: function createMesh(params) {
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
      var geometry = this.geometries[params.geometryId];
      if (!geometry) {
        console.error("XKTGeometry not found: " + params.geometryId);
        return;
      }
      geometry.numInstances++;
      var textureSet = null;
      if (params.textureSetId) {
        textureSet = this.textureSets[params.textureSetId];
        if (!textureSet) {
          console.error("XKTTextureSet not found: " + params.textureSetId);
          return;
        }
        textureSet.numInstances++;
      }
      var matrix = params.matrix;
      if (!matrix) {
        var position = params.position;
        var scale = params.scale;
        var rotation = params.rotation;
        if (position || scale || rotation) {
          matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityMat4();
          var quaternion = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.eulerToQuaternion(rotation || [0, 0, 0], "XYZ", _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityQuaternion());
          _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.composeMat4(position || [0, 0, 0], quaternion, scale || [1, 1, 1], matrix);
        } else {
          matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityMat4();
        }
      }
      var meshIndex = this.meshesList.length;
      var mesh = new _XKTMesh_js__WEBPACK_IMPORTED_MODULE_4__.XKTMesh({
        meshId: params.meshId,
        meshIndex: meshIndex,
        matrix: matrix,
        geometry: geometry,
        color: params.color,
        metallic: params.metallic,
        roughness: params.roughness,
        opacity: params.opacity,
        textureSet: textureSet
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
  }, {
    key: "createEntity",
    value: function createEntity(params) {
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
      var entityId = params.entityId;
      if (this.entities[entityId]) {
        while (this.entities[entityId]) {
          entityId = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.createUUID();
        }
        console.error("XKTEntity already exists with this ID: " + params.entityId + " - substituting random ID instead: " + entityId);
      }
      var meshIds = params.meshIds;
      var meshes = [];
      for (var meshIdIdx = 0, meshIdLen = meshIds.length; meshIdIdx < meshIdLen; meshIdIdx++) {
        var meshId = meshIds[meshIdIdx];
        var mesh = this.meshes[meshId];
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
      var entity = new _XKTEntity_js__WEBPACK_IMPORTED_MODULE_6__.XKTEntity(entityId, meshes);
      for (var i = 0, len = meshes.length; i < len; i++) {
        var _mesh = meshes[i];
        _mesh.entity = entity;
      }
      this.entities[entityId] = entity;
      this.entitiesList.push(entity);
      return entity;
    }

    /**
     * Creates a default {@link XKTMetaObject} for each {@link XKTEntity} that does not already have one.
     */
  }, {
    key: "createDefaultMetaObjects",
    value: function createDefaultMetaObjects() {
      for (var i = 0, len = this.entitiesList.length; i < len; i++) {
        var entity = this.entitiesList[i];
        var metaObjectId = entity.entityId;
        var metaObject = this.metaObjects[metaObjectId];
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
  }, {
    key: "finalize",
    value: function () {
      var _finalize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var rootKDNode;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this.finalized) {
                _context.next = 3;
                break;
              }
              console.log("XKTModel already finalized");
              return _context.abrupt("return");
            case 3:
              this._removeUnusedTextures();
              _context.next = 6;
              return this._compressTextures();
            case 6:
              this._bakeSingleUseGeometryPositions();
              this._bakeAndOctEncodeNormals();
              this._createEntityAABBs();
              rootKDNode = this._createKDTree();
              this.entitiesList = [];
              this._createTilesFromKDTree(rootKDNode);
              this._createReusedGeometriesDecodeMatrix();
              this._flagSolidGeometries();
              this.aabb.set(rootKDNode.aabb);
              this.finalized = true;
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function finalize() {
        return _finalize.apply(this, arguments);
      }
      return finalize;
    }()
  }, {
    key: "_removeUnusedTextures",
    value: function _removeUnusedTextures() {
      var texturesList = [];
      var textures = {};
      for (var i = 0, leni = this.texturesList.length; i < leni; i++) {
        var texture = this.texturesList[i];
        if (texture.channel !== null) {
          texture.textureIndex = texturesList.length;
          texturesList.push(texture);
          textures[texture.textureId] = texture;
        }
      }
      this.texturesList = texturesList;
      this.textures = textures;
    }
  }, {
    key: "_compressTextures",
    value: function _compressTextures() {
      var _this = this;
      var countTextures = this.texturesList.length;
      return new Promise(function (resolve) {
        if (countTextures === 0) {
          resolve();
          return;
        }
        var _loop = function _loop() {
          var texture = _this.texturesList[i];
          var encodingOptions = TEXTURE_ENCODING_OPTIONS[texture.channel] || {};
          if (texture.src) {
            // XKTTexture created with XKTModel#createTexture({ src: ... })

            var src = texture.src;
            var fileExt = src.split('.').pop();
            switch (fileExt) {
              case "jpeg":
              case "jpg":
              case "png":
                (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_15__.load)(src, _loaders_gl_images__WEBPACK_IMPORTED_MODULE_17__.ImageLoader, {
                  image: {
                    type: "data"
                  }
                }).then(function (imageData) {
                  if (texture.compressed) {
                    (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_15__.encode)(imageData, _loaders_gl_textures__WEBPACK_IMPORTED_MODULE_16__.KTX2BasisWriter, encodingOptions).then(function (encodedData) {
                      var encodedImageData = new Uint8Array(encodedData);
                      texture.imageData = encodedImageData;
                      if (--countTextures <= 0) {
                        resolve();
                      }
                    })["catch"](function (err) {
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
                })["catch"](function (err) {
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
              (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_15__.encode)(texture.imageData, _loaders_gl_textures__WEBPACK_IMPORTED_MODULE_16__.KTX2BasisWriter, encodingOptions).then(function (encodedImageData) {
                texture.imageData = new Uint8Array(encodedImageData);
                if (--countTextures <= 0) {
                  resolve();
                }
              })["catch"](function (err) {
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
        };
        for (var i = 0, leni = _this.texturesList.length; i < leni; i++) {
          _loop();
        }
      });
    }
  }, {
    key: "_bakeSingleUseGeometryPositions",
    value: function _bakeSingleUseGeometryPositions() {
      for (var j = 0, lenj = this.meshesList.length; j < lenj; j++) {
        var mesh = this.meshesList[j];
        var geometry = mesh.geometry;
        if (geometry.numInstances === 1) {
          var matrix = mesh.matrix;
          if (matrix && !_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.isIdentityMat4(matrix)) {
            var positions = geometry.positions;
            for (var i = 0, len = positions.length; i < len; i += 3) {
              tempVec4a[0] = positions[i + 0];
              tempVec4a[1] = positions[i + 1];
              tempVec4a[2] = positions[i + 2];
              tempVec4a[3] = 1;
              _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.transformPoint4(matrix, tempVec4a, tempVec4b);
              positions[i + 0] = tempVec4b[0];
              positions[i + 1] = tempVec4b[1];
              positions[i + 2] = tempVec4b[2];
            }
          }
        }
      }
    }
  }, {
    key: "_bakeAndOctEncodeNormals",
    value: function _bakeAndOctEncodeNormals() {
      for (var i = 0, len = this.meshesList.length; i < len; i++) {
        var mesh = this.meshesList[i];
        var geometry = mesh.geometry;
        if (geometry.normals && !geometry.normalsOctEncoded) {
          geometry.normalsOctEncoded = new Int8Array(geometry.normals.length);
          if (geometry.numInstances > 1) {
            _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__.geometryCompression.octEncodeNormals(geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);
          } else {
            var modelNormalMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.inverseMat4(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.transposeMat4(mesh.matrix, tempMat4), tempMat4b);
            _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__.geometryCompression.transformAndOctEncodeNormals(modelNormalMatrix, geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);
          }
        }
      }
    }
  }, {
    key: "_createEntityAABBs",
    value: function _createEntityAABBs() {
      for (var i = 0, len = this.entitiesList.length; i < len; i++) {
        var entity = this.entitiesList[i];
        var entityAABB = entity.aabb;
        var meshes = entity.meshes;
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.collapseAABB3(entityAABB);
        for (var j = 0, lenj = meshes.length; j < lenj; j++) {
          var mesh = meshes[j];
          var geometry = mesh.geometry;
          var matrix = mesh.matrix;
          if (geometry.numInstances > 1) {
            var positions = geometry.positions;
            for (var _i = 0, _len = positions.length; _i < _len; _i += 3) {
              tempVec4a[0] = positions[_i + 0];
              tempVec4a[1] = positions[_i + 1];
              tempVec4a[2] = positions[_i + 2];
              tempVec4a[3] = 1;
              _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.transformPoint4(matrix, tempVec4a, tempVec4b);
              _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3Point3(entityAABB, tempVec4b);
            }
          } else {
            var _positions = geometry.positions;
            for (var _i2 = 0, _len2 = _positions.length; _i2 < _len2; _i2 += 3) {
              tempVec4a[0] = _positions[_i2 + 0];
              tempVec4a[1] = _positions[_i2 + 1];
              tempVec4a[2] = _positions[_i2 + 2];
              _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3Point3(entityAABB, tempVec4a);
            }
          }
        }
      }
    }
  }, {
    key: "_createKDTree",
    value: function _createKDTree() {
      var aabb;
      if (this.modelAABB) {
        aabb = this.modelAABB; // Pre-known uber AABB
      } else {
        aabb = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.collapseAABB3();
        for (var i = 0, len = this.entitiesList.length; i < len; i++) {
          var entity = this.entitiesList[i];
          _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3(aabb, entity.aabb);
        }
      }
      var rootKDNode = new _KDNode_js__WEBPACK_IMPORTED_MODULE_8__.KDNode(aabb);
      for (var _i3 = 0, _len3 = this.entitiesList.length; _i3 < _len3; _i3++) {
        var _entity = this.entitiesList[_i3];
        this._insertEntityIntoKDTree(rootKDNode, _entity);
      }
      return rootKDNode;
    }
  }, {
    key: "_insertEntityIntoKDTree",
    value: function _insertEntityIntoKDTree(kdNode, entity) {
      var nodeAABB = kdNode.aabb;
      var entityAABB = entity.aabb;
      var nodeAABBDiag = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.getAABB3Diag(nodeAABB);
      if (nodeAABBDiag < this.minTileSize) {
        kdNode.entities = kdNode.entities || [];
        kdNode.entities.push(entity);
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3(nodeAABB, entityAABB);
        return;
      }
      if (kdNode.left) {
        if (_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.containsAABB3(kdNode.left.aabb, entityAABB)) {
          this._insertEntityIntoKDTree(kdNode.left, entity);
          return;
        }
      }
      if (kdNode.right) {
        if (_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.containsAABB3(kdNode.right.aabb, entityAABB)) {
          this._insertEntityIntoKDTree(kdNode.right, entity);
          return;
        }
      }
      kdTreeDimLength[0] = nodeAABB[3] - nodeAABB[0];
      kdTreeDimLength[1] = nodeAABB[4] - nodeAABB[1];
      kdTreeDimLength[2] = nodeAABB[5] - nodeAABB[2];
      var dim = 0;
      if (kdTreeDimLength[1] > kdTreeDimLength[dim]) {
        dim = 1;
      }
      if (kdTreeDimLength[2] > kdTreeDimLength[dim]) {
        dim = 2;
      }
      if (!kdNode.left) {
        var aabbLeft = nodeAABB.slice();
        aabbLeft[dim + 3] = (nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0;
        kdNode.left = new _KDNode_js__WEBPACK_IMPORTED_MODULE_8__.KDNode(aabbLeft);
        if (_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.containsAABB3(aabbLeft, entityAABB)) {
          this._insertEntityIntoKDTree(kdNode.left, entity);
          return;
        }
      }
      if (!kdNode.right) {
        var aabbRight = nodeAABB.slice();
        aabbRight[dim] = (nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0;
        kdNode.right = new _KDNode_js__WEBPACK_IMPORTED_MODULE_8__.KDNode(aabbRight);
        if (_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.containsAABB3(aabbRight, entityAABB)) {
          this._insertEntityIntoKDTree(kdNode.right, entity);
          return;
        }
      }
      kdNode.entities = kdNode.entities || [];
      kdNode.entities.push(entity);
      _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3(nodeAABB, entityAABB);
    }
  }, {
    key: "_createTilesFromKDTree",
    value: function _createTilesFromKDTree(rootKDNode) {
      this._createTilesFromKDNode(rootKDNode);
    }
  }, {
    key: "_createTilesFromKDNode",
    value: function _createTilesFromKDNode(kdNode) {
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
  }, {
    key: "_createTileFromEntities",
    value: function _createTileFromEntities(kdNode) {
      var tileAABB = kdNode.aabb;
      var entities = kdNode.entities;
      var tileCenter = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.getAABB3Center(tileAABB);
      var tileCenterNeg = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mulVec3Scalar(tileCenter, -1, _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3());
      var rtcAABB = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.AABB3(); // AABB centered at the RTC origin

      rtcAABB[0] = tileAABB[0] - tileCenter[0];
      rtcAABB[1] = tileAABB[1] - tileCenter[1];
      rtcAABB[2] = tileAABB[2] - tileCenter[2];
      rtcAABB[3] = tileAABB[3] - tileCenter[0];
      rtcAABB[4] = tileAABB[4] - tileCenter[1];
      rtcAABB[5] = tileAABB[5] - tileCenter[2];
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var meshes = entity.meshes;
        for (var j = 0, lenj = meshes.length; j < lenj; j++) {
          var mesh = meshes[j];
          var geometry = mesh.geometry;
          if (!geometry.reused) {
            // Batched geometry

            var positions = geometry.positions;

            // Center positions relative to their tile's World-space center

            for (var k = 0, lenk = positions.length; k < lenk; k += 3) {
              positions[k + 0] -= tileCenter[0];
              positions[k + 1] -= tileCenter[1];
              positions[k + 2] -= tileCenter[2];
            }

            // Quantize positions relative to tile's RTC-space boundary

            _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__.geometryCompression.quantizePositions(positions, positions.length, rtcAABB, geometry.positionsQuantized);
          } else {
            // Instanced geometry

            // Post-multiply a translation to the mesh's modeling matrix
            // to center the entity's geometry instances to the tile RTC center

            //////////////////////////////
            // Why do we do this?
            // Seems to break various models
            /////////////////////////////////

            _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.translateMat4v(tileCenterNeg, mesh.matrix);
          }
        }
        entity.entityIndex = this.entitiesList.length;
        this.entitiesList.push(entity);
      }
      var tile = new _XKTTile_js__WEBPACK_IMPORTED_MODULE_7__.XKTTile(tileAABB, entities);
      this.tilesList.push(tile);
    }
  }, {
    key: "_createReusedGeometriesDecodeMatrix",
    value: function _createReusedGeometriesDecodeMatrix() {
      var tempVec3a = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
      var reusedGeometriesAABB = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.collapseAABB3(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.AABB3());
      var countReusedGeometries = 0;
      for (var geometryIndex = 0, numGeometries = this.geometriesList.length; geometryIndex < numGeometries; geometryIndex++) {
        var geometry = this.geometriesList[geometryIndex];
        if (geometry.reused) {
          // Instanced geometry

          var positions = geometry.positions;
          for (var i = 0, len = positions.length; i < len; i += 3) {
            tempVec3a[0] = positions[i];
            tempVec3a[1] = positions[i + 1];
            tempVec3a[2] = positions[i + 2];
            _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.expandAABB3Point3(reusedGeometriesAABB, tempVec3a);
          }
          countReusedGeometries++;
        }
      }
      if (countReusedGeometries > 0) {
        _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__.geometryCompression.createPositionsDecodeMatrix(reusedGeometriesAABB, this.reusedGeometriesDecodeMatrix);
        for (var _geometryIndex = 0, _numGeometries = this.geometriesList.length; _geometryIndex < _numGeometries; _geometryIndex++) {
          var _geometry = this.geometriesList[_geometryIndex];
          if (_geometry.reused) {
            _lib_geometryCompression_js__WEBPACK_IMPORTED_MODULE_1__.geometryCompression.quantizePositions(_geometry.positions, _geometry.positions.length, reusedGeometriesAABB, _geometry.positionsQuantized);
          }
        }
      } else {
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityMat4(this.reusedGeometriesDecodeMatrix); // No need for this matrix, but we'll be tidy and set it to identity
      }
    }
  }, {
    key: "_flagSolidGeometries",
    value: function _flagSolidGeometries() {
      var maxNumPositions = 0;
      var maxNumIndices = 0;
      for (var i = 0, len = this.geometriesList.length; i < len; i++) {
        var geometry = this.geometriesList[i];
        if (geometry.primitiveType === "triangles") {
          if (geometry.positionsQuantized.length > maxNumPositions) {
            maxNumPositions = geometry.positionsQuantized.length;
          }
          if (geometry.indices.length > maxNumIndices) {
            maxNumIndices = geometry.indices.length;
          }
        }
      }
      var vertexIndexMapping = new Array(maxNumPositions / 3);
      var edges = new Array(maxNumIndices);
      for (var _i4 = 0, _len4 = this.geometriesList.length; _i4 < _len4; _i4++) {
        var _geometry2 = this.geometriesList[_i4];
        if (_geometry2.primitiveType === "triangles") {
          _geometry2.solid = (0,_lib_isTriangleMeshSolid_js__WEBPACK_IMPORTED_MODULE_3__.isTriangleMeshSolid)(_geometry2.indices, _geometry2.positionsQuantized, vertexIndexMapping, edges);
        }
      }
    }
  }]);
  return XKTModel;
}();


/***/ }),

/***/ "./src/XKTModel/XKTPropertySet.js":
/*!****************************************!*\
  !*** ./src/XKTModel/XKTPropertySet.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTPropertySet: () => (/* binding */ XKTPropertySet)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * A property set within an {@link XKTModel}.
 *
 * These are shared among {@link XKTMetaObject}s.
 *
 * * Created by {@link XKTModel#createPropertySet}
 * * Stored in {@link XKTModel#propertySets} and {@link XKTModel#propertySetsList}
 * * Has an ID, a type, and a human-readable name
 *
 * @class XKTPropertySet
 */
var XKTPropertySet = /*#__PURE__*/_createClass(
/**
 * @private
 */
function XKTPropertySet(propertySetId, propertySetType, propertySetName, properties) {
  _classCallCheck(this, XKTPropertySet);
  /**
   * Unique ID of this ````XKTPropertySet```` in {@link XKTModel#propertySets}.
   *
   * @type {String}
   */
  this.propertySetId = propertySetId;

  /**
   * Indicates the ````XKTPropertySet````'s type.
   *
   * This defaults to "default".
   *
   * @type {string}
   */
  this.propertySetType = propertySetType;

  /**
   * Indicates the XKTPropertySet meta object name.
   *
   * This defaults to {@link XKTPropertySet#propertySetId}.
   *
   * @type {string}
   */
  this.propertySetName = propertySetName;

  /**
   * The properties within this ````XKTPropertySet````.
   *
   * @type {*[]}
   */
  this.properties = properties;
});


/***/ }),

/***/ "./src/XKTModel/XKTTexture.js":
/*!************************************!*\
  !*** ./src/XKTModel/XKTTexture.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTTexture: () => (/* binding */ XKTTexture)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * A texture shared by {@link XKTTextureSet}s.
 *
 * * Created by {@link XKTModel#createTexture}
 * * Stored in {@link XKTTextureSet#textures}, {@link XKTModel#textures} and {@link XKTModel#texturesList}
 *
 * @class XKTTexture
 */

var XKTTexture = /*#__PURE__*/_createClass(
/**
 * @private
 */
function XKTTexture(cfg) {
  _classCallCheck(this, XKTTexture);
  /**
   * Unique ID of this XKTTexture in {@link XKTModel#textures}.
   *
   * @type {Number}
   */
  this.textureId = cfg.textureId;

  /**
   * Index of this XKTTexture in {@link XKTModel#texturesList};
   *
   * @type {Number}
   */
  this.textureIndex = cfg.textureIndex;

  /**
   * Texture image data.
   *
   * @type {Buffer}
   */
  this.imageData = cfg.imageData;

  /**
   * Which material channel this texture is applied to, as determined by its {@link XKTTextureSet}s.
   *
   * @type {Number}
   */
  this.channel = null;

  /**
   * Width of this XKTTexture.
   *
   * @type {Number}
   */
  this.width = cfg.width;

  /**
   * Height of this XKTTexture.
   *
   * @type {Number}
   */
  this.height = cfg.height;

  /**
   * Texture file source.
   *
   * @type {String}
   */
  this.src = cfg.src;

  /**
   * Whether this XKTTexture is to be compressed.
   *
   * @type {Boolean}
   */
  this.compressed = !!cfg.compressed;

  /**
   * Media type of this XKTTexture.
   *
   * Supported values are {@link GIFMediaType}, {@link PNGMediaType} and {@link JPEGMediaType}.
   *
   * Ignored for compressed textures.
   *
   * @type {Number}
   */
  this.mediaType = cfg.mediaType;

  /**
   * How the texture is sampled when a texel covers less than one pixel. Supported values
   * are {@link LinearMipmapLinearFilter}, {@link LinearMipMapNearestFilter},
   * {@link NearestMipMapNearestFilter}, {@link NearestMipMapLinearFilter}
   * and {@link LinearMipMapLinearFilter}.
   *
   * Ignored for compressed textures.
   *
   * @type {Number}
   */
  this.minFilter = cfg.minFilter || _constants__WEBPACK_IMPORTED_MODULE_0__.LinearMipMapNearestFilter;

  /**
   * How the texture is sampled when a texel covers more than one pixel. Supported values
   * are {@link LinearFilter} and {@link NearestFilter}.
   *
   * Ignored for compressed textures.
   *
   * @type {Number}
   */
  this.magFilter = cfg.magFilter || _constants__WEBPACK_IMPORTED_MODULE_0__.LinearMipMapNearestFilter;

  /**
   * S wrapping mode.
   *
   * Supported values are {@link ClampToEdgeWrapping},
   * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
   *
   * Ignored for compressed textures.
   *
   * @type {Number}
   */
  this.wrapS = cfg.wrapS || _constants__WEBPACK_IMPORTED_MODULE_0__.RepeatWrapping;

  /**
   * T wrapping mode.
   *
   * Supported values are {@link ClampToEdgeWrapping},
   * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
   *
   * Ignored for compressed textures.
   *
   * @type {Number}
   */
  this.wrapT = cfg.wrapT || _constants__WEBPACK_IMPORTED_MODULE_0__.RepeatWrapping;

  /**
   * R wrapping mode.
   *
   * Ignored for compressed textures.
   *
   * Supported values are {@link ClampToEdgeWrapping},
   * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
   *
   * @type {*|number}
   */
  this.wrapR = cfg.wrapR || _constants__WEBPACK_IMPORTED_MODULE_0__.RepeatWrapping;
});


/***/ }),

/***/ "./src/XKTModel/XKTTextureSet.js":
/*!***************************************!*\
  !*** ./src/XKTModel/XKTTextureSet.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTTextureSet: () => (/* binding */ XKTTextureSet)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * A set of textures shared by {@link XKTMesh}es.
 *
 * * Created by {@link XKTModel#createTextureSet}
 * * Registered in {@link XKTMesh#material}, {@link XKTModel#materials} and {@link XKTModel#.textureSetsList}
 *
 * @class XKTMetalRoughMaterial
 */
var XKTTextureSet = /*#__PURE__*/_createClass(
/**
 * @private
 */
function XKTTextureSet(cfg) {
  _classCallCheck(this, XKTTextureSet);
  /**
   * Unique ID of this XKTTextureSet in {@link XKTModel#materials}.
   *
   * @type {Number}
   */
  this.textureSetId = cfg.textureSetId;

  /**
   * Index of this XKTTexture in {@link XKTModel#texturesList};
   *
   * @type {Number}
   */
  this.textureSetIndex = cfg.textureSetIndex;

  /**
   * Identifies the material type.
   *
   * @type {Number}
   */
  this.materialType = cfg.materialType;

  /**
   * Index of this XKTTextureSet in {@link XKTModel#meshesList};
   *
   * @type {Number}
   */
  this.materialIndex = cfg.materialIndex;

  /**
   * The number of {@link XKTMesh}s that reference this XKTTextureSet.
   *
   * @type {Number}
   */
  this.numInstances = 0;

  /**
   * RGBA {@link XKTTexture} containing base color in RGB and opacity in A.
   *
   * @type {XKTTexture}
   */
  this.colorTexture = cfg.colorTexture;

  /**
   * RGBA {@link XKTTexture} containing metallic and roughness factors in R and G.
   *
   * @type {XKTTexture}
   */
  this.metallicRoughnessTexture = cfg.metallicRoughnessTexture;

  /**
   * RGBA {@link XKTTexture} with surface normals in RGB.
   *
   * @type {XKTTexture}
   */
  this.normalsTexture = cfg.normalsTexture;

  /**
   * RGBA {@link XKTTexture} with emissive color in RGB.
   *
   * @type {XKTTexture}
   */
  this.emissiveTexture = cfg.emissiveTexture;

  /**
   * RGBA {@link XKTTexture} with ambient occlusion factors in RGB.
   *
   * @type {XKTTexture}
   */
  this.occlusionTexture = cfg.occlusionTexture;
});


/***/ }),

/***/ "./src/XKTModel/XKTTile.js":
/*!*********************************!*\
  !*** ./src/XKTModel/XKTTile.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKTTile: () => (/* binding */ XKTTile)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * @desc A box-shaped 3D region within an {@link XKTModel} that contains {@link XKTEntity}s.
 *
 * * Created by {@link XKTModel#finalize}
 * * Stored in {@link XKTModel#tilesList}
 *
 * @class XKTTile
 */
var XKTTile = /*#__PURE__*/_createClass(
/**
 * Creates a new XKTTile.
 *
 * @private
 * @param aabb
 * @param entities
 */
function XKTTile(aabb, entities) {
  _classCallCheck(this, XKTTile);
  /**
   * Axis-aligned World-space bounding box that encloses the {@link XKTEntity}'s within this Tile.
   *
   * @type {Float64Array}
   */
  this.aabb = aabb;

  /**
   * The {@link XKTEntity}'s within this XKTTile.
   *
   * @type {XKTEntity[]}
   */
  this.entities = entities;
});


/***/ }),

/***/ "./src/XKTModel/lib/buildEdgeIndices.js":
/*!**********************************************!*\
  !*** ./src/XKTModel/lib/buildEdgeIndices.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildEdgeIndices: () => (/* binding */ buildEdgeIndices)
/* harmony export */ });
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/math.js */ "./src/lib/math.js");


/**
 * @private
 */
var buildEdgeIndices = function () {
  var uniquePositions = [];
  var indicesLookup = [];
  var indicesReverseLookup = [];
  var weldedIndices = [];

  // TODO: Optimize with caching, but need to cater to both compressed and uncompressed positions

  var faces = [];
  var numFaces = 0;
  var compa = new Uint16Array(3);
  var compb = new Uint16Array(3);
  var compc = new Uint16Array(3);
  var a = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var b = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var c = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var cb = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var ab = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var cross = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var normal = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var inverseNormal = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  function weldVertices(positions, indices) {
    var positionsMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
    var vx;
    var vy;
    var vz;
    var key;
    var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    var precision = Math.pow(10, precisionPoints);
    var i;
    var len;
    var lenUniquePositions = 0;
    for (i = 0, len = positions.length; i < len; i += 3) {
      vx = positions[i];
      vy = positions[i + 1];
      vz = positions[i + 2];
      key = Math.round(vx * precision) + '_' + Math.round(vy * precision) + '_' + Math.round(vz * precision);
      if (positionsMap[key] === undefined) {
        positionsMap[key] = lenUniquePositions / 3;
        uniquePositions[lenUniquePositions++] = vx;
        uniquePositions[lenUniquePositions++] = vy;
        uniquePositions[lenUniquePositions++] = vz;
      }
      indicesLookup[i / 3] = positionsMap[key];
    }
    for (i = 0, len = indices.length; i < len; i++) {
      weldedIndices[i] = indicesLookup[indices[i]];
      indicesReverseLookup[weldedIndices[i]] = indices[i];
    }
  }
  function buildFaces(numIndices, positionsDecodeMatrix) {
    numFaces = 0;
    for (var i = 0, len = numIndices; i < len; i += 3) {
      var ia = weldedIndices[i] * 3;
      var ib = weldedIndices[i + 1] * 3;
      var ic = weldedIndices[i + 2] * 3;
      if (positionsDecodeMatrix) {
        compa[0] = uniquePositions[ia];
        compa[1] = uniquePositions[ia + 1];
        compa[2] = uniquePositions[ia + 2];
        compb[0] = uniquePositions[ib];
        compb[1] = uniquePositions[ib + 1];
        compb[2] = uniquePositions[ib + 2];
        compc[0] = uniquePositions[ic];
        compc[1] = uniquePositions[ic + 1];
        compc[2] = uniquePositions[ic + 2];
        // Decode
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.decompressPosition(compa, positionsDecodeMatrix, a);
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.decompressPosition(compb, positionsDecodeMatrix, b);
        _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.decompressPosition(compc, positionsDecodeMatrix, c);
      } else {
        a[0] = uniquePositions[ia];
        a[1] = uniquePositions[ia + 1];
        a[2] = uniquePositions[ia + 2];
        b[0] = uniquePositions[ib];
        b[1] = uniquePositions[ib + 1];
        b[2] = uniquePositions[ib + 2];
        c[0] = uniquePositions[ic];
        c[1] = uniquePositions[ic + 1];
        c[2] = uniquePositions[ic + 2];
      }
      _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.subVec3(c, b, cb);
      _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.subVec3(a, b, ab);
      _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.cross3Vec3(cb, ab, cross);
      _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.normalizeVec3(cross, normal);
      var face = faces[numFaces] || (faces[numFaces] = {
        normal: _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3()
      });
      face.normal[0] = normal[0];
      face.normal[1] = normal[1];
      face.normal[2] = normal[2];
      numFaces++;
    }
  }
  return function (positions, indices, positionsDecodeMatrix, edgeThreshold) {
    weldVertices(positions, indices);
    buildFaces(indices.length, positionsDecodeMatrix);
    var edgeIndices = [];
    var thresholdDot = Math.cos(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.DEGTORAD * edgeThreshold);
    var edges = {};
    var edge1;
    var edge2;
    var index1;
    var index2;
    var key;
    var largeIndex = false;
    var edge;
    var normal1;
    var normal2;
    var dot;
    var ia;
    var ib;
    for (var i = 0, len = indices.length; i < len; i += 3) {
      var faceIndex = i / 3;
      for (var j = 0; j < 3; j++) {
        edge1 = weldedIndices[i + j];
        edge2 = weldedIndices[i + (j + 1) % 3];
        index1 = Math.min(edge1, edge2);
        index2 = Math.max(edge1, edge2);
        key = index1 + ',' + index2;
        if (edges[key] === undefined) {
          edges[key] = {
            index1: index1,
            index2: index2,
            face1: faceIndex,
            face2: undefined
          };
        } else {
          edges[key].face2 = faceIndex;
        }
      }
    }
    for (key in edges) {
      edge = edges[key];
      // an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
      if (edge.face2 !== undefined) {
        normal1 = faces[edge.face1].normal;
        normal2 = faces[edge.face2].normal;
        inverseNormal[0] = -normal2[0];
        inverseNormal[1] = -normal2[1];
        inverseNormal[2] = -normal2[2];
        dot = Math.abs(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.dotVec3(normal1, normal2));
        var dot2 = Math.abs(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.dotVec3(normal1, inverseNormal));
        if (dot > thresholdDot && dot2 > thresholdDot) {
          continue;
        }
      }
      ia = indicesReverseLookup[edge.index1];
      ib = indicesReverseLookup[edge.index2];
      if (!largeIndex && ia > 65535 || ib > 65535) {
        largeIndex = true;
      }
      edgeIndices.push(ia);
      edgeIndices.push(ib);
    }
    return largeIndex ? new Uint32Array(edgeIndices) : new Uint16Array(edgeIndices);
  };
}();


/***/ }),

/***/ "./src/XKTModel/lib/geometryCompression.js":
/*!*************************************************!*\
  !*** ./src/XKTModel/lib/geometryCompression.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   geometryCompression: () => (/* binding */ geometryCompression)
/* harmony export */ });
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/math.js */ "./src/lib/math.js");

function quantizePositions(positions, lenPositions, aabb, quantizedPositions) {
  var xmin = aabb[0];
  var ymin = aabb[1];
  var zmin = aabb[2];
  var xwid = aabb[3] - xmin;
  var ywid = aabb[4] - ymin;
  var zwid = aabb[5] - zmin;
  var maxInt = 65535;
  var xMultiplier = maxInt / xwid;
  var yMultiplier = maxInt / ywid;
  var zMultiplier = maxInt / zwid;
  var verify = function verify(num) {
    return num >= 0 ? num : 0;
  };
  for (var i = 0; i < lenPositions; i += 3) {
    quantizedPositions[i + 0] = Math.max(0, Math.min(65535, Math.floor(verify(positions[i + 0] - xmin) * xMultiplier)));
    quantizedPositions[i + 1] = Math.max(0, Math.min(65535, Math.floor(verify(positions[i + 1] - ymin) * yMultiplier)));
    quantizedPositions[i + 2] = Math.max(0, Math.min(65535, Math.floor(verify(positions[i + 2] - zmin) * zMultiplier)));
  }
}
function compressPosition(p, aabb, q) {
  var multiplier = new Float32Array([aabb[3] !== aabb[0] ? 65535 / (aabb[3] - aabb[0]) : 0, aabb[4] !== aabb[1] ? 65535 / (aabb[4] - aabb[1]) : 0, aabb[5] !== aabb[2] ? 65535 / (aabb[5] - aabb[2]) : 0]);
  q[0] = Math.max(0, Math.min(65535, Math.floor((p[0] - aabb[0]) * multiplier[0])));
  q[1] = Math.max(0, Math.min(65535, Math.floor((p[1] - aabb[1]) * multiplier[1])));
  q[2] = Math.max(0, Math.min(65535, Math.floor((p[2] - aabb[2]) * multiplier[2])));
}
var createPositionsDecodeMatrix = function () {
  var translate = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mat4();
  var scale = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mat4();
  return function (aabb, positionsDecodeMatrix) {
    positionsDecodeMatrix = positionsDecodeMatrix || _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mat4();
    var xmin = aabb[0];
    var ymin = aabb[1];
    var zmin = aabb[2];
    var xwid = aabb[3] - xmin;
    var ywid = aabb[4] - ymin;
    var zwid = aabb[5] - zmin;
    var maxInt = 65535;
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityMat4(translate);
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.translationMat4v(aabb, translate);
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.identityMat4(scale);
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.scalingMat4v([xwid / maxInt, ywid / maxInt, zwid / maxInt], scale);
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.mulMat4(translate, scale, positionsDecodeMatrix);
    return positionsDecodeMatrix;
  };
}();
function transformAndOctEncodeNormals(modelNormalMatrix, normals, lenNormals, compressedNormals, lenCompressedNormals) {
  // http://jcgt.org/published/0003/02/01/
  var oct, dec, best, currentCos, bestCos;
  var i, ei;
  var localNormal = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  var worldNormal = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec3();
  for (i = 0; i < lenNormals; i += 3) {
    localNormal[0] = normals[i];
    localNormal[1] = normals[i + 1];
    localNormal[2] = normals[i + 2];
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.transformVec3(modelNormalMatrix, localNormal, worldNormal);
    _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.normalizeVec3(worldNormal, worldNormal);

    // Test various combinations of ceil and floor to minimize rounding errors
    best = oct = octEncodeVec3(worldNormal, 0, "floor", "floor");
    dec = octDecodeVec2(oct);
    currentCos = bestCos = dot(worldNormal, 0, dec);
    oct = octEncodeVec3(worldNormal, 0, "ceil", "floor");
    dec = octDecodeVec2(oct);
    currentCos = dot(worldNormal, 0, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    oct = octEncodeVec3(worldNormal, 0, "floor", "ceil");
    dec = octDecodeVec2(oct);
    currentCos = dot(worldNormal, 0, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    oct = octEncodeVec3(worldNormal, 0, "ceil", "ceil");
    dec = octDecodeVec2(oct);
    currentCos = dot(worldNormal, 0, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    compressedNormals[lenCompressedNormals + i + 0] = best[0];
    compressedNormals[lenCompressedNormals + i + 1] = best[1];
    compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
  }

  lenCompressedNormals += lenNormals;
  return lenCompressedNormals;
}
function octEncodeNormals(normals, lenNormals, compressedNormals, lenCompressedNormals) {
  // http://jcgt.org/published/0003/02/01/
  var oct, dec, best, currentCos, bestCos;
  for (var i = 0; i < lenNormals; i += 3) {
    // Test various combinations of ceil and floor to minimize rounding errors
    best = oct = octEncodeVec3(normals, i, "floor", "floor");
    dec = octDecodeVec2(oct);
    currentCos = bestCos = dot(normals, i, dec);
    oct = octEncodeVec3(normals, i, "ceil", "floor");
    dec = octDecodeVec2(oct);
    currentCos = dot(normals, i, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    oct = octEncodeVec3(normals, i, "floor", "ceil");
    dec = octDecodeVec2(oct);
    currentCos = dot(normals, i, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    oct = octEncodeVec3(normals, i, "ceil", "ceil");
    dec = octDecodeVec2(oct);
    currentCos = dot(normals, i, dec);
    if (currentCos > bestCos) {
      best = oct;
      bestCos = currentCos;
    }
    compressedNormals[lenCompressedNormals + i + 0] = best[0];
    compressedNormals[lenCompressedNormals + i + 1] = best[1];
    compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
  }

  lenCompressedNormals += lenNormals;
  return lenCompressedNormals;
}

/**
 * @private
 */
function octEncodeVec3(array, i, xfunc, yfunc) {
  // Oct-encode single normal vector in 2 bytes
  var x = array[i] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
  var y = array[i + 1] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
  if (array[i + 2] < 0) {
    var tempx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
    var tempy = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
    x = tempx;
    y = tempy;
  }
  return new Int8Array([Math[xfunc](x * 127.5 + (x < 0 ? -1 : 0)), Math[yfunc](y * 127.5 + (y < 0 ? -1 : 0))]);
}

/**
 * Decode an oct-encoded normal
 */
function octDecodeVec2(oct) {
  var x = oct[0];
  var y = oct[1];
  x /= x < 0 ? 127 : 128;
  y /= y < 0 ? 127 : 128;
  var z = 1 - Math.abs(x) - Math.abs(y);
  if (z < 0) {
    x = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
    y = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
  }
  var length = Math.sqrt(x * x + y * y + z * z);
  return [x / length, y / length, z / length];
}

/**
 * Dot product of a normal in an array against a candidate decoding
 * @private
 */
function dot(array, i, vec3) {
  return array[i] * vec3[0] + array[i + 1] * vec3[1] + array[i + 2] * vec3[2];
}

/**
 * @private
 */
var geometryCompression = {
  quantizePositions: quantizePositions,
  compressPosition: compressPosition,
  createPositionsDecodeMatrix: createPositionsDecodeMatrix,
  transformAndOctEncodeNormals: transformAndOctEncodeNormals,
  octEncodeNormals: octEncodeNormals
};


/***/ }),

/***/ "./src/XKTModel/lib/isTriangleMeshSolid.js":
/*!*************************************************!*\
  !*** ./src/XKTModel/lib/isTriangleMeshSolid.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isTriangleMeshSolid: () => (/* binding */ isTriangleMeshSolid)
/* harmony export */ });
/**
 * Uses edge adjacency counts to identify if the given triangle mesh can be rendered with backface culling enabled.
 *
 * If all edges are connected to exactly two triangles, then the mesh will likely be a closed solid, and we can safely
 * render it with backface culling enabled.
 *
 * Otherwise, the mesh is a surface, and we must render it with backface culling disabled.
 *
 * @private
 */
var isTriangleMeshSolid = function isTriangleMeshSolid(indices, positions, vertexIndexMapping, edges) {
  function compareIndexPositions(a, b) {
    var posA, posB;
    for (var i = 0; i < 3; i++) {
      posA = positions[a * 3 + i];
      posB = positions[b * 3 + i];
      if (posA !== posB) {
        return posB - posA;
      }
    }
    return 0;
  }
  ;

  // Group together indices corresponding to same position coordinates
  var newIndices = indices.slice().sort(compareIndexPositions);

  // Calculate the mapping:
  // - from original index in indices array
  // - to indices-for-unique-positions
  var uniqueVertexIndex = null;
  for (var i = 0, len = newIndices.length; i < len; i++) {
    if (i == 0 || 0 != compareIndexPositions(newIndices[i], newIndices[i - 1])) {
      // different position
      uniqueVertexIndex = newIndices[i];
    }
    vertexIndexMapping[newIndices[i]] = uniqueVertexIndex;
  }

  // Generate the list of edges
  for (var _i = 0, _len = indices.length; _i < _len; _i += 3) {
    var a = vertexIndexMapping[indices[_i]];
    var b = vertexIndexMapping[indices[_i + 1]];
    var c = vertexIndexMapping[indices[_i + 2]];
    var a2 = a;
    var b2 = b;
    var c2 = c;
    if (a > b && a > c) {
      if (b > c) {
        a2 = a;
        b2 = b;
        c2 = c;
      } else {
        a2 = a;
        b2 = c;
        c2 = b;
      }
    } else if (b > a && b > c) {
      if (a > c) {
        a2 = b;
        b2 = a;
        c2 = c;
      } else {
        a2 = b;
        b2 = c;
        c2 = a;
      }
    } else if (c > a && c > b) {
      if (a > b) {
        a2 = c;
        b2 = a;
        c2 = b;
      } else {
        a2 = c;
        b2 = b;
        c2 = a;
      }
    }
    edges[_i + 0] = [a2, b2];
    edges[_i + 1] = [b2, c2];
    if (a2 > c2) {
      var temp = c2;
      c2 = a2;
      a2 = temp;
    }
    edges[_i + 2] = [c2, a2];
  }

  // Group semantically equivalent edgdes together
  function compareEdges(e1, e2) {
    var a, b;
    for (var _i2 = 0; _i2 < 2; _i2++) {
      a = e1[_i2];
      b = e2[_i2];
      if (b !== a) {
        return b - a;
      }
    }
    return 0;
  }
  edges = edges.slice(0, indices.length);
  edges.sort(compareEdges);

  // Make sure each edge is used exactly twice
  var sameEdgeCount = 0;
  for (var _i3 = 0; _i3 < edges.length; _i3++) {
    if (_i3 === 0 || 0 !== compareEdges(edges[_i3], edges[_i3 - 1])) {
      // different edge
      if (0 !== _i3 && sameEdgeCount !== 2) {
        return false;
      }
      sameEdgeCount = 1;
    } else {
      // same edge
      sameEdgeCount++;
    }
  }
  if (edges.length > 0 && sameEdgeCount !== 2) {
    return false;
  }

  // Each edge is used exactly twice, this is a
  // watertight surface and hence a solid geometry.
  return true;
};


/***/ }),

/***/ "./src/XKTModel/lib/toArraybuffer.js":
/*!*******************************************!*\
  !*** ./src/XKTModel/lib/toArraybuffer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toArrayBuffer: () => (/* binding */ toArrayBuffer)
/* harmony export */ });
/**
 * @private
 * @param buf
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

/***/ }),

/***/ "./src/XKTModel/lib/utils.js":
/*!***********************************!*\
  !*** ./src/XKTModel/lib/utils.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   utils: () => (/* binding */ utils)
/* harmony export */ });
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}
function apply(o, o2) {
  for (var name in o) {
    if (o.hasOwnProperty(name)) {
      o2[name] = o[name];
    }
  }
  return o2;
}

/**
 * @private
 */
var utils = {
  isString: isString,
  apply: apply
};


/***/ }),

/***/ "./src/XKTModel/writeXKTModelToArrayBuffer.js":
/*!****************************************************!*\
  !*** ./src/XKTModel/writeXKTModelToArrayBuffer.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   writeXKTModelToArrayBuffer: () => (/* binding */ writeXKTModelToArrayBuffer)
/* harmony export */ });
/* harmony import */ var _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../XKT_INFO.js */ "./src/XKT_INFO.js");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pako */ "pako");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pako__WEBPACK_IMPORTED_MODULE_1__);


var XKT_VERSION = _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__.XKT_INFO.xktVersion;
var NUM_TEXTURE_ATTRIBUTES = 9;
var NUM_MATERIAL_ATTRIBUTES = 6;

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
  if (!options.zip) {
    return writeXKTModelToArrayBufferUncompressed(xktModel, metaModelJSON, stats);
  }
  var data = getModelData(xktModel, metaModelJSON, stats);
  var deflatedData = deflateData(data, metaModelJSON, options);
  stats.texturesSize += deflatedData.textureData.byteLength;
  var arrayBuffer = createArrayBuffer(deflatedData);
  return arrayBuffer;
}

// V11
function writeXKTModelToArrayBufferUncompressed(xktModel, metaModelJSON, stats) {
  var data = getModelData(xktModel, metaModelJSON, stats);
  stats.texturesSize += data.textureData.byteLength;
  var object2Array = function () {
    var encoder = new TextEncoder();
    return function (obj) {
      return encoder.encode(JSON.stringify(obj));
    };
  }();
  var arrays = [object2Array(metaModelJSON || data.metadata), data.textureData, data.eachTextureDataPortion, data.eachTextureAttributes, data.positions, data.normals, data.colors, data.uvs, data.indices, data.edgeIndices, data.eachTextureSetTextures, data.matrices, data.reusedGeometriesDecodeMatrix, data.eachGeometryPrimitiveType, data.eachGeometryPositionsPortion, data.eachGeometryNormalsPortion, data.eachGeometryColorsPortion, data.eachGeometryUVsPortion, data.eachGeometryIndicesPortion, data.eachGeometryEdgeIndicesPortion, data.eachMeshGeometriesPortion, data.eachMeshMatricesPortion, data.eachMeshTextureSet, data.eachMeshMaterialAttributes, object2Array(data.eachEntityId), data.eachEntityMeshesPortion, data.eachTileAABB, data.eachTileEntitiesPortion];
  var arraysCnt = arrays.length;
  var dataView = new DataView(new ArrayBuffer((1 + 2 * arraysCnt) * 4));
  dataView.setUint32(0, XKT_VERSION, true);
  var byteOffset = dataView.byteLength;
  var offsets = [];

  // Store arrays' offsets and lengths
  for (var i = 0; i < arraysCnt; i++) {
    var arr = arrays[i];
    var BPE = arr.BYTES_PER_ELEMENT;
    // align to BPE, so the arrayBuffer can be used for a typed array
    byteOffset = Math.ceil(byteOffset / BPE) * BPE;
    var byteLength = arr.byteLength;
    var idx = 1 + 2 * i;
    dataView.setUint32(idx * 4, byteOffset, true);
    dataView.setUint32((idx + 1) * 4, byteLength, true);
    offsets.push(byteOffset);
    byteOffset += byteLength;
  }
  var dataArray = new Uint8Array(byteOffset);
  dataArray.set(new Uint8Array(dataView.buffer), 0);
  var requiresSwapToLittleEndian = function () {
    var buffer = new ArrayBuffer(2);
    new Uint16Array(buffer)[0] = 1;
    return new Uint8Array(buffer)[0] !== 1;
  }();

  // Store arrays themselves
  for (var _i = 0; _i < arraysCnt; _i++) {
    var _arr = arrays[_i];
    var subarray = new Uint8Array(_arr.buffer, _arr.byteOffset, _arr.byteLength);
    var _BPE = _arr.BYTES_PER_ELEMENT;
    if (requiresSwapToLittleEndian && _BPE > 1) {
      var swaps = _BPE / 2;
      var cnt = subarray.length / _BPE;
      for (var b = 0; b < cnt; b++) {
        var offset = b * _BPE;
        for (var j = 0; j < swaps; j++) {
          var i1 = offset + j;
          var i2 = offset - j + _BPE - 1;
          var tmp = subarray[i1];
          subarray[i1] = subarray[i2];
          subarray[i2] = tmp;
        }
      }
    }
    dataArray.set(subarray, offsets[_i]);
  }
  return dataArray.buffer;
}
function getModelData(xktModel, metaModelDataStr, stats) {
  //------------------------------------------------------------------------------------------------------------------
  // Allocate data
  //------------------------------------------------------------------------------------------------------------------

  var propertySetsList = xktModel.propertySetsList;
  var metaObjectsList = xktModel.metaObjectsList;
  var geometriesList = xktModel.geometriesList;
  var texturesList = xktModel.texturesList;
  var textureSetsList = xktModel.textureSetsList;
  var meshesList = xktModel.meshesList;
  var entitiesList = xktModel.entitiesList;
  var tilesList = xktModel.tilesList;
  var numPropertySets = propertySetsList.length;
  var numMetaObjects = metaObjectsList.length;
  var numGeometries = geometriesList.length;
  var numTextures = texturesList.length;
  var numTextureSets = textureSetsList.length;
  var numMeshes = meshesList.length;
  var numEntities = entitiesList.length;
  var numTiles = tilesList.length;
  var lenPositions = 0;
  var lenNormals = 0;
  var lenColors = 0;
  var lenUVs = 0;
  var lenIndices = 0;
  var lenEdgeIndices = 0;
  var lenMatrices = 0;
  var lenTextures = 0;
  for (var geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {
    var geometry = geometriesList[geometryIndex];
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
  for (var textureIndex = 0; textureIndex < numTextures; textureIndex++) {
    var xktTexture = texturesList[textureIndex];
    var imageData = xktTexture.imageData;
    lenTextures += imageData.byteLength;
    if (xktTexture.compressed) {
      stats.numCompressedTextures++;
    }
  }
  for (var _meshIndex = 0; _meshIndex < numMeshes; _meshIndex++) {
    var mesh = meshesList[_meshIndex];
    if (mesh.geometry.numInstances > 1) {
      lenMatrices += 16;
    }
  }
  var data = {
    metadata: {},
    textureData: new Uint8Array(lenTextures),
    // All textures
    eachTextureDataPortion: new Uint32Array(numTextures),
    // For each texture, an index to its first element in textureData
    eachTextureAttributes: new Uint16Array(numTextures * NUM_TEXTURE_ATTRIBUTES),
    positions: new Uint16Array(lenPositions),
    // All geometry arrays
    normals: new Int8Array(lenNormals),
    colors: new Uint8Array(lenColors),
    uvs: new Float32Array(lenUVs),
    indices: new Uint32Array(lenIndices),
    edgeIndices: new Uint32Array(lenEdgeIndices),
    eachTextureSetTextures: new Int32Array(numTextureSets * 5),
    // For each texture set, a set of five Texture indices [color, metal/roughness,normals,emissive,occlusion]; each index has value -1 if no texture
    matrices: new Float32Array(lenMatrices),
    // Modeling matrices for entities that share geometries. Each entity either shares all it's geometries, or owns all its geometries exclusively. Exclusively-owned geometries are pre-transformed into World-space, and so their entities don't have modeling matrices in this array.
    reusedGeometriesDecodeMatrix: new Float32Array(xktModel.reusedGeometriesDecodeMatrix),
    // A single, global vertex position de-quantization matrix for all reused geometries. Reused geometries are quantized to their collective Local-space AABB, and this matrix is derived from that AABB.
    eachGeometryPrimitiveType: new Uint8Array(numGeometries),
    // Primitive type for each geometry (0=solid triangles, 1=surface triangles, 2=lines, 3=points, 4=line-strip)
    eachGeometryPositionsPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.positions. Every primitive type has positions.
    eachGeometryNormalsPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.normals. If the next geometry has the same index, then this geometry has no normals.
    eachGeometryColorsPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.colors. If the next geometry has the same index, then this geometry has no colors.
    eachGeometryUVsPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.uvs. If the next geometry has the same index, then this geometry has no UVs.
    eachGeometryIndicesPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.indices. If the next geometry has the same index, then this geometry has no indices.
    eachGeometryEdgeIndicesPortion: new Uint32Array(numGeometries),
    // For each geometry, an index to its first element in data.edgeIndices. If the next geometry has the same index, then this geometry has no edge indices.
    eachMeshGeometriesPortion: new Uint32Array(numMeshes),
    // For each mesh, an index into the eachGeometry* arrays
    eachMeshMatricesPortion: new Uint32Array(numMeshes),
    // For each mesh that shares its geometry, an index to its first element in data.matrices, to indicate the modeling matrix that transforms the shared geometry Local-space vertex positions. This is ignored for meshes that don't share geometries, because the vertex positions of non-shared geometries are pre-transformed into World-space.
    eachMeshTextureSet: new Int32Array(numMeshes),
    // For each mesh, the index of its texture set in data.eachTextureSetTextures; this array contains signed integers so that we can use -1 to indicate when a mesh has no texture set
    eachMeshMaterialAttributes: new Uint8Array(numMeshes * NUM_MATERIAL_ATTRIBUTES),
    // For each mesh, an RGBA integer color of format [0..255, 0..255, 0..255, 0..255], and PBR metallic and roughness factors, of format [0..255, 0..255]
    eachEntityId: [],
    // For each entity, an ID string
    eachEntityMeshesPortion: new Uint32Array(numEntities),
    // For each entity, the index of the first element of meshes used by the entity
    eachTileAABB: new Float64Array(numTiles * 6),
    // For each tile, an axis-aligned bounding box
    eachTileEntitiesPortion: new Uint32Array(numTiles) // For each tile, the index of the first element of eachEntityId, eachEntityMeshesPortion and eachEntityMatricesPortion used by the tile
  };

  var countPositions = 0;
  var countNormals = 0;
  var countColors = 0;
  var countUVs = 0;
  var countIndices = 0;
  var countEdgeIndices = 0;

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

  for (var propertySetsIndex = 0; propertySetsIndex < numPropertySets; propertySetsIndex++) {
    var propertySet = propertySetsList[propertySetsIndex];
    var propertySetJSON = {
      id: "" + propertySet.propertySetId,
      name: propertySet.propertySetName,
      type: propertySet.propertySetType,
      properties: propertySet.properties
    };
    data.metadata.propertySets.push(propertySetJSON);
  }

  // Metaobjects

  if (!metaModelDataStr) {
    for (var metaObjectsIndex = 0; metaObjectsIndex < numMetaObjects; metaObjectsIndex++) {
      var metaObject = metaObjectsList[metaObjectsIndex];
      var metaObjectJSON = {
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

  for (var _geometryIndex = 0; _geometryIndex < numGeometries; _geometryIndex++) {
    var _geometry = geometriesList[_geometryIndex];
    var primitiveType = 1;
    switch (_geometry.primitiveType) {
      case "triangles":
        primitiveType = _geometry.solid ? 0 : 1;
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
      default:
        primitiveType = 1;
    }
    data.eachGeometryPrimitiveType[_geometryIndex] = primitiveType;
    data.eachGeometryPositionsPortion[_geometryIndex] = countPositions;
    data.eachGeometryNormalsPortion[_geometryIndex] = countNormals;
    data.eachGeometryColorsPortion[_geometryIndex] = countColors;
    data.eachGeometryUVsPortion[_geometryIndex] = countUVs;
    data.eachGeometryIndicesPortion[_geometryIndex] = countIndices;
    data.eachGeometryEdgeIndicesPortion[_geometryIndex] = countEdgeIndices;
    if (_geometry.positionsQuantized) {
      data.positions.set(_geometry.positionsQuantized, countPositions);
      countPositions += _geometry.positionsQuantized.length;
    }
    if (_geometry.normalsOctEncoded) {
      data.normals.set(_geometry.normalsOctEncoded, countNormals);
      countNormals += _geometry.normalsOctEncoded.length;
    }
    if (_geometry.colorsCompressed) {
      data.colors.set(_geometry.colorsCompressed, countColors);
      countColors += _geometry.colorsCompressed.length;
    }
    if (_geometry.uvs) {
      data.uvs.set(_geometry.uvs, countUVs);
      countUVs += _geometry.uvs.length;
    }
    if (_geometry.indices) {
      data.indices.set(_geometry.indices, countIndices);
      countIndices += _geometry.indices.length;
    }
    if (_geometry.edgeIndices) {
      data.edgeIndices.set(_geometry.edgeIndices, countEdgeIndices);
      countEdgeIndices += _geometry.edgeIndices.length;
    }
  }

  // Textures

  for (var _textureIndex = 0, _numTextures = xktModel.texturesList.length, portionIdx = 0; _textureIndex < _numTextures; _textureIndex++) {
    var _xktTexture = xktModel.texturesList[_textureIndex];
    var _imageData = _xktTexture.imageData;
    data.textureData.set(_imageData, portionIdx);
    data.eachTextureDataPortion[_textureIndex] = portionIdx;
    portionIdx += _imageData.byteLength;
    var textureAttrIdx = _textureIndex * NUM_TEXTURE_ATTRIBUTES;
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.compressed ? 1 : 0;
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.mediaType; // GIFMediaType | PNGMediaType | JPEGMediaType
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.width;
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.height;
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.minFilter; // LinearMipmapLinearFilter | LinearMipMapNearestFilter | NearestMipMapNearestFilter | NearestMipMapLinearFilter | LinearMipMapLinearFilter
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.magFilter; // LinearFilter | NearestFilter
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.wrapS; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.wrapT; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
    data.eachTextureAttributes[textureAttrIdx++] = _xktTexture.wrapR; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
  }

  // Texture sets

  for (var textureSetIndex = 0, _numTextureSets = xktModel.textureSetsList.length, eachTextureSetTexturesIndex = 0; textureSetIndex < _numTextureSets; textureSetIndex++) {
    var textureSet = textureSetsList[textureSetIndex];
    data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.colorTexture ? textureSet.colorTexture.textureIndex : -1; // Color map
    data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.metallicRoughnessTexture ? textureSet.metallicRoughnessTexture.textureIndex : -1; // Metal/rough map
    data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.normalsTexture ? textureSet.normalsTexture.textureIndex : -1; // Normal map
    data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.emissiveTexture ? textureSet.emissiveTexture.textureIndex : -1; // Emissive map
    data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.occlusionTexture ? textureSet.occlusionTexture.textureIndex : -1; // Occlusion map
  }

  // Tiles -> Entities -> Meshes

  var entityIndex = 0;
  var countEntityMeshesPortion = 0;
  var eachMeshMaterialAttributesIndex = 0;
  var matricesIndex = 0;
  var meshIndex = 0;
  for (var tileIndex = 0; tileIndex < numTiles; tileIndex++) {
    var tile = tilesList[tileIndex];
    var tileEntities = tile.entities;
    var numTileEntities = tileEntities.length;
    if (numTileEntities === 0) {
      continue;
    }
    data.eachTileEntitiesPortion[tileIndex] = entityIndex;
    var tileAABB = tile.aabb;
    for (var j = 0; j < numTileEntities; j++) {
      var entity = tileEntities[j];
      var entityMeshes = entity.meshes;
      var numEntityMeshes = entityMeshes.length;
      for (var k = 0; k < numEntityMeshes; k++) {
        var _mesh = entityMeshes[k];
        var _geometry2 = _mesh.geometry;
        var _geometryIndex2 = _geometry2.geometryIndex;
        data.eachMeshGeometriesPortion[countEntityMeshesPortion + k] = _geometryIndex2;
        if (_mesh.geometry.numInstances > 1) {
          data.matrices.set(_mesh.matrix, matricesIndex);
          data.eachMeshMatricesPortion[meshIndex] = matricesIndex;
          matricesIndex += 16;
        }
        data.eachMeshTextureSet[meshIndex] = _mesh.textureSet ? _mesh.textureSet.textureSetIndex : -1;
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.color[0] * 255; // Color RGB
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.color[1] * 255;
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.color[2] * 255;
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.opacity * 255; // Opacity
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.metallic * 255; // Metallic
        data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = _mesh.roughness * 255; // Roughness

        meshIndex++;
      }
      data.eachEntityId[entityIndex] = entity.entityId;
      data.eachEntityMeshesPortion[entityIndex] = countEntityMeshesPortion; // <<<<<<<<<<<<<<<<<<<< Error here? Order/value of countEntityMeshesPortion correct?

      entityIndex++;
      countEntityMeshesPortion += numEntityMeshes;
    }
    var tileAABBIndex = tileIndex * 6;
    data.eachTileAABB.set(tileAABB, tileAABBIndex);
  }
  return data;
}
function deflateData(data, metaModelJSON, options) {
  function deflate(buffer) {
    return options.zip !== false ? pako__WEBPACK_IMPORTED_MODULE_1__.deflate(buffer) : buffer;
  }
  var metaModelBytes;
  if (metaModelJSON) {
    var deflatedJSON = deflateJSON(metaModelJSON);
    metaModelBytes = deflate(deflatedJSON);
  } else {
    var _deflatedJSON = deflateJSON(data.metadata);
    metaModelBytes = deflate(_deflatedJSON);
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
    eachEntityId: deflate(JSON.stringify(data.eachEntityId).replace(/[\u007F-\uFFFF]/g, function (chr) {
      // Produce only ASCII-chars, so that the data can be inflated later
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    })),
    eachEntityMeshesPortion: deflate(data.eachEntityMeshesPortion.buffer),
    eachTileAABB: deflate(data.eachTileAABB.buffer),
    eachTileEntitiesPortion: deflate(data.eachTileEntitiesPortion.buffer)
  };
}
function deflateJSON(strings) {
  return JSON.stringify(strings).replace(/[\u007F-\uFFFF]/g, function (chr) {
    // Produce only ASCII-chars, so that the data can be inflated later
    return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
  });
}
function createArrayBuffer(deflatedData) {
  return toArrayBuffer([deflatedData.metadata, deflatedData.textureData, deflatedData.eachTextureDataPortion, deflatedData.eachTextureAttributes, deflatedData.positions, deflatedData.normals, deflatedData.colors, deflatedData.uvs, deflatedData.indices, deflatedData.edgeIndices, deflatedData.eachTextureSetTextures, deflatedData.matrices, deflatedData.reusedGeometriesDecodeMatrix, deflatedData.eachGeometryPrimitiveType, deflatedData.eachGeometryPositionsPortion, deflatedData.eachGeometryNormalsPortion, deflatedData.eachGeometryColorsPortion, deflatedData.eachGeometryUVsPortion, deflatedData.eachGeometryIndicesPortion, deflatedData.eachGeometryEdgeIndicesPortion, deflatedData.eachMeshGeometriesPortion, deflatedData.eachMeshMatricesPortion, deflatedData.eachMeshTextureSet, deflatedData.eachMeshMaterialAttributes, deflatedData.eachEntityId, deflatedData.eachEntityMeshesPortion, deflatedData.eachTileAABB, deflatedData.eachTileEntitiesPortion]);
}
function toArrayBuffer(elements) {
  var indexData = new Uint32Array(elements.length + 2);
  indexData[0] = 10; // XKT_VERSION for legacy v10 mode
  indexData[1] = elements.length; // Stored Data 1.1: number of stored elements
  var dataLen = 0; // Stored Data 1.2: length of stored elements
  for (var i = 0, len = elements.length; i < len; i++) {
    var element = elements[i];
    var elementsize = element.length;
    indexData[i + 2] = elementsize;
    dataLen += elementsize;
  }
  var indexBuf = new Uint8Array(indexData.buffer);
  var dataArray = new Uint8Array(indexBuf.length + dataLen);
  dataArray.set(indexBuf);
  var offset = indexBuf.length;
  for (var _i2 = 0, _len = elements.length; _i2 < _len; _i2++) {
    // Stored Data 2: the elements themselves
    var _element = elements[_i2];
    dataArray.set(_element, offset);
    offset += _element.length;
  }
  return dataArray.buffer;
}


/***/ }),

/***/ "./src/XKT_INFO.js":
/*!*************************!*\
  !*** ./src/XKT_INFO.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XKT_INFO: () => (/* binding */ XKT_INFO)
/* harmony export */ });
/**
 * @desc Provides info on the XKT generated by xeokit-convert.
 */
var XKT_INFO = {
  /**
   * The XKT version generated by xeokit-convert.
   *
   * This is the XKT version that's modeled by {@link XKTModel}, serialized
   * by {@link writeXKTModelToArrayBuffer}, and written by {@link convert2xkt}.
   *
   * * Current XKT version: **10**
   * * [XKT format specs](https://github.com/xeokit/xeokit-convert/blob/main/specs/index.md)
   *
   * @property xktVersion
   * @type {number}
   */
  xktVersion: 11
};


/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClampToEdgeWrapping: () => (/* binding */ ClampToEdgeWrapping),
/* harmony export */   GIFMediaType: () => (/* binding */ GIFMediaType),
/* harmony export */   JPEGMediaType: () => (/* binding */ JPEGMediaType),
/* harmony export */   LinearFilter: () => (/* binding */ LinearFilter),
/* harmony export */   LinearMipMapLinearFilter: () => (/* binding */ LinearMipMapLinearFilter),
/* harmony export */   LinearMipMapNearestFilter: () => (/* binding */ LinearMipMapNearestFilter),
/* harmony export */   LinearMipmapLinearFilter: () => (/* binding */ LinearMipmapLinearFilter),
/* harmony export */   LinearMipmapNearestFilter: () => (/* binding */ LinearMipmapNearestFilter),
/* harmony export */   MirroredRepeatWrapping: () => (/* binding */ MirroredRepeatWrapping),
/* harmony export */   NearestFilter: () => (/* binding */ NearestFilter),
/* harmony export */   NearestMipMapLinearFilter: () => (/* binding */ NearestMipMapLinearFilter),
/* harmony export */   NearestMipMapNearestFilter: () => (/* binding */ NearestMipMapNearestFilter),
/* harmony export */   NearestMipmapLinearFilter: () => (/* binding */ NearestMipmapLinearFilter),
/* harmony export */   NearestMipmapNearestFilter: () => (/* binding */ NearestMipmapNearestFilter),
/* harmony export */   PNGMediaType: () => (/* binding */ PNGMediaType),
/* harmony export */   RepeatWrapping: () => (/* binding */ RepeatWrapping)
/* harmony export */ });
/*----------------------------------------------------------------------------------------------------------------------
 * NOTE: The values of these constants must match those within xeokit-sdk
 *--------------------------------------------------------------------------------------------------------------------*/

/**
 * Texture wrapping mode in which the texture repeats to infinity.
 */
var RepeatWrapping = 1000;

/**
 * Texture wrapping mode in which the last pixel of the texture stretches to the edge of the mesh.
 */
var ClampToEdgeWrapping = 1001;

/**
 * Texture wrapping mode in which the texture repeats to infinity, mirroring on each repeat.
 */
var MirroredRepeatWrapping = 1002;

/**
 * Texture magnification and minification filter that returns the nearest texel to the given sample coordinates.
 */
var NearestFilter = 1003;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and returns the nearest texel to the given sample coordinates.
 */
var NearestMipMapNearestFilter = 1004;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured
 * and returns the nearest texel to the given sample coordinates.
 */
var NearestMipmapNearestFilter = 1004;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured
 * and returns the nearest texel to the center of the pixel at the given sample coordinates.
 */
var NearestMipmapLinearFilter = 1005;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured
 * and returns the nearest texel to the center of the pixel at the given sample coordinates.
 */
var NearestMipMapLinearFilter = 1005;

/**
 * Texture magnification and minification filter that returns the weighted average of the four nearest texels to the given sample coordinates.
 */
var LinearFilter = 1006;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and
 * returns the weighted average of the four nearest texels to the given sample coordinates.
 */
var LinearMipmapNearestFilter = 1007;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and
 * returns the weighted average of the four nearest texels to the given sample coordinates.
 */
var LinearMipMapNearestFilter = 1007;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured,
 * finds within each mipmap the weighted average of the nearest texel to the center of the pixel, then returns the
 * weighted average of those two values.
 */
var LinearMipmapLinearFilter = 1008;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured,
 * finds within each mipmap the weighted average of the nearest texel to the center of the pixel, then returns the
 * weighted average of those two values.
 */
var LinearMipMapLinearFilter = 1008;

/**
 * Media type for GIF images.
 */
var GIFMediaType = 10000;

/**
 * Media type for JPEG images.
 */
var JPEGMediaType = 10001;

/**
 * Media type for PNG images.
 */
var PNGMediaType = 10002;

/***/ }),

/***/ "./src/convert2xkt.js":
/*!****************************!*\
  !*** ./src/convert2xkt.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convert2xkt: () => (/* binding */ convert2xkt)
/* harmony export */ });
/* harmony import */ var _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./XKT_INFO.js */ "./src/XKT_INFO.js");
/* harmony import */ var _XKTModel_XKTModel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./XKTModel/XKTModel.js */ "./src/XKTModel/XKTModel.js");
/* harmony import */ var _parsers_parseCityJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parsers/parseCityJSONIntoXKTModel.js */ "./src/parsers/parseCityJSONIntoXKTModel.js");
/* harmony import */ var _parsers_parseGLTFIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parsers/parseGLTFIntoXKTModel.js */ "./src/parsers/parseGLTFIntoXKTModel.js");
/* harmony import */ var _parsers_parseIFCIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parsers/parseIFCIntoXKTModel.js */ "./src/parsers/parseIFCIntoXKTModel.js");
/* harmony import */ var _parsers_parseLASIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parsers/parseLASIntoXKTModel.js */ "./src/parsers/parseLASIntoXKTModel.js");
/* harmony import */ var _parsers_parsePCDIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parsers/parsePCDIntoXKTModel.js */ "./src/parsers/parsePCDIntoXKTModel.js");
/* harmony import */ var _parsers_parsePLYIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./parsers/parsePLYIntoXKTModel.js */ "./src/parsers/parsePLYIntoXKTModel.js");
/* harmony import */ var _parsers_parseSTLIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parsers/parseSTLIntoXKTModel.js */ "./src/parsers/parseSTLIntoXKTModel.js");
/* harmony import */ var _XKTModel_writeXKTModelToArrayBuffer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./XKTModel/writeXKTModelToArrayBuffer.js */ "./src/XKTModel/writeXKTModelToArrayBuffer.js");
/* harmony import */ var _XKTModel_lib_toArraybuffer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./XKTModel/lib/toArraybuffer */ "./src/XKTModel/lib/toArraybuffer.js");











var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");

/**
 * Converts model files into xeokit's native XKT format.
 *
 * Supported source formats are: IFC, CityJSON, glTF, LAZ and LAS.
 *
 * **Only bundled in xeokit-convert.cjs.js.**
 *
 * ## Usage
 *
 * ````javascript
 * const convert2xkt = require("@xeokit/xeokit-convert/dist/convert2xkt.cjs.js");
 * const fs = require('fs');
 *
 * convert2xkt({
 *      sourceData: fs.readFileSync("rme_advanced_sample_project.ifc"),
 *      outputXKT: (xtkArrayBuffer) => {
 *          fs.writeFileSync("rme_advanced_sample_project.ifc.xkt", xtkArrayBuffer);
 *      }
 *  }).then(() => {
 *      console.log("Converted.");
 *  }, (errMsg) => {
 *      console.error("Conversion failed: " + errMsg)
 *  });
 ````
 * @param {Object} params Conversion parameters.
 * @param {Object} params.WebIFC The WebIFC library. We pass this in as an external dependency, in order to give the
 * caller the choice of whether to use the Browser or NodeJS version.
 * @param {*} [params.configs] Configurations.
 * @param {String} [params.source] Path to source file. Alternative to ````sourceData````.
 * @param {ArrayBuffer|JSON} [params.sourceData] Source file data. Alternative to ````source````.
 * @param {String} [params.sourceFormat] Format of source file/data. Always needed with ````sourceData````, but not normally needed with ````source````, because convert2xkt will determine the format automatically from the file extension of ````source````.
 * @param {String} [params.metaModelDataStr] Source file data. Overrides metadata from ````metaModelSource````, ````sourceData```` and ````source````.
 * @param {String} [params.metaModelSource] Path to source metaModel file. Overrides metadata from ````sourceData```` and ````source````. Overridden by ````metaModelData````.
 * @param {String} [params.output] Path to destination XKT file. Directories on this path are automatically created if not existing.
 * @param {Function} [params.outputXKTModel] Callback to collect the ````XKTModel```` that is internally build by this method.
 * @param {Function} [params.outputXKT] Callback to collect XKT file data.
 * @param {String[]} [params.includeTypes] Option to only convert objects of these types.
 * @param {String[]} [params.excludeTypes] Option to never convert objects of these types.
 * @param {Object} [stats] Collects conversion statistics. Statistics are attached to this object if provided.
 * @param {Function} [params.outputStats] Callback to collect statistics.
 * @param {Boolean} [params.rotateX=false] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary. Applies to CityJSON and LAS/LAZ models.
 * @param {Boolean} [params.reuseGeometries=true] When true, will enable geometry reuse within the XKT. When false,
 * will automatically "expand" all reused geometries into duplicate copies. This has the drawback of increasing the XKT
 * file size (~10-30% for typical models), but can make the model more responsive in the xeokit Viewer, especially if the model
 * has excessive geometry reuse. An example of excessive geometry reuse would be when a model (eg. glTF) has 4000 geometries that are
 * shared amongst 2000 objects, ie. a large number of geometries with a low amount of reuse, which can present a
 * pathological performance case for xeokit's underlying graphics APIs (WebGL, WebGPU etc).
 * @param {Boolean} [params.includeTextures=true] Whether to convert textures. Only works for ````glTF```` models.
 * @param {Boolean} [params.includeNormals=true] Whether to convert normals. When false, the parser will ignore
 * geometry normals, and the modelwill rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the model.
 * @param {Number} [params.minTileSize=200] Minimum RTC coordinate tile size. Set this to a value between 100 and 10000,
 * depending on how far from the coordinate origin the model's vertex positions are; specify larger tile sizes when close
 * to the origin, and smaller sizes when distant.  This compensates for decreasing precision as floats get bigger.
 * @param {Function} [params.log] Logging callback.
 * @return {Promise<number>}
 */
function convert2xkt(_ref) {
  var WebIFC = _ref.WebIFC,
    _ref$configs = _ref.configs,
    configs = _ref$configs === void 0 ? {} : _ref$configs,
    source = _ref.source,
    sourceData = _ref.sourceData,
    sourceFormat = _ref.sourceFormat,
    metaModelSource = _ref.metaModelSource,
    metaModelDataStr = _ref.metaModelDataStr,
    modelAABB = _ref.modelAABB,
    output = _ref.output,
    outputXKTModel = _ref.outputXKTModel,
    outputXKT = _ref.outputXKT,
    includeTypes = _ref.includeTypes,
    excludeTypes = _ref.excludeTypes,
    _ref$reuseGeometries = _ref.reuseGeometries,
    reuseGeometries = _ref$reuseGeometries === void 0 ? true : _ref$reuseGeometries,
    _ref$minTileSize = _ref.minTileSize,
    minTileSize = _ref$minTileSize === void 0 ? 200 : _ref$minTileSize,
    _ref$stats = _ref.stats,
    stats = _ref$stats === void 0 ? {} : _ref$stats,
    outputStats = _ref.outputStats,
    _ref$rotateX = _ref.rotateX,
    rotateX = _ref$rotateX === void 0 ? false : _ref$rotateX,
    _ref$includeTextures = _ref.includeTextures,
    includeTextures = _ref$includeTextures === void 0 ? true : _ref$includeTextures,
    _ref$includeNormals = _ref.includeNormals,
    includeNormals = _ref$includeNormals === void 0 ? true : _ref$includeNormals,
    _ref$zip = _ref.zip,
    zip = _ref$zip === void 0 ? true : _ref$zip,
    _ref$log = _ref.log,
    log = _ref$log === void 0 ? function (msg) {} : _ref$log;
  stats.sourceFormat = "";
  stats.schemaVersion = "";
  stats.title = "";
  stats.author = "";
  stats.created = "";
  stats.numMetaObjects = 0;
  stats.numPropertySets = 0;
  stats.numTriangles = 0;
  stats.numVertices = 0;
  stats.numNormals = 0;
  stats.numUVs = 0;
  stats.numTextures = 0;
  stats.numTextureSets = 0;
  stats.numObjects = 0;
  stats.numGeometries = 0;
  stats.sourceSize = 0;
  stats.xktSize = 0;
  stats.texturesSize = 0;
  stats.xktVersion = "";
  stats.compressionRatio = 0;
  stats.conversionTime = 0;
  stats.aabb = null;
  function getFileExtension(fileName) {
    var ext = path.extname(fileName);
    if (ext.charAt(0) === ".") {
      ext = ext.substring(1);
    }
    return ext;
  }
  return new Promise(function (resolve, reject) {
    var _log = log;
    log = function log(msg) {
      _log("[convert2xkt] ".concat(msg));
    };
    if (!source && !sourceData) {
      reject("Argument expected: source or sourceData");
      return;
    }
    if (!sourceFormat && sourceData) {
      reject("Argument expected: sourceFormat is required with sourceData");
      return;
    }
    if (!output && !outputXKTModel && !outputXKT) {
      reject("Argument expected: output, outputXKTModel or outputXKT");
      return;
    }
    if (source) {
      log('Reading input file: ' + source);
    }
    var startTime = new Date();
    var sourceConfigs = configs.sourceConfigs || {};
    var ext = sourceFormat || getFileExtension(source);
    log("Input file extension: \"".concat(ext, "\""));
    var fileTypeConfigs = sourceConfigs[ext];
    if (!fileTypeConfigs) {
      log("[WARNING] Could not find configs sourceConfigs entry for source format \"".concat(ext, "\". This is derived from the source file name extension. Will use internal default configs."));
      fileTypeConfigs = {};
    }
    function overrideOption(option1, option2) {
      if (option1 !== undefined) {
        return option1;
      }
      return option2;
    }
    if (!sourceData) {
      try {
        sourceData = fs.readFileSync(source);
      } catch (err) {
        reject(err);
        return;
      }
    }
    var sourceFileSizeBytes = sourceData.byteLength;
    log("Input file size: " + (sourceFileSizeBytes / 1000).toFixed(2) + " kB");
    if (!metaModelDataStr && metaModelSource) {
      log('Reading input metadata file: ' + metaModelSource);
      try {
        metaModelDataStr = fs.readFileSync(metaModelSource);
      } catch (err) {
        reject(err);
        return;
      }
    } else {
      log("Not embedding metadata in XKT");
    }
    var metaModelJSON;
    if (metaModelDataStr) {
      try {
        metaModelJSON = JSON.parse(metaModelDataStr);
      } catch (e) {
        metaModelJSON = {};
        log("Error parsing metadata JSON: ".concat(e));
      }
    }
    minTileSize = overrideOption(fileTypeConfigs.minTileSize, minTileSize);
    rotateX = overrideOption(fileTypeConfigs.rotateX, rotateX);
    reuseGeometries = overrideOption(fileTypeConfigs.reuseGeometries, reuseGeometries);
    includeTextures = overrideOption(fileTypeConfigs.includeTextures, includeTextures);
    includeNormals = overrideOption(fileTypeConfigs.includeNormals, includeNormals);
    includeTypes = overrideOption(fileTypeConfigs.includeTypes, includeTypes);
    excludeTypes = overrideOption(fileTypeConfigs.excludeTypes, excludeTypes);
    if (reuseGeometries === false) {
      log("Geometry reuse is disabled");
    }
    var xktModel = new _XKTModel_XKTModel_js__WEBPACK_IMPORTED_MODULE_1__.XKTModel({
      minTileSize: minTileSize,
      modelAABB: modelAABB
    });
    switch (ext) {
      case "json":
        convert(_parsers_parseCityJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_2__.parseCityJSONIntoXKTModel, {
          data: JSON.parse(sourceData),
          xktModel: xktModel,
          stats: stats,
          rotateX: rotateX,
          center: fileTypeConfigs.center,
          transform: fileTypeConfigs.transform,
          log: log
        });
        break;
      case "glb":
        sourceData = (0,_XKTModel_lib_toArraybuffer__WEBPACK_IMPORTED_MODULE_10__.toArrayBuffer)(sourceData);
        convert(_parsers_parseGLTFIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_3__.parseGLTFIntoXKTModel, {
          data: sourceData,
          reuseGeometries: reuseGeometries,
          includeTextures: true,
          includeNormals: includeNormals,
          metaModelData: metaModelJSON,
          xktModel: xktModel,
          stats: stats,
          log: log
        });
        break;
      case "gltf":
        sourceData = (0,_XKTModel_lib_toArraybuffer__WEBPACK_IMPORTED_MODULE_10__.toArrayBuffer)(sourceData);
        var gltfBasePath = source ? path.dirname(source) : "";
        convert(_parsers_parseGLTFIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_3__.parseGLTFIntoXKTModel, {
          baseUri: gltfBasePath,
          data: sourceData,
          reuseGeometries: reuseGeometries,
          includeTextures: true,
          includeNormals: includeNormals,
          metaModelData: metaModelJSON,
          xktModel: xktModel,
          stats: stats,
          log: log
        });
        break;

      // case "gltf":
      //     const gltfJSON = JSON.parse(sourceData);
      //     const gltfBasePath = source ? getBasePath(source) : "";
      //     convert(parseGLTFIntoXKTModel, {
      //         baseUri: gltfBasePath,
      //         data: gltfJSON,
      //         reuseGeometries,
      //         includeTextures,
      //         includeNormals,
      //         metaModelData: metaModelJSON,
      //         xktModel,
      //         getAttachment: async (name) => {
      //             const filePath = gltfBasePath + name;
      //             log(`Reading attachment file: ${filePath}`);
      //             const buffer = fs.readFileSync(filePath);
      //             const arrayBuf = toArrayBuffer(buffer);
      //             return arrayBuf;
      //         },
      //         stats,
      //         log
      //     });
      //     break;

      case "ifc":
        convert(_parsers_parseIFCIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_4__.parseIFCIntoXKTModel, {
          WebIFC: WebIFC,
          data: sourceData,
          xktModel: xktModel,
          wasmPath: "./",
          includeTypes: includeTypes,
          excludeTypes: excludeTypes,
          stats: stats,
          log: log
        });
        break;
      case "laz":
        convert(_parsers_parseLASIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_5__.parseLASIntoXKTModel, {
          data: sourceData,
          xktModel: xktModel,
          stats: stats,
          fp64: fileTypeConfigs.fp64,
          colorDepth: fileTypeConfigs.colorDepth,
          center: fileTypeConfigs.center,
          transform: fileTypeConfigs.transform,
          skip: overrideOption(fileTypeConfigs.skip, 1),
          log: log
        });
        break;
      case "las":
        convert(_parsers_parseLASIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_5__.parseLASIntoXKTModel, {
          data: sourceData,
          xktModel: xktModel,
          stats: stats,
          fp64: fileTypeConfigs.fp64,
          colorDepth: fileTypeConfigs.colorDepth,
          center: fileTypeConfigs.center,
          transform: fileTypeConfigs.transform,
          skip: overrideOption(fileTypeConfigs.skip, 1),
          log: log
        });
        break;
      case "pcd":
        convert(_parsers_parsePCDIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_6__.parsePCDIntoXKTModel, {
          data: sourceData,
          xktModel: xktModel,
          stats: stats,
          log: log
        });
        break;
      case "ply":
        convert(_parsers_parsePLYIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_7__.parsePLYIntoXKTModel, {
          data: sourceData,
          xktModel: xktModel,
          stats: stats,
          log: log
        });
        break;
      case "stl":
        convert(_parsers_parseSTLIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_8__.parseSTLIntoXKTModel, {
          data: sourceData,
          xktModel: xktModel,
          stats: stats,
          log: log
        });
        break;
      default:
        reject("Error: unsupported source format: \"".concat(ext, "\"."));
        return;
    }
    function convert(parser, converterParams) {
      parser(converterParams).then(function () {
        if (!metaModelJSON) {
          log("Creating default metamodel in XKT");
          xktModel.createDefaultMetaObjects();
        }
        log("Input file parsed OK. Building XKT document...");
        xktModel.finalize().then(function () {
          log("XKT document built OK. Writing to XKT file...");
          var xktArrayBuffer = (0,_XKTModel_writeXKTModelToArrayBuffer_js__WEBPACK_IMPORTED_MODULE_9__.writeXKTModelToArrayBuffer)(xktModel, metaModelJSON, stats, {
            zip: zip
          });
          var xktContent = Buffer.from(xktArrayBuffer);
          var targetFileSizeBytes = xktArrayBuffer.byteLength;
          stats.minTileSize = minTileSize || 200;
          stats.sourceSize = (sourceFileSizeBytes / 1000).toFixed(2);
          stats.xktSize = (targetFileSizeBytes / 1000).toFixed(2);
          stats.xktVersion = zip ? 10 : _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__.XKT_INFO.xktVersion;
          stats.compressionRatio = (sourceFileSizeBytes / targetFileSizeBytes).toFixed(2);
          stats.conversionTime = ((new Date() - startTime) / 1000.0).toFixed(2);
          stats.aabb = xktModel.aabb;
          log("Converted to: XKT v".concat(stats.xktVersion));
          if (includeTypes) {
            log("Include types: " + (includeTypes ? includeTypes : "(include all)"));
          }
          if (excludeTypes) {
            log("Exclude types: " + (excludeTypes ? excludeTypes : "(exclude none)"));
          }
          log("XKT size: " + stats.xktSize + " kB");
          log("XKT textures size: " + (stats.texturesSize / 1000).toFixed(2) + "kB");
          log("Compression ratio: " + stats.compressionRatio);
          log("Conversion time: " + stats.conversionTime + " s");
          log("Converted metaobjects: " + stats.numMetaObjects);
          log("Converted property sets: " + stats.numPropertySets);
          log("Converted drawable objects: " + stats.numObjects);
          log("Converted geometries: " + stats.numGeometries);
          log("Converted textures: " + stats.numTextures);
          log("Converted textureSets: " + stats.numTextureSets);
          log("Converted triangles: " + stats.numTriangles);
          log("Converted vertices: " + stats.numVertices);
          log("Converted UVs: " + stats.numUVs);
          log("Converted normals: " + stats.numNormals);
          log("Converted tiles: " + xktModel.tilesList.length);
          log("minTileSize: " + stats.minTileSize);
          if (output) {
            var outputDir = path.dirname(output);
            if (outputDir !== "" && !fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, {
                recursive: true
              });
            }
            log('Writing XKT file: ' + output);
            fs.writeFileSync(output, xktContent);
          }
          if (outputXKTModel) {
            outputXKTModel(xktModel);
          }
          if (outputXKT) {
            outputXKT(xktContent);
          }
          if (outputStats) {
            outputStats(stats);
          }
          resolve();
        });
      }, function (err) {
        reject(err);
      });
    }
  });
}


/***/ }),

/***/ "./src/geometryBuilders/buildBoxGeometry.js":
/*!**************************************************!*\
  !*** ./src/geometryBuilders/buildBoxGeometry.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildBoxGeometry: () => (/* binding */ buildBoxGeometry)
/* harmony export */ });
/**
 * @desc Creates box-shaped triangle mesh geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a box-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildBoxGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const box = buildBoxGeometry({
 *     primitiveType: "triangles" // or "lines"
 *     center: [0,0,0],
 *     xSize: 1,  // Half-size on each axis
 *     ySize: 1,
 *     zSize: 1
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "boxGeometry",
 *      primitiveType: box.primitiveType,
 *      positions: box.positions,
 *      normals: box.normals,
 *      indices: box.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redBoxMesh",
 *      geometryId: "boxGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redBox",
 *      meshIds: ["redBoxMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildBoxGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number} [cfg.xSize=1.0]  Half-size on the X-axis.
 * @param {Number} [cfg.ySize=1.0]  Half-size on the Y-axis.
 * @param {Number} [cfg.zSize=1.0]  Half-size on the Z-axis.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildBoxGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var xSize = cfg.xSize || 1;
  if (xSize < 0) {
    console.error("negative xSize not allowed - will invert");
    xSize *= -1;
  }
  var ySize = cfg.ySize || 1;
  if (ySize < 0) {
    console.error("negative ySize not allowed - will invert");
    ySize *= -1;
  }
  var zSize = cfg.zSize || 1;
  if (zSize < 0) {
    console.error("negative zSize not allowed - will invert");
    zSize *= -1;
  }
  var center = cfg.center;
  var centerX = center ? center[0] : 0;
  var centerY = center ? center[1] : 0;
  var centerZ = center ? center[2] : 0;
  var xmin = -xSize + centerX;
  var ymin = -ySize + centerY;
  var zmin = -zSize + centerZ;
  var xmax = xSize + centerX;
  var ymax = ySize + centerY;
  var zmax = zSize + centerZ;
  return {
    primitiveType: "triangles",
    // The vertices - eight for our cube, each
    // one spanning three array elements for X,Y and Z

    positions: [
    // v0-v1-v2-v3 front
    xmax, ymax, zmax, xmin, ymax, zmax, xmin, ymin, zmax, xmax, ymin, zmax,
    // v0-v3-v4-v1 right
    xmax, ymax, zmax, xmax, ymin, zmax, xmax, ymin, zmin, xmax, ymax, zmin,
    // v0-v1-v6-v1 top
    xmax, ymax, zmax, xmax, ymax, zmin, xmin, ymax, zmin, xmin, ymax, zmax,
    // v1-v6-v7-v2 left
    xmin, ymax, zmax, xmin, ymax, zmin, xmin, ymin, zmin, xmin, ymin, zmax,
    // v7-v4-v3-v2 bottom
    xmin, ymin, zmin, xmax, ymin, zmin, xmax, ymin, zmax, xmin, ymin, zmax,
    // v4-v7-v6-v1 back
    xmax, ymin, zmin, xmin, ymin, zmin, xmin, ymax, zmin, xmax, ymax, zmin],
    // Normal vectors, one for each vertex
    normals: [
    // v0-v1-v2-v3 front
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    // v0-v3-v4-v5 right
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    // v0-v5-v6-v1 top
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    // v1-v6-v7-v2 left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    // v7-v4-v3-v2 bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // v4-v7-v6-v5 back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
    // UV coords
    uv: [
    // v0-v1-v2-v3 front
    1, 0, 0, 0, 0, 1, 1, 1,
    // v0-v3-v4-v1 right
    0, 0, 0, 1, 1, 1, 1, 0,
    // v0-v1-v6-v1 top
    1, 1, 1, 0, 0, 0, 0, 1,
    // v1-v6-v7-v2 left
    1, 0, 0, 0, 0, 1, 1, 1,
    // v7-v4-v3-v2 bottom
    0, 1, 1, 1, 1, 0, 0, 0,
    // v4-v7-v6-v1 back
    0, 1, 1, 1, 1, 0, 0, 0],
    // Indices - these organise the
    // positions and uv texture coordinates
    // into geometric primitives in accordance
    // with the "primitive" parameter,
    // in this case a set of three indices
    // for each triangle.
    //
    // Note that each triangle is specified
    // in counter-clockwise winding order.
    //
    // You can specify them in clockwise
    // order if you configure the Modes
    // node's frontFace flag as "cw", instead of
    // the default "ccw".
    indices: [0, 1, 2, 0, 2, 3,
    // front
    4, 5, 6, 4, 6, 7,
    // right
    8, 9, 10, 8, 10, 11,
    // top
    12, 13, 14, 12, 14, 15,
    // left
    16, 17, 18, 16, 18, 19,
    // bottom
    20, 21, 22, 20, 22, 23]
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildBoxLinesGeometry.js":
/*!*******************************************************!*\
  !*** ./src/geometryBuilders/buildBoxLinesGeometry.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildBoxLinesGeometry: () => (/* binding */ buildBoxLinesGeometry)
/* harmony export */ });
/**
 * @desc Creates box-shaped line segment geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a box-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildBoxLinesGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const box = buildBoxLinesGeometry({
 *     center: [0,0,0],
 *     xSize: 1,  // Half-size on each axis
 *     ySize: 1,
 *     zSize: 1
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "boxGeometry",
 *      primitiveType: box.primitiveType, // "lines"
 *      positions: box.positions,
 *      normals: box.normals,
 *      indices: box.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redBoxMesh",
 *      geometryId: "boxGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redBox",
 *      meshIds: ["redBoxMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildBoxLinesGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number} [cfg.xSize=1.0]  Half-size on the X-axis.
 * @param {Number} [cfg.ySize=1.0]  Half-size on the Y-axis.
 * @param {Number} [cfg.zSize=1.0]  Half-size on the Z-axis.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildBoxLinesGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var xSize = cfg.xSize || 1;
  if (xSize < 0) {
    console.error("negative xSize not allowed - will invert");
    xSize *= -1;
  }
  var ySize = cfg.ySize || 1;
  if (ySize < 0) {
    console.error("negative ySize not allowed - will invert");
    ySize *= -1;
  }
  var zSize = cfg.zSize || 1;
  if (zSize < 0) {
    console.error("negative zSize not allowed - will invert");
    zSize *= -1;
  }
  var center = cfg.center;
  var centerX = center ? center[0] : 0;
  var centerY = center ? center[1] : 0;
  var centerZ = center ? center[2] : 0;
  var xmin = -xSize + centerX;
  var ymin = -ySize + centerY;
  var zmin = -zSize + centerZ;
  var xmax = xSize + centerX;
  var ymax = ySize + centerY;
  var zmax = zSize + centerZ;
  return {
    primitiveType: "lines",
    positions: [xmin, ymin, zmin, xmin, ymin, zmax, xmin, ymax, zmin, xmin, ymax, zmax, xmax, ymin, zmin, xmax, ymin, zmax, xmax, ymax, zmin, xmax, ymax, zmax],
    indices: [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 2, 6, 3, 7]
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildCylinderGeometry.js":
/*!*******************************************************!*\
  !*** ./src/geometryBuilders/buildCylinderGeometry.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildCylinderGeometry: () => (/* binding */ buildCylinderGeometry)
/* harmony export */ });
/**
 * @desc Creates cylinder-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a cylinder-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildCylinderGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const cylinder = buildCylinderGeometry({
 *      center: [0,0,0],
 *      radiusTop: 2.0,
 *      radiusBottom: 2.0,
 *      height: 5.0,
 *      radialSegments: 20,
 *      heightSegments: 1,
 *      openEnded: false
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "cylinderGeometry",
 *      primitiveType: cylinder.primitiveType,
 *      positions: cylinder.positions,
 *      normals: cylinder.normals,
 *      indices: cylinder.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redCylinderMesh",
 *      geometryId: "cylinderGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redCylinder",
 *      meshIds: ["redCylinderMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildCylinderGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center] 3D point indicating the center position.
 * @param {Number} [cfg.radiusTop=1]  Radius of top.
 * @param {Number} [cfg.radiusBottom=1]  Radius of bottom.
 * @param {Number} [cfg.height=1] Height.
 * @param {Number} [cfg.radialSegments=60]  Number of horizontal segments.
 * @param {Number} [cfg.heightSegments=1]  Number of vertical segments.
 * @param {Boolean} [cfg.openEnded=false]  Whether or not the cylinder has solid caps on the ends.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildCylinderGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var radiusTop = cfg.radiusTop || 1;
  if (radiusTop < 0) {
    console.error("negative radiusTop not allowed - will invert");
    radiusTop *= -1;
  }
  var radiusBottom = cfg.radiusBottom || 1;
  if (radiusBottom < 0) {
    console.error("negative radiusBottom not allowed - will invert");
    radiusBottom *= -1;
  }
  var height = cfg.height || 1;
  if (height < 0) {
    console.error("negative height not allowed - will invert");
    height *= -1;
  }
  var radialSegments = cfg.radialSegments || 32;
  if (radialSegments < 0) {
    console.error("negative radialSegments not allowed - will invert");
    radialSegments *= -1;
  }
  if (radialSegments < 3) {
    radialSegments = 3;
  }
  var heightSegments = cfg.heightSegments || 1;
  if (heightSegments < 0) {
    console.error("negative heightSegments not allowed - will invert");
    heightSegments *= -1;
  }
  if (heightSegments < 1) {
    heightSegments = 1;
  }
  var openEnded = !!cfg.openEnded;
  var center = cfg.center;
  var centerX = center ? center[0] : 0;
  var centerY = center ? center[1] : 0;
  var centerZ = center ? center[2] : 0;
  var heightHalf = height / 2;
  var heightLength = height / heightSegments;
  var radialAngle = 2.0 * Math.PI / radialSegments;
  var radialLength = 1.0 / radialSegments;
  //var nextRadius = this._radiusBottom;
  var radiusChange = (radiusTop - radiusBottom) / heightSegments;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var h;
  var i;
  var x;
  var z;
  var currentRadius;
  var currentHeight;
  var first;
  var second;
  var startIndex;
  var tu;
  var tv;

  // create vertices
  var normalY = (90.0 - Math.atan(height / (radiusBottom - radiusTop)) * 180 / Math.PI) / 90.0;
  for (h = 0; h <= heightSegments; h++) {
    currentRadius = radiusTop - h * radiusChange;
    currentHeight = heightHalf - h * heightLength;
    for (i = 0; i <= radialSegments; i++) {
      x = Math.sin(i * radialAngle);
      z = Math.cos(i * radialAngle);
      normals.push(currentRadius * x);
      normals.push(normalY); //todo
      normals.push(currentRadius * z);
      uvs.push(i * radialLength);
      uvs.push(h * 1 / heightSegments);
      positions.push(currentRadius * x + centerX);
      positions.push(currentHeight + centerY);
      positions.push(currentRadius * z + centerZ);
    }
  }

  // create faces
  for (h = 0; h < heightSegments; h++) {
    for (i = 0; i <= radialSegments; i++) {
      first = h * (radialSegments + 1) + i;
      second = first + radialSegments;
      indices.push(first);
      indices.push(second);
      indices.push(second + 1);
      indices.push(first);
      indices.push(second + 1);
      indices.push(first + 1);
    }
  }

  // create top cap
  if (!openEnded && radiusTop > 0) {
    startIndex = positions.length / 3;

    // top center
    normals.push(0.0);
    normals.push(1.0);
    normals.push(0.0);
    uvs.push(0.5);
    uvs.push(0.5);
    positions.push(0 + centerX);
    positions.push(heightHalf + centerY);
    positions.push(0 + centerZ);

    // top triangle fan
    for (i = 0; i <= radialSegments; i++) {
      x = Math.sin(i * radialAngle);
      z = Math.cos(i * radialAngle);
      tu = 0.5 * Math.sin(i * radialAngle) + 0.5;
      tv = 0.5 * Math.cos(i * radialAngle) + 0.5;
      normals.push(radiusTop * x);
      normals.push(1.0);
      normals.push(radiusTop * z);
      uvs.push(tu);
      uvs.push(tv);
      positions.push(radiusTop * x + centerX);
      positions.push(heightHalf + centerY);
      positions.push(radiusTop * z + centerZ);
    }
    for (i = 0; i < radialSegments; i++) {
      center = startIndex;
      first = startIndex + 1 + i;
      indices.push(first);
      indices.push(first + 1);
      indices.push(center);
    }
  }

  // create bottom cap
  if (!openEnded && radiusBottom > 0) {
    startIndex = positions.length / 3;

    // top center
    normals.push(0.0);
    normals.push(-1.0);
    normals.push(0.0);
    uvs.push(0.5);
    uvs.push(0.5);
    positions.push(0 + centerX);
    positions.push(0 - heightHalf + centerY);
    positions.push(0 + centerZ);

    // top triangle fan
    for (i = 0; i <= radialSegments; i++) {
      x = Math.sin(i * radialAngle);
      z = Math.cos(i * radialAngle);
      tu = 0.5 * Math.sin(i * radialAngle) + 0.5;
      tv = 0.5 * Math.cos(i * radialAngle) + 0.5;
      normals.push(radiusBottom * x);
      normals.push(-1.0);
      normals.push(radiusBottom * z);
      uvs.push(tu);
      uvs.push(tv);
      positions.push(radiusBottom * x + centerX);
      positions.push(0 - heightHalf + centerY);
      positions.push(radiusBottom * z + centerZ);
    }
    for (i = 0; i < radialSegments; i++) {
      center = startIndex;
      first = startIndex + 1 + i;
      indices.push(center);
      indices.push(first + 1);
      indices.push(first);
    }
  }
  return {
    primitiveType: "triangles",
    positions: positions,
    normals: normals,
    uv: uvs,
    uvs: uvs,
    indices: indices
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildGridGeometry.js":
/*!***************************************************!*\
  !*** ./src/geometryBuilders/buildGridGeometry.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildGridGeometry: () => (/* binding */ buildGridGeometry)
/* harmony export */ });
/**
 * @desc Creates grid-shaped geometry arrays..
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a grid-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildGridGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const grid = buildGridGeometry({
 *      size: 1000,
 *      divisions: 500
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "gridGeometry",
 *      primitiveType: grid.primitiveType, // Will be "lines"
 *      positions: grid.positions,
 *      indices: grid.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redGridMesh",
 *      geometryId: "gridGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redGrid",
 *      meshIds: ["redGridMesh"]
 * });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildGridGeometry
 * @param {*} [cfg] Configs
 * @param {Number} [cfg.size=1] Dimension on the X and Z-axis.
 * @param {Number} [cfg.divisions=1] Number of divisions on X and Z axis..
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildGridGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var size = cfg.size || 1;
  if (size < 0) {
    console.error("negative size not allowed - will invert");
    size *= -1;
  }
  var divisions = cfg.divisions || 1;
  if (divisions < 0) {
    console.error("negative divisions not allowed - will invert");
    divisions *= -1;
  }
  if (divisions < 1) {
    divisions = 1;
  }
  size = size || 10;
  divisions = divisions || 10;
  var step = size / divisions;
  var halfSize = size / 2;
  var positions = [];
  var indices = [];
  var l = 0;
  for (var i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
    positions.push(-halfSize);
    positions.push(0);
    positions.push(k);
    positions.push(halfSize);
    positions.push(0);
    positions.push(k);
    positions.push(k);
    positions.push(0);
    positions.push(-halfSize);
    positions.push(k);
    positions.push(0);
    positions.push(halfSize);
    indices.push(l++);
    indices.push(l++);
    indices.push(l++);
    indices.push(l++);
  }
  return {
    primitiveType: "lines",
    positions: positions,
    indices: indices
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildPlaneGeometry.js":
/*!****************************************************!*\
  !*** ./src/geometryBuilders/buildPlaneGeometry.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildPlaneGeometry: () => (/* binding */ buildPlaneGeometry)
/* harmony export */ });
/**
 * @desc Creates plane-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a plane-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildPlaneGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const plane = buildPlaneGeometry({
 *      center: [0,0,0],
 *      xSize: 2,
 *      zSize: 2,
 *      xSegments: 10,
 *      zSegments: 10
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "planeGeometry",
 *      primitiveType: plane.primitiveType, // Will be "triangles"
 *      positions: plane.positions,
 *      normals: plane.normals,
 *      indices: plane.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redPlaneMesh",
 *      geometryId: "planeGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redPlane",
 *      meshIds: ["redPlaneMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildPlaneGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number} [cfg.xSize=1] Dimension on the X-axis.
 * @param {Number} [cfg.zSize=1] Dimension on the Z-axis.
 * @param {Number} [cfg.xSegments=1] Number of segments on the X-axis.
 * @param {Number} [cfg.zSegments=1] Number of segments on the Z-axis.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildPlaneGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var xSize = cfg.xSize || 1;
  if (xSize < 0) {
    console.error("negative xSize not allowed - will invert");
    xSize *= -1;
  }
  var zSize = cfg.zSize || 1;
  if (zSize < 0) {
    console.error("negative zSize not allowed - will invert");
    zSize *= -1;
  }
  var xSegments = cfg.xSegments || 1;
  if (xSegments < 0) {
    console.error("negative xSegments not allowed - will invert");
    xSegments *= -1;
  }
  if (xSegments < 1) {
    xSegments = 1;
  }
  var zSegments = cfg.xSegments || 1;
  if (zSegments < 0) {
    console.error("negative zSegments not allowed - will invert");
    zSegments *= -1;
  }
  if (zSegments < 1) {
    zSegments = 1;
  }
  var center = cfg.center;
  var centerX = center ? center[0] : 0;
  var centerY = center ? center[1] : 0;
  var centerZ = center ? center[2] : 0;
  var halfWidth = xSize / 2;
  var halfHeight = zSize / 2;
  var planeX = Math.floor(xSegments) || 1;
  var planeZ = Math.floor(zSegments) || 1;
  var planeX1 = planeX + 1;
  var planeZ1 = planeZ + 1;
  var segmentWidth = xSize / planeX;
  var segmentHeight = zSize / planeZ;
  var positions = new Float32Array(planeX1 * planeZ1 * 3);
  var normals = new Float32Array(planeX1 * planeZ1 * 3);
  var uvs = new Float32Array(planeX1 * planeZ1 * 2);
  var offset = 0;
  var offset2 = 0;
  var iz;
  var ix;
  var x;
  var a;
  var b;
  var c;
  var d;
  for (iz = 0; iz < planeZ1; iz++) {
    var z = iz * segmentHeight - halfHeight;
    for (ix = 0; ix < planeX1; ix++) {
      x = ix * segmentWidth - halfWidth;
      positions[offset] = x + centerX;
      positions[offset + 1] = centerY;
      positions[offset + 2] = -z + centerZ;
      normals[offset + 2] = -1;
      uvs[offset2] = ix / planeX;
      uvs[offset2 + 1] = (planeZ - iz) / planeZ;
      offset += 3;
      offset2 += 2;
    }
  }
  offset = 0;
  var indices = new (positions.length / 3 > 65535 ? Uint32Array : Uint16Array)(planeX * planeZ * 6);
  for (iz = 0; iz < planeZ; iz++) {
    for (ix = 0; ix < planeX; ix++) {
      a = ix + planeX1 * iz;
      b = ix + planeX1 * (iz + 1);
      c = ix + 1 + planeX1 * (iz + 1);
      d = ix + 1 + planeX1 * iz;
      indices[offset] = d;
      indices[offset + 1] = b;
      indices[offset + 2] = a;
      indices[offset + 3] = d;
      indices[offset + 4] = c;
      indices[offset + 5] = b;
      offset += 6;
    }
  }
  return {
    primitiveType: "triangles",
    positions: positions,
    normals: normals,
    uv: uvs,
    uvs: uvs,
    indices: indices
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildSphereGeometry.js":
/*!*****************************************************!*\
  !*** ./src/geometryBuilders/buildSphereGeometry.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildSphereGeometry: () => (/* binding */ buildSphereGeometry)
/* harmony export */ });
/**
 * @desc Creates sphere-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a sphere-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildSphereGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const sphere = buildSphereGeometry({
 *      center: [0,0,0],
 *      radius: 1.5,
 *      heightSegments: 60,
 *      widthSegments: 60
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "sphereGeometry",
 *      primitiveType: sphere.primitiveType, // Will be "triangles"
 *      positions: sphere.positions,
 *      normals: sphere.normals,
 *      indices: sphere.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redSphereMesh",
 *      geometryId: "sphereGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 *const xktEntity = xktModel.createEntity({
 *      entityId: "redSphere",
 *      meshIds: ["redSphereMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildSphereGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number} [cfg.radius=1]  Radius.
 * @param {Number} [cfg.heightSegments=24] Number of latitudinal bands.
 * @param  {Number} [cfg.widthSegments=18] Number of longitudinal bands.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildSphereGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var lod = cfg.lod || 1;
  var centerX = cfg.center ? cfg.center[0] : 0;
  var centerY = cfg.center ? cfg.center[1] : 0;
  var centerZ = cfg.center ? cfg.center[2] : 0;
  var radius = cfg.radius || 1;
  if (radius < 0) {
    console.error("negative radius not allowed - will invert");
    radius *= -1;
  }
  var heightSegments = cfg.heightSegments || 18;
  if (heightSegments < 0) {
    console.error("negative heightSegments not allowed - will invert");
    heightSegments *= -1;
  }
  heightSegments = Math.floor(lod * heightSegments);
  if (heightSegments < 18) {
    heightSegments = 18;
  }
  var widthSegments = cfg.widthSegments || 18;
  if (widthSegments < 0) {
    console.error("negative widthSegments not allowed - will invert");
    widthSegments *= -1;
  }
  widthSegments = Math.floor(lod * widthSegments);
  if (widthSegments < 18) {
    widthSegments = 18;
  }
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var i;
  var j;
  var theta;
  var sinTheta;
  var cosTheta;
  var phi;
  var sinPhi;
  var cosPhi;
  var x;
  var y;
  var z;
  var u;
  var v;
  var first;
  var second;
  for (i = 0; i <= heightSegments; i++) {
    theta = i * Math.PI / heightSegments;
    sinTheta = Math.sin(theta);
    cosTheta = Math.cos(theta);
    for (j = 0; j <= widthSegments; j++) {
      phi = j * 2 * Math.PI / widthSegments;
      sinPhi = Math.sin(phi);
      cosPhi = Math.cos(phi);
      x = cosPhi * sinTheta;
      y = cosTheta;
      z = sinPhi * sinTheta;
      u = 1.0 - j / widthSegments;
      v = i / heightSegments;
      normals.push(x);
      normals.push(y);
      normals.push(z);
      uvs.push(u);
      uvs.push(v);
      positions.push(centerX + radius * x);
      positions.push(centerY + radius * y);
      positions.push(centerZ + radius * z);
    }
  }
  for (i = 0; i < heightSegments; i++) {
    for (j = 0; j < widthSegments; j++) {
      first = i * (widthSegments + 1) + j;
      second = first + widthSegments + 1;
      indices.push(first + 1);
      indices.push(second + 1);
      indices.push(second);
      indices.push(first + 1);
      indices.push(second);
      indices.push(first);
    }
  }
  return {
    primitiveType: "triangles",
    positions: positions,
    normals: normals,
    uv: uvs,
    uvs: uvs,
    indices: indices
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildTorusGeometry.js":
/*!****************************************************!*\
  !*** ./src/geometryBuilders/buildTorusGeometry.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildTorusGeometry: () => (/* binding */ buildTorusGeometry)
/* harmony export */ });
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");


/**
 * @desc Creates torus-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a torus-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildTorusGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const torus = buildTorusGeometry({
 *      center: [0,0,0],
 *      radius: 1.0,
 *      tube: 0.5,
 *      radialSegments: 32,
 *      tubeSegments: 24,
 *      arc: Math.PI * 2.0
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "torusGeometry",
 *      primitiveType: torus.primitiveType, // Will be "triangles"
 *      positions: torus.positions,
 *      normals: torus.normals,
 *      indices: torus.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redTorusMesh",
 *      geometryId: "torusGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redTorus",
 *      meshIds: ["redTorusMesh"]
 * });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildTorusGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center] 3D point indicating the center position.
 * @param {Number} [cfg.radius=1] The overall radius.
 * @param {Number} [cfg.tube=0.3] The tube radius.
 * @param {Number} [cfg.radialSegments=32] The number of radial segments.
 * @param {Number} [cfg.tubeSegments=24] The number of tubular segments.
 * @param {Number} [cfg.arc=Math.PI*0.5] The length of the arc in radians, where Math.PI*2 is a closed torus.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildTorusGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var radius = cfg.radius || 1;
  if (radius < 0) {
    console.error("negative radius not allowed - will invert");
    radius *= -1;
  }
  radius *= 0.5;
  var tube = cfg.tube || 0.3;
  if (tube < 0) {
    console.error("negative tube not allowed - will invert");
    tube *= -1;
  }
  var radialSegments = cfg.radialSegments || 32;
  if (radialSegments < 0) {
    console.error("negative radialSegments not allowed - will invert");
    radialSegments *= -1;
  }
  if (radialSegments < 4) {
    radialSegments = 4;
  }
  var tubeSegments = cfg.tubeSegments || 24;
  if (tubeSegments < 0) {
    console.error("negative tubeSegments not allowed - will invert");
    tubeSegments *= -1;
  }
  if (tubeSegments < 4) {
    tubeSegments = 4;
  }
  var arc = cfg.arc || Math.PI * 2;
  if (arc < 0) {
    console.warn("negative arc not allowed - will invert");
    arc *= -1;
  }
  if (arc > 360) {
    arc = 360;
  }
  var center = cfg.center;
  var centerX = center ? center[0] : 0;
  var centerY = center ? center[1] : 0;
  var centerZ = center ? center[2] : 0;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var u;
  var v;
  var x;
  var y;
  var z;
  var vec;
  var i;
  var j;
  for (j = 0; j <= tubeSegments; j++) {
    for (i = 0; i <= radialSegments; i++) {
      u = i / radialSegments * arc;
      v = 0.785398 + j / tubeSegments * Math.PI * 2;
      centerX = radius * Math.cos(u);
      centerY = radius * Math.sin(u);
      x = (radius + tube * Math.cos(v)) * Math.cos(u);
      y = (radius + tube * Math.cos(v)) * Math.sin(u);
      z = tube * Math.sin(v);
      positions.push(x + centerX);
      positions.push(y + centerY);
      positions.push(z + centerZ);
      uvs.push(1 - i / radialSegments);
      uvs.push(j / tubeSegments);
      vec = _lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.normalizeVec3(_lib_math_js__WEBPACK_IMPORTED_MODULE_0__.math.subVec3([x, y, z], [centerX, centerY, centerZ], []), []);
      normals.push(vec[0]);
      normals.push(vec[1]);
      normals.push(vec[2]);
    }
  }
  var a;
  var b;
  var c;
  var d;
  for (j = 1; j <= tubeSegments; j++) {
    for (i = 1; i <= radialSegments; i++) {
      a = (radialSegments + 1) * j + i - 1;
      b = (radialSegments + 1) * (j - 1) + i - 1;
      c = (radialSegments + 1) * (j - 1) + i;
      d = (radialSegments + 1) * j + i;
      indices.push(a);
      indices.push(b);
      indices.push(c);
      indices.push(c);
      indices.push(d);
      indices.push(a);
    }
  }
  return {
    primitiveType: "triangles",
    positions: positions,
    normals: normals,
    uv: uvs,
    uvs: uvs,
    indices: indices
  };
}


/***/ }),

/***/ "./src/geometryBuilders/buildVectorTextGeometry.js":
/*!*********************************************************!*\
  !*** ./src/geometryBuilders/buildVectorTextGeometry.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildVectorTextGeometry: () => (/* binding */ buildVectorTextGeometry)
/* harmony export */ });
var letters = {
  ' ': {
    width: 16,
    points: []
  },
  '!': {
    width: 10,
    points: [[5, 21], [5, 7], [-1, -1], [5, 2], [4, 1], [5, 0], [6, 1], [5, 2]]
  },
  '"': {
    width: 16,
    points: [[4, 21], [4, 14], [-1, -1], [12, 21], [12, 14]]
  },
  '#': {
    width: 21,
    points: [[11, 25], [4, -7], [-1, -1], [17, 25], [10, -7], [-1, -1], [4, 12], [18, 12], [-1, -1], [3, 6], [17, 6]]
  },
  '$': {
    width: 20,
    points: [[8, 25], [8, -4], [-1, -1], [12, 25], [12, -4], [-1, -1], [17, 18], [15, 20], [12, 21], [8, 21], [5, 20], [3, 18], [3, 16], [4, 14], [5, 13], [7, 12], [13, 10], [15, 9], [16, 8], [17, 6], [17, 3], [15, 1], [12, 0], [8, 0], [5, 1], [3, 3]]
  },
  '%': {
    width: 24,
    points: [[21, 21], [3, 0], [-1, -1], [8, 21], [10, 19], [10, 17], [9, 15], [7, 14], [5, 14], [3, 16], [3, 18], [4, 20], [6, 21], [8, 21], [10, 20], [13, 19], [16, 19], [19, 20], [21, 21], [-1, -1], [17, 7], [15, 6], [14, 4], [14, 2], [16, 0], [18, 0], [20, 1], [21, 3], [21, 5], [19, 7], [17, 7]]
  },
  '&': {
    width: 26,
    points: [[23, 12], [23, 13], [22, 14], [21, 14], [20, 13], [19, 11], [17, 6], [15, 3], [13, 1], [11, 0], [7, 0], [5, 1], [4, 2], [3, 4], [3, 6], [4, 8], [5, 9], [12, 13], [13, 14], [14, 16], [14, 18], [13, 20], [11, 21], [9, 20], [8, 18], [8, 16], [9, 13], [11, 10], [16, 3], [18, 1], [20, 0], [22, 0], [23, 1], [23, 2]]
  },
  '\'': {
    width: 10,
    points: [[5, 19], [4, 20], [5, 21], [6, 20], [6, 18], [5, 16], [4, 15]]
  },
  '(': {
    width: 14,
    points: [[11, 25], [9, 23], [7, 20], [5, 16], [4, 11], [4, 7], [5, 2], [7, -2], [9, -5], [11, -7]]
  },
  ')': {
    width: 14,
    points: [[3, 25], [5, 23], [7, 20], [9, 16], [10, 11], [10, 7], [9, 2], [7, -2], [5, -5], [3, -7]]
  },
  '*': {
    width: 16,
    points: [[8, 21], [8, 9], [-1, -1], [3, 18], [13, 12], [-1, -1], [13, 18], [3, 12]]
  },
  '+': {
    width: 26,
    points: [[13, 18], [13, 0], [-1, -1], [4, 9], [22, 9]]
  },
  ',': {
    width: 10,
    points: [[6, 1], [5, 0], [4, 1], [5, 2], [6, 1], [6, -1], [5, -3], [4, -4]]
  },
  '-': {
    width: 26,
    points: [[4, 9], [22, 9]]
  },
  '.': {
    width: 10,
    points: [[5, 2], [4, 1], [5, 0], [6, 1], [5, 2]]
  },
  '/': {
    width: 22,
    points: [[20, 25], [2, -7]]
  },
  '0': {
    width: 20,
    points: [[9, 21], [6, 20], [4, 17], [3, 12], [3, 9], [4, 4], [6, 1], [9, 0], [11, 0], [14, 1], [16, 4], [17, 9], [17, 12], [16, 17], [14, 20], [11, 21], [9, 21]]
  },
  '1': {
    width: 20,
    points: [[6, 17], [8, 18], [11, 21], [11, 0]]
  },
  '2': {
    width: 20,
    points: [[4, 16], [4, 17], [5, 19], [6, 20], [8, 21], [12, 21], [14, 20], [15, 19], [16, 17], [16, 15], [15, 13], [13, 10], [3, 0], [17, 0]]
  },
  '3': {
    width: 20,
    points: [[5, 21], [16, 21], [10, 13], [13, 13], [15, 12], [16, 11], [17, 8], [17, 6], [16, 3], [14, 1], [11, 0], [8, 0], [5, 1], [4, 2], [3, 4]]
  },
  '4': {
    width: 20,
    points: [[13, 21], [3, 7], [18, 7], [-1, -1], [13, 21], [13, 0]]
  },
  '5': {
    width: 20,
    points: [[15, 21], [5, 21], [4, 12], [5, 13], [8, 14], [11, 14], [14, 13], [16, 11], [17, 8], [17, 6], [16, 3], [14, 1], [11, 0], [8, 0], [5, 1], [4, 2], [3, 4]]
  },
  '6': {
    width: 20,
    points: [[16, 18], [15, 20], [12, 21], [10, 21], [7, 20], [5, 17], [4, 12], [4, 7], [5, 3], [7, 1], [10, 0], [11, 0], [14, 1], [16, 3], [17, 6], [17, 7], [16, 10], [14, 12], [11, 13], [10, 13], [7, 12], [5, 10], [4, 7]]
  },
  '7': {
    width: 20,
    points: [[17, 21], [7, 0], [-1, -1], [3, 21], [17, 21]]
  },
  '8': {
    width: 20,
    points: [[8, 21], [5, 20], [4, 18], [4, 16], [5, 14], [7, 13], [11, 12], [14, 11], [16, 9], [17, 7], [17, 4], [16, 2], [15, 1], [12, 0], [8, 0], [5, 1], [4, 2], [3, 4], [3, 7], [4, 9], [6, 11], [9, 12], [13, 13], [15, 14], [16, 16], [16, 18], [15, 20], [12, 21], [8, 21]]
  },
  '9': {
    width: 20,
    points: [[16, 14], [15, 11], [13, 9], [10, 8], [9, 8], [6, 9], [4, 11], [3, 14], [3, 15], [4, 18], [6, 20], [9, 21], [10, 21], [13, 20], [15, 18], [16, 14], [16, 9], [15, 4], [13, 1], [10, 0], [8, 0], [5, 1], [4, 3]]
  },
  ':': {
    width: 10,
    points: [[5, 14], [4, 13], [5, 12], [6, 13], [5, 14], [-1, -1], [5, 2], [4, 1], [5, 0], [6, 1], [5, 2]]
  },
  ';': {
    width: 10,
    points: [[5, 14], [4, 13], [5, 12], [6, 13], [5, 14], [-1, -1], [6, 1], [5, 0], [4, 1], [5, 2], [6, 1], [6, -1], [5, -3], [4, -4]]
  },
  '<': {
    width: 24,
    points: [[20, 18], [4, 9], [20, 0]]
  },
  '=': {
    width: 26,
    points: [[4, 12], [22, 12], [-1, -1], [4, 6], [22, 6]]
  },
  '>': {
    width: 24,
    points: [[4, 18], [20, 9], [4, 0]]
  },
  '?': {
    width: 18,
    points: [[3, 16], [3, 17], [4, 19], [5, 20], [7, 21], [11, 21], [13, 20], [14, 19], [15, 17], [15, 15], [14, 13], [13, 12], [9, 10], [9, 7], [-1, -1], [9, 2], [8, 1], [9, 0], [10, 1], [9, 2]]
  },
  '@': {
    width: 27,
    points: [[18, 13], [17, 15], [15, 16], [12, 16], [10, 15], [9, 14], [8, 11], [8, 8], [9, 6], [11, 5], [14, 5], [16, 6], [17, 8], [-1, -1], [12, 16], [10, 14], [9, 11], [9, 8], [10, 6], [11, 5], [-1, -1], [18, 16], [17, 8], [17, 6], [19, 5], [21, 5], [23, 7], [24, 10], [24, 12], [23, 15], [22, 17], [20, 19], [18, 20], [15, 21], [12, 21], [9, 20], [7, 19], [5, 17], [4, 15], [3, 12], [3, 9], [4, 6], [5, 4], [7, 2], [9, 1], [12, 0], [15, 0], [18, 1], [20, 2], [21, 3], [-1, -1], [19, 16], [18, 8], [18, 6], [19, 5]]
  },
  'A': {
    width: 18,
    points: [[9, 21], [1, 0], [-1, -1], [9, 21], [17, 0], [-1, -1], [4, 7], [14, 7]]
  },
  'B': {
    width: 21,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [13, 21], [16, 20], [17, 19], [18, 17], [18, 15], [17, 13], [16, 12], [13, 11], [-1, -1], [4, 11], [13, 11], [16, 10], [17, 9], [18, 7], [18, 4], [17, 2], [16, 1], [13, 0], [4, 0]]
  },
  'C': {
    width: 21,
    points: [[18, 16], [17, 18], [15, 20], [13, 21], [9, 21], [7, 20], [5, 18], [4, 16], [3, 13], [3, 8], [4, 5], [5, 3], [7, 1], [9, 0], [13, 0], [15, 1], [17, 3], [18, 5]]
  },
  'D': {
    width: 21,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [11, 21], [14, 20], [16, 18], [17, 16], [18, 13], [18, 8], [17, 5], [16, 3], [14, 1], [11, 0], [4, 0]]
  },
  'E': {
    width: 19,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [17, 21], [-1, -1], [4, 11], [12, 11], [-1, -1], [4, 0], [17, 0]]
  },
  'F': {
    width: 18,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [17, 21], [-1, -1], [4, 11], [12, 11]]
  },
  'G': {
    width: 21,
    points: [[18, 16], [17, 18], [15, 20], [13, 21], [9, 21], [7, 20], [5, 18], [4, 16], [3, 13], [3, 8], [4, 5], [5, 3], [7, 1], [9, 0], [13, 0], [15, 1], [17, 3], [18, 5], [18, 8], [-1, -1], [13, 8], [18, 8]]
  },
  'H': {
    width: 22,
    points: [[4, 21], [4, 0], [-1, -1], [18, 21], [18, 0], [-1, -1], [4, 11], [18, 11]]
  },
  'I': {
    width: 8,
    points: [[4, 21], [4, 0]]
  },
  'J': {
    width: 16,
    points: [[12, 21], [12, 5], [11, 2], [10, 1], [8, 0], [6, 0], [4, 1], [3, 2], [2, 5], [2, 7]]
  },
  'K': {
    width: 21,
    points: [[4, 21], [4, 0], [-1, -1], [18, 21], [4, 7], [-1, -1], [9, 12], [18, 0]]
  },
  'L': {
    width: 17,
    points: [[4, 21], [4, 0], [-1, -1], [4, 0], [16, 0]]
  },
  'M': {
    width: 24,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [12, 0], [-1, -1], [20, 21], [12, 0], [-1, -1], [20, 21], [20, 0]]
  },
  'N': {
    width: 22,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [18, 0], [-1, -1], [18, 21], [18, 0]]
  },
  'O': {
    width: 22,
    points: [[9, 21], [7, 20], [5, 18], [4, 16], [3, 13], [3, 8], [4, 5], [5, 3], [7, 1], [9, 0], [13, 0], [15, 1], [17, 3], [18, 5], [19, 8], [19, 13], [18, 16], [17, 18], [15, 20], [13, 21], [9, 21]]
  },
  'P': {
    width: 21,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [13, 21], [16, 20], [17, 19], [18, 17], [18, 14], [17, 12], [16, 11], [13, 10], [4, 10]]
  },
  'Q': {
    width: 22,
    points: [[9, 21], [7, 20], [5, 18], [4, 16], [3, 13], [3, 8], [4, 5], [5, 3], [7, 1], [9, 0], [13, 0], [15, 1], [17, 3], [18, 5], [19, 8], [19, 13], [18, 16], [17, 18], [15, 20], [13, 21], [9, 21], [-1, -1], [12, 4], [18, -2]]
  },
  'R': {
    width: 21,
    points: [[4, 21], [4, 0], [-1, -1], [4, 21], [13, 21], [16, 20], [17, 19], [18, 17], [18, 15], [17, 13], [16, 12], [13, 11], [4, 11], [-1, -1], [11, 11], [18, 0]]
  },
  'S': {
    width: 20,
    points: [[17, 18], [15, 20], [12, 21], [8, 21], [5, 20], [3, 18], [3, 16], [4, 14], [5, 13], [7, 12], [13, 10], [15, 9], [16, 8], [17, 6], [17, 3], [15, 1], [12, 0], [8, 0], [5, 1], [3, 3]]
  },
  'T': {
    width: 16,
    points: [[8, 21], [8, 0], [-1, -1], [1, 21], [15, 21]]
  },
  'U': {
    width: 22,
    points: [[4, 21], [4, 6], [5, 3], [7, 1], [10, 0], [12, 0], [15, 1], [17, 3], [18, 6], [18, 21]]
  },
  'V': {
    width: 18,
    points: [[1, 21], [9, 0], [-1, -1], [17, 21], [9, 0]]
  },
  'W': {
    width: 24,
    points: [[2, 21], [7, 0], [-1, -1], [12, 21], [7, 0], [-1, -1], [12, 21], [17, 0], [-1, -1], [22, 21], [17, 0]]
  },
  'X': {
    width: 20,
    points: [[3, 21], [17, 0], [-1, -1], [17, 21], [3, 0]]
  },
  'Y': {
    width: 18,
    points: [[1, 21], [9, 11], [9, 0], [-1, -1], [17, 21], [9, 11]]
  },
  'Z': {
    width: 20,
    points: [[17, 21], [3, 0], [-1, -1], [3, 21], [17, 21], [-1, -1], [3, 0], [17, 0]]
  },
  '[': {
    width: 14,
    points: [[4, 25], [4, -7], [-1, -1], [5, 25], [5, -7], [-1, -1], [4, 25], [11, 25], [-1, -1], [4, -7], [11, -7]]
  },
  '\\': {
    width: 14,
    points: [[0, 21], [14, -3]]
  },
  ']': {
    width: 14,
    points: [[9, 25], [9, -7], [-1, -1], [10, 25], [10, -7], [-1, -1], [3, 25], [10, 25], [-1, -1], [3, -7], [10, -7]]
  },
  '^': {
    width: 16,
    points: [[6, 15], [8, 18], [10, 15], [-1, -1], [3, 12], [8, 17], [13, 12], [-1, -1], [8, 17], [8, 0]]
  },
  '_': {
    width: 16,
    points: [[0, -2], [16, -2]]
  },
  '`': {
    width: 10,
    points: [[6, 21], [5, 20], [4, 18], [4, 16], [5, 15], [6, 16], [5, 17]]
  },
  'a': {
    width: 19,
    points: [[15, 14], [15, 0], [-1, -1], [15, 11], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'b': {
    width: 19,
    points: [[4, 21], [4, 0], [-1, -1], [4, 11], [6, 13], [8, 14], [11, 14], [13, 13], [15, 11], [16, 8], [16, 6], [15, 3], [13, 1], [11, 0], [8, 0], [6, 1], [4, 3]]
  },
  'c': {
    width: 18,
    points: [[15, 11], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'd': {
    width: 19,
    points: [[15, 21], [15, 0], [-1, -1], [15, 11], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'e': {
    width: 18,
    points: [[3, 8], [15, 8], [15, 10], [14, 12], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'f': {
    width: 12,
    points: [[10, 21], [8, 21], [6, 20], [5, 17], [5, 0], [-1, -1], [2, 14], [9, 14]]
  },
  'g': {
    width: 19,
    points: [[15, 14], [15, -2], [14, -5], [13, -6], [11, -7], [8, -7], [6, -6], [-1, -1], [15, 11], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'h': {
    width: 19,
    points: [[4, 21], [4, 0], [-1, -1], [4, 10], [7, 13], [9, 14], [12, 14], [14, 13], [15, 10], [15, 0]]
  },
  'i': {
    width: 8,
    points: [[3, 21], [4, 20], [5, 21], [4, 22], [3, 21], [-1, -1], [4, 14], [4, 0]]
  },
  'j': {
    width: 10,
    points: [[5, 21], [6, 20], [7, 21], [6, 22], [5, 21], [-1, -1], [6, 14], [6, -3], [5, -6], [3, -7], [1, -7]]
  },
  'k': {
    width: 17,
    points: [[4, 21], [4, 0], [-1, -1], [14, 14], [4, 4], [-1, -1], [8, 8], [15, 0]]
  },
  'l': {
    width: 8,
    points: [[4, 21], [4, 0]]
  },
  'm': {
    width: 30,
    points: [[4, 14], [4, 0], [-1, -1], [4, 10], [7, 13], [9, 14], [12, 14], [14, 13], [15, 10], [15, 0], [-1, -1], [15, 10], [18, 13], [20, 14], [23, 14], [25, 13], [26, 10], [26, 0]]
  },
  'n': {
    width: 19,
    points: [[4, 14], [4, 0], [-1, -1], [4, 10], [7, 13], [9, 14], [12, 14], [14, 13], [15, 10], [15, 0]]
  },
  'o': {
    width: 19,
    points: [[8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3], [16, 6], [16, 8], [15, 11], [13, 13], [11, 14], [8, 14]]
  },
  'p': {
    width: 19,
    points: [[4, 14], [4, -7], [-1, -1], [4, 11], [6, 13], [8, 14], [11, 14], [13, 13], [15, 11], [16, 8], [16, 6], [15, 3], [13, 1], [11, 0], [8, 0], [6, 1], [4, 3]]
  },
  'q': {
    width: 19,
    points: [[15, 14], [15, -7], [-1, -1], [15, 11], [13, 13], [11, 14], [8, 14], [6, 13], [4, 11], [3, 8], [3, 6], [4, 3], [6, 1], [8, 0], [11, 0], [13, 1], [15, 3]]
  },
  'r': {
    width: 13,
    points: [[4, 14], [4, 0], [-1, -1], [4, 8], [5, 11], [7, 13], [9, 14], [12, 14]]
  },
  's': {
    width: 17,
    points: [[14, 11], [13, 13], [10, 14], [7, 14], [4, 13], [3, 11], [4, 9], [6, 8], [11, 7], [13, 6], [14, 4], [14, 3], [13, 1], [10, 0], [7, 0], [4, 1], [3, 3]]
  },
  't': {
    width: 12,
    points: [[5, 21], [5, 4], [6, 1], [8, 0], [10, 0], [-1, -1], [2, 14], [9, 14]]
  },
  'u': {
    width: 19,
    points: [[4, 14], [4, 4], [5, 1], [7, 0], [10, 0], [12, 1], [15, 4], [-1, -1], [15, 14], [15, 0]]
  },
  'v': {
    width: 16,
    points: [[2, 14], [8, 0], [-1, -1], [14, 14], [8, 0]]
  },
  'w': {
    width: 22,
    points: [[3, 14], [7, 0], [-1, -1], [11, 14], [7, 0], [-1, -1], [11, 14], [15, 0], [-1, -1], [19, 14], [15, 0]]
  },
  'x': {
    width: 17,
    points: [[3, 14], [14, 0], [-1, -1], [14, 14], [3, 0]]
  },
  'y': {
    width: 16,
    points: [[2, 14], [8, 0], [-1, -1], [14, 14], [8, 0], [6, -4], [4, -6], [2, -7], [1, -7]]
  },
  'z': {
    width: 17,
    points: [[14, 14], [3, 0], [-1, -1], [3, 14], [14, 14], [-1, -1], [3, 0], [14, 0]]
  },
  '{': {
    width: 14,
    points: [[9, 25], [7, 24], [6, 23], [5, 21], [5, 19], [6, 17], [7, 16], [8, 14], [8, 12], [6, 10], [-1, -1], [7, 24], [6, 22], [6, 20], [7, 18], [8, 17], [9, 15], [9, 13], [8, 11], [4, 9], [8, 7], [9, 5], [9, 3], [8, 1], [7, 0], [6, -2], [6, -4], [7, -6], [-1, -1], [6, 8], [8, 6], [8, 4], [7, 2], [6, 1], [5, -1], [5, -3], [6, -5], [7, -6], [9, -7]]
  },
  '|': {
    width: 8,
    points: [[4, 25], [4, -7]]
  },
  '}': {
    width: 14,
    points: [[5, 25], [7, 24], [8, 23], [9, 21], [9, 19], [8, 17], [7, 16], [6, 14], [6, 12], [8, 10], [-1, -1], [7, 24], [8, 22], [8, 20], [7, 18], [6, 17], [5, 15], [5, 13], [6, 11], [10, 9], [6, 7], [5, 5], [5, 3], [6, 1], [7, 0], [8, -2], [8, -4], [7, -6], [-1, -1], [8, 8], [6, 6], [6, 4], [7, 2], [8, 1], [9, -1], [9, -3], [8, -5], [7, -6], [5, -7]]
  },
  '~': {
    width: 24,
    points: [[3, 6], [3, 8], [4, 11], [6, 12], [8, 12], [10, 11], [14, 8], [16, 7], [18, 7], [20, 8], [21, 10], [-1, -1], [3, 8], [4, 10], [6, 11], [8, 11], [10, 10], [14, 7], [16, 6], [18, 6], [20, 7], [21, 10], [21, 12]]
  }
};

/**
 * @desc Creates wireframe text-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a text-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildVectorTextGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const text = buildVectorTextGeometry({
 *      origin: [0,0,0],
 *      text: "On the other side of the screen, it all looked so easy"
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "textGeometry",
 *      primitiveType: text.primitiveType, // Will be "lines"
 *      positions: text.positions,
 *      indices: text.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redTextMesh",
 *      geometryId: "textGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redText",
 *      meshIds: ["redTextMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildVectorTextGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number[]} [cfg.origin] 3D point indicating the top left corner.
 * @param {Number} [cfg.size=1] Size of each character.
 * @param {String} [cfg.text=""] The text.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildVectorTextGeometry() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var origin = cfg.origin || [0, 0, 0];
  var xOrigin = origin[0];
  var yOrigin = origin[1];
  var zOrigin = origin[2];
  var size = cfg.size || 1;
  var positions = [];
  var indices = [];
  var text = ("" + cfg.text).trim();
  var lines = (text || "").split("\n");
  var countVerts = 0;
  var y = 0;
  var x;
  var str;
  var len;
  var c;
  var mag = 1.0 / 25.0;
  var penUp;
  var p1;
  var p2;
  var needLine;
  var pointsLen;
  var a;
  for (var iLine = 0; iLine < lines.length; iLine++) {
    x = 0;
    str = lines[iLine];
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = letters[str.charAt(i)];
      if (c === '\n') {
        //alert("newline");
      }
      if (!c) {
        continue;
      }
      penUp = 1;
      p1 = -1;
      p2 = -1;
      needLine = false;
      pointsLen = c.points.length;
      for (var j = 0; j < pointsLen; j++) {
        a = c.points[j];
        if (a[0] === -1 && a[1] === -1) {
          penUp = 1;
          needLine = false;
          continue;
        }
        positions.push(x + a[0] * size * mag + xOrigin);
        positions.push(y + a[1] * size * mag + yOrigin);
        positions.push(0 + zOrigin);
        if (p1 === -1) {
          p1 = countVerts;
        } else if (p2 === -1) {
          p2 = countVerts;
        } else {
          p1 = p2;
          p2 = countVerts;
        }
        countVerts++;
        if (penUp) {
          penUp = false;
        } else {
          indices.push(p1);
          indices.push(p2);
        }
        needLine = true;
      }
      x += c.width * mag * size;
    }
    y -= 35 * mag * size;
  }
  return {
    primitiveType: "lines",
    positions: positions,
    indices: indices
  };
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClampToEdgeWrapping: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.ClampToEdgeWrapping),
/* harmony export */   GIFMediaType: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.GIFMediaType),
/* harmony export */   JPEGMediaType: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.JPEGMediaType),
/* harmony export */   LinearFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.LinearFilter),
/* harmony export */   LinearMipMapLinearFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.LinearMipMapLinearFilter),
/* harmony export */   LinearMipMapNearestFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.LinearMipMapNearestFilter),
/* harmony export */   LinearMipmapLinearFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.LinearMipmapLinearFilter),
/* harmony export */   LinearMipmapNearestFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.LinearMipmapNearestFilter),
/* harmony export */   MirroredRepeatWrapping: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.MirroredRepeatWrapping),
/* harmony export */   NearestFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.NearestFilter),
/* harmony export */   NearestMipMapLinearFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.NearestMipMapLinearFilter),
/* harmony export */   NearestMipMapNearestFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.NearestMipMapNearestFilter),
/* harmony export */   NearestMipmapLinearFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.NearestMipmapLinearFilter),
/* harmony export */   NearestMipmapNearestFilter: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.NearestMipmapNearestFilter),
/* harmony export */   PNGMediaType: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.PNGMediaType),
/* harmony export */   RepeatWrapping: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_1__.RepeatWrapping),
/* harmony export */   XKTModel: () => (/* reexport safe */ _XKTModel_XKTModel_js__WEBPACK_IMPORTED_MODULE_2__.XKTModel),
/* harmony export */   XKT_INFO: () => (/* reexport safe */ _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__.XKT_INFO),
/* harmony export */   buildBoxGeometry: () => (/* reexport safe */ _geometryBuilders_buildBoxGeometry_js__WEBPACK_IMPORTED_MODULE_13__.buildBoxGeometry),
/* harmony export */   buildBoxLinesGeometry: () => (/* reexport safe */ _geometryBuilders_buildBoxLinesGeometry_js__WEBPACK_IMPORTED_MODULE_14__.buildBoxLinesGeometry),
/* harmony export */   buildCylinderGeometry: () => (/* reexport safe */ _geometryBuilders_buildCylinderGeometry_js__WEBPACK_IMPORTED_MODULE_15__.buildCylinderGeometry),
/* harmony export */   buildGridGeometry: () => (/* reexport safe */ _geometryBuilders_buildGridGeometry_js__WEBPACK_IMPORTED_MODULE_16__.buildGridGeometry),
/* harmony export */   buildPlaneGeometry: () => (/* reexport safe */ _geometryBuilders_buildPlaneGeometry_js__WEBPACK_IMPORTED_MODULE_17__.buildPlaneGeometry),
/* harmony export */   buildSphereGeometry: () => (/* reexport safe */ _geometryBuilders_buildSphereGeometry_js__WEBPACK_IMPORTED_MODULE_18__.buildSphereGeometry),
/* harmony export */   buildTorusGeometry: () => (/* reexport safe */ _geometryBuilders_buildTorusGeometry_js__WEBPACK_IMPORTED_MODULE_19__.buildTorusGeometry),
/* harmony export */   buildVectorTextGeometry: () => (/* reexport safe */ _geometryBuilders_buildVectorTextGeometry_js__WEBPACK_IMPORTED_MODULE_20__.buildVectorTextGeometry),
/* harmony export */   parseCityJSONIntoXKTModel: () => (/* reexport safe */ _parsers_parseCityJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_4__.parseCityJSONIntoXKTModel),
/* harmony export */   parseGLTFIntoXKTModel: () => (/* reexport safe */ _parsers_parseGLTFIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_5__.parseGLTFIntoXKTModel),
/* harmony export */   parseGLTFJSONIntoXKTModel: () => (/* reexport safe */ _parsers_parseGLTFJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_6__.parseGLTFJSONIntoXKTModel),
/* harmony export */   parseIFCIntoXKTModel: () => (/* reexport safe */ _parsers_parseIFCIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_7__.parseIFCIntoXKTModel),
/* harmony export */   parseLASIntoXKTModel: () => (/* reexport safe */ _parsers_parseLASIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_8__.parseLASIntoXKTModel),
/* harmony export */   parseMetaModelIntoXKTModel: () => (/* reexport safe */ _parsers_parseMetaModelIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_9__.parseMetaModelIntoXKTModel),
/* harmony export */   parsePCDIntoXKTModel: () => (/* reexport safe */ _parsers_parsePCDIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_10__.parsePCDIntoXKTModel),
/* harmony export */   parsePLYIntoXKTModel: () => (/* reexport safe */ _parsers_parsePLYIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_11__.parsePLYIntoXKTModel),
/* harmony export */   parseSTLIntoXKTModel: () => (/* reexport safe */ _parsers_parseSTLIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_12__.parseSTLIntoXKTModel),
/* harmony export */   writeXKTModelToArrayBuffer: () => (/* reexport safe */ _XKTModel_writeXKTModelToArrayBuffer_js__WEBPACK_IMPORTED_MODULE_3__.writeXKTModelToArrayBuffer)
/* harmony export */ });
/* harmony import */ var _XKT_INFO_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./XKT_INFO.js */ "./src/XKT_INFO.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _XKTModel_XKTModel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./XKTModel/XKTModel.js */ "./src/XKTModel/XKTModel.js");
/* harmony import */ var _XKTModel_writeXKTModelToArrayBuffer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XKTModel/writeXKTModelToArrayBuffer.js */ "./src/XKTModel/writeXKTModelToArrayBuffer.js");
/* harmony import */ var _parsers_parseCityJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parsers/parseCityJSONIntoXKTModel.js */ "./src/parsers/parseCityJSONIntoXKTModel.js");
/* harmony import */ var _parsers_parseGLTFIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parsers/parseGLTFIntoXKTModel.js */ "./src/parsers/parseGLTFIntoXKTModel.js");
/* harmony import */ var _parsers_parseGLTFJSONIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parsers/parseGLTFJSONIntoXKTModel.js */ "./src/parsers/parseGLTFJSONIntoXKTModel.js");
/* harmony import */ var _parsers_parseIFCIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./parsers/parseIFCIntoXKTModel.js */ "./src/parsers/parseIFCIntoXKTModel.js");
/* harmony import */ var _parsers_parseLASIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parsers/parseLASIntoXKTModel.js */ "./src/parsers/parseLASIntoXKTModel.js");
/* harmony import */ var _parsers_parseMetaModelIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./parsers/parseMetaModelIntoXKTModel.js */ "./src/parsers/parseMetaModelIntoXKTModel.js");
/* harmony import */ var _parsers_parsePCDIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./parsers/parsePCDIntoXKTModel.js */ "./src/parsers/parsePCDIntoXKTModel.js");
/* harmony import */ var _parsers_parsePLYIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./parsers/parsePLYIntoXKTModel.js */ "./src/parsers/parsePLYIntoXKTModel.js");
/* harmony import */ var _parsers_parseSTLIntoXKTModel_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./parsers/parseSTLIntoXKTModel.js */ "./src/parsers/parseSTLIntoXKTModel.js");
/* harmony import */ var _geometryBuilders_buildBoxGeometry_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./geometryBuilders/buildBoxGeometry.js */ "./src/geometryBuilders/buildBoxGeometry.js");
/* harmony import */ var _geometryBuilders_buildBoxLinesGeometry_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./geometryBuilders/buildBoxLinesGeometry.js */ "./src/geometryBuilders/buildBoxLinesGeometry.js");
/* harmony import */ var _geometryBuilders_buildCylinderGeometry_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./geometryBuilders/buildCylinderGeometry.js */ "./src/geometryBuilders/buildCylinderGeometry.js");
/* harmony import */ var _geometryBuilders_buildGridGeometry_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./geometryBuilders/buildGridGeometry.js */ "./src/geometryBuilders/buildGridGeometry.js");
/* harmony import */ var _geometryBuilders_buildPlaneGeometry_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./geometryBuilders/buildPlaneGeometry.js */ "./src/geometryBuilders/buildPlaneGeometry.js");
/* harmony import */ var _geometryBuilders_buildSphereGeometry_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./geometryBuilders/buildSphereGeometry.js */ "./src/geometryBuilders/buildSphereGeometry.js");
/* harmony import */ var _geometryBuilders_buildTorusGeometry_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./geometryBuilders/buildTorusGeometry.js */ "./src/geometryBuilders/buildTorusGeometry.js");
/* harmony import */ var _geometryBuilders_buildVectorTextGeometry_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./geometryBuilders/buildVectorTextGeometry.js */ "./src/geometryBuilders/buildVectorTextGeometry.js");






















/***/ }),

/***/ "./src/lib/earcut.js":
/*!***************************!*\
  !*** ./src/lib/earcut.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   earcut: () => (/* binding */ earcut)
/* harmony export */ });
/** @private */
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length,
    outerLen = hasHoles ? holeIndices[0] * dim : data.length,
    outerNode = linkedList(data, 0, outerLen, dim, true),
    triangles = [];
  if (!outerNode || outerNode.next === outerNode.prev) return triangles;
  var minX, minY, maxX, maxY, x, y, invSize;
  if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

  // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i = dim; i < outerLen; i += dim) {
      x = data[i];
      y = data[i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    // minX, minY and invSize are later used to transform coords into integers for z-order calculation
    invSize = Math.max(maxX - minX, maxY - minY);
    invSize = invSize !== 0 ? 1 / invSize : 0;
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
  return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
  var i, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
  if (!start) return start;
  if (!end) end = start;
  var p = start,
    again;
  do {
    again = false;
    if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
      removeNode(p);
      p = end = p.prev;
      if (p === p.next) break;
      again = true;
    } else {
      p = p.next;
    }
  } while (again || p !== end);
  return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
  if (!ear) return;

  // interlink polygon nodes in z-order
  if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
  var stop = ear,
    prev,
    next;

  // iterate through ears, slicing them one by one
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
      // cut off the triangle
      triangles.push(prev.i / dim);
      triangles.push(ear.i / dim);
      triangles.push(next.i / dim);
      removeNode(ear);

      // skipping the next vertex leads to less sliver triangles
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;

    // if we looped through the whole remaining polygon and can't find any more ears
    if (ear === stop) {
      // try filtering points and slicing again
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

        // if this didn't work, try curing all small self-intersections locally
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

        // as a last resort, try splitting the remaining polygon into two
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }
      break;
    }
  }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
  var a = ear.prev,
    b = ear,
    c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

  // now make sure we don't have other points inside the potential ear
  var p = ear.next.next;
  while (p !== ear.prev) {
    if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, invSize) {
  var a = ear.prev,
    b = ear,
    c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

  // triangle bbox; min & max are calculated like this for speed
  var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x,
    minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y,
    maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x,
    maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;

  // z-order range for the current triangle bbox;
  var minZ = zOrder(minTX, minTY, minX, minY, invSize),
    maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
  var p = ear.prevZ,
    n = ear.nextZ;

  // look for points inside the triangle in both directions
  while (p && p.z >= minZ && n && n.z <= maxZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.prevZ;
    if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
    n = n.nextZ;
  }

  // look for remaining points in decreasing z-order
  while (p && p.z >= minZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.prevZ;
  }

  // look for remaining points in increasing z-order
  while (n && n.z <= maxZ) {
    if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
    n = n.nextZ;
  }
  return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
  var p = start;
  do {
    var a = p.prev,
      b = p.next.next;
    if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
      triangles.push(a.i / dim);
      triangles.push(p.i / dim);
      triangles.push(b.i / dim);

      // remove two nodes involved
      removeNode(p);
      removeNode(p.next);
      p = start = b;
    }
    p = p.next;
  } while (p !== start);
  return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
  // look for a valid diagonal that divides the polygon into two
  var a = start;
  do {
    var b = a.next.next;
    while (b !== a.prev) {
      if (a.i !== b.i && isValidDiagonal(a, b)) {
        // split the polygon in two by the diagonal
        var c = splitPolygon(a, b);

        // filter colinear points around the cuts
        a = filterPoints(a, a.next);
        c = filterPoints(c, c.next);

        // run earcut on each half
        earcutLinked(a, triangles, dim, minX, minY, invSize);
        earcutLinked(c, triangles, dim, minX, minY, invSize);
        return;
      }
      b = b.next;
    }
    a = a.next;
  } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [],
    i,
    len,
    start,
    end,
    list;
  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next) list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);

  // process holes from left to right
  for (i = 0; i < queue.length; i++) {
    eliminateHole(queue[i], outerNode);
    outerNode = filterPoints(outerNode, outerNode.next);
  }
  return outerNode;
}
function compareX(a, b) {
  return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
  outerNode = findHoleBridge(hole, outerNode);
  if (outerNode) {
    var b = splitPolygon(outerNode, hole);

    // filter collinear points around the cuts
    filterPoints(outerNode, outerNode.next);
    filterPoints(b, b.next);
  }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
  var p = outerNode,
    hx = hole.x,
    hy = hole.y,
    qx = -Infinity,
    m;

  // find a segment intersected by a ray from the hole's leftmost point to the left;
  // segment's endpoint with lesser x will be potential connection point
  do {
    if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
      var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
      if (x <= hx && x > qx) {
        qx = x;
        if (x === hx) {
          if (hy === p.y) return p;
          if (hy === p.next.y) return p.next;
        }
        m = p.x < p.next.x ? p : p.next;
      }
    }
    p = p.next;
  } while (p !== outerNode);
  if (!m) return null;
  if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

  // look for points inside the triangle of hole point, segment intersection and endpoint;
  // if there are no points found, we have a valid connection;
  // otherwise choose the point of the minimum angle with the ray as connection point

  var stop = m,
    mx = m.x,
    my = m.y,
    tanMin = Infinity,
    tan;
  p = m;
  do {
    if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

      if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
        m = p;
        tanMin = tan;
      }
    }
    p = p.next;
  } while (p !== stop);
  return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
  return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
  var p = start;
  do {
    if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
    p.prevZ = p.prev;
    p.nextZ = p.next;
    p = p.next;
  } while (p !== start);
  p.prevZ.nextZ = null;
  p.prevZ = null;
  sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
  var i,
    p,
    q,
    e,
    tail,
    numMerges,
    pSize,
    qSize,
    inSize = 1;
  do {
    p = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p) {
      numMerges++;
      q = p;
      pSize = 0;
      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q) break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
          e = p;
          p = p.nextZ;
          pSize--;
        } else {
          e = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail) tail.nextZ = e;else list = e;
        e.prevZ = tail;
        tail = e;
      }
      p = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
  // coords are transformed into non-negative 15-bit integer range
  x = 32767 * (x - minX) * invSize;
  y = 32767 * (y - minY) * invSize;
  x = (x | x << 8) & 0x00FF00FF;
  x = (x | x << 4) & 0x0F0F0F0F;
  x = (x | x << 2) & 0x33333333;
  x = (x | x << 1) & 0x55555555;
  y = (y | y << 8) & 0x00FF00FF;
  y = (y | y << 4) & 0x0F0F0F0F;
  y = (y | y << 2) & 0x33333333;
  y = (y | y << 1) & 0x55555555;
  return x | y << 1;
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
  var p = start,
    leftmost = start;
  do {
    if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
    p = p.next;
  } while (p !== start);
  return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (
  // dones't intersect other edges
  locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (
  // locally visible
  area(a.prev, a, b.prev) || area(a, b.prev, b)) ||
  // does not create opposite-facing sectors
  equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
  var o1 = sign(area(p1, q1, p2));
  var o2 = sign(area(p1, q1, q2));
  var o3 = sign(area(p2, q2, p1));
  var o4 = sign(area(p2, q2, q1));
  if (o1 !== o2 && o3 !== o4) return true; // general case

  if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
  if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
  if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
  if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

  return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}
function sign(num) {
  return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
  var p = a;
  do {
    if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
    p = p.next;
  } while (p !== a);
  return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
  return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
  var p = a,
    inside = false,
    px = (a.x + b.x) / 2,
    py = (a.y + b.y) / 2;
  do {
    if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
    p = p.next;
  } while (p !== a);
  return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
  var a2 = new Node(a.i, a.x, a.y),
    b2 = new Node(b.i, b.x, b.y),
    an = a.next,
    bp = b.prev;
  a.next = b;
  b.prev = a;
  a2.next = an;
  an.prev = a2;
  b2.next = a2;
  a2.prev = b2;
  bp.next = b2;
  b2.prev = bp;
  return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);
  if (!last) {
    p.prev = p;
    p.next = p;
  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }
  return p;
}
function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
  if (p.prevZ) p.prevZ.nextZ = p.nextZ;
  if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}
function Node(i, x, y) {
  // vertex index in coordinates array
  this.i = i;

  // vertex coordinates
  this.x = x;
  this.y = y;

  // previous and next vertex nodes in a polygon ring
  this.prev = null;
  this.next = null;

  // z-order curve value
  this.z = null;

  // previous and next nodes in z-order
  this.prevZ = null;
  this.nextZ = null;

  // indicates whether this is a steiner point
  this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i = 0; i < triangles.length; i += 3) {
    var a = triangles[i] * dim;
    var b = triangles[i + 1] * dim;
    var c = triangles[i + 2] * dim;
    trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }
  return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
  var dim = data[0][0].length,
    result = {
      vertices: [],
      holes: [],
      dimensions: dim
    },
    holeIndex = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
    }
    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }
  return result;
};


/***/ }),

/***/ "./src/lib/faceToVertexNormals.js":
/*!****************************************!*\
  !*** ./src/lib/faceToVertexNormals.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   faceToVertexNormals: () => (/* binding */ faceToVertexNormals)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./src/lib/math.js");


/**
 * Converts surface-perpendicular face normals to vertex normals. Assumes that the mesh contains disjoint triangles
 * that don't share vertex array elements. Works by finding groups of vertices that have the same location and
 * averaging their normal vectors.
 *
 * @returns {{positions: Array, normals: *}}
 * @private
 */
function faceToVertexNormals(positions, normals) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var smoothNormalsAngleThreshold = options.smoothNormalsAngleThreshold || 20;
  var vertexMap = {};
  var vertexNormals = [];
  var vertexNormalAccum = {};
  var acc;
  var vx;
  var vy;
  var vz;
  var key;
  var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
  var precision = Math.pow(10, precisionPoints);
  var posi;
  var i;
  var j;
  var len;
  var a;
  var b;
  var c;
  for (i = 0, len = positions.length; i < len; i += 3) {
    posi = i / 3;
    vx = positions[i];
    vy = positions[i + 1];
    vz = positions[i + 2];
    key = "".concat(Math.round(vx * precision), "_").concat(Math.round(vy * precision), "_").concat(Math.round(vz * precision));
    if (vertexMap[key] === undefined) {
      vertexMap[key] = [posi];
    } else {
      vertexMap[key].push(posi);
    }
    var normal = _math_js__WEBPACK_IMPORTED_MODULE_0__.math.normalizeVec3([normals[i], normals[i + 1], normals[i + 2]]);
    vertexNormals[posi] = normal;
    acc = _math_js__WEBPACK_IMPORTED_MODULE_0__.math.vec4([normal[0], normal[1], normal[2], 1]);
    vertexNormalAccum[posi] = acc;
  }
  for (key in vertexMap) {
    if (vertexMap.hasOwnProperty(key)) {
      var vertices = vertexMap[key];
      var numVerts = vertices.length;
      for (i = 0; i < numVerts; i++) {
        var ii = vertices[i];
        acc = vertexNormalAccum[ii];
        for (j = 0; j < numVerts; j++) {
          if (i === j) {
            continue;
          }
          var jj = vertices[j];
          a = vertexNormals[ii];
          b = vertexNormals[jj];
          var angle = Math.abs(_math_js__WEBPACK_IMPORTED_MODULE_0__.math.angleVec3(a, b) / _math_js__WEBPACK_IMPORTED_MODULE_0__.math.DEGTORAD);
          if (angle < smoothNormalsAngleThreshold) {
            acc[0] += b[0];
            acc[1] += b[1];
            acc[2] += b[2];
            acc[3] += 1.0;
          }
        }
      }
    }
  }
  for (i = 0, len = normals.length; i < len; i += 3) {
    acc = vertexNormalAccum[i / 3];
    normals[i + 0] = acc[0] / acc[3];
    normals[i + 1] = acc[1] / acc[3];
    normals[i + 2] = acc[2] / acc[3];
  }
}


/***/ }),

/***/ "./src/lib/math.js":
/*!*************************!*\
  !*** ./src/lib/math.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   math: () => (/* binding */ math)
/* harmony export */ });
// Some temporary vars to help avoid garbage collection

var doublePrecision = true;
var FloatArrayType = doublePrecision ? Float64Array : Float32Array;
var tempMat1 = new FloatArrayType(16);
var tempMat2 = new FloatArrayType(16);
var tempVec4 = new FloatArrayType(4);

/**
 * @private
 */
var math = {
  MIN_DOUBLE: -Number.MAX_SAFE_INTEGER,
  MAX_DOUBLE: Number.MAX_SAFE_INTEGER,
  /**
   * The number of radiians in a degree (0.0174532925).
   * @property DEGTORAD
   * @type {Number}
   */
  DEGTORAD: 0.0174532925,
  /**
   * The number of degrees in a radian.
   * @property RADTODEG
   * @type {Number}
   */
  RADTODEG: 57.295779513,
  /**
   * Returns a new, uninitialized two-element vector.
   * @method vec2
   * @param [values] Initial values.
   * @static
   * @returns {Number[]}
   */
  vec2: function vec2(values) {
    return new FloatArrayType(values || 2);
  },
  /**
   * Returns a new, uninitialized three-element vector.
   * @method vec3
   * @param [values] Initial values.
   * @static
   * @returns {Number[]}
   */
  vec3: function vec3(values) {
    return new FloatArrayType(values || 3);
  },
  /**
   * Returns a new, uninitialized four-element vector.
   * @method vec4
   * @param [values] Initial values.
   * @static
   * @returns {Number[]}
   */
  vec4: function vec4(values) {
    return new FloatArrayType(values || 4);
  },
  /**
   * Returns a new, uninitialized 3x3 matrix.
   * @method mat3
   * @param [values] Initial values.
   * @static
   * @returns {Number[]}
   */
  mat3: function mat3(values) {
    return new FloatArrayType(values || 9);
  },
  /**
   * Converts a 3x3 matrix to 4x4
   * @method mat3ToMat4
   * @param mat3 3x3 matrix.
   * @param mat4 4x4 matrix
   * @static
   * @returns {Number[]}
   */
  mat3ToMat4: function mat3ToMat4(mat3) {
    var mat4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new FloatArrayType(16);
    mat4[0] = mat3[0];
    mat4[1] = mat3[1];
    mat4[2] = mat3[2];
    mat4[3] = 0;
    mat4[4] = mat3[3];
    mat4[5] = mat3[4];
    mat4[6] = mat3[5];
    mat4[7] = 0;
    mat4[8] = mat3[6];
    mat4[9] = mat3[7];
    mat4[10] = mat3[8];
    mat4[11] = 0;
    mat4[12] = 0;
    mat4[13] = 0;
    mat4[14] = 0;
    mat4[15] = 1;
    return mat4;
  },
  /**
   * Returns a new, uninitialized 4x4 matrix.
   * @method mat4
   * @param [values] Initial values.
   * @static
   * @returns {Number[]}
   */
  mat4: function mat4(values) {
    return new FloatArrayType(values || 16);
  },
  /**
   * Converts a 4x4 matrix to 3x3
   * @method mat4ToMat3
   * @param mat4 4x4 matrix.
   * @param mat3 3x3 matrix
   * @static
   * @returns {Number[]}
   */
  mat4ToMat3: function mat4ToMat3(mat4, mat3) {// TODO
    //return new FloatArrayType(values || 9);
  },
  /**
   * Returns a new UUID.
   * @method createUUID
   * @static
   * @return string The new UUID
   */
  createUUID: function () {
    var self = {};
    var lut = [];
    for (var i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + i.toString(16);
    }
    return function () {
      var d0 = Math.random() * 0xffffffff | 0;
      var d1 = Math.random() * 0xffffffff | 0;
      var d2 = Math.random() * 0xffffffff | 0;
      var d3 = Math.random() * 0xffffffff | 0;
      return "".concat(lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff], "-").concat(lut[d1 & 0xff]).concat(lut[d1 >> 8 & 0xff], "-").concat(lut[d1 >> 16 & 0x0f | 0x40]).concat(lut[d1 >> 24 & 0xff], "-").concat(lut[d2 & 0x3f | 0x80]).concat(lut[d2 >> 8 & 0xff], "-").concat(lut[d2 >> 16 & 0xff]).concat(lut[d2 >> 24 & 0xff]).concat(lut[d3 & 0xff]).concat(lut[d3 >> 8 & 0xff]).concat(lut[d3 >> 16 & 0xff]).concat(lut[d3 >> 24 & 0xff]);
    };
  }(),
  /**
   * Clamps a value to the given range.
   * @param {Number} value Value to clamp.
   * @param {Number} min Lower bound.
   * @param {Number} max Upper bound.
   * @returns {Number} Clamped result.
   */
  clamp: function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  /**
   * Floating-point modulus
   * @method fmod
   * @static
   * @param {Number} a
   * @param {Number} b
   * @returns {*}
   */
  fmod: function fmod(a, b) {
    if (a < b) {
      console.error("math.fmod : Attempting to find modulus within negative range - would be infinite loop - ignoring");
      return a;
    }
    while (b <= a) {
      a -= b;
    }
    return a;
  },
  /**
   * Negates a four-element vector.
   * @method negateVec4
   * @static
   * @param {Array(Number)} v Vector to negate
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  negateVec4: function negateVec4(v, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = -v[0];
    dest[1] = -v[1];
    dest[2] = -v[2];
    dest[3] = -v[3];
    return dest;
  },
  /**
   * Adds one four-element vector to another.
   * @method addVec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  addVec4: function addVec4(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] + v[0];
    dest[1] = u[1] + v[1];
    dest[2] = u[2] + v[2];
    dest[3] = u[3] + v[3];
    return dest;
  },
  /**
   * Adds a scalar value to each element of a four-element vector.
   * @method addVec4Scalar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  addVec4Scalar: function addVec4Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] + s;
    dest[1] = v[1] + s;
    dest[2] = v[2] + s;
    dest[3] = v[3] + s;
    return dest;
  },
  /**
   * Adds one three-element vector to another.
   * @method addVec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  addVec3: function addVec3(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] + v[0];
    dest[1] = u[1] + v[1];
    dest[2] = u[2] + v[2];
    return dest;
  },
  /**
   * Adds a scalar value to each element of a three-element vector.
   * @method addVec4Scalar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  addVec3Scalar: function addVec3Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] + s;
    dest[1] = v[1] + s;
    dest[2] = v[2] + s;
    return dest;
  },
  /**
   * Subtracts one four-element vector from another.
   * @method subVec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Vector to subtract
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  subVec4: function subVec4(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] - v[0];
    dest[1] = u[1] - v[1];
    dest[2] = u[2] - v[2];
    dest[3] = u[3] - v[3];
    return dest;
  },
  /**
   * Subtracts one three-element vector from another.
   * @method subVec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Vector to subtract
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  subVec3: function subVec3(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] - v[0];
    dest[1] = u[1] - v[1];
    dest[2] = u[2] - v[2];
    return dest;
  },
  /**
   * Subtracts one two-element vector from another.
   * @method subVec2
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Vector to subtract
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  subVec2: function subVec2(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] - v[0];
    dest[1] = u[1] - v[1];
    return dest;
  },
  /**
   * Subtracts a scalar value from each element of a four-element vector.
   * @method subVec4Scalar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  subVec4Scalar: function subVec4Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] - s;
    dest[1] = v[1] - s;
    dest[2] = v[2] - s;
    dest[3] = v[3] - s;
    return dest;
  },
  /**
   * Sets each element of a 4-element vector to a scalar value minus the value of that element.
   * @method subScalarVec4
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  subScalarVec4: function subScalarVec4(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = s - v[0];
    dest[1] = s - v[1];
    dest[2] = s - v[2];
    dest[3] = s - v[3];
    return dest;
  },
  /**
   * Multiplies one three-element vector by another.
   * @method mulVec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  mulVec4: function mulVec4(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] * v[0];
    dest[1] = u[1] * v[1];
    dest[2] = u[2] * v[2];
    dest[3] = u[3] * v[3];
    return dest;
  },
  /**
   * Multiplies each element of a four-element vector by a scalar.
   * @method mulVec34calar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  mulVec4Scalar: function mulVec4Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] * s;
    dest[1] = v[1] * s;
    dest[2] = v[2] * s;
    dest[3] = v[3] * s;
    return dest;
  },
  /**
   * Multiplies each element of a three-element vector by a scalar.
   * @method mulVec3Scalar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  mulVec3Scalar: function mulVec3Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] * s;
    dest[1] = v[1] * s;
    dest[2] = v[2] * s;
    return dest;
  },
  /**
   * Multiplies each element of a two-element vector by a scalar.
   * @method mulVec2Scalar
   * @static
   * @param {Array(Number)} v The vector
   * @param {Number} s The scalar
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, v otherwise
   */
  mulVec2Scalar: function mulVec2Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] * s;
    dest[1] = v[1] * s;
    return dest;
  },
  /**
   * Divides one three-element vector by another.
   * @method divVec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  divVec3: function divVec3(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] / v[0];
    dest[1] = u[1] / v[1];
    dest[2] = u[2] / v[2];
    return dest;
  },
  /**
   * Divides one four-element vector by another.
   * @method divVec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @param  {Array(Number)} [dest] Destination vector
   * @return {Array(Number)} dest if specified, u otherwise
   */
  divVec4: function divVec4(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    dest[0] = u[0] / v[0];
    dest[1] = u[1] / v[1];
    dest[2] = u[2] / v[2];
    dest[3] = u[3] / v[3];
    return dest;
  },
  /**
   * Divides a scalar by a three-element vector, returning a new vector.
   * @method divScalarVec3
   * @static
   * @param v vec3
   * @param s scalar
   * @param dest vec3 - optional destination
   * @return [] dest if specified, v otherwise
   */
  divScalarVec3: function divScalarVec3(s, v, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = s / v[0];
    dest[1] = s / v[1];
    dest[2] = s / v[2];
    return dest;
  },
  /**
   * Divides a three-element vector by a scalar.
   * @method divVec3Scalar
   * @static
   * @param v vec3
   * @param s scalar
   * @param dest vec3 - optional destination
   * @return [] dest if specified, v otherwise
   */
  divVec3Scalar: function divVec3Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] / s;
    dest[1] = v[1] / s;
    dest[2] = v[2] / s;
    return dest;
  },
  /**
   * Divides a four-element vector by a scalar.
   * @method divVec4Scalar
   * @static
   * @param v vec4
   * @param s scalar
   * @param dest vec4 - optional destination
   * @return [] dest if specified, v otherwise
   */
  divVec4Scalar: function divVec4Scalar(v, s, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = v[0] / s;
    dest[1] = v[1] / s;
    dest[2] = v[2] / s;
    dest[3] = v[3] / s;
    return dest;
  },
  /**
   * Divides a scalar by a four-element vector, returning a new vector.
   * @method divScalarVec4
   * @static
   * @param s scalar
   * @param v vec4
   * @param dest vec4 - optional destination
   * @return [] dest if specified, v otherwise
   */
  divScalarVec4: function divScalarVec4(s, v, dest) {
    if (!dest) {
      dest = v;
    }
    dest[0] = s / v[0];
    dest[1] = s / v[1];
    dest[2] = s / v[2];
    dest[3] = s / v[3];
    return dest;
  },
  /**
   * Returns the dot product of two four-element vectors.
   * @method dotVec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @return The dot product
   */
  dotVec4: function dotVec4(u, v) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
  },
  /**
   * Returns the cross product of two four-element vectors.
   * @method cross3Vec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @return The cross product
   */
  cross3Vec4: function cross3Vec4(u, v) {
    var u0 = u[0];
    var u1 = u[1];
    var u2 = u[2];
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    return [u1 * v2 - u2 * v1, u2 * v0 - u0 * v2, u0 * v1 - u1 * v0, 0.0];
  },
  /**
   * Returns the cross product of two three-element vectors.
   * @method cross3Vec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @return The cross product
   */
  cross3Vec3: function cross3Vec3(u, v, dest) {
    if (!dest) {
      dest = u;
    }
    var x = u[0];
    var y = u[1];
    var z = u[2];
    var x2 = v[0];
    var y2 = v[1];
    var z2 = v[2];
    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    dest[2] = x * y2 - y * x2;
    return dest;
  },
  sqLenVec4: function sqLenVec4(v) {
    // TODO
    return math.dotVec4(v, v);
  },
  /**
   * Returns the length of a four-element vector.
   * @method lenVec4
   * @static
   * @param {Array(Number)} v The vector
   * @return The length
   */
  lenVec4: function lenVec4(v) {
    return Math.sqrt(math.sqLenVec4(v));
  },
  /**
   * Returns the dot product of two three-element vectors.
   * @method dotVec3
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @return The dot product
   */
  dotVec3: function dotVec3(u, v) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  },
  /**
   * Returns the dot product of two two-element vectors.
   * @method dotVec4
   * @static
   * @param {Array(Number)} u First vector
   * @param {Array(Number)} v Second vector
   * @return The dot product
   */
  dotVec2: function dotVec2(u, v) {
    return u[0] * v[0] + u[1] * v[1];
  },
  sqLenVec3: function sqLenVec3(v) {
    return math.dotVec3(v, v);
  },
  sqLenVec2: function sqLenVec2(v) {
    return math.dotVec2(v, v);
  },
  /**
   * Returns the length of a three-element vector.
   * @method lenVec3
   * @static
   * @param {Array(Number)} v The vector
   * @return The length
   */
  lenVec3: function lenVec3(v) {
    return Math.sqrt(math.sqLenVec3(v));
  },
  distVec3: function () {
    var vec = new FloatArrayType(3);
    return function (v, w) {
      return math.lenVec3(math.subVec3(v, w, vec));
    };
  }(),
  /**
   * Returns the length of a two-element vector.
   * @method lenVec2
   * @static
   * @param {Array(Number)} v The vector
   * @return The length
   */
  lenVec2: function lenVec2(v) {
    return Math.sqrt(math.sqLenVec2(v));
  },
  distVec2: function () {
    var vec = new FloatArrayType(2);
    return function (v, w) {
      return math.lenVec2(math.subVec2(v, w, vec));
    };
  }(),
  /**
   * @method rcpVec3
   * @static
   * @param v vec3
   * @param dest vec3 - optional destination
   * @return [] dest if specified, v otherwise
   *
   */
  rcpVec3: function rcpVec3(v, dest) {
    return math.divScalarVec3(1.0, v, dest);
  },
  /**
   * Normalizes a four-element vector
   * @method normalizeVec4
   * @static
   * @param v vec4
   * @param dest vec4 - optional destination
   * @return [] dest if specified, v otherwise
   *
   */
  normalizeVec4: function normalizeVec4(v, dest) {
    var f = 1.0 / math.lenVec4(v);
    return math.mulVec4Scalar(v, f, dest);
  },
  /**
   * Normalizes a three-element vector
   * @method normalizeVec4
   * @static
   */
  normalizeVec3: function normalizeVec3(v, dest) {
    var f = 1.0 / math.lenVec3(v);
    return math.mulVec3Scalar(v, f, dest);
  },
  /**
   * Normalizes a two-element vector
   * @method normalizeVec2
   * @static
   */
  normalizeVec2: function normalizeVec2(v, dest) {
    var f = 1.0 / math.lenVec2(v);
    return math.mulVec2Scalar(v, f, dest);
  },
  /**
   * Gets the angle between two vectors
   * @method angleVec3
   * @param v
   * @param w
   * @returns {number}
   */
  angleVec3: function angleVec3(v, w) {
    var theta = math.dotVec3(v, w) / Math.sqrt(math.sqLenVec3(v) * math.sqLenVec3(w));
    theta = theta < -1 ? -1 : theta > 1 ? 1 : theta; // Clamp to handle numerical problems
    return Math.acos(theta);
  },
  /**
   * Creates a three-element vector from the rotation part of a sixteen-element matrix.
   * @param m
   * @param dest
   */
  vec3FromMat4Scale: function () {
    var tempVec3 = new FloatArrayType(3);
    return function (m, dest) {
      tempVec3[0] = m[0];
      tempVec3[1] = m[1];
      tempVec3[2] = m[2];
      dest[0] = math.lenVec3(tempVec3);
      tempVec3[0] = m[4];
      tempVec3[1] = m[5];
      tempVec3[2] = m[6];
      dest[1] = math.lenVec3(tempVec3);
      tempVec3[0] = m[8];
      tempVec3[1] = m[9];
      tempVec3[2] = m[10];
      dest[2] = math.lenVec3(tempVec3);
      return dest;
    };
  }(),
  /**
   * Converts an n-element vector to a JSON-serializable
   * array with values rounded to two decimal places.
   */
  vecToArray: function () {
    function trunc(v) {
      return Math.round(v * 100000) / 100000;
    }
    return function (v) {
      v = Array.prototype.slice.call(v);
      for (var i = 0, len = v.length; i < len; i++) {
        v[i] = trunc(v[i]);
      }
      return v;
    };
  }(),
  /**
   * Converts a 3-element vector from an array to an object of the form ````{x:999, y:999, z:999}````.
   * @param arr
   * @returns {{x: *, y: *, z: *}}
   */
  xyzArrayToObject: function xyzArrayToObject(arr) {
    return {
      "x": arr[0],
      "y": arr[1],
      "z": arr[2]
    };
  },
  /**
   * Converts a 3-element vector object of the form ````{x:999, y:999, z:999}```` to an array.
   * @param xyz
   * @param  [arry]
   * @returns {*[]}
   */
  xyzObjectToArray: function xyzObjectToArray(xyz, arry) {
    arry = arry || new FloatArrayType(3);
    arry[0] = xyz.x;
    arry[1] = xyz.y;
    arry[2] = xyz.z;
    return arry;
  },
  /**
   * Duplicates a 4x4 identity matrix.
   * @method dupMat4
   * @static
   */
  dupMat4: function dupMat4(m) {
    return m.slice(0, 16);
  },
  /**
   * Extracts a 3x3 matrix from a 4x4 matrix.
   * @method mat4To3
   * @static
   */
  mat4To3: function mat4To3(m) {
    return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]];
  },
  /**
   * Returns a 4x4 matrix with each element set to the given scalar value.
   * @method m4s
   * @static
   */
  m4s: function m4s(s) {
    return [s, s, s, s, s, s, s, s, s, s, s, s, s, s, s, s];
  },
  /**
   * Returns a 4x4 matrix with each element set to zero.
   * @method setMat4ToZeroes
   * @static
   */
  setMat4ToZeroes: function setMat4ToZeroes() {
    return math.m4s(0.0);
  },
  /**
   * Returns a 4x4 matrix with each element set to 1.0.
   * @method setMat4ToOnes
   * @static
   */
  setMat4ToOnes: function setMat4ToOnes() {
    return math.m4s(1.0);
  },
  /**
   * Returns a 4x4 matrix with each element set to 1.0.
   * @method setMat4ToOnes
   * @static
   */
  diagonalMat4v: function diagonalMat4v(v) {
    return new FloatArrayType([v[0], 0.0, 0.0, 0.0, 0.0, v[1], 0.0, 0.0, 0.0, 0.0, v[2], 0.0, 0.0, 0.0, 0.0, v[3]]);
  },
  /**
   * Returns a 4x4 matrix with diagonal elements set to the given vector.
   * @method diagonalMat4c
   * @static
   */
  diagonalMat4c: function diagonalMat4c(x, y, z, w) {
    return math.diagonalMat4v([x, y, z, w]);
  },
  /**
   * Returns a 4x4 matrix with diagonal elements set to the given scalar.
   * @method diagonalMat4s
   * @static
   */
  diagonalMat4s: function diagonalMat4s(s) {
    return math.diagonalMat4c(s, s, s, s);
  },
  /**
   * Returns a 4x4 identity matrix.
   * @method identityMat4
   * @static
   */
  identityMat4: function identityMat4() {
    var mat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new FloatArrayType(16);
    mat[0] = 1.0;
    mat[1] = 0.0;
    mat[2] = 0.0;
    mat[3] = 0.0;
    mat[4] = 0.0;
    mat[5] = 1.0;
    mat[6] = 0.0;
    mat[7] = 0.0;
    mat[8] = 0.0;
    mat[9] = 0.0;
    mat[10] = 1.0;
    mat[11] = 0.0;
    mat[12] = 0.0;
    mat[13] = 0.0;
    mat[14] = 0.0;
    mat[15] = 1.0;
    return mat;
  },
  /**
   * Returns a 3x3 identity matrix.
   * @method identityMat3
   * @static
   */
  identityMat3: function identityMat3() {
    var mat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new FloatArrayType(9);
    mat[0] = 1.0;
    mat[1] = 0.0;
    mat[2] = 0.0;
    mat[3] = 0.0;
    mat[4] = 1.0;
    mat[5] = 0.0;
    mat[6] = 0.0;
    mat[7] = 0.0;
    mat[8] = 1.0;
    return mat;
  },
  /**
   * Tests if the given 4x4 matrix is the identity matrix.
   * @method isIdentityMat4
   * @static
   */
  isIdentityMat4: function isIdentityMat4(m) {
    if (m[0] !== 1.0 || m[1] !== 0.0 || m[2] !== 0.0 || m[3] !== 0.0 || m[4] !== 0.0 || m[5] !== 1.0 || m[6] !== 0.0 || m[7] !== 0.0 || m[8] !== 0.0 || m[9] !== 0.0 || m[10] !== 1.0 || m[11] !== 0.0 || m[12] !== 0.0 || m[13] !== 0.0 || m[14] !== 0.0 || m[15] !== 1.0) {
      return false;
    }
    return true;
  },
  /**
   * Negates the given 4x4 matrix.
   * @method negateMat4
   * @static
   */
  negateMat4: function negateMat4(m, dest) {
    if (!dest) {
      dest = m;
    }
    dest[0] = -m[0];
    dest[1] = -m[1];
    dest[2] = -m[2];
    dest[3] = -m[3];
    dest[4] = -m[4];
    dest[5] = -m[5];
    dest[6] = -m[6];
    dest[7] = -m[7];
    dest[8] = -m[8];
    dest[9] = -m[9];
    dest[10] = -m[10];
    dest[11] = -m[11];
    dest[12] = -m[12];
    dest[13] = -m[13];
    dest[14] = -m[14];
    dest[15] = -m[15];
    return dest;
  },
  /**
   * Adds the given 4x4 matrices together.
   * @method addMat4
   * @static
   */
  addMat4: function addMat4(a, b, dest) {
    if (!dest) {
      dest = a;
    }
    dest[0] = a[0] + b[0];
    dest[1] = a[1] + b[1];
    dest[2] = a[2] + b[2];
    dest[3] = a[3] + b[3];
    dest[4] = a[4] + b[4];
    dest[5] = a[5] + b[5];
    dest[6] = a[6] + b[6];
    dest[7] = a[7] + b[7];
    dest[8] = a[8] + b[8];
    dest[9] = a[9] + b[9];
    dest[10] = a[10] + b[10];
    dest[11] = a[11] + b[11];
    dest[12] = a[12] + b[12];
    dest[13] = a[13] + b[13];
    dest[14] = a[14] + b[14];
    dest[15] = a[15] + b[15];
    return dest;
  },
  /**
   * Adds the given scalar to each element of the given 4x4 matrix.
   * @method addMat4Scalar
   * @static
   */
  addMat4Scalar: function addMat4Scalar(m, s, dest) {
    if (!dest) {
      dest = m;
    }
    dest[0] = m[0] + s;
    dest[1] = m[1] + s;
    dest[2] = m[2] + s;
    dest[3] = m[3] + s;
    dest[4] = m[4] + s;
    dest[5] = m[5] + s;
    dest[6] = m[6] + s;
    dest[7] = m[7] + s;
    dest[8] = m[8] + s;
    dest[9] = m[9] + s;
    dest[10] = m[10] + s;
    dest[11] = m[11] + s;
    dest[12] = m[12] + s;
    dest[13] = m[13] + s;
    dest[14] = m[14] + s;
    dest[15] = m[15] + s;
    return dest;
  },
  /**
   * Adds the given scalar to each element of the given 4x4 matrix.
   * @method addScalarMat4
   * @static
   */
  addScalarMat4: function addScalarMat4(s, m, dest) {
    return math.addMat4Scalar(m, s, dest);
  },
  /**
   * Subtracts the second 4x4 matrix from the first.
   * @method subMat4
   * @static
   */
  subMat4: function subMat4(a, b, dest) {
    if (!dest) {
      dest = a;
    }
    dest[0] = a[0] - b[0];
    dest[1] = a[1] - b[1];
    dest[2] = a[2] - b[2];
    dest[3] = a[3] - b[3];
    dest[4] = a[4] - b[4];
    dest[5] = a[5] - b[5];
    dest[6] = a[6] - b[6];
    dest[7] = a[7] - b[7];
    dest[8] = a[8] - b[8];
    dest[9] = a[9] - b[9];
    dest[10] = a[10] - b[10];
    dest[11] = a[11] - b[11];
    dest[12] = a[12] - b[12];
    dest[13] = a[13] - b[13];
    dest[14] = a[14] - b[14];
    dest[15] = a[15] - b[15];
    return dest;
  },
  /**
   * Subtracts the given scalar from each element of the given 4x4 matrix.
   * @method subMat4Scalar
   * @static
   */
  subMat4Scalar: function subMat4Scalar(m, s, dest) {
    if (!dest) {
      dest = m;
    }
    dest[0] = m[0] - s;
    dest[1] = m[1] - s;
    dest[2] = m[2] - s;
    dest[3] = m[3] - s;
    dest[4] = m[4] - s;
    dest[5] = m[5] - s;
    dest[6] = m[6] - s;
    dest[7] = m[7] - s;
    dest[8] = m[8] - s;
    dest[9] = m[9] - s;
    dest[10] = m[10] - s;
    dest[11] = m[11] - s;
    dest[12] = m[12] - s;
    dest[13] = m[13] - s;
    dest[14] = m[14] - s;
    dest[15] = m[15] - s;
    return dest;
  },
  /**
   * Subtracts the given scalar from each element of the given 4x4 matrix.
   * @method subScalarMat4
   * @static
   */
  subScalarMat4: function subScalarMat4(s, m, dest) {
    if (!dest) {
      dest = m;
    }
    dest[0] = s - m[0];
    dest[1] = s - m[1];
    dest[2] = s - m[2];
    dest[3] = s - m[3];
    dest[4] = s - m[4];
    dest[5] = s - m[5];
    dest[6] = s - m[6];
    dest[7] = s - m[7];
    dest[8] = s - m[8];
    dest[9] = s - m[9];
    dest[10] = s - m[10];
    dest[11] = s - m[11];
    dest[12] = s - m[12];
    dest[13] = s - m[13];
    dest[14] = s - m[14];
    dest[15] = s - m[15];
    return dest;
  },
  /**
   * Multiplies the two given 4x4 matrix by each other.
   * @method mulMat4
   * @static
   */
  mulMat4: function mulMat4(a, b, dest) {
    if (!dest) {
      dest = a;
    }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    var a30 = a[12];
    var a31 = a[13];
    var a32 = a[14];
    var a33 = a[15];
    var b00 = b[0];
    var b01 = b[1];
    var b02 = b[2];
    var b03 = b[3];
    var b10 = b[4];
    var b11 = b[5];
    var b12 = b[6];
    var b13 = b[7];
    var b20 = b[8];
    var b21 = b[9];
    var b22 = b[10];
    var b23 = b[11];
    var b30 = b[12];
    var b31 = b[13];
    var b32 = b[14];
    var b33 = b[15];
    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return dest;
  },
  /**
   * Multiplies the two given 3x3 matrices by each other.
   * @method mulMat4
   * @static
   */
  mulMat3: function mulMat3(a, b, dest) {
    if (!dest) {
      dest = new FloatArrayType(9);
    }
    var a11 = a[0];
    var a12 = a[3];
    var a13 = a[6];
    var a21 = a[1];
    var a22 = a[4];
    var a23 = a[7];
    var a31 = a[2];
    var a32 = a[5];
    var a33 = a[8];
    var b11 = b[0];
    var b12 = b[3];
    var b13 = b[6];
    var b21 = b[1];
    var b22 = b[4];
    var b23 = b[7];
    var b31 = b[2];
    var b32 = b[5];
    var b33 = b[8];
    dest[0] = a11 * b11 + a12 * b21 + a13 * b31;
    dest[3] = a11 * b12 + a12 * b22 + a13 * b32;
    dest[6] = a11 * b13 + a12 * b23 + a13 * b33;
    dest[1] = a21 * b11 + a22 * b21 + a23 * b31;
    dest[4] = a21 * b12 + a22 * b22 + a23 * b32;
    dest[7] = a21 * b13 + a22 * b23 + a23 * b33;
    dest[2] = a31 * b11 + a32 * b21 + a33 * b31;
    dest[5] = a31 * b12 + a32 * b22 + a33 * b32;
    dest[8] = a31 * b13 + a32 * b23 + a33 * b33;
    return dest;
  },
  /**
   * Multiplies each element of the given 4x4 matrix by the given scalar.
   * @method mulMat4Scalar
   * @static
   */
  mulMat4Scalar: function mulMat4Scalar(m, s, dest) {
    if (!dest) {
      dest = m;
    }
    dest[0] = m[0] * s;
    dest[1] = m[1] * s;
    dest[2] = m[2] * s;
    dest[3] = m[3] * s;
    dest[4] = m[4] * s;
    dest[5] = m[5] * s;
    dest[6] = m[6] * s;
    dest[7] = m[7] * s;
    dest[8] = m[8] * s;
    dest[9] = m[9] * s;
    dest[10] = m[10] * s;
    dest[11] = m[11] * s;
    dest[12] = m[12] * s;
    dest[13] = m[13] * s;
    dest[14] = m[14] * s;
    dest[15] = m[15] * s;
    return dest;
  },
  /**
   * Multiplies the given 4x4 matrix by the given four-element vector.
   * @method mulMat4v4
   * @static
   */
  mulMat4v4: function mulMat4v4(m, v) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    var v3 = v[3];
    dest[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3;
    dest[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3;
    dest[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3;
    dest[3] = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3;
    return dest;
  },
  /**
   * Transposes the given 4x4 matrix.
   * @method transposeMat4
   * @static
   */
  transposeMat4: function transposeMat4(mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    var m4 = mat[4];
    var m14 = mat[14];
    var m8 = mat[8];
    var m13 = mat[13];
    var m12 = mat[12];
    var m9 = mat[9];
    if (!dest || mat === dest) {
      var a01 = mat[1];
      var a02 = mat[2];
      var a03 = mat[3];
      var a12 = mat[6];
      var a13 = mat[7];
      var a23 = mat[11];
      mat[1] = m4;
      mat[2] = m8;
      mat[3] = m12;
      mat[4] = a01;
      mat[6] = m9;
      mat[7] = m13;
      mat[8] = a02;
      mat[9] = a12;
      mat[11] = m14;
      mat[12] = a03;
      mat[13] = a13;
      mat[14] = a23;
      return mat;
    }
    dest[0] = mat[0];
    dest[1] = m4;
    dest[2] = m8;
    dest[3] = m12;
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = m9;
    dest[7] = m13;
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = m14;
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
  },
  /**
   * Transposes the given 3x3 matrix.
   *
   * @method transposeMat3
   * @static
   */
  transposeMat3: function transposeMat3(mat, dest) {
    if (dest === mat) {
      var a01 = mat[1];
      var a02 = mat[2];
      var a12 = mat[5];
      dest[1] = mat[3];
      dest[2] = mat[6];
      dest[3] = a01;
      dest[5] = mat[7];
      dest[6] = a02;
      dest[7] = a12;
    } else {
      dest[0] = mat[0];
      dest[1] = mat[3];
      dest[2] = mat[6];
      dest[3] = mat[1];
      dest[4] = mat[4];
      dest[5] = mat[7];
      dest[6] = mat[2];
      dest[7] = mat[5];
      dest[8] = mat[8];
    }
    return dest;
  },
  /**
   * Returns the determinant of the given 4x4 matrix.
   * @method determinantMat4
   * @static
   */
  determinantMat4: function determinantMat4(mat) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0];
    var a01 = mat[1];
    var a02 = mat[2];
    var a03 = mat[3];
    var a10 = mat[4];
    var a11 = mat[5];
    var a12 = mat[6];
    var a13 = mat[7];
    var a20 = mat[8];
    var a21 = mat[9];
    var a22 = mat[10];
    var a23 = mat[11];
    var a30 = mat[12];
    var a31 = mat[13];
    var a32 = mat[14];
    var a33 = mat[15];
    return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 + a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 + a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 + a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 + a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 + a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
  },
  /**
   * Returns the inverse of the given 4x4 matrix.
   * @method inverseMat4
   * @static
   */
  inverseMat4: function inverseMat4(mat, dest) {
    if (!dest) {
      dest = mat;
    }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0];
    var a01 = mat[1];
    var a02 = mat[2];
    var a03 = mat[3];
    var a10 = mat[4];
    var a11 = mat[5];
    var a12 = mat[6];
    var a13 = mat[7];
    var a20 = mat[8];
    var a21 = mat[9];
    var a22 = mat[10];
    var a23 = mat[11];
    var a30 = mat[12];
    var a31 = mat[13];
    var a32 = mat[14];
    var a33 = mat[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant (inlined to avoid double-caching)
    var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return dest;
  },
  /**
   * Returns the trace of the given 4x4 matrix.
   * @method traceMat4
   * @static
   */
  traceMat4: function traceMat4(m) {
    return m[0] + m[5] + m[10] + m[15];
  },
  /**
   * Returns 4x4 translation matrix.
   * @method translationMat4
   * @static
   */
  translationMat4v: function translationMat4v(v, dest) {
    var m = dest || math.identityMat4();
    m[12] = v[0];
    m[13] = v[1];
    m[14] = v[2];
    return m;
  },
  /**
   * Returns 3x3 translation matrix.
   * @method translationMat3
   * @static
   */
  translationMat3v: function translationMat3v(v, dest) {
    var m = dest || math.identityMat3();
    m[6] = v[0];
    m[7] = v[1];
    return m;
  },
  /**
   * Returns 4x4 translation matrix.
   * @method translationMat4c
   * @static
   */
  translationMat4c: function () {
    var xyz = new FloatArrayType(3);
    return function (x, y, z, dest) {
      xyz[0] = x;
      xyz[1] = y;
      xyz[2] = z;
      return math.translationMat4v(xyz, dest);
    };
  }(),
  /**
   * Returns 4x4 translation matrix.
   * @method translationMat4s
   * @static
   */
  translationMat4s: function translationMat4s(s, dest) {
    return math.translationMat4c(s, s, s, dest);
  },
  /**
   * Efficiently post-concatenates a translation to the given matrix.
   * @param v
   * @param m
   */
  translateMat4v: function translateMat4v(xyz, m) {
    return math.translateMat4c(xyz[0], xyz[1], xyz[2], m);
  },
  /**
   * Efficiently post-concatenates a translation to the given matrix.
   * @param x
   * @param y
   * @param z
   * @param m
   */
  OLDtranslateMat4c: function OLDtranslateMat4c(x, y, z, m) {
    var m12 = m[12];
    m[0] += m12 * x;
    m[4] += m12 * y;
    m[8] += m12 * z;
    var m13 = m[13];
    m[1] += m13 * x;
    m[5] += m13 * y;
    m[9] += m13 * z;
    var m14 = m[14];
    m[2] += m14 * x;
    m[6] += m14 * y;
    m[10] += m14 * z;
    var m15 = m[15];
    m[3] += m15 * x;
    m[7] += m15 * y;
    m[11] += m15 * z;
    return m;
  },
  translateMat4c: function translateMat4c(x, y, z, m) {
    var m3 = m[3];
    m[0] += m3 * x;
    m[1] += m3 * y;
    m[2] += m3 * z;
    var m7 = m[7];
    m[4] += m7 * x;
    m[5] += m7 * y;
    m[6] += m7 * z;
    var m11 = m[11];
    m[8] += m11 * x;
    m[9] += m11 * y;
    m[10] += m11 * z;
    var m15 = m[15];
    m[12] += m15 * x;
    m[13] += m15 * y;
    m[14] += m15 * z;
    return m;
  },
  /**
   * Returns 4x4 rotation matrix.
   * @method rotationMat4v
   * @static
   */
  rotationMat4v: function rotationMat4v(anglerad, axis, m) {
    var ax = math.normalizeVec4([axis[0], axis[1], axis[2], 0.0], []);
    var s = Math.sin(anglerad);
    var c = Math.cos(anglerad);
    var q = 1.0 - c;
    var x = ax[0];
    var y = ax[1];
    var z = ax[2];
    var xy;
    var yz;
    var zx;
    var xs;
    var ys;
    var zs;

    //xx = x * x; used once
    //yy = y * y; used once
    //zz = z * z; used once
    xy = x * y;
    yz = y * z;
    zx = z * x;
    xs = x * s;
    ys = y * s;
    zs = z * s;
    m = m || math.mat4();
    m[0] = q * x * x + c;
    m[1] = q * xy + zs;
    m[2] = q * zx - ys;
    m[3] = 0.0;
    m[4] = q * xy - zs;
    m[5] = q * y * y + c;
    m[6] = q * yz + xs;
    m[7] = 0.0;
    m[8] = q * zx + ys;
    m[9] = q * yz - xs;
    m[10] = q * z * z + c;
    m[11] = 0.0;
    m[12] = 0.0;
    m[13] = 0.0;
    m[14] = 0.0;
    m[15] = 1.0;
    return m;
  },
  /**
   * Returns 4x4 rotation matrix.
   * @method rotationMat4c
   * @static
   */
  rotationMat4c: function rotationMat4c(anglerad, x, y, z, mat) {
    return math.rotationMat4v(anglerad, [x, y, z], mat);
  },
  /**
   * Returns 4x4 scale matrix.
   * @method scalingMat4v
   * @static
   */
  scalingMat4v: function scalingMat4v(v) {
    var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.identityMat4();
    m[0] = v[0];
    m[5] = v[1];
    m[10] = v[2];
    return m;
  },
  /**
   * Returns 3x3 scale matrix.
   * @method scalingMat3v
   * @static
   */
  scalingMat3v: function scalingMat3v(v) {
    var m = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.identityMat3();
    m[0] = v[0];
    m[4] = v[1];
    return m;
  },
  /**
   * Returns 4x4 scale matrix.
   * @method scalingMat4c
   * @static
   */
  scalingMat4c: function () {
    var xyz = new FloatArrayType(3);
    return function (x, y, z, dest) {
      xyz[0] = x;
      xyz[1] = y;
      xyz[2] = z;
      return math.scalingMat4v(xyz, dest);
    };
  }(),
  /**
   * Efficiently post-concatenates a scaling to the given matrix.
   * @method scaleMat4c
   * @param x
   * @param y
   * @param z
   * @param m
   */
  scaleMat4c: function scaleMat4c(x, y, z, m) {
    m[0] *= x;
    m[4] *= y;
    m[8] *= z;
    m[1] *= x;
    m[5] *= y;
    m[9] *= z;
    m[2] *= x;
    m[6] *= y;
    m[10] *= z;
    m[3] *= x;
    m[7] *= y;
    m[11] *= z;
    return m;
  },
  /**
   * Efficiently post-concatenates a scaling to the given matrix.
   * @method scaleMat4c
   * @param xyz
   * @param m
   */
  scaleMat4v: function scaleMat4v(xyz, m) {
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    m[0] *= x;
    m[4] *= y;
    m[8] *= z;
    m[1] *= x;
    m[5] *= y;
    m[9] *= z;
    m[2] *= x;
    m[6] *= y;
    m[10] *= z;
    m[3] *= x;
    m[7] *= y;
    m[11] *= z;
    return m;
  },
  /**
   * Returns 4x4 scale matrix.
   * @method scalingMat4s
   * @static
   */
  scalingMat4s: function scalingMat4s(s) {
    return math.scalingMat4c(s, s, s);
  },
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   *
   * @param {Number[]} q Rotation quaternion
   * @param {Number[]} v Translation vector
   * @param {Number[]} dest Destination matrix
   * @returns {Number[]} dest
   */
  rotationTranslationMat4: function rotationTranslationMat4(q, v) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.mat4();
    var x = q[0];
    var y = q[1];
    var z = q[2];
    var w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = v[0];
    dest[13] = v[1];
    dest[14] = v[2];
    dest[15] = 1;
    return dest;
  },
  /**
   * Gets Euler angles from a 4x4 matrix.
   *
   * @param {Number[]} mat The 4x4 matrix.
   * @param {String} order Desired Euler angle order: "XYZ", "YXZ", "ZXY" etc.
   * @param {Number[]} [dest] Destination Euler angles, created by default.
   * @returns {Number[]} The Euler angles.
   */
  mat4ToEuler: function mat4ToEuler(mat, order) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    var clamp = math.clamp;

    // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var m11 = mat[0];
    var m12 = mat[4];
    var m13 = mat[8];
    var m21 = mat[1];
    var m22 = mat[5];
    var m23 = mat[9];
    var m31 = mat[2];
    var m32 = mat[6];
    var m33 = mat[10];
    if (order === 'XYZ') {
      dest[1] = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.99999) {
        dest[0] = Math.atan2(-m23, m33);
        dest[2] = Math.atan2(-m12, m11);
      } else {
        dest[0] = Math.atan2(m32, m22);
        dest[2] = 0;
      }
    } else if (order === 'YXZ') {
      dest[0] = Math.asin(-clamp(m23, -1, 1));
      if (Math.abs(m23) < 0.99999) {
        dest[1] = Math.atan2(m13, m33);
        dest[2] = Math.atan2(m21, m22);
      } else {
        dest[1] = Math.atan2(-m31, m11);
        dest[2] = 0;
      }
    } else if (order === 'ZXY') {
      dest[0] = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.99999) {
        dest[1] = Math.atan2(-m31, m33);
        dest[2] = Math.atan2(-m12, m22);
      } else {
        dest[1] = 0;
        dest[2] = Math.atan2(m21, m11);
      }
    } else if (order === 'ZYX') {
      dest[1] = Math.asin(-clamp(m31, -1, 1));
      if (Math.abs(m31) < 0.99999) {
        dest[0] = Math.atan2(m32, m33);
        dest[2] = Math.atan2(m21, m11);
      } else {
        dest[0] = 0;
        dest[2] = Math.atan2(-m12, m22);
      }
    } else if (order === 'YZX') {
      dest[2] = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.99999) {
        dest[0] = Math.atan2(-m23, m22);
        dest[1] = Math.atan2(-m31, m11);
      } else {
        dest[0] = 0;
        dest[1] = Math.atan2(m13, m33);
      }
    } else if (order === 'XZY') {
      dest[2] = Math.asin(-clamp(m12, -1, 1));
      if (Math.abs(m12) < 0.99999) {
        dest[0] = Math.atan2(m32, m22);
        dest[1] = Math.atan2(m13, m11);
      } else {
        dest[0] = Math.atan2(-m23, m33);
        dest[1] = 0;
      }
    }
    return dest;
  },
  composeMat4: function composeMat4(position, quaternion, scale) {
    var mat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.mat4();
    math.quaternionToRotationMat4(quaternion, mat);
    math.scaleMat4v(scale, mat);
    math.translateMat4v(position, mat);
    return mat;
  },
  decomposeMat4: function () {
    var vec = new FloatArrayType(3);
    var matrix = new FloatArrayType(16);
    return function decompose(mat, position, quaternion, scale) {
      vec[0] = mat[0];
      vec[1] = mat[1];
      vec[2] = mat[2];
      var sx = math.lenVec3(vec);
      vec[0] = mat[4];
      vec[1] = mat[5];
      vec[2] = mat[6];
      var sy = math.lenVec3(vec);
      vec[8] = mat[8];
      vec[9] = mat[9];
      vec[10] = mat[10];
      var sz = math.lenVec3(vec);

      // if determine is negative, we need to invert one scale
      var det = math.determinantMat4(mat);
      if (det < 0) {
        sx = -sx;
      }
      position[0] = mat[12];
      position[1] = mat[13];
      position[2] = mat[14];

      // scale the rotation part
      matrix.set(mat);
      var invSX = 1 / sx;
      var invSY = 1 / sy;
      var invSZ = 1 / sz;
      matrix[0] *= invSX;
      matrix[1] *= invSX;
      matrix[2] *= invSX;
      matrix[4] *= invSY;
      matrix[5] *= invSY;
      matrix[6] *= invSY;
      matrix[8] *= invSZ;
      matrix[9] *= invSZ;
      matrix[10] *= invSZ;
      math.mat4ToQuaternion(matrix, quaternion);
      scale[0] = sx;
      scale[1] = sy;
      scale[2] = sz;
      return this;
    };
  }(),
  /**
   * Returns a 4x4 'lookat' viewing transform matrix.
   * @method lookAtMat4v
   * @param pos vec3 position of the viewer
   * @param target vec3 point the viewer is looking at
   * @param up vec3 pointing "up"
   * @param dest mat4 Optional, mat4 matrix will be written into
   *
   * @return {mat4} dest if specified, a new mat4 otherwise
   */
  lookAtMat4v: function lookAtMat4v(pos, target, up, dest) {
    if (!dest) {
      dest = math.mat4();
    }
    var posx = pos[0];
    var posy = pos[1];
    var posz = pos[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var targetx = target[0];
    var targety = target[1];
    var targetz = target[2];
    if (posx === targetx && posy === targety && posz === targetz) {
      return math.identityMat4();
    }
    var z0;
    var z1;
    var z2;
    var x0;
    var x1;
    var x2;
    var y0;
    var y1;
    var y2;
    var len;

    //vec3.direction(eye, center, z);
    z0 = posx - targetx;
    z1 = posy - targety;
    z2 = posz - targetz;

    // normalize (no check needed for 0 because of early return)
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    //vec3.normalize(vec3.cross(up, z, x));
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    //vec3.normalize(vec3.cross(z, x, y));
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    dest[0] = x0;
    dest[1] = y0;
    dest[2] = z0;
    dest[3] = 0;
    dest[4] = x1;
    dest[5] = y1;
    dest[6] = z1;
    dest[7] = 0;
    dest[8] = x2;
    dest[9] = y2;
    dest[10] = z2;
    dest[11] = 0;
    dest[12] = -(x0 * posx + x1 * posy + x2 * posz);
    dest[13] = -(y0 * posx + y1 * posy + y2 * posz);
    dest[14] = -(z0 * posx + z1 * posy + z2 * posz);
    dest[15] = 1;
    return dest;
  },
  /**
   * Returns a 4x4 'lookat' viewing transform matrix.
   * @method lookAtMat4c
   * @static
   */
  lookAtMat4c: function lookAtMat4c(posx, posy, posz, targetx, targety, targetz, upx, upy, upz) {
    return math.lookAtMat4v([posx, posy, posz], [targetx, targety, targetz], [upx, upy, upz], []);
  },
  /**
   * Returns a 4x4 orthographic projection matrix.
   * @method orthoMat4c
   * @static
   */
  orthoMat4c: function orthoMat4c(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = math.mat4();
    }
    var rl = right - left;
    var tb = top - bottom;
    var fn = far - near;
    dest[0] = 2.0 / rl;
    dest[1] = 0.0;
    dest[2] = 0.0;
    dest[3] = 0.0;
    dest[4] = 0.0;
    dest[5] = 2.0 / tb;
    dest[6] = 0.0;
    dest[7] = 0.0;
    dest[8] = 0.0;
    dest[9] = 0.0;
    dest[10] = -2.0 / fn;
    dest[11] = 0.0;
    dest[12] = -(left + right) / rl;
    dest[13] = -(top + bottom) / tb;
    dest[14] = -(far + near) / fn;
    dest[15] = 1.0;
    return dest;
  },
  /**
   * Returns a 4x4 perspective projection matrix.
   * @method frustumMat4v
   * @static
   */
  frustumMat4v: function frustumMat4v(fmin, fmax, m) {
    if (!m) {
      m = math.mat4();
    }
    var fmin4 = [fmin[0], fmin[1], fmin[2], 0.0];
    var fmax4 = [fmax[0], fmax[1], fmax[2], 0.0];
    math.addVec4(fmax4, fmin4, tempMat1);
    math.subVec4(fmax4, fmin4, tempMat2);
    var t = 2.0 * fmin4[2];
    var tempMat20 = tempMat2[0];
    var tempMat21 = tempMat2[1];
    var tempMat22 = tempMat2[2];
    m[0] = t / tempMat20;
    m[1] = 0.0;
    m[2] = 0.0;
    m[3] = 0.0;
    m[4] = 0.0;
    m[5] = t / tempMat21;
    m[6] = 0.0;
    m[7] = 0.0;
    m[8] = tempMat1[0] / tempMat20;
    m[9] = tempMat1[1] / tempMat21;
    m[10] = -tempMat1[2] / tempMat22;
    m[11] = -1.0;
    m[12] = 0.0;
    m[13] = 0.0;
    m[14] = -t * fmax4[2] / tempMat22;
    m[15] = 0.0;
    return m;
  },
  /**
   * Returns a 4x4 perspective projection matrix.
   * @method frustumMat4v
   * @static
   */
  frustumMat4: function frustumMat4(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = math.mat4();
    }
    var rl = right - left;
    var tb = top - bottom;
    var fn = far - near;
    dest[0] = near * 2 / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = near * 2 / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = (right + left) / rl;
    dest[9] = (top + bottom) / tb;
    dest[10] = -(far + near) / fn;
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / fn;
    dest[15] = 0;
    return dest;
  },
  /**
   * Returns a 4x4 perspective projection matrix.
   * @method perspectiveMat4v
   * @static
   */
  perspectiveMat4: function perspectiveMat4(fovyrad, aspectratio, znear, zfar, m) {
    var pmin = [];
    var pmax = [];
    pmin[2] = znear;
    pmax[2] = zfar;
    pmax[1] = pmin[2] * Math.tan(fovyrad / 2.0);
    pmin[1] = -pmax[1];
    pmax[0] = pmax[1] * aspectratio;
    pmin[0] = -pmax[0];
    return math.frustumMat4v(pmin, pmax, m);
  },
  /**
   * Transforms a three-element position by a 4x4 matrix.
   * @method transformPoint3
   * @static
   */
  transformPoint3: function transformPoint3(m, p) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec3();
    var x = p[0];
    var y = p[1];
    var z = p[2];
    dest[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    dest[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    dest[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return dest;
  },
  /**
   * Transforms a homogeneous coordinate by a 4x4 matrix.
   * @method transformPoint3
   * @static
   */
  transformPoint4: function transformPoint4(m, v) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    dest[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
    dest[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
    dest[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
    dest[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];
    return dest;
  },
  /**
   * Transforms an array of three-element positions by a 4x4 matrix.
   * @method transformPoints3
   * @static
   */
  transformPoints3: function transformPoints3(m, points, points2) {
    var result = points2 || [];
    var len = points.length;
    var p0;
    var p1;
    var p2;
    var pi;

    // cache values
    var m0 = m[0];
    var m1 = m[1];
    var m2 = m[2];
    var m3 = m[3];
    var m4 = m[4];
    var m5 = m[5];
    var m6 = m[6];
    var m7 = m[7];
    var m8 = m[8];
    var m9 = m[9];
    var m10 = m[10];
    var m11 = m[11];
    var m12 = m[12];
    var m13 = m[13];
    var m14 = m[14];
    var m15 = m[15];
    var r;
    for (var i = 0; i < len; ++i) {
      // cache values
      pi = points[i];
      p0 = pi[0];
      p1 = pi[1];
      p2 = pi[2];
      r = result[i] || (result[i] = [0, 0, 0]);
      r[0] = m0 * p0 + m4 * p1 + m8 * p2 + m12;
      r[1] = m1 * p0 + m5 * p1 + m9 * p2 + m13;
      r[2] = m2 * p0 + m6 * p1 + m10 * p2 + m14;
      r[3] = m3 * p0 + m7 * p1 + m11 * p2 + m15;
    }
    result.length = len;
    return result;
  },
  /**
   * Transforms an array of positions by a 4x4 matrix.
   * @method transformPositions3
   * @static
   */
  transformPositions3: function transformPositions3(m, p) {
    var p2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : p;
    var i;
    var len = p.length;
    var x;
    var y;
    var z;
    var m0 = m[0];
    var m1 = m[1];
    var m2 = m[2];
    var m3 = m[3];
    var m4 = m[4];
    var m5 = m[5];
    var m6 = m[6];
    var m7 = m[7];
    var m8 = m[8];
    var m9 = m[9];
    var m10 = m[10];
    var m11 = m[11];
    var m12 = m[12];
    var m13 = m[13];
    var m14 = m[14];
    var m15 = m[15];
    for (i = 0; i < len; i += 3) {
      x = p[i + 0];
      y = p[i + 1];
      z = p[i + 2];
      p2[i + 0] = m0 * x + m4 * y + m8 * z + m12;
      p2[i + 1] = m1 * x + m5 * y + m9 * z + m13;
      p2[i + 2] = m2 * x + m6 * y + m10 * z + m14;
      p2[i + 3] = m3 * x + m7 * y + m11 * z + m15;
    }
    return p2;
  },
  /**
   * Transforms an array of positions by a 4x4 matrix.
   * @method transformPositions4
   * @static
   */
  transformPositions4: function transformPositions4(m, p) {
    var p2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : p;
    var i;
    var len = p.length;
    var x;
    var y;
    var z;
    var m0 = m[0];
    var m1 = m[1];
    var m2 = m[2];
    var m3 = m[3];
    var m4 = m[4];
    var m5 = m[5];
    var m6 = m[6];
    var m7 = m[7];
    var m8 = m[8];
    var m9 = m[9];
    var m10 = m[10];
    var m11 = m[11];
    var m12 = m[12];
    var m13 = m[13];
    var m14 = m[14];
    var m15 = m[15];
    for (i = 0; i < len; i += 4) {
      x = p[i + 0];
      y = p[i + 1];
      z = p[i + 2];
      p2[i + 0] = m0 * x + m4 * y + m8 * z + m12;
      p2[i + 1] = m1 * x + m5 * y + m9 * z + m13;
      p2[i + 2] = m2 * x + m6 * y + m10 * z + m14;
      p2[i + 3] = m3 * x + m7 * y + m11 * z + m15;
    }
    return p2;
  },
  /**
   * Transforms a three-element vector by a 4x4 matrix.
   * @method transformVec3
   * @static
   */
  transformVec3: function transformVec3(m, v, dest) {
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    dest = dest || this.vec3();
    dest[0] = m[0] * v0 + m[4] * v1 + m[8] * v2;
    dest[1] = m[1] * v0 + m[5] * v1 + m[9] * v2;
    dest[2] = m[2] * v0 + m[6] * v1 + m[10] * v2;
    return dest;
  },
  /**
   * Transforms a four-element vector by a 4x4 matrix.
   * @method transformVec4
   * @static
   */
  transformVec4: function transformVec4(m, v, dest) {
    var v0 = v[0];
    var v1 = v[1];
    var v2 = v[2];
    var v3 = v[3];
    dest = dest || math.vec4();
    dest[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3;
    dest[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3;
    dest[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3;
    dest[3] = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3;
    return dest;
  },
  /**
   * Rotate a 3D vector around the x-axis
   *
   * @method rotateVec3X
   * @param {Number[]} a The vec3 point to rotate
   * @param {Number[]} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @param {Number[]} dest The receiving vec3
   * @returns {Number[]} dest
   * @static
   */
  rotateVec3X: function rotateVec3X(a, b, c, dest) {
    var p = [];
    var r = [];

    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];

    //perform rotation
    r[0] = p[0];
    r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
    r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

    //translate to correct position
    dest[0] = r[0] + b[0];
    dest[1] = r[1] + b[1];
    dest[2] = r[2] + b[2];
    return dest;
  },
  /**
   * Rotate a 3D vector around the y-axis
   *
   * @method rotateVec3Y
   * @param {Number[]} a The vec3 point to rotate
   * @param {Number[]} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @param {Number[]} dest The receiving vec3
   * @returns {Number[]} dest
   * @static
   */
  rotateVec3Y: function rotateVec3Y(a, b, c, dest) {
    var p = [];
    var r = [];

    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];

    //perform rotation
    r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

    //translate to correct position
    dest[0] = r[0] + b[0];
    dest[1] = r[1] + b[1];
    dest[2] = r[2] + b[2];
    return dest;
  },
  /**
   * Rotate a 3D vector around the z-axis
   *
   * @method rotateVec3Z
   * @param {Number[]} a The vec3 point to rotate
   * @param {Number[]} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @param {Number[]} dest The receiving vec3
   * @returns {Number[]} dest
   * @static
   */
  rotateVec3Z: function rotateVec3Z(a, b, c, dest) {
    var p = [];
    var r = [];

    //Translate point to the origin
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];

    //perform rotation
    r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
    r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
    r[2] = p[2];

    //translate to correct position
    dest[0] = r[0] + b[0];
    dest[1] = r[1] + b[1];
    dest[2] = r[2] + b[2];
    return dest;
  },
  /**
   * Transforms a four-element vector by a 4x4 projection matrix.
   *
   * @method projectVec4
   * @param {Number[]} p 3D View-space coordinate
   * @param {Number[]} q 2D Projected coordinate
   * @returns {Number[]} 2D Projected coordinate
   * @static
   */
  projectVec4: function projectVec4(p, q) {
    var f = 1.0 / p[3];
    q = q || math.vec2();
    q[0] = v[0] * f;
    q[1] = v[1] * f;
    return q;
  },
  /**
   * Unprojects a three-element vector.
   *
   * @method unprojectVec3
   * @param {Number[]} p 3D Projected coordinate
   * @param {Number[]} viewMat View matrix
   * @returns {Number[]} projMat Projection matrix
   * @static
   */
  unprojectVec3: function () {
    var mat = new FloatArrayType(16);
    var mat2 = new FloatArrayType(16);
    var mat3 = new FloatArrayType(16);
    return function (p, viewMat, projMat, q) {
      return this.transformVec3(this.mulMat4(this.inverseMat4(viewMat, mat), this.inverseMat4(projMat, mat2), mat3), p, q);
    };
  }(),
  /**
   * Linearly interpolates between two 3D vectors.
   * @method lerpVec3
   * @static
   */
  lerpVec3: function lerpVec3(t, t1, t2, p1, p2, dest) {
    var result = dest || math.vec3();
    var f = (t - t1) / (t2 - t1);
    result[0] = p1[0] + f * (p2[0] - p1[0]);
    result[1] = p1[1] + f * (p2[1] - p1[1]);
    result[2] = p1[2] + f * (p2[2] - p1[2]);
    return result;
  },
  /**
   * Flattens a two-dimensional array into a one-dimensional array.
   *
   * @method flatten
   * @static
   * @param {Array of Arrays} a A 2D array
   * @returns Flattened 1D array
   */
  flatten: function flatten(a) {
    var result = [];
    var i;
    var leni;
    var j;
    var lenj;
    var item;
    for (i = 0, leni = a.length; i < leni; i++) {
      item = a[i];
      for (j = 0, lenj = item.length; j < lenj; j++) {
        result.push(item[j]);
      }
    }
    return result;
  },
  identityQuaternion: function identityQuaternion() {
    var dest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : math.vec4();
    dest[0] = 0.0;
    dest[1] = 0.0;
    dest[2] = 0.0;
    dest[3] = 1.0;
    return dest;
  },
  /**
   * Initializes a quaternion from Euler angles.
   *
   * @param {Number[]} euler The Euler angles.
   * @param {String} order Euler angle order: "XYZ", "YXZ", "ZXY" etc.
   * @param {Number[]} [dest] Destination quaternion, created by default.
   * @returns {Number[]} The quaternion.
   */
  eulerToQuaternion: function eulerToQuaternion(euler, order) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
    //	content/SpinCalc.m

    var a = euler[0] * math.DEGTORAD / 2;
    var b = euler[1] * math.DEGTORAD / 2;
    var c = euler[2] * math.DEGTORAD / 2;
    var c1 = Math.cos(a);
    var c2 = Math.cos(b);
    var c3 = Math.cos(c);
    var s1 = Math.sin(a);
    var s2 = Math.sin(b);
    var s3 = Math.sin(c);
    if (order === 'XYZ') {
      dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === 'YXZ') {
      dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === 'ZXY') {
      dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === 'ZYX') {
      dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === 'YZX') {
      dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === 'XZY') {
      dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
      dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
      dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
      dest[3] = c1 * c2 * c3 + s1 * s2 * s3;
    }
    return dest;
  },
  mat4ToQuaternion: function mat4ToQuaternion(m) {
    var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.vec4();
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var m11 = m[0];
    var m12 = m[4];
    var m13 = m[8];
    var m21 = m[1];
    var m22 = m[5];
    var m23 = m[9];
    var m31 = m[2];
    var m32 = m[6];
    var m33 = m[10];
    var s;
    var trace = m11 + m22 + m33;
    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1.0);
      dest[3] = 0.25 / s;
      dest[0] = (m32 - m23) * s;
      dest[1] = (m13 - m31) * s;
      dest[2] = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      dest[3] = (m32 - m23) / s;
      dest[0] = 0.25 * s;
      dest[1] = (m12 + m21) / s;
      dest[2] = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      dest[3] = (m13 - m31) / s;
      dest[0] = (m12 + m21) / s;
      dest[1] = 0.25 * s;
      dest[2] = (m23 + m32) / s;
    } else {
      s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      dest[3] = (m21 - m12) / s;
      dest[0] = (m13 + m31) / s;
      dest[1] = (m23 + m32) / s;
      dest[2] = 0.25 * s;
    }
    return dest;
  },
  vec3PairToQuaternion: function vec3PairToQuaternion(u, v) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    var norm_u_norm_v = Math.sqrt(math.dotVec3(u, u) * math.dotVec3(v, v));
    var real_part = norm_u_norm_v + math.dotVec3(u, v);
    if (real_part < 0.00000001 * norm_u_norm_v) {
      // If u and v are exactly opposite, rotate 180 degrees
      // around an arbitrary orthogonal axis. Axis normalisation
      // can happen later, when we normalise the quaternion.

      real_part = 0.0;
      if (Math.abs(u[0]) > Math.abs(u[2])) {
        dest[0] = -u[1];
        dest[1] = u[0];
        dest[2] = 0;
      } else {
        dest[0] = 0;
        dest[1] = -u[2];
        dest[2] = u[1];
      }
    } else {
      // Otherwise, build quaternion the standard way.
      math.cross3Vec3(u, v, dest);
    }
    dest[3] = real_part;
    return math.normalizeQuaternion(dest);
  },
  angleAxisToQuaternion: function angleAxisToQuaternion(angleAxis) {
    var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.vec4();
    var halfAngle = angleAxis[3] / 2.0;
    var fsin = Math.sin(halfAngle);
    dest[0] = fsin * angleAxis[0];
    dest[1] = fsin * angleAxis[1];
    dest[2] = fsin * angleAxis[2];
    dest[3] = Math.cos(halfAngle);
    return dest;
  },
  quaternionToEuler: function () {
    var mat = new FloatArrayType(16);
    return function (q, order, dest) {
      dest = dest || math.vec3();
      math.quaternionToRotationMat4(q, mat);
      math.mat4ToEuler(mat, order, dest);
      return dest;
    };
  }(),
  mulQuaternions: function mulQuaternions(p, q) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec4();
    var p0 = p[0];
    var p1 = p[1];
    var p2 = p[2];
    var p3 = p[3];
    var q0 = q[0];
    var q1 = q[1];
    var q2 = q[2];
    var q3 = q[3];
    dest[0] = p3 * q0 + p0 * q3 + p1 * q2 - p2 * q1;
    dest[1] = p3 * q1 + p1 * q3 + p2 * q0 - p0 * q2;
    dest[2] = p3 * q2 + p2 * q3 + p0 * q1 - p1 * q0;
    dest[3] = p3 * q3 - p0 * q0 - p1 * q1 - p2 * q2;
    return dest;
  },
  vec3ApplyQuaternion: function vec3ApplyQuaternion(q, vec) {
    var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.vec3();
    var x = vec[0];
    var y = vec[1];
    var z = vec[2];
    var qx = q[0];
    var qy = q[1];
    var qz = q[2];
    var qw = q[3];

    // calculate quat * vector

    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return dest;
  },
  quaternionToMat4: function quaternionToMat4(q, dest) {
    dest = math.identityMat4(dest);
    var q0 = q[0]; //x
    var q1 = q[1]; //y
    var q2 = q[2]; //z
    var q3 = q[3]; //w

    var tx = 2.0 * q0;
    var ty = 2.0 * q1;
    var tz = 2.0 * q2;
    var twx = tx * q3;
    var twy = ty * q3;
    var twz = tz * q3;
    var txx = tx * q0;
    var txy = ty * q0;
    var txz = tz * q0;
    var tyy = ty * q1;
    var tyz = tz * q1;
    var tzz = tz * q2;
    dest[0] = 1.0 - (tyy + tzz);
    dest[1] = txy + twz;
    dest[2] = txz - twy;
    dest[4] = txy - twz;
    dest[5] = 1.0 - (txx + tzz);
    dest[6] = tyz + twx;
    dest[8] = txz + twy;
    dest[9] = tyz - twx;
    dest[10] = 1.0 - (txx + tyy);
    return dest;
  },
  quaternionToRotationMat4: function quaternionToRotationMat4(q, m) {
    var x = q[0];
    var y = q[1];
    var z = q[2];
    var w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    m[0] = 1 - (yy + zz);
    m[4] = xy - wz;
    m[8] = xz + wy;
    m[1] = xy + wz;
    m[5] = 1 - (xx + zz);
    m[9] = yz - wx;
    m[2] = xz - wy;
    m[6] = yz + wx;
    m[10] = 1 - (xx + yy);

    // last column
    m[3] = 0;
    m[7] = 0;
    m[11] = 0;

    // bottom row
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return m;
  },
  normalizeQuaternion: function normalizeQuaternion(q) {
    var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : q;
    var len = math.lenVec4([q[0], q[1], q[2], q[3]]);
    dest[0] = q[0] / len;
    dest[1] = q[1] / len;
    dest[2] = q[2] / len;
    dest[3] = q[3] / len;
    return dest;
  },
  conjugateQuaternion: function conjugateQuaternion(q) {
    var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : q;
    dest[0] = -q[0];
    dest[1] = -q[1];
    dest[2] = -q[2];
    dest[3] = q[3];
    return dest;
  },
  inverseQuaternion: function inverseQuaternion(q, dest) {
    return math.normalizeQuaternion(math.conjugateQuaternion(q, dest));
  },
  quaternionToAngleAxis: function quaternionToAngleAxis(q) {
    var angleAxis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.vec4();
    q = math.normalizeQuaternion(q, tempVec4);
    var q3 = q[3];
    var angle = 2 * Math.acos(q3);
    var s = Math.sqrt(1 - q3 * q3);
    if (s < 0.001) {
      // test to avoid divide by zero, s is always positive due to sqrt
      angleAxis[0] = q[0];
      angleAxis[1] = q[1];
      angleAxis[2] = q[2];
    } else {
      angleAxis[0] = q[0] / s;
      angleAxis[1] = q[1] / s;
      angleAxis[2] = q[2] / s;
    }
    angleAxis[3] = angle; // * 57.295779579;
    return angleAxis;
  },
  //------------------------------------------------------------------------------------------------------------------
  // Boundaries
  //------------------------------------------------------------------------------------------------------------------
  /**
   * Returns a new, uninitialized 3D axis-aligned bounding box.
   *
   * @private
   */
  AABB3: function AABB3(values) {
    return new FloatArrayType(values || 6);
  },
  /**
   * Returns a new, uninitialized 2D axis-aligned bounding box.
   *
   * @private
   */
  AABB2: function AABB2(values) {
    return new FloatArrayType(values || 4);
  },
  /**
   * Returns a new, uninitialized 3D oriented bounding box (OBB).
   *
   * @private
   */
  OBB3: function OBB3(values) {
    return new FloatArrayType(values || 32);
  },
  /**
   * Returns a new, uninitialized 2D oriented bounding box (OBB).
   *
   * @private
   */
  OBB2: function OBB2(values) {
    return new FloatArrayType(values || 16);
  },
  /** Returns a new 3D bounding sphere */Sphere3: function Sphere3(x, y, z, r) {
    return new FloatArrayType([x, y, z, r]);
  },
  /**
   * Transforms an OBB3 by a 4x4 matrix.
   *
   * @private
   */
  transformOBB3: function transformOBB3(m, p) {
    var p2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : p;
    var i;
    var len = p.length;
    var x;
    var y;
    var z;
    var m0 = m[0];
    var m1 = m[1];
    var m2 = m[2];
    var m3 = m[3];
    var m4 = m[4];
    var m5 = m[5];
    var m6 = m[6];
    var m7 = m[7];
    var m8 = m[8];
    var m9 = m[9];
    var m10 = m[10];
    var m11 = m[11];
    var m12 = m[12];
    var m13 = m[13];
    var m14 = m[14];
    var m15 = m[15];
    for (i = 0; i < len; i += 4) {
      x = p[i + 0];
      y = p[i + 1];
      z = p[i + 2];
      p2[i + 0] = m0 * x + m4 * y + m8 * z + m12;
      p2[i + 1] = m1 * x + m5 * y + m9 * z + m13;
      p2[i + 2] = m2 * x + m6 * y + m10 * z + m14;
      p2[i + 3] = m3 * x + m7 * y + m11 * z + m15;
    }
    return p2;
  },
  /** Returns true if the first AABB contains the second AABB.
   * @param aabb1
   * @param aabb2
   * @returns {boolean}
   */
  containsAABB3: function containsAABB3(aabb1, aabb2) {
    var result = aabb1[0] <= aabb2[0] && aabb2[3] <= aabb1[3] && aabb1[1] <= aabb2[1] && aabb2[4] <= aabb1[4] && aabb1[2] <= aabb2[2] && aabb2[5] <= aabb1[5];
    return result;
  },
  /**
   * Gets the diagonal size of an AABB3 given as minima and maxima.
   *
   * @private
   */
  getAABB3Diag: function () {
    var min = new FloatArrayType(3);
    var max = new FloatArrayType(3);
    var tempVec3 = new FloatArrayType(3);
    return function (aabb) {
      min[0] = aabb[0];
      min[1] = aabb[1];
      min[2] = aabb[2];
      max[0] = aabb[3];
      max[1] = aabb[4];
      max[2] = aabb[5];
      math.subVec3(max, min, tempVec3);
      return Math.abs(math.lenVec3(tempVec3));
    };
  }(),
  /**
   * Get a diagonal boundary size that is symmetrical about the given point.
   *
   * @private
   */
  getAABB3DiagPoint: function () {
    var min = new FloatArrayType(3);
    var max = new FloatArrayType(3);
    var tempVec3 = new FloatArrayType(3);
    return function (aabb, p) {
      min[0] = aabb[0];
      min[1] = aabb[1];
      min[2] = aabb[2];
      max[0] = aabb[3];
      max[1] = aabb[4];
      max[2] = aabb[5];
      var diagVec = math.subVec3(max, min, tempVec3);
      var xneg = p[0] - aabb[0];
      var xpos = aabb[3] - p[0];
      var yneg = p[1] - aabb[1];
      var ypos = aabb[4] - p[1];
      var zneg = p[2] - aabb[2];
      var zpos = aabb[5] - p[2];
      diagVec[0] += xneg > xpos ? xneg : xpos;
      diagVec[1] += yneg > ypos ? yneg : ypos;
      diagVec[2] += zneg > zpos ? zneg : zpos;
      return Math.abs(math.lenVec3(diagVec));
    };
  }(),
  /**
   * Gets the center of an AABB.
   *
   * @private
   */
  getAABB3Center: function getAABB3Center(aabb, dest) {
    var r = dest || math.vec3();
    r[0] = (aabb[0] + aabb[3]) / 2;
    r[1] = (aabb[1] + aabb[4]) / 2;
    r[2] = (aabb[2] + aabb[5]) / 2;
    return r;
  },
  /**
   * Gets the center of a 2D AABB.
   *
   * @private
   */
  getAABB2Center: function getAABB2Center(aabb, dest) {
    var r = dest || math.vec2();
    r[0] = (aabb[2] + aabb[0]) / 2;
    r[1] = (aabb[3] + aabb[1]) / 2;
    return r;
  },
  /**
   * Collapses a 3D axis-aligned boundary, ready to expand to fit 3D points.
   * Creates new AABB if none supplied.
   *
   * @private
   */
  collapseAABB3: function collapseAABB3() {
    var aabb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : math.AABB3();
    aabb[0] = math.MAX_DOUBLE;
    aabb[1] = math.MAX_DOUBLE;
    aabb[2] = math.MAX_DOUBLE;
    aabb[3] = -math.MAX_DOUBLE;
    aabb[4] = -math.MAX_DOUBLE;
    aabb[5] = -math.MAX_DOUBLE;
    return aabb;
  },
  /**
   * Converts an axis-aligned 3D boundary into an oriented boundary consisting of
   * an array of eight 3D positions, one for each corner of the boundary.
   *
   * @private
   */
  AABB3ToOBB3: function AABB3ToOBB3(aabb) {
    var obb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.OBB3();
    obb[0] = aabb[0];
    obb[1] = aabb[1];
    obb[2] = aabb[2];
    obb[3] = 1;
    obb[4] = aabb[3];
    obb[5] = aabb[1];
    obb[6] = aabb[2];
    obb[7] = 1;
    obb[8] = aabb[3];
    obb[9] = aabb[4];
    obb[10] = aabb[2];
    obb[11] = 1;
    obb[12] = aabb[0];
    obb[13] = aabb[4];
    obb[14] = aabb[2];
    obb[15] = 1;
    obb[16] = aabb[0];
    obb[17] = aabb[1];
    obb[18] = aabb[5];
    obb[19] = 1;
    obb[20] = aabb[3];
    obb[21] = aabb[1];
    obb[22] = aabb[5];
    obb[23] = 1;
    obb[24] = aabb[3];
    obb[25] = aabb[4];
    obb[26] = aabb[5];
    obb[27] = 1;
    obb[28] = aabb[0];
    obb[29] = aabb[4];
    obb[30] = aabb[5];
    obb[31] = 1;
    return obb;
  },
  /**
   * Finds the minimum axis-aligned 3D boundary enclosing the homogeneous 3D points (x,y,z,w) given in a flattened array.
   *
   * @private
   */
  positions3ToAABB3: function () {
    var p = new FloatArrayType(3);
    return function (positions, aabb, positionsDecodeMatrix) {
      aabb = aabb || math.AABB3();
      var xmin = math.MAX_DOUBLE;
      var ymin = math.MAX_DOUBLE;
      var zmin = math.MAX_DOUBLE;
      var xmax = -math.MAX_DOUBLE;
      var ymax = -math.MAX_DOUBLE;
      var zmax = -math.MAX_DOUBLE;
      var x;
      var y;
      var z;
      for (var i = 0, len = positions.length; i < len; i += 3) {
        if (positionsDecodeMatrix) {
          p[0] = positions[i + 0];
          p[1] = positions[i + 1];
          p[2] = positions[i + 2];
          math.decompressPosition(p, positionsDecodeMatrix, p);
          x = p[0];
          y = p[1];
          z = p[2];
        } else {
          x = positions[i + 0];
          y = positions[i + 1];
          z = positions[i + 2];
        }
        if (x < xmin) {
          xmin = x;
        }
        if (y < ymin) {
          ymin = y;
        }
        if (z < zmin) {
          zmin = z;
        }
        if (x > xmax) {
          xmax = x;
        }
        if (y > ymax) {
          ymax = y;
        }
        if (z > zmax) {
          zmax = z;
        }
      }
      aabb[0] = xmin;
      aabb[1] = ymin;
      aabb[2] = zmin;
      aabb[3] = xmax;
      aabb[4] = ymax;
      aabb[5] = zmax;
      return aabb;
    };
  }(),
  /**
   * Finds the minimum axis-aligned 3D boundary enclosing the homogeneous 3D points (x,y,z,w) given in a flattened array.
   *
   * @private
   */
  OBB3ToAABB3: function OBB3ToAABB3(obb) {
    var aabb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.AABB3();
    var xmin = math.MAX_DOUBLE;
    var ymin = math.MAX_DOUBLE;
    var zmin = math.MAX_DOUBLE;
    var xmax = -math.MAX_DOUBLE;
    var ymax = -math.MAX_DOUBLE;
    var zmax = -math.MAX_DOUBLE;
    var x;
    var y;
    var z;
    for (var i = 0, len = obb.length; i < len; i += 4) {
      x = obb[i + 0];
      y = obb[i + 1];
      z = obb[i + 2];
      if (x < xmin) {
        xmin = x;
      }
      if (y < ymin) {
        ymin = y;
      }
      if (z < zmin) {
        zmin = z;
      }
      if (x > xmax) {
        xmax = x;
      }
      if (y > ymax) {
        ymax = y;
      }
      if (z > zmax) {
        zmax = z;
      }
    }
    aabb[0] = xmin;
    aabb[1] = ymin;
    aabb[2] = zmin;
    aabb[3] = xmax;
    aabb[4] = ymax;
    aabb[5] = zmax;
    return aabb;
  },
  /**
   * Finds the minimum axis-aligned 3D boundary enclosing the given 3D points.
   *
   * @private
   */
  points3ToAABB3: function points3ToAABB3(points) {
    var aabb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.AABB3();
    var xmin = math.MAX_DOUBLE;
    var ymin = math.MAX_DOUBLE;
    var zmin = math.MAX_DOUBLE;
    var xmax = -math.MAX_DOUBLE;
    var ymax = -math.MAX_DOUBLE;
    var zmax = -math.MAX_DOUBLE;
    var x;
    var y;
    var z;
    for (var i = 0, len = points.length; i < len; i++) {
      x = points[i][0];
      y = points[i][1];
      z = points[i][2];
      if (x < xmin) {
        xmin = x;
      }
      if (y < ymin) {
        ymin = y;
      }
      if (z < zmin) {
        zmin = z;
      }
      if (x > xmax) {
        xmax = x;
      }
      if (y > ymax) {
        ymax = y;
      }
      if (z > zmax) {
        zmax = z;
      }
    }
    aabb[0] = xmin;
    aabb[1] = ymin;
    aabb[2] = zmin;
    aabb[3] = xmax;
    aabb[4] = ymax;
    aabb[5] = zmax;
    return aabb;
  },
  /**
   * Finds the minimum boundary sphere enclosing the given 3D points.
   *
   * @private
   */
  points3ToSphere3: function () {
    var tempVec3 = new FloatArrayType(3);
    return function (points, sphere) {
      sphere = sphere || math.vec4();
      var x = 0;
      var y = 0;
      var z = 0;
      var i;
      var numPoints = points.length;
      for (i = 0; i < numPoints; i++) {
        x += points[i][0];
        y += points[i][1];
        z += points[i][2];
      }
      sphere[0] = x / numPoints;
      sphere[1] = y / numPoints;
      sphere[2] = z / numPoints;
      var radius = 0;
      var dist;
      for (i = 0; i < numPoints; i++) {
        dist = Math.abs(math.lenVec3(math.subVec3(points[i], sphere, tempVec3)));
        if (dist > radius) {
          radius = dist;
        }
      }
      sphere[3] = radius;
      return sphere;
    };
  }(),
  /**
   * Finds the minimum boundary sphere enclosing the given 3D positions.
   *
   * @private
   */
  positions3ToSphere3: function () {
    var tempVec3a = new FloatArrayType(3);
    var tempVec3b = new FloatArrayType(3);
    return function (positions, sphere) {
      sphere = sphere || math.vec4();
      var x = 0;
      var y = 0;
      var z = 0;
      var i;
      var lenPositions = positions.length;
      var radius = 0;
      for (i = 0; i < lenPositions; i += 3) {
        x += positions[i];
        y += positions[i + 1];
        z += positions[i + 2];
      }
      var numPositions = lenPositions / 3;
      sphere[0] = x / numPositions;
      sphere[1] = y / numPositions;
      sphere[2] = z / numPositions;
      var dist;
      for (i = 0; i < lenPositions; i += 3) {
        tempVec3a[0] = positions[i];
        tempVec3a[1] = positions[i + 1];
        tempVec3a[2] = positions[i + 2];
        dist = Math.abs(math.lenVec3(math.subVec3(tempVec3a, sphere, tempVec3b)));
        if (dist > radius) {
          radius = dist;
        }
      }
      sphere[3] = radius;
      return sphere;
    };
  }(),
  /**
   * Finds the minimum boundary sphere enclosing the given 3D points.
   *
   * @private
   */
  OBB3ToSphere3: function () {
    var point = new FloatArrayType(3);
    var tempVec3 = new FloatArrayType(3);
    return function (points, sphere) {
      sphere = sphere || math.vec4();
      var x = 0;
      var y = 0;
      var z = 0;
      var i;
      var lenPoints = points.length;
      var numPoints = lenPoints / 4;
      for (i = 0; i < lenPoints; i += 4) {
        x += points[i + 0];
        y += points[i + 1];
        z += points[i + 2];
      }
      sphere[0] = x / numPoints;
      sphere[1] = y / numPoints;
      sphere[2] = z / numPoints;
      var radius = 0;
      var dist;
      for (i = 0; i < lenPoints; i += 4) {
        point[0] = points[i + 0];
        point[1] = points[i + 1];
        point[2] = points[i + 2];
        dist = Math.abs(math.lenVec3(math.subVec3(point, sphere, tempVec3)));
        if (dist > radius) {
          radius = dist;
        }
      }
      sphere[3] = radius;
      return sphere;
    };
  }(),
  /**
   * Gets the center of a bounding sphere.
   *
   * @private
   */
  getSphere3Center: function getSphere3Center(sphere) {
    var dest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.vec3();
    dest[0] = sphere[0];
    dest[1] = sphere[1];
    dest[2] = sphere[2];
    return dest;
  },
  /**
   * Expands the first axis-aligned 3D boundary to enclose the second, if required.
   *
   * @private
   */
  expandAABB3: function expandAABB3(aabb1, aabb2) {
    if (aabb1[0] > aabb2[0]) {
      aabb1[0] = aabb2[0];
    }
    if (aabb1[1] > aabb2[1]) {
      aabb1[1] = aabb2[1];
    }
    if (aabb1[2] > aabb2[2]) {
      aabb1[2] = aabb2[2];
    }
    if (aabb1[3] < aabb2[3]) {
      aabb1[3] = aabb2[3];
    }
    if (aabb1[4] < aabb2[4]) {
      aabb1[4] = aabb2[4];
    }
    if (aabb1[5] < aabb2[5]) {
      aabb1[5] = aabb2[5];
    }
    return aabb1;
  },
  /**
   * Expands an axis-aligned 3D boundary to enclose the given point, if needed.
   *
   * @private
   */
  expandAABB3Point3: function expandAABB3Point3(aabb, p) {
    if (aabb[0] > p[0]) {
      aabb[0] = p[0];
    }
    if (aabb[1] > p[1]) {
      aabb[1] = p[1];
    }
    if (aabb[2] > p[2]) {
      aabb[2] = p[2];
    }
    if (aabb[3] < p[0]) {
      aabb[3] = p[0];
    }
    if (aabb[4] < p[1]) {
      aabb[4] = p[1];
    }
    if (aabb[5] < p[2]) {
      aabb[5] = p[2];
    }
    return aabb;
  },
  /**
   * Calculates the normal vector of a triangle.
   *
   * @private
   */
  triangleNormal: function triangleNormal(a, b, c) {
    var normal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.vec3();
    var p1x = b[0] - a[0];
    var p1y = b[1] - a[1];
    var p1z = b[2] - a[2];
    var p2x = c[0] - a[0];
    var p2y = c[1] - a[1];
    var p2z = c[2] - a[2];
    var p3x = p1y * p2z - p1z * p2y;
    var p3y = p1z * p2x - p1x * p2z;
    var p3z = p1x * p2y - p1y * p2x;
    var mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
    if (mag === 0) {
      normal[0] = 0;
      normal[1] = 0;
      normal[2] = 0;
    } else {
      normal[0] = p3x / mag;
      normal[1] = p3y / mag;
      normal[2] = p3z / mag;
    }
    return normal;
  }
};


/***/ }),

/***/ "./src/lib/mergeVertices.js":
/*!**********************************!*\
  !*** ./src/lib/mergeVertices.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeVertices: () => (/* binding */ mergeVertices)
/* harmony export */ });
/**
 * Given geometry defined as an array of positions, optional normals, option uv and an array of indices, returns
 * modified arrays that have duplicate vertices removed.
 *
 * @private
 */
function mergeVertices(positions, indices, mergedPositions, mergedIndices) {
  var positionsMap = {};
  var indicesLookup = [];
  var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
  var precision = Math.pow(10, precisionPoints);
  var uvi = 0;
  for (var i = 0, len = positions.length; i < len; i += 3) {
    var vx = positions[i];
    var vy = positions[i + 1];
    var vz = positions[i + 2];
    var key = "".concat(Math.round(vx * precision), "_").concat(Math.round(vy * precision), "_").concat(Math.round(vz * precision));
    if (positionsMap[key] === undefined) {
      positionsMap[key] = mergedPositions.length / 3;
      mergedPositions.push(vx);
      mergedPositions.push(vy);
      mergedPositions.push(vz);
    }
    indicesLookup[i / 3] = positionsMap[key];
    uvi += 2;
  }
  for (var _i = 0, _len = indices.length; _i < _len; _i++) {
    mergedIndices[_i] = indicesLookup[indices[_i]];
  }
}


/***/ }),

/***/ "./src/parsers/parseCityJSONIntoXKTModel.js":
/*!**************************************************!*\
  !*** ./src/parsers/parseCityJSONIntoXKTModel.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseCityJSONIntoXKTModel: () => (/* binding */ parseCityJSONIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _lib_earcut__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../lib/earcut */ "./src/lib/earcut.js");
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../lib/math.js */ "./src/lib/math.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }


var tempVec2a = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec2();
var tempVec3a = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3();
var tempVec3b = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3();
var tempVec3c = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3();

/**
 * @desc Parses a CityJSON model into an {@link XKTModel}.
 *
 * [CityJSON](https://www.cityjson.org) is a JSON-based encoding for a subset of the CityGML data model (version 2.0.0),
 * which is an open standardised data model and exchange format to store digital 3D models of cities and
 * landscapes. CityGML is an official standard of the [Open Geospatial Consortium](https://www.ogc.org/).
 *
 * This converter function supports most of the [CityJSON 1.0.2 Specification](https://www.cityjson.org/specs/1.0.2),
 * with the following limitations:
 *
 * * Does not (yet) support CityJSON semantics for geometry primitives.
 * * Does not (yet) support textured geometries.
 * * Does not (yet) support geometry templates.
 * * When the CityJSON file provides multiple *themes* for a geometry, then we parse only the first of the provided themes for that geometry.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load a CityJSON model into it.
 *
 * ````javascript
 * utils.loadJSON("./models/cityjson/DenHaag.json", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseCityJSONIntoXKTModel({
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
 * @param {Object} params.data CityJSON data.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {boolean} [params.center=false] Set true to center the CityJSON vertex positions to [0,0,0]. This is applied before the transformation matrix, if specified.
 * @param {Boolean} [params.transform] 4x4 transformation matrix to transform CityJSON vertex positions. Use this to rotate, translate and scale them if neccessary.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when CityJSON has been parsed.
 */
function parseCityJSONIntoXKTModel(_ref) {
  var data = _ref.data,
    xktModel = _ref.xktModel,
    _ref$center = _ref.center,
    center = _ref$center === void 0 ? false : _ref$center,
    _ref$transform = _ref.transform,
    transform = _ref$transform === void 0 ? null : _ref$transform,
    _ref$stats = _ref.stats,
    stats = _ref$stats === void 0 ? {} : _ref$stats,
    log = _ref.log;
  return new Promise(function (resolve, reject) {
    if (!data) {
      reject("Argument expected: data");
      return;
    }
    if (data.type !== "CityJSON") {
      reject("Invalid argument: data is not a CityJSON file");
      return;
    }
    if (!xktModel) {
      reject("Argument expected: xktModel");
      return;
    }
    var vertices;
    log("Using parser: parseCityJSONIntoXKTModel");
    log("center: ".concat(center));
    if (transform) {
      log("transform: [".concat(transform, "]"));
    }
    if (data.transform || center || transform) {
      vertices = copyVertices(data.vertices);
      if (data.transform) {
        transformVertices(vertices, data.transform);
      }
      if (center) {
        centerVertices(vertices);
      }
      if (transform) {
        customTransformVertices(vertices, transform);
      }
    } else {
      vertices = data.vertices;
    }
    stats.sourceFormat = data.type || "";
    stats.schemaVersion = data.version || "";
    stats.title = "";
    stats.author = "";
    stats.created = "";
    stats.numMetaObjects = 0;
    stats.numPropertySets = 0;
    stats.numTriangles = 0;
    stats.numVertices = 0;
    stats.numObjects = 0;
    stats.numGeometries = 0;
    var rootMetaObjectId = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.createUUID();
    xktModel.createMetaObject({
      metaObjectId: rootMetaObjectId,
      metaObjectType: "Model",
      metaObjectName: "Model"
    });
    stats.numMetaObjects++;
    var modelMetaObjectId = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.createUUID();
    xktModel.createMetaObject({
      metaObjectId: modelMetaObjectId,
      metaObjectType: "CityJSON",
      metaObjectName: "CityJSON",
      parentMetaObjectId: rootMetaObjectId
    });
    stats.numMetaObjects++;
    var ctx = {
      data: data,
      vertices: vertices,
      xktModel: xktModel,
      rootMetaObjectId: modelMetaObjectId,
      log: log || function (msg) {},
      nextId: 0,
      stats: stats
    };
    ctx.xktModel.schema = data.type + " " + data.version;
    ctx.log("Converting " + ctx.xktModel.schema);
    parseCityJSON(ctx);
    resolve();
  });
}
function copyVertices(vertices) {
  var vertices2 = [];
  for (var i = 0, j = 0; i < vertices.length; i++, j += 3) {
    var x = vertices[i][0];
    var y = vertices[i][1];
    var z = vertices[i][2];
    vertices2.push([x, y, z]);
  }
  return vertices2;
}
function transformVertices(vertices, cityJSONTransform) {
  var scale = cityJSONTransform.scale || _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3([1, 1, 1]);
  var translate = cityJSONTransform.translate || _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3([0, 0, 0]);
  for (var i = 0; i < vertices.length; i++) {
    var vertex = vertices[i];
    vertex[0] = vertex[0] * scale[0] + translate[0];
    vertex[1] = vertex[1] * scale[1] + translate[1];
    vertex[2] = vertex[2] * scale[2] + translate[2];
  }
}
function centerVertices(vertices) {
  if (center) {
    var centerPos = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3();
    var numPoints = vertices.length;
    for (var i = 0, len = vertices.length; i < len; i++) {
      var vertex = vertices[i];
      centerPos[0] += vertex[0];
      centerPos[1] += vertex[1];
      centerPos[2] += vertex[2];
    }
    centerPos[0] /= numPoints;
    centerPos[1] /= numPoints;
    centerPos[2] /= numPoints;
    for (var _i = 0, _len = vertices.length; _i < _len; _i++) {
      var _vertex = vertices[_i];
      _vertex[0] -= centerPos[0];
      _vertex[1] -= centerPos[1];
      _vertex[2] -= centerPos[2];
    }
  }
}
function customTransformVertices(vertices, transform) {
  if (transform) {
    var mat = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4(transform);
    for (var i = 0, len = vertices.length; i < len; i++) {
      var vertex = vertices[i];
      _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.transformPoint3(mat, vertex, vertex);
    }
  }
}
function parseCityJSON(ctx) {
  var data = ctx.data;
  var cityObjects = data.CityObjects;
  for (var objectId in cityObjects) {
    if (cityObjects.hasOwnProperty(objectId)) {
      var cityObject = cityObjects[objectId];
      parseCityObject(ctx, cityObject, objectId);
    }
  }
}
function parseCityObject(ctx, cityObject, objectId) {
  var xktModel = ctx.xktModel;
  var data = ctx.data;
  var metaObjectId = objectId;
  var metaObjectType = cityObject.type;
  var metaObjectName = metaObjectType + " : " + objectId;
  var parentMetaObjectId = cityObject.parents ? cityObject.parents[0] : ctx.rootMetaObjectId;
  xktModel.createMetaObject({
    metaObjectId: metaObjectId,
    metaObjectName: metaObjectName,
    metaObjectType: metaObjectType,
    parentMetaObjectId: parentMetaObjectId
  });
  ctx.stats.numMetaObjects++;
  if (!(cityObject.geometry && cityObject.geometry.length > 0)) {
    return;
  }
  var meshIds = [];
  for (var i = 0, len = cityObject.geometry.length; i < len; i++) {
    var geometry = cityObject.geometry[i];
    var objectMaterial = void 0;
    var surfaceMaterials = void 0;
    var appearance = data.appearance;
    if (appearance) {
      var materials = appearance.materials;
      if (materials) {
        var geometryMaterial = geometry.material;
        if (geometryMaterial) {
          var themeIds = Object.keys(geometryMaterial);
          if (themeIds.length > 0) {
            var themeId = themeIds[0];
            var theme = geometryMaterial[themeId];
            if (theme.value !== undefined) {
              objectMaterial = materials[theme.value];
            } else {
              var values = theme.values;
              if (values) {
                surfaceMaterials = [];
                for (var j = 0, lenj = values.length; j < lenj; j++) {
                  var value = values[i];
                  var surfaceMaterial = materials[value];
                  surfaceMaterials.push(surfaceMaterial);
                }
              }
            }
          }
        }
      }
    }
    if (surfaceMaterials) {
      parseGeometrySurfacesWithOwnMaterials(ctx, geometry, surfaceMaterials, meshIds);
    } else {
      parseGeometrySurfacesWithSharedMaterial(ctx, geometry, objectMaterial, meshIds);
    }
  }
  if (meshIds.length > 0) {
    xktModel.createEntity({
      entityId: objectId,
      meshIds: meshIds
    });
    ctx.stats.numObjects++;
  }
}
function parseGeometrySurfacesWithOwnMaterials(ctx, geometry, surfaceMaterials, meshIds) {
  var geomType = geometry.type;
  switch (geomType) {
    case "MultiPoint":
      break;
    case "MultiLineString":
      break;
    case "MultiSurface":
    case "CompositeSurface":
      var surfaces = geometry.boundaries;
      parseSurfacesWithOwnMaterials(ctx, surfaceMaterials, surfaces, meshIds);
      break;
    case "Solid":
      var shells = geometry.boundaries;
      for (var j = 0; j < shells.length; j++) {
        var _surfaces = shells[j];
        parseSurfacesWithOwnMaterials(ctx, surfaceMaterials, _surfaces, meshIds);
      }
      break;
    case "MultiSolid":
    case "CompositeSolid":
      var solids = geometry.boundaries;
      for (var _j = 0; _j < solids.length; _j++) {
        for (var k = 0; k < solids[_j].length; k++) {
          var _surfaces2 = solids[_j][k];
          parseSurfacesWithOwnMaterials(ctx, surfaceMaterials, _surfaces2, meshIds);
        }
      }
      break;
    case "GeometryInstance":
      break;
  }
}
function parseSurfacesWithOwnMaterials(ctx, surfaceMaterials, surfaces, meshIds) {
  var vertices = ctx.vertices;
  var xktModel = ctx.xktModel;
  for (var i = 0; i < surfaces.length; i++) {
    var surface = surfaces[i];
    var surfaceMaterial = surfaceMaterials[i] || {
      diffuseColor: [0.8, 0.8, 0.8],
      transparency: 1.0
    };
    var face = [];
    var holes = [];
    var sharedIndices = [];
    var geometryCfg = {
      positions: [],
      indices: []
    };
    for (var j = 0; j < surface.length; j++) {
      if (face.length > 0) {
        holes.push(face.length);
      }
      var newFace = extractLocalIndices(ctx, surface[j], sharedIndices, geometryCfg);
      face.push.apply(face, _toConsumableArray(newFace));
    }
    if (face.length === 3) {
      // Triangle

      geometryCfg.indices.push(face[0]);
      geometryCfg.indices.push(face[1]);
      geometryCfg.indices.push(face[2]);
    } else if (face.length > 3) {
      // Polygon

      // Prepare to triangulate

      var pList = [];
      for (var k = 0; k < face.length; k++) {
        pList.push({
          x: vertices[sharedIndices[face[k]]][0],
          y: vertices[sharedIndices[face[k]]][1],
          z: vertices[sharedIndices[face[k]]][2]
        });
      }
      var normal = getNormalOfPositions(pList, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3());

      // Convert to 2D

      var pv = [];
      for (var _k = 0; _k < pList.length; _k++) {
        to2D(pList[_k], normal, tempVec2a);
        pv.unshift(tempVec2a[0]);
        pv.unshift(tempVec2a[1]);
      }

      // Triangulate

      var tr = (0,_lib_earcut__WEBPACK_IMPORTED_MODULE_0__.earcut)(pv, holes, 2);

      // Create triangles

      for (var _k2 = 0; _k2 < tr.length; _k2 += 3) {
        geometryCfg.indices.unshift(face[tr[_k2]]);
        geometryCfg.indices.unshift(face[tr[_k2 + 1]]);
        geometryCfg.indices.unshift(face[tr[_k2 + 2]]);
      }
    }
    var geometryId = "" + ctx.nextId++;
    var meshId = "" + ctx.nextId++;
    xktModel.createGeometry({
      geometryId: geometryId,
      primitiveType: "triangles",
      positions: geometryCfg.positions,
      indices: geometryCfg.indices
    });
    xktModel.createMesh({
      meshId: meshId,
      geometryId: geometryId,
      color: surfaceMaterial && surfaceMaterial.diffuseColor ? surfaceMaterial.diffuseColor : [0.8, 0.8, 0.8],
      opacity: 1.0
      //opacity: (surfaceMaterial && surfaceMaterial.transparency !== undefined) ? (1.0 - surfaceMaterial.transparency) : 1.0
    });

    meshIds.push(meshId);
    ctx.stats.numGeometries++;
    ctx.stats.numVertices += geometryCfg.positions.length / 3;
    ctx.stats.numTriangles += geometryCfg.indices.length / 3;
  }
}
function parseGeometrySurfacesWithSharedMaterial(ctx, geometry, objectMaterial, meshIds) {
  var xktModel = ctx.xktModel;
  var sharedIndices = [];
  var geometryCfg = {
    positions: [],
    indices: []
  };
  var geomType = geometry.type;
  switch (geomType) {
    case "MultiPoint":
      break;
    case "MultiLineString":
      break;
    case "MultiSurface":
    case "CompositeSurface":
      var surfaces = geometry.boundaries;
      parseSurfacesWithSharedMaterial(ctx, surfaces, sharedIndices, geometryCfg);
      break;
    case "Solid":
      var shells = geometry.boundaries;
      for (var j = 0; j < shells.length; j++) {
        var _surfaces3 = shells[j];
        parseSurfacesWithSharedMaterial(ctx, _surfaces3, sharedIndices, geometryCfg);
      }
      break;
    case "MultiSolid":
    case "CompositeSolid":
      var solids = geometry.boundaries;
      for (var _j2 = 0; _j2 < solids.length; _j2++) {
        for (var k = 0; k < solids[_j2].length; k++) {
          var _surfaces4 = solids[_j2][k];
          parseSurfacesWithSharedMaterial(ctx, _surfaces4, sharedIndices, geometryCfg);
        }
      }
      break;
    case "GeometryInstance":
      break;
  }
  var geometryId = "" + ctx.nextId++;
  var meshId = "" + ctx.nextId++;
  xktModel.createGeometry({
    geometryId: geometryId,
    primitiveType: "triangles",
    positions: geometryCfg.positions,
    indices: geometryCfg.indices
  });
  xktModel.createMesh({
    meshId: meshId,
    geometryId: geometryId,
    color: objectMaterial && objectMaterial.diffuseColor ? objectMaterial.diffuseColor : [0.8, 0.8, 0.8],
    opacity: 1.0
    //opacity: (objectMaterial && objectMaterial.transparency !== undefined) ? (1.0 - objectMaterial.transparency) : 1.0
  });

  meshIds.push(meshId);
  ctx.stats.numGeometries++;
  ctx.stats.numVertices += geometryCfg.positions.length / 3;
  ctx.stats.numTriangles += geometryCfg.indices.length / 3;
}
function parseSurfacesWithSharedMaterial(ctx, surfaces, sharedIndices, primitiveCfg) {
  var vertices = ctx.vertices;
  for (var i = 0; i < surfaces.length; i++) {
    var boundary = [];
    var holes = [];
    for (var j = 0; j < surfaces[i].length; j++) {
      if (boundary.length > 0) {
        holes.push(boundary.length);
      }
      var newBoundary = extractLocalIndices(ctx, surfaces[i][j], sharedIndices, primitiveCfg);
      boundary.push.apply(boundary, _toConsumableArray(newBoundary));
    }
    if (boundary.length === 3) {
      // Triangle

      primitiveCfg.indices.push(boundary[0]);
      primitiveCfg.indices.push(boundary[1]);
      primitiveCfg.indices.push(boundary[2]);
    } else if (boundary.length > 3) {
      // Polygon

      var pList = [];
      for (var k = 0; k < boundary.length; k++) {
        pList.push({
          x: vertices[sharedIndices[boundary[k]]][0],
          y: vertices[sharedIndices[boundary[k]]][1],
          z: vertices[sharedIndices[boundary[k]]][2]
        });
      }
      var normal = getNormalOfPositions(pList, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3());
      var pv = [];
      for (var _k3 = 0; _k3 < pList.length; _k3++) {
        to2D(pList[_k3], normal, tempVec2a);
        pv.unshift(tempVec2a[0]);
        pv.unshift(tempVec2a[1]);
      }
      var tr = (0,_lib_earcut__WEBPACK_IMPORTED_MODULE_0__.earcut)(pv, holes, 2);
      for (var _k4 = 0; _k4 < tr.length; _k4 += 3) {
        primitiveCfg.indices.unshift(boundary[tr[_k4]]);
        primitiveCfg.indices.unshift(boundary[tr[_k4 + 1]]);
        primitiveCfg.indices.unshift(boundary[tr[_k4 + 2]]);
      }
    }
  }
}
function extractLocalIndices(ctx, boundary, sharedIndices, geometryCfg) {
  var vertices = ctx.vertices;
  var newBoundary = [];
  for (var i = 0, len = boundary.length; i < len; i++) {
    var index = boundary[i];
    if (sharedIndices.includes(index)) {
      var vertexIndex = sharedIndices.indexOf(index);
      newBoundary.push(vertexIndex);
    } else {
      geometryCfg.positions.push(vertices[index][0]);
      geometryCfg.positions.push(vertices[index][1]);
      geometryCfg.positions.push(vertices[index][2]);
      newBoundary.push(sharedIndices.length);
      sharedIndices.push(index);
    }
  }
  return newBoundary;
}
function getNormalOfPositions(positions, normal) {
  for (var i = 0; i < positions.length; i++) {
    var nexti = i + 1;
    if (nexti === positions.length) {
      nexti = 0;
    }
    normal[0] += (positions[i].y - positions[nexti].y) * (positions[i].z + positions[nexti].z);
    normal[1] += (positions[i].z - positions[nexti].z) * (positions[i].x + positions[nexti].x);
    normal[2] += (positions[i].x - positions[nexti].x) * (positions[i].y + positions[nexti].y);
  }
  return _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.normalizeVec3(normal);
}
function to2D(_p, _n, re) {
  var p = tempVec3a;
  var n = tempVec3b;
  var x3 = tempVec3c;
  p[0] = _p.x;
  p[1] = _p.y;
  p[2] = _p.z;
  n[0] = _n.x;
  n[1] = _n.y;
  n[2] = _n.z;
  x3[0] = 1.1;
  x3[1] = 1.1;
  x3[2] = 1.1;
  var dist = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.lenVec3(_lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.subVec3(x3, n));
  if (dist < 0.01) {
    x3[0] += 1.0;
    x3[1] += 2.0;
    x3[2] += 3.0;
  }
  var dot = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.dotVec3(x3, n);
  var tmp2 = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulVec3Scalar(n, dot, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3());
  x3[0] -= tmp2[0];
  x3[1] -= tmp2[1];
  x3[2] -= tmp2[2];
  _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.normalizeVec3(x3);
  var y3 = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.cross3Vec3(n, x3, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.vec3());
  var x = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.dotVec3(p, x3);
  var y = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.dotVec3(p, y3);
  re[0] = x;
  re[1] = y;
}


/***/ }),

/***/ "./src/parsers/parseGLTFIntoXKTModel.js":
/*!**********************************************!*\
  !*** ./src/parsers/parseGLTFIntoXKTModel.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseGLTFIntoXKTModel: () => (/* binding */ parseGLTFIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _XKTModel_lib_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../XKTModel/lib/utils.js */ "./src/XKTModel/lib/utils.js");
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/core */ "@loaders.gl/core");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @loaders.gl/gltf */ "@loaders.gl/gltf");
/* harmony import */ var _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");






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
 * @param {Boolean} [params.includeTextures=true] Whether to parse textures.
 * @param {Boolean} [params.includeNormals=true] Whether to parse normals. When false, the parser will ignore the glTF
 * geometry normals, and the glTF data will rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the glTF.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when glTF has been parsed.
 */
function parseGLTFIntoXKTModel(_ref) {
  var data = _ref.data,
    baseUri = _ref.baseUri,
    xktModel = _ref.xktModel,
    metaModelData = _ref.metaModelData,
    _ref$includeTextures = _ref.includeTextures,
    includeTextures = _ref$includeTextures === void 0 ? true : _ref$includeTextures,
    _ref$includeNormals = _ref.includeNormals,
    includeNormals = _ref$includeNormals === void 0 ? true : _ref$includeNormals,
    getAttachment = _ref.getAttachment,
    _ref$stats = _ref.stats,
    stats = _ref$stats === void 0 ? {} : _ref$stats,
    log = _ref.log;
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
    (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_2__.parse)(data, _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_3__.GLTFLoader, {
      baseUri: baseUri
    }).then(function (gltfData) {
      var ctx = {
        gltfData: gltfData,
        nodesHaveNames: false,
        // determined in testIfNodesHaveNames()
        getAttachment: getAttachment || function () {
          throw new Error('You must define getAttachment() method to convert glTF with external resources');
        },
        log: log || function (msg) {},
        error: function error(msg) {
          console.error(msg);
        },
        xktModel: xktModel,
        includeNormals: includeNormals !== false,
        includeTextures: includeTextures !== false,
        geometryCreated: {},
        nextId: 0,
        geometriesCreated: {},
        stats: stats
      };
      ctx.log("Using parser: parseGLTFIntoXKTModel");
      ctx.log("Parsing normals: ".concat(ctx.includeNormals ? "enabled" : "disabled"));
      ctx.log("Parsing textures: ".concat(ctx.includeTextures ? "enabled" : "disabled"));
      if (ctx.includeTextures) {
        parseTextures(ctx);
      }
      parseMaterials(ctx);
      parseDefaultScene(ctx);
      resolve();
    }, function (errMsg) {
      reject("[parseGLTFIntoXKTModel] ".concat(errMsg));
    });
  });
}
function parseTextures(ctx) {
  var gltfData = ctx.gltfData;
  var textures = gltfData.textures;
  if (textures) {
    for (var i = 0, len = textures.length; i < len; i++) {
      parseTexture(ctx, textures[i]);
      ctx.stats.numTextures++;
    }
  }
}
function parseTexture(ctx, texture) {
  if (!texture.source || !texture.source.image) {
    return;
  }
  var textureId = "texture-".concat(ctx.nextId++);
  var minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.NearestMipMapLinearFilter;
  switch (texture.sampler.minFilter) {
    case 9728:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.NearestFilter;
      break;
    case 9729:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.LinearFilter;
      break;
    case 9984:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.NearestMipMapNearestFilter;
      break;
    case 9985:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.LinearMipMapNearestFilter;
      break;
    case 9986:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.NearestMipMapLinearFilter;
      break;
    case 9987:
      minFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.LinearMipMapLinearFilter;
      break;
  }
  var magFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.LinearFilter;
  switch (texture.sampler.magFilter) {
    case 9728:
      magFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.NearestFilter;
      break;
    case 9729:
      magFilter = _constants_js__WEBPACK_IMPORTED_MODULE_4__.LinearFilter;
      break;
  }
  var wrapS = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
  switch (texture.sampler.wrapS) {
    case 33071:
      wrapS = _constants_js__WEBPACK_IMPORTED_MODULE_4__.ClampToEdgeWrapping;
      break;
    case 33648:
      wrapS = _constants_js__WEBPACK_IMPORTED_MODULE_4__.MirroredRepeatWrapping;
      break;
    case 10497:
      wrapS = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
      break;
  }
  var wrapT = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
  switch (texture.sampler.wrapT) {
    case 33071:
      wrapT = _constants_js__WEBPACK_IMPORTED_MODULE_4__.ClampToEdgeWrapping;
      break;
    case 33648:
      wrapT = _constants_js__WEBPACK_IMPORTED_MODULE_4__.MirroredRepeatWrapping;
      break;
    case 10497:
      wrapT = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
      break;
  }
  var wrapR = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
  switch (texture.sampler.wrapR) {
    case 33071:
      wrapR = _constants_js__WEBPACK_IMPORTED_MODULE_4__.ClampToEdgeWrapping;
      break;
    case 33648:
      wrapR = _constants_js__WEBPACK_IMPORTED_MODULE_4__.MirroredRepeatWrapping;
      break;
    case 10497:
      wrapR = _constants_js__WEBPACK_IMPORTED_MODULE_4__.RepeatWrapping;
      break;
  }
  ctx.xktModel.createTexture({
    textureId: textureId,
    imageData: texture.source.image,
    mediaType: texture.source.mediaType,
    compressed: true,
    width: texture.source.image.width,
    height: texture.source.image.height,
    minFilter: minFilter,
    magFilter: magFilter,
    wrapS: wrapS,
    wrapT: wrapT,
    wrapR: wrapR,
    flipY: !!texture.flipY
    //     encoding: "sRGB"
  });

  texture._textureId = textureId;
}
function parseMaterials(ctx) {
  var gltfData = ctx.gltfData;
  var materials = gltfData.materials;
  if (materials) {
    for (var i = 0, len = materials.length; i < len; i++) {
      var material = materials[i];
      material._textureSetId = ctx.includeTextures ? parseTextureSet(ctx, material) : null;
      material._attributes = parseMaterialAttributes(ctx, material);
    }
  }
}
function parseTextureSet(ctx, material) {
  var textureSetCfg = {};
  if (material.normalTexture) {
    textureSetCfg.normalTextureId = material.normalTexture.texture._textureId;
  }
  if (material.occlusionTexture) {
    textureSetCfg.occlusionTextureId = material.occlusionTexture.texture._textureId;
  }
  if (material.emissiveTexture) {
    textureSetCfg.emissiveTextureId = material.emissiveTexture.texture._textureId;
  }
  var metallicPBR = material.pbrMetallicRoughness;
  if (material.pbrMetallicRoughness) {
    var pbrMetallicRoughness = material.pbrMetallicRoughness;
    var baseColorTexture = pbrMetallicRoughness.baseColorTexture || pbrMetallicRoughness.colorTexture;
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
  var extensions = material.extensions;
  if (extensions) {
    var specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
    if (specularPBR) {
      var specularTexture = specularPBR.specularTexture;
      if (specularTexture !== null && specularTexture !== undefined) {
        //  textureSetCfg.colorTextureId = ctx.gltfData.textures[specularColorTexture.index]._textureId;
      }
      var specularColorTexture = specularPBR.specularColorTexture;
      if (specularColorTexture !== null && specularColorTexture !== undefined) {
        textureSetCfg.colorTextureId = ctx.gltfData.textures[specularColorTexture.index]._textureId;
      }
    }
  }
  if (textureSetCfg.normalTextureId !== undefined || textureSetCfg.occlusionTextureId !== undefined || textureSetCfg.emissiveTextureId !== undefined || textureSetCfg.colorTextureId !== undefined || textureSetCfg.metallicRoughnessTextureId !== undefined) {
    textureSetCfg.textureSetId = "textureSet-".concat(ctx.nextId++, ";");
    ctx.xktModel.createTextureSet(textureSetCfg);
    ctx.stats.numTextureSets++;
    return textureSetCfg.textureSetId;
  }
  return null;
}
function parseMaterialAttributes(ctx, material) {
  // Substitute RGBA for material, to use fast flat shading instead
  var extensions = material.extensions;
  var materialAttributes = {
    color: new Float32Array([1, 1, 1, 1]),
    opacity: 1,
    metallic: 0,
    roughness: 1
  };
  if (extensions) {
    var specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
    if (specularPBR) {
      var diffuseFactor = specularPBR.diffuseFactor;
      if (diffuseFactor !== null && diffuseFactor !== undefined) {
        materialAttributes.color.set(diffuseFactor);
      }
    }
    var common = extensions["KHR_materials_common"];
    if (common) {
      var technique = common.technique;
      var values = common.values || {};
      var blinn = technique === "BLINN";
      var phong = technique === "PHONG";
      var lambert = technique === "LAMBERT";
      var diffuse = values.diffuse;
      if (diffuse && (blinn || phong || lambert)) {
        if (!_XKTModel_lib_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.isString(diffuse)) {
          materialAttributes.color.set(diffuse);
        }
      }
      var transparency = values.transparency;
      if (transparency !== null && transparency !== undefined) {
        materialAttributes.opacity = transparency;
      }
      var transparent = values.transparent;
      if (transparent !== null && transparent !== undefined) {
        materialAttributes.opacity = transparent;
      }
    }
  }
  var metallicPBR = material.pbrMetallicRoughness;
  if (metallicPBR) {
    var baseColorFactor = metallicPBR.baseColorFactor;
    if (baseColorFactor) {
      materialAttributes.color[0] = baseColorFactor[0];
      materialAttributes.color[1] = baseColorFactor[1];
      materialAttributes.color[2] = baseColorFactor[2];
      materialAttributes.opacity = baseColorFactor[3];
    }
    var metallicFactor = metallicPBR.metallicFactor;
    if (metallicFactor !== null && metallicFactor !== undefined) {
      materialAttributes.metallic = metallicFactor;
    }
    var roughnessFactor = metallicPBR.roughnessFactor;
    if (roughnessFactor !== null && roughnessFactor !== undefined) {
      materialAttributes.roughness = roughnessFactor;
    }
  }
  return materialAttributes;
}
function parseDefaultScene(ctx) {
  var gltfData = ctx.gltfData;
  var scene = gltfData.scene || gltfData.scenes[0];
  if (!scene) {
    ctx.error("glTF has no default scene");
    return;
  }
  parseScene(ctx, scene);
}
function parseScene(ctx, scene) {
  var nodes = scene.nodes;
  if (!nodes) {
    return;
  }
  for (var i = 0, len = nodes.length; i < len; i++) {
    var node = nodes[i];
    countMeshUsage(ctx, node);
  }
  for (var _i = 0, _len = nodes.length; _i < _len && !ctx.nodesHaveNames; _i++) {
    var _node = nodes[_i];
    if (testIfNodesHaveNames(_node)) {
      ctx.nodesHaveNames = true;
    }
  }
  if (!ctx.nodesHaveNames) {
    ctx.log("Warning: No \"name\" attributes found on glTF scene nodes - objects in XKT may not be what you expect");
    for (var _i2 = 0, _len2 = nodes.length; _i2 < _len2; _i2++) {
      var _node2 = nodes[_i2];
      parseNodesWithoutNames(ctx, _node2, 0, null);
    }
  } else {
    for (var _i3 = 0, _len3 = nodes.length; _i3 < _len3; _i3++) {
      var _node3 = nodes[_i3];
      parseNodesWithNames(ctx, _node3, 0, null);
    }
  }
}
function countMeshUsage(ctx, node) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!node) {
    return;
  }
  var mesh = node.mesh;
  if (mesh) {
    mesh.instances = mesh.instances ? mesh.instances + 1 : 1;
  }
  if (node.children) {
    var children = node.children;
    for (var i = 0, len = children.length; i < len; i++) {
      var childNode = children[i];
      if (!childNode) {
        ctx.error("Node not found: " + i);
        continue;
      }
      countMeshUsage(ctx, childNode, level + 1);
    }
  }
}
function testIfNodesHaveNames(node) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!node) {
    return;
  }
  if (node.name) {
    return true;
  }
  if (node.children) {
    var children = node.children;
    for (var i = 0, len = children.length; i < len; i++) {
      var childNode = children[i];
      if (testIfNodesHaveNames(childNode, level + 1)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Parses a glTF node hierarchy that is known to NOT contain "name" attributes on the nodes.
 * Create a XKTMesh for each mesh primitive, and a single XKTEntity.
 */
var parseNodesWithoutNames = function () {
  var meshIds = [];
  return function (ctx, node, depth, matrix) {
    if (!node) {
      return;
    }
    matrix = parseNodeMatrix(node, matrix);
    if (node.mesh) {
      parseNodeMesh(node, ctx, matrix, meshIds);
    }
    if (node.children) {
      var children = node.children;
      for (var i = 0, len = children.length; i < len; i++) {
        var childNode = children[i];
        parseNodesWithoutNames(ctx, childNode, depth + 1, matrix);
      }
    }
    if (depth === 0) {
      var entityId = "entity-" + ctx.nextId++;
      if (meshIds && meshIds.length > 0) {
        ctx.log("Creating XKTEntity with default ID: " + entityId);
        ctx.xktModel.createEntity({
          entityId: entityId,
          meshIds: meshIds
        });
        meshIds.length = 0;
      }
      ctx.stats.numObjects++;
    }
  };
}();

/**
 * Parses a glTF node hierarchy that is known to contain "name" attributes on the nodes.
 *
 * Create a XKTMesh for each mesh primitive, and XKTEntity for each named node.
 *
 * Following a depth-first traversal, each XKTEntity is created on post-visit of each named node,
 * and gets all the XKTMeshes created since the last XKTEntity created.
 */
var parseNodesWithNames = function () {
  var objectIdStack = [];
  var meshIdsStack = [];
  var meshIds = null;
  return function (ctx, node, depth, matrix) {
    if (!node) {
      return;
    }
    matrix = parseNodeMatrix(node, matrix);
    if (node.name) {
      meshIds = [];
      var xktEntityId = node.name;
      if (!!xktEntityId && ctx.xktModel.entities[xktEntityId]) {
        ctx.log("Warning: Two or more glTF nodes found with same 'name' attribute: '".concat(xktEntityId, " - will randomly-generating an object ID in XKT"));
      }
      while (!xktEntityId || ctx.xktModel.entities[xktEntityId]) {
        xktEntityId = "entity-" + ctx.nextId++;
      }
      objectIdStack.push(xktEntityId);
      meshIdsStack.push(meshIds);
    }
    if (meshIds && node.mesh) {
      parseNodeMesh(node, ctx, matrix, meshIds);
    }
    if (node.children) {
      var children = node.children;
      for (var i = 0, len = children.length; i < len; i++) {
        var childNode = children[i];
        parseNodesWithNames(ctx, childNode, depth + 1, matrix);
      }
    }
    var nodeName = node.name;
    if (nodeName !== undefined && nodeName !== null || depth === 0) {
      var _xktEntityId = objectIdStack.pop();
      if (!_xktEntityId) {
        // For when there are no nodes with names
        _xktEntityId = "entity-" + ctx.nextId++;
      }
      var entityMeshIds = meshIdsStack.pop();
      if (meshIds && meshIds.length > 0) {
        ctx.xktModel.createEntity({
          entityId: _xktEntityId,
          meshIds: entityMeshIds
        });
      }
      ctx.stats.numObjects++;
      meshIds = meshIdsStack.length > 0 ? meshIdsStack[meshIdsStack.length - 1] : null;
    }
  };
}();

/**
 * Parses transform at the given glTF node.
 *
 * @param node the glTF node
 * @param matrix Transfor matrix from parent nodes
 * @returns {*} Transform matrix for the node
 */
function parseNodeMatrix(node, matrix) {
  if (!node) {
    return;
  }
  var localMatrix;
  if (node.matrix) {
    localMatrix = node.matrix;
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4());
    } else {
      matrix = localMatrix;
    }
  }
  if (node.translation) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.translationMat4v(node.translation);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4());
    } else {
      matrix = localMatrix;
    }
  }
  if (node.rotation) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.quaternionToMat4(node.rotation);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4());
    } else {
      matrix = localMatrix;
    }
  }
  if (node.scale) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.scalingMat4v(node.scale);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4());
    } else {
      matrix = localMatrix;
    }
  }
  return matrix;
}
function createPrimitiveHash(primitive) {
  var hash = [];
  var attributes = primitive.attributes;
  if (attributes) {
    for (var key in attributes) {
      hash.push(attributes[key].id);
    }
  }
  if (primitive.indices) {
    hash.push(primitive.indices.id);
  }
  return hash.join(".");
}

/**
 * Parses primitives referenced by the mesh belonging to the given node, creating XKTMeshes in the XKTModel.
 *
 * @param node glTF node
 * @param ctx Parsing context
 * @param matrix Matrix for the XKTMeshes
 * @param meshIds returns IDs of the new XKTMeshes
 */
function parseNodeMesh(node, ctx, matrix, meshIds) {
  if (!node) {
    return;
  }
  var mesh = node.mesh;
  if (!mesh) {
    return;
  }
  var numPrimitives = mesh.primitives.length;
  if (numPrimitives > 0) {
    for (var i = 0; i < numPrimitives; i++) {
      try {
        var primitive = mesh.primitives[i];
        var geometryId = createPrimitiveHash(primitive);
        if (!ctx.geometriesCreated[geometryId]) {
          var geometryCfg = {
            geometryId: geometryId
          };
          switch (primitive.mode) {
            case 0:
              // POINTS
              geometryCfg.primitiveType = "points";
              break;
            case 1:
              // LINES
              geometryCfg.primitiveType = "lines";
              break;
            case 2:
              // LINE_LOOP
              geometryCfg.primitiveType = "line-loop";
              break;
            case 3:
              // LINE_STRIP
              geometryCfg.primitiveType = "line-strip";
              break;
            case 4:
              // TRIANGLES
              geometryCfg.primitiveType = "triangles";
              break;
            case 5:
              // TRIANGLE_STRIP
              geometryCfg.primitiveType = "triangle-strip";
              break;
            case 6:
              // TRIANGLE_FAN
              geometryCfg.primitiveType = "triangle-fan";
              break;
            default:
              geometryCfg.primitiveType = "triangles";
          }
          var POSITION = primitive.attributes.POSITION;
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
          ctx.xktModel.createGeometry(geometryCfg);
          ctx.geometriesCreated[geometryId] = true;
          ctx.stats.numGeometries++;
        }
        var xktMeshId = ctx.nextId++;
        var meshCfg = {
          meshId: xktMeshId,
          geometryId: geometryId,
          matrix: matrix ? matrix.slice() : _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.identityMat4()
        };
        var material = primitive.material;
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
        ctx.xktModel.createMesh(meshCfg);
        meshIds.push(xktMeshId);
      } catch (e) {
        console.log(e);
      }
    }
  }
}


/***/ }),

/***/ "./src/parsers/parseGLTFJSONIntoXKTModel.js":
/*!**************************************************!*\
  !*** ./src/parsers/parseGLTFJSONIntoXKTModel.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseGLTFJSONIntoXKTModel: () => (/* binding */ parseGLTFJSONIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _XKTModel_lib_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../XKTModel/lib/utils.js */ "./src/XKTModel/lib/utils.js");
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");


var atob2 = typeof atob !== 'undefined' ? atob : function (a) {
  return Buffer.from(a, 'base64').toString('binary');
};
var WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
var WEBGL_TYPE_SIZES = {
  'SCALAR': 1,
  'VEC2': 2,
  'VEC3': 3,
  'VEC4': 4,
  'MAT2': 4,
  'MAT3': 9,
  'MAT4': 16
};

/**
 * @desc Parses glTF JSON into an {@link XKTModel}, without ````.glb```` and textures.
 *
 * * Lightweight JSON-based glTF parser which ignores textures
 * * For texture and ````.glb```` support, see {@link parseGLTFIntoXKTModel}
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
 *     parseGLTFJSONIntoXKTModel({
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
 * @param {Boolean} [params.includeNormals=false] Whether to parse normals. When false, the parser will ignore the glTF
 * geometry normals, and the glTF data will rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded representation of the glTF.
 * @param {Boolean} [params.reuseGeometries=true] When true, the parser will enable geometry reuse within the XKTModel. When false,
 * will automatically "expand" all reused geometries into duplicate copies. This has the drawback of increasing the XKT
 * file size (~10-30% for typical models), but can make the model more responsive in the xeokit Viewer, especially if the model
 * has excessive geometry reuse. An example of excessive geometry reuse would be if we have 4000 geometries that are
 * shared amongst 2000 objects, ie. a large number of geometries with a low amount of reuse, which can present a
 * pathological performance case for xeokit's underlying graphics APIs (WebGL, WebGPU etc).
 * @param {function} [params.getAttachment] Callback through which to fetch attachments, if the glTF has them.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
function parseGLTFJSONIntoXKTModel(_ref) {
  var data = _ref.data,
    xktModel = _ref.xktModel,
    metaModelData = _ref.metaModelData,
    includeNormals = _ref.includeNormals,
    reuseGeometries = _ref.reuseGeometries,
    getAttachment = _ref.getAttachment,
    _ref$stats = _ref.stats,
    stats = _ref$stats === void 0 ? {} : _ref$stats,
    log = _ref.log;
  if (log) {
    log("Using parser: parseGLTFJSONIntoXKTModel");
  }
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
    stats.numObjects = 0;
    stats.numGeometries = 0;
    var ctx = {
      gltf: data,
      metaModelCorrections: metaModelData ? getMetaModelCorrections(metaModelData) : null,
      getAttachment: getAttachment || function () {
        throw new Error('You must define getAttachment() method to convert glTF with external resources');
      },
      log: log || function (msg) {},
      xktModel: xktModel,
      includeNormals: includeNormals,
      createXKTGeometryIds: {},
      nextMeshId: 0,
      reuseGeometries: reuseGeometries !== false,
      stats: stats
    };
    ctx.log("Parsing normals: ".concat(ctx.includeNormals ? "enabled" : "disabled"));
    parseBuffers(ctx).then(function () {
      parseBufferViews(ctx);
      freeBuffers(ctx);
      parseMaterials(ctx);
      parseDefaultScene(ctx);
      resolve();
    }, function (errMsg) {
      reject(errMsg);
    });
  });
}
function getMetaModelCorrections(metaModelData) {
  var eachRootStats = {};
  var eachChildRoot = {};
  var metaObjects = metaModelData.metaObjects || [];
  var metaObjectsMap = {};
  for (var i = 0, len = metaObjects.length; i < len; i++) {
    var metaObject = metaObjects[i];
    metaObjectsMap[metaObject.id] = metaObject;
  }
  for (var _i = 0, _len = metaObjects.length; _i < _len; _i++) {
    var _metaObject = metaObjects[_i];
    if (_metaObject.parent !== undefined && _metaObject.parent !== null) {
      var metaObjectParent = metaObjectsMap[_metaObject.parent];
      if (_metaObject.type === metaObjectParent.type) {
        var rootMetaObject = metaObjectParent;
        while (rootMetaObject.parent && metaObjectsMap[rootMetaObject.parent].type === rootMetaObject.type) {
          rootMetaObject = metaObjectsMap[rootMetaObject.parent];
        }
        var rootStats = eachRootStats[rootMetaObject.id] || (eachRootStats[rootMetaObject.id] = {
          numChildren: 0,
          countChildren: 0
        });
        rootStats.numChildren++;
        eachChildRoot[_metaObject.id] = rootMetaObject;
      } else {}
    }
  }
  var metaModelCorrections = {
    metaObjectsMap: metaObjectsMap,
    eachRootStats: eachRootStats,
    eachChildRoot: eachChildRoot
  };
  return metaModelCorrections;
}
function parseBuffers(ctx) {
  // Parses geometry buffers into temporary  "_buffer" Unit8Array properties on the glTF "buffer" elements
  var buffers = ctx.gltf.buffers;
  if (buffers) {
    return Promise.all(buffers.map(function (buffer) {
      return parseBuffer(ctx, buffer);
    }));
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
    var uri = bufferInfo.uri;
    if (!uri) {
      reject('gltf/handleBuffer missing uri in ' + JSON.stringify(bufferInfo));
      return;
    }
    parseArrayBuffer(ctx, uri).then(function (arrayBuffer) {
      bufferInfo._buffer = arrayBuffer;
      resolve(arrayBuffer);
    }, function (errMsg) {
      reject(errMsg);
    });
  });
}
function parseArrayBuffer(ctx, uri) {
  return new Promise(function (resolve, reject) {
    var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/; // Check for data: URI
    var dataUriRegexResult = uri.match(dataUriRegex);
    if (dataUriRegexResult) {
      // Safari can't handle data URIs through XMLHttpRequest
      var isBase64 = !!dataUriRegexResult[2];
      var data = dataUriRegexResult[3];
      data = decodeURIComponent(data);
      if (isBase64) {
        data = atob2(data);
      }
      var buffer = new ArrayBuffer(data.length);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < data.length; i++) {
        view[i] = data.charCodeAt(i);
      }
      resolve(buffer);
    } else {
      // Uri is a path to a file
      ctx.getAttachment(uri).then(function (arrayBuffer) {
        resolve(arrayBuffer);
      }, function (errMsg) {
        reject(errMsg);
      });
    }
  });
}
function parseBufferViews(ctx) {
  // Parses our temporary "_buffer" properties into "_buffer" properties on glTF "bufferView" elements
  var bufferViewsInfo = ctx.gltf.bufferViews;
  if (bufferViewsInfo) {
    for (var i = 0, len = bufferViewsInfo.length; i < len; i++) {
      parseBufferView(ctx, bufferViewsInfo[i]);
    }
  }
}
function parseBufferView(ctx, bufferViewInfo) {
  var buffer = ctx.gltf.buffers[bufferViewInfo.buffer];
  bufferViewInfo._typedArray = null;
  var byteLength = bufferViewInfo.byteLength || 0;
  var byteOffset = bufferViewInfo.byteOffset || 0;
  bufferViewInfo._buffer = buffer._buffer.slice(byteOffset, byteOffset + byteLength);
}
function freeBuffers(ctx) {
  // Deletes the "_buffer" properties from the glTF "buffer" elements, to save memory
  var buffers = ctx.gltf.buffers;
  if (buffers) {
    for (var i = 0, len = buffers.length; i < len; i++) {
      buffers[i]._buffer = null;
    }
  }
}
function parseMaterials(ctx) {
  var materialsInfo = ctx.gltf.materials;
  if (materialsInfo) {
    for (var i = 0, len = materialsInfo.length; i < len; i++) {
      var materialInfo = materialsInfo[i];
      var material = parseMaterial(ctx, materialInfo);
      materialInfo._materialData = material;
    }
  }
}
function parseMaterial(ctx, materialInfo) {
  // Attempts to extract an RGBA color for a glTF material
  var material = {
    color: new Float32Array([1, 1, 1]),
    opacity: 1.0,
    metallic: 0,
    roughness: 1
  };
  var extensions = materialInfo.extensions;
  if (extensions) {
    var specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
    if (specularPBR) {
      var diffuseFactor = specularPBR.diffuseFactor;
      if (diffuseFactor !== null && diffuseFactor !== undefined) {
        material.color[0] = diffuseFactor[0];
        material.color[1] = diffuseFactor[1];
        material.color[2] = diffuseFactor[2];
      }
    }
    var common = extensions["KHR_materials_common"];
    if (common) {
      var technique = common.technique;
      var values = common.values || {};
      var blinn = technique === "BLINN";
      var phong = technique === "PHONG";
      var lambert = technique === "LAMBERT";
      var diffuse = values.diffuse;
      if (diffuse && (blinn || phong || lambert)) {
        if (!_XKTModel_lib_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.isString(diffuse)) {
          material.color[0] = diffuse[0];
          material.color[1] = diffuse[1];
          material.color[2] = diffuse[2];
        }
      }
      var transparency = values.transparency;
      if (transparency !== null && transparency !== undefined) {
        material.opacity = transparency;
      }
      var transparent = values.transparent;
      if (transparent !== null && transparent !== undefined) {
        material.opacity = transparent;
      }
    }
  }
  var metallicPBR = materialInfo.pbrMetallicRoughness;
  if (metallicPBR) {
    var baseColorFactor = metallicPBR.baseColorFactor;
    if (baseColorFactor) {
      material.color[0] = baseColorFactor[0];
      material.color[1] = baseColorFactor[1];
      material.color[2] = baseColorFactor[2];
      material.opacity = baseColorFactor[3];
    }
    var metallicFactor = metallicPBR.metallicFactor;
    if (metallicFactor !== null && metallicFactor !== undefined) {
      material.metallic = metallicFactor;
    }
    var roughnessFactor = metallicPBR.roughnessFactor;
    if (roughnessFactor !== null && roughnessFactor !== undefined) {
      material.roughness = roughnessFactor;
    }
  }
  return material;
}
function parseDefaultScene(ctx) {
  var scene = ctx.gltf.scene || 0;
  var defaultSceneInfo = ctx.gltf.scenes[scene];
  if (!defaultSceneInfo) {
    throw new Error("glTF has no default scene");
  }
  parseScene(ctx, defaultSceneInfo);
}
function parseScene(ctx, sceneInfo) {
  var nodes = sceneInfo.nodes;
  if (!nodes) {
    return;
  }
  for (var i = 0, len = nodes.length; i < len; i++) {
    var glTFNode = ctx.gltf.nodes[nodes[i]];
    if (glTFNode) {
      parseNode(ctx, glTFNode, 0, null);
    }
  }
}
var deferredMeshIds = [];
function parseNode(ctx, glTFNode, depth, matrix) {
  var gltf = ctx.gltf;
  var xktModel = ctx.xktModel;
  var localMatrix;
  if (glTFNode.matrix) {
    localMatrix = glTFNode.matrix;
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mat4());
    } else {
      matrix = localMatrix;
    }
  }
  if (glTFNode.translation) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.translationMat4v(glTFNode.translation);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, localMatrix);
    } else {
      matrix = localMatrix;
    }
  }
  if (glTFNode.rotation) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.quaternionToMat4(glTFNode.rotation);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, localMatrix);
    } else {
      matrix = localMatrix;
    }
  }
  if (glTFNode.scale) {
    localMatrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.scalingMat4v(glTFNode.scale);
    if (matrix) {
      matrix = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.mulMat4(matrix, localMatrix, localMatrix);
    } else {
      matrix = localMatrix;
    }
  }
  var gltfMeshId = glTFNode.mesh;
  if (gltfMeshId !== undefined) {
    var meshInfo = gltf.meshes[gltfMeshId];
    if (meshInfo) {
      var numPrimitivesInMesh = meshInfo.primitives.length;
      if (numPrimitivesInMesh > 0) {
        for (var i = 0; i < numPrimitivesInMesh; i++) {
          var primitiveInfo = meshInfo.primitives[i];
          var geometryHash = createPrimitiveGeometryHash(primitiveInfo);
          var xktGeometryId = ctx.createXKTGeometryIds[geometryHash];
          if (!ctx.reuseGeometries || !xktGeometryId) {
            xktGeometryId = "geometry-" + ctx.nextMeshId++;
            var geometryArrays = {};
            parsePrimitiveGeometry(ctx, primitiveInfo, geometryArrays);
            var colors = geometryArrays.colors;
            var colorsCompressed = void 0;
            if (geometryArrays.colors) {
              colorsCompressed = [];
              for (var j = 0, lenj = colors.length; j < lenj; j += 4) {
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
              normals: ctx.includeNormals ? geometryArrays.normals : null,
              colorsCompressed: colorsCompressed,
              indices: geometryArrays.indices
            });
            ctx.stats.numGeometries++;
            ctx.stats.numVertices += geometryArrays.positions ? geometryArrays.positions.length / 3 : 0;
            ctx.stats.numNormals += ctx.includeNormals && geometryArrays.normals ? geometryArrays.normals.length / 3 : 0;
            ctx.stats.numTriangles += geometryArrays.indices ? geometryArrays.indices.length / 3 : 0;
            ctx.createXKTGeometryIds[geometryHash] = xktGeometryId;
          } else {
            // Geometry reused
          }
          var materialIndex = primitiveInfo.material;
          var materialInfo = materialIndex !== null && materialIndex !== undefined ? gltf.materials[materialIndex] : null;
          var color = materialInfo ? materialInfo._materialData.color : new Float32Array([1.0, 1.0, 1.0, 1.0]);
          var opacity = materialInfo ? materialInfo._materialData.opacity : 1.0;
          var metallic = materialInfo ? materialInfo._materialData.metallic : 0.0;
          var roughness = materialInfo ? materialInfo._materialData.roughness : 1.0;
          var xktMeshId = "mesh-" + ctx.nextMeshId++;
          xktModel.createMesh({
            meshId: xktMeshId,
            geometryId: xktGeometryId,
            matrix: matrix ? matrix.slice() : _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.identityMat4(),
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
    var children = glTFNode.children;
    for (var _i2 = 0, len = children.length; _i2 < len; _i2++) {
      var childNodeIdx = children[_i2];
      var childGLTFNode = gltf.nodes[childNodeIdx];
      if (!childGLTFNode) {
        console.warn('Node not found: ' + _i2);
        continue;
      }
      parseNode(ctx, childGLTFNode, depth + 1, matrix);
    }
  }

  // Post-order visit scene node

  var nodeName = glTFNode.name;
  if ((nodeName !== undefined && nodeName !== null || depth === 0) && deferredMeshIds.length > 0) {
    if (nodeName === undefined || nodeName === null) {
      ctx.log("[parseGLTFJSONIntoXKTModel] Warning: 'name' properties not found on glTF scene nodes - will randomly-generate object IDs in XKT");
    }
    var xktEntityId = nodeName; // Fall back on generated ID when `name` not found on glTF scene node(s)
    if (xktEntityId === undefined || xktEntityId === null) {
      if (xktModel.entities[xktEntityId]) {
        ctx.error("Two or more glTF nodes found with same 'name' attribute: '" + nodeName + "'");
      }
      while (!xktEntityId || xktModel.entities[xktEntityId]) {
        xktEntityId = "entity-" + ctx.nextId++;
      }
    }
    if (ctx.metaModelCorrections) {
      // Merging meshes into XKTObjects that map to metaobjects
      var rootMetaObject = ctx.metaModelCorrections.eachChildRoot[xktEntityId];
      if (rootMetaObject) {
        var rootMetaObjectStats = ctx.metaModelCorrections.eachRootStats[rootMetaObject.id];
        rootMetaObjectStats.countChildren++;
        if (rootMetaObjectStats.countChildren >= rootMetaObjectStats.numChildren) {
          xktModel.createEntity({
            entityId: rootMetaObject.id,
            meshIds: deferredMeshIds
          });
          ctx.stats.numObjects++;
          deferredMeshIds = [];
        }
      } else {
        var metaObject = ctx.metaModelCorrections.metaObjectsMap[xktEntityId];
        if (metaObject) {
          xktModel.createEntity({
            entityId: xktEntityId,
            meshIds: deferredMeshIds
          });
          ctx.stats.numObjects++;
          deferredMeshIds = [];
        }
      }
    } else {
      // Create an XKTObject from the meshes at each named glTF node, don't care about metaobjects
      xktModel.createEntity({
        entityId: xktEntityId,
        meshIds: deferredMeshIds
      });
      ctx.stats.numObjects++;
      deferredMeshIds = [];
    }
  }
}
function createPrimitiveGeometryHash(primitiveInfo) {
  var attributes = primitiveInfo.attributes;
  if (!attributes) {
    return "empty";
  }
  var mode = primitiveInfo.mode;
  var material = primitiveInfo.material;
  var indices = primitiveInfo.indices;
  var positions = primitiveInfo.attributes.POSITION;
  var normals = primitiveInfo.attributes.NORMAL;
  var colors = primitiveInfo.attributes.COLOR_0;
  var uv = primitiveInfo.attributes.TEXCOORD_0;
  return [mode,
  //  material,
  indices !== null && indices !== undefined ? indices : "-", positions !== null && positions !== undefined ? positions : "-", normals !== null && normals !== undefined ? normals : "-", colors !== null && colors !== undefined ? colors : "-", uv !== null && uv !== undefined ? uv : "-"].join(";");
}
function parsePrimitiveGeometry(ctx, primitiveInfo, geometryArrays) {
  var attributes = primitiveInfo.attributes;
  if (!attributes) {
    return;
  }
  switch (primitiveInfo.mode) {
    case 0:
      // POINTS
      geometryArrays.primitive = "points";
      break;
    case 1:
      // LINES
      geometryArrays.primitive = "lines";
      break;
    case 2:
      // LINE_LOOP
      // TODO: convert
      geometryArrays.primitive = "lines";
      break;
    case 3:
      // LINE_STRIP
      // TODO: convert
      geometryArrays.primitive = "lines";
      break;
    case 4:
      // TRIANGLES
      geometryArrays.primitive = "triangles";
      break;
    case 5:
      // TRIANGLE_STRIP
      // TODO: convert
      console.log("TRIANGLE_STRIP");
      geometryArrays.primitive = "triangles";
      break;
    case 6:
      // TRIANGLE_FAN
      // TODO: convert
      console.log("TRIANGLE_FAN");
      geometryArrays.primitive = "triangles";
      break;
    default:
      geometryArrays.primitive = "triangles";
  }
  var accessors = ctx.gltf.accessors;
  var indicesIndex = primitiveInfo.indices;
  if (indicesIndex !== null && indicesIndex !== undefined) {
    var accessorInfo = accessors[indicesIndex];
    geometryArrays.indices = parseAccessorTypedArray(ctx, accessorInfo);
  }
  var positionsIndex = attributes.POSITION;
  if (positionsIndex !== null && positionsIndex !== undefined) {
    var _accessorInfo = accessors[positionsIndex];
    geometryArrays.positions = parseAccessorTypedArray(ctx, _accessorInfo);
  }
  var normalsIndex = attributes.NORMAL;
  if (normalsIndex !== null && normalsIndex !== undefined) {
    var _accessorInfo2 = accessors[normalsIndex];
    geometryArrays.normals = parseAccessorTypedArray(ctx, _accessorInfo2);
  }
  var colorsIndex = attributes.COLOR_0;
  if (colorsIndex !== null && colorsIndex !== undefined) {
    var _accessorInfo3 = accessors[colorsIndex];
    geometryArrays.colors = parseAccessorTypedArray(ctx, _accessorInfo3);
  }
}
function parseAccessorTypedArray(ctx, accessorInfo) {
  var bufferView = ctx.gltf.bufferViews[accessorInfo.bufferView];
  var itemSize = WEBGL_TYPE_SIZES[accessorInfo.type];
  var TypedArray = WEBGL_COMPONENT_TYPES[accessorInfo.componentType];
  var elementBytes = TypedArray.BYTES_PER_ELEMENT; // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
  var itemBytes = elementBytes * itemSize;
  if (accessorInfo.byteStride && accessorInfo.byteStride !== itemBytes) {
    // The buffer is not interleaved if the stride is the item size in bytes.
    throw new Error("interleaved buffer!"); // TODO
  } else {
    return new TypedArray(bufferView._buffer, accessorInfo.byteOffset || 0, accessorInfo.count * itemSize);
  }
}


/***/ }),

/***/ "./src/parsers/parseIFCIntoXKTModel.js":
/*!*********************************************!*\
  !*** ./src/parsers/parseIFCIntoXKTModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseIFCIntoXKTModel: () => (/* binding */ parseIFCIntoXKTModel)
/* harmony export */ });
/**
 * @desc Parses IFC STEP file data into an {@link XKTModel}.
 *
 * This function uses [web-ifc](https://github.com/tomvandig/web-ifc) to parse the IFC, which relies on a
 * WASM file to do the parsing.
 *
 * Depending on how we use this function, we may need to provide it with a path to the directory where that WASM file is stored.
 *
 * This function is tested with web-ifc version 0.0.34.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load an IFC model into it.
 *
 * ````javascript
 * import {XKTModel, parseIFCIntoXKTModel, writeXKTModelToArrayBuffer} from "xeokit-convert.es.js";
 *
 * import * as WebIFC from "web-ifc-api.js";
 *
 * utils.loadArraybuffer("rac_advanced_sample_project.ifc", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseIFCIntoXKTModel({
 *          WebIFC,
 *          data,
 *          xktModel,
 *          wasmPath: "../dist/",
 *          autoNormals: true,
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
 * @param {Object} params.WebIFC The WebIFC library. We pass this in as an external dependency, in order to give the
 * caller the choice of whether to use the Browser or NodeJS version.
 * @param {ArrayBuffer} [params.data] IFC file data.
 * @param {XKTModel} [params.xktModel] XKTModel to parse into.
 * @param {Boolean} [params.autoNormals=true] When true, the parser will ignore the IFC geometry normals, and the IFC
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the IFC model. This is ````true```` by default, because IFC models tend to look acceptable with flat-shading,
 * and we always want to minimize IFC model size wherever possible.
 * @param {String[]} [params.includeTypes] Option to only convert objects of these types.
 * @param {String[]} [params.excludeTypes] Option to never convert objects of these types.
 * @param {String} params.wasmPath Path to ````web-ifc.wasm````, required by this function.
 * @param {Object} [params.stats={}] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise} Resolves when IFC has been parsed.
 */
function parseIFCIntoXKTModel(_ref) {
  var WebIFC = _ref.WebIFC,
    data = _ref.data,
    xktModel = _ref.xktModel,
    _ref$autoNormals = _ref.autoNormals,
    autoNormals = _ref$autoNormals === void 0 ? true : _ref$autoNormals,
    includeTypes = _ref.includeTypes,
    excludeTypes = _ref.excludeTypes,
    wasmPath = _ref.wasmPath,
    _ref$stats = _ref.stats,
    stats = _ref$stats === void 0 ? {} : _ref$stats,
    log = _ref.log;
  if (log) {
    log("Using parser: parseIFCIntoXKTModel");
  }
  return new Promise(function (resolve, reject) {
    if (!data) {
      reject("Argument expected: data");
      return;
    }
    if (!xktModel) {
      reject("Argument expected: xktModel");
      return;
    }
    if (!wasmPath) {
      reject("Argument expected: wasmPath");
      return;
    }
    var ifcAPI = new WebIFC.IfcAPI();
    if (wasmPath) {
      ifcAPI.SetWasmPath(wasmPath);
    }
    ifcAPI.Init().then(function () {
      var dataArray = new Uint8Array(data);
      var modelID = ifcAPI.OpenModel(dataArray);
      stats.sourceFormat = "IFC";
      stats.schemaVersion = "";
      stats.title = "";
      stats.author = "";
      stats.created = "";
      stats.numMetaObjects = 0;
      stats.numPropertySets = 0;
      stats.numObjects = 0;
      stats.numGeometries = 0;
      stats.numTriangles = 0;
      stats.numVertices = 0;
      var ctx = {
        WebIFC: WebIFC,
        modelID: modelID,
        ifcAPI: ifcAPI,
        xktModel: xktModel,
        autoNormals: autoNormals,
        log: log || function (msg) {},
        nextId: 0,
        stats: stats
      };
      if (includeTypes) {
        ctx.includeTypes = {};
        for (var i = 0, len = includeTypes.length; i < len; i++) {
          ctx.includeTypes[includeTypes[i]] = true;
        }
      }
      if (excludeTypes) {
        ctx.excludeTypes = {};
        for (var _i = 0, _len = excludeTypes.length; _i < _len; _i++) {
          ctx.excludeTypes[excludeTypes[_i]] = true;
        }
      }
      var lines = ctx.ifcAPI.GetLineIDsWithType(modelID, WebIFC.IFCPROJECT);
      var ifcProjectId = lines.get(0);
      var ifcProject = ctx.ifcAPI.GetLine(modelID, ifcProjectId);
      ctx.xktModel.schema = "";
      ctx.xktModel.modelId = "" + modelID;
      ctx.xktModel.projectId = "" + ifcProjectId;
      parseMetadata(ctx);
      parseGeometry(ctx);
      parsePropertySets(ctx);
      resolve();
    })["catch"](function (e) {
      reject(e);
    });
  });
}
function parsePropertySets(ctx) {
  var lines = ctx.ifcAPI.GetLineIDsWithType(ctx.modelID, ctx.WebIFC.IFCRELDEFINESBYPROPERTIES);
  for (var i = 0; i < lines.size(); i++) {
    var relID = lines.get(i);
    var rel = ctx.ifcAPI.GetLine(ctx.modelID, relID, true);
    if (rel) {
      var relatingPropertyDefinition = rel.RelatingPropertyDefinition;
      if (!relatingPropertyDefinition) {
        continue;
      }
      var propertySetId = relatingPropertyDefinition.GlobalId.value;
      var relatedObjects = rel.RelatedObjects;
      if (relatedObjects) {
        for (var _i2 = 0, len = relatedObjects.length; _i2 < len; _i2++) {
          var relatedObject = relatedObjects[_i2];
          var metaObjectId = relatedObject.GlobalId.value;
          var metaObject = ctx.xktModel.metaObjects[metaObjectId];
          if (metaObject) {
            if (!metaObject.propertySetIds) {
              metaObject.propertySetIds = [];
            }
            metaObject.propertySetIds.push(propertySetId);
          }
        }
      }
      var props = relatingPropertyDefinition.HasProperties;
      if (props && props.length > 0) {
        var propertySetType = "Default";
        var propertySetName = relatingPropertyDefinition.Name.value;
        var properties = [];
        for (var _i3 = 0, _len2 = props.length; _i3 < _len2; _i3++) {
          var prop = props[_i3];
          var name = prop.Name;
          var nominalValue = prop.NominalValue;
          if (name && nominalValue) {
            var property = {
              name: name.value,
              type: nominalValue.type,
              value: nominalValue.value,
              valueType: nominalValue.valueType
            };
            if (prop.Description) {
              property.description = prop.Description.value;
            } else if (nominalValue.description) {
              property.description = nominalValue.description;
            }
            properties.push(property);
          }
        }
        ctx.xktModel.createPropertySet({
          propertySetId: propertySetId,
          propertySetType: propertySetType,
          propertySetName: propertySetName,
          properties: properties
        });
        ctx.stats.numPropertySets++;
      }
    }
  }
}
function parseMetadata(ctx) {
  var lines = ctx.ifcAPI.GetLineIDsWithType(ctx.modelID, ctx.WebIFC.IFCPROJECT);
  var ifcProjectId = lines.get(0);
  var ifcProject = ctx.ifcAPI.GetLine(ctx.modelID, ifcProjectId);
  parseSpatialChildren(ctx, ifcProject);
}
function parseSpatialChildren(ctx, ifcElement, parentMetaObjectId) {
  var metaObjectType = ifcElement.__proto__.constructor.name;
  if (ctx.includeTypes && !ctx.includeTypes[metaObjectType]) {
    return;
  }
  if (ctx.excludeTypes && ctx.excludeTypes[metaObjectType]) {
    return;
  }
  createMetaObject(ctx, ifcElement, parentMetaObjectId);
  var metaObjectId = ifcElement.GlobalId.value;
  parseRelatedItemsOfType(ctx, ifcElement.expressID, 'RelatingObject', 'RelatedObjects', ctx.WebIFC.IFCRELAGGREGATES, metaObjectId);
  parseRelatedItemsOfType(ctx, ifcElement.expressID, 'RelatingStructure', 'RelatedElements', ctx.WebIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE, metaObjectId);
}
function createMetaObject(ctx, ifcElement, parentMetaObjectId) {
  var metaObjectId = ifcElement.GlobalId.value;
  var propertySetIds = null;
  var metaObjectType = ifcElement.__proto__.constructor.name;
  var metaObjectName = ifcElement.Name && ifcElement.Name.value !== "" ? ifcElement.Name.value : metaObjectType;
  ctx.xktModel.createMetaObject({
    metaObjectId: metaObjectId,
    propertySetIds: propertySetIds,
    metaObjectType: metaObjectType,
    metaObjectName: metaObjectName,
    parentMetaObjectId: parentMetaObjectId
  });
  ctx.stats.numMetaObjects++;
}
function parseRelatedItemsOfType(ctx, id, relation, related, type, parentMetaObjectId) {
  var lines = ctx.ifcAPI.GetLineIDsWithType(ctx.modelID, type);
  for (var i = 0; i < lines.size(); i++) {
    var relID = lines.get(i);
    var rel = ctx.ifcAPI.GetLine(ctx.modelID, relID);
    var relatedItems = rel[relation];
    var foundElement = false;
    if (Array.isArray(relatedItems)) {
      var values = relatedItems.map(function (item) {
        return item.value;
      });
      foundElement = values.includes(id);
    } else {
      foundElement = relatedItems.value === id;
    }
    if (foundElement) {
      var element = rel[related];
      if (!Array.isArray(element)) {
        var ifcElement = ctx.ifcAPI.GetLine(ctx.modelID, element.value);
        parseSpatialChildren(ctx, ifcElement, parentMetaObjectId);
      } else {
        element.forEach(function (element2) {
          var ifcElement = ctx.ifcAPI.GetLine(ctx.modelID, element2.value);
          parseSpatialChildren(ctx, ifcElement, parentMetaObjectId);
        });
      }
    }
  }
}
function parseGeometry(ctx) {
  // Parses the geometry and materials in the IFC, creates
  // XKTEntity, XKTMesh and XKTGeometry components within the XKTModel.

  var flatMeshes = ctx.ifcAPI.LoadAllGeometry(ctx.modelID);
  for (var i = 0, len = flatMeshes.size(); i < len; i++) {
    var flatMesh = flatMeshes.get(i);
    createObject(ctx, flatMesh);
  }

  // LoadAllGeometry does not return IFCSpace meshes
  // here is a workaround

  var lines = ctx.ifcAPI.GetLineIDsWithType(ctx.modelID, ctx.WebIFC.IFCSPACE);
  for (var j = 0, _len3 = lines.size(); j < _len3; j++) {
    var ifcSpaceId = lines.get(j);
    var _flatMesh = ctx.ifcAPI.GetFlatMesh(ctx.modelID, ifcSpaceId);
    createObject(ctx, _flatMesh);
  }
}
function createObject(ctx, flatMesh) {
  var flatMeshExpressID = flatMesh.expressID;
  var placedGeometries = flatMesh.geometries;
  var meshIds = [];
  var properties = ctx.ifcAPI.GetLine(ctx.modelID, flatMeshExpressID);
  var entityId = properties.GlobalId.value;
  var metaObjectId = entityId;
  var metaObject = ctx.xktModel.metaObjects[metaObjectId];
  if (ctx.includeTypes && (!metaObject || !ctx.includeTypes[metaObject.metaObjectType])) {
    return;
  }
  if (ctx.excludeTypes && (!metaObject || ctx.excludeTypes[metaObject.metaObjectType])) {
    console.log("excluding: " + metaObjectId);
    return;
  }
  for (var j = 0, lenj = placedGeometries.size(); j < lenj; j++) {
    var placedGeometry = placedGeometries.get(j);
    var geometryId = "" + placedGeometry.geometryExpressID;
    if (!ctx.xktModel.geometries[geometryId]) {
      var geometry = ctx.ifcAPI.GetGeometry(ctx.modelID, placedGeometry.geometryExpressID);
      var vertexData = ctx.ifcAPI.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
      var indices = ctx.ifcAPI.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());

      // De-interleave vertex arrays

      var positions = [];
      var normals = [];
      for (var k = 0, lenk = vertexData.length / 6; k < lenk; k++) {
        positions.push(vertexData[k * 6 + 0]);
        positions.push(vertexData[k * 6 + 1]);
        positions.push(vertexData[k * 6 + 2]);
      }
      if (!ctx.autoNormals) {
        for (var _k = 0, _lenk = vertexData.length / 6; _k < _lenk; _k++) {
          normals.push(vertexData[_k * 6 + 3]);
          normals.push(vertexData[_k * 6 + 4]);
          normals.push(vertexData[_k * 6 + 5]);
        }
      }
      ctx.xktModel.createGeometry({
        geometryId: geometryId,
        primitiveType: "triangles",
        positions: positions,
        normals: ctx.autoNormals ? null : normals,
        indices: indices
      });
      ctx.stats.numGeometries++;
      ctx.stats.numVertices += positions.length / 3;
      ctx.stats.numTriangles += indices.length / 3;
    }
    var meshId = "mesh" + ctx.nextId++;
    ctx.xktModel.createMesh({
      meshId: meshId,
      geometryId: geometryId,
      matrix: placedGeometry.flatTransformation,
      color: [placedGeometry.color.x, placedGeometry.color.y, placedGeometry.color.z],
      opacity: placedGeometry.color.w
    });
    meshIds.push(meshId);
  }
  if (meshIds.length > 0) {
    ctx.xktModel.createEntity({
      entityId: entityId,
      meshIds: meshIds
    });
    ctx.stats.numObjects++;
  }
}


/***/ }),

/***/ "./src/parsers/parseLASIntoXKTModel.js":
/*!*********************************************!*\
  !*** ./src/parsers/parseLASIntoXKTModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseLASIntoXKTModel: () => (/* binding */ parseLASIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/core */ "@loaders.gl/core");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _loaders_gl_las__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/las */ "@loaders.gl/las");
/* harmony import */ var _loaders_gl_las__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_las__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");



var MAX_VERTICES = 500000; // TODO: Rough estimate

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
 *          rotateX: true,
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
 * @param {boolean} [params.center=false] Set true to center the LAS point positions to [0,0,0]. This is applied before the transformation matrix, if specified.
 * @param {Boolean} [params.transform] 4x4 transformation matrix to transform point positions. Use this to rotate, translate and scale them if neccessary.
 * @param {Number|String} [params.colorDepth=8] Whether colors encoded using 8 or 16 bits. Can be set to 'auto'. LAS specification recommends 16 bits.
 * @param {Boolean} [params.fp64=false] Configures if LASLoaderPlugin assumes that LAS positions are stored in 64-bit floats instead of 32-bit.
 * @param {Number} [params.skip=1] Read one from every n points.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise} Resolves when LAS has been parsed.
 */
function parseLASIntoXKTModel(_ref) {
  var data = _ref.data,
    xktModel = _ref.xktModel,
    _ref$center = _ref.center,
    center = _ref$center === void 0 ? false : _ref$center,
    _ref$transform = _ref.transform,
    transform = _ref$transform === void 0 ? null : _ref$transform,
    _ref$colorDepth = _ref.colorDepth,
    colorDepth = _ref$colorDepth === void 0 ? "auto" : _ref$colorDepth,
    _ref$fp = _ref.fp64,
    fp64 = _ref$fp === void 0 ? false : _ref$fp,
    _ref$skip = _ref.skip,
    skip = _ref$skip === void 0 ? 1 : _ref$skip,
    stats = _ref.stats,
    _ref$log = _ref.log,
    log = _ref$log === void 0 ? function () {} : _ref$log;
  if (log) {
    log("Using parser: parseLASIntoXKTModel");
  }
  return new Promise(function (resolve, reject) {
    if (!data) {
      reject("Argument expected: data");
      return;
    }
    if (!xktModel) {
      reject("Argument expected: xktModel");
      return;
    }
    log("Converting LAZ/LAS");
    log("center: ".concat(center));
    if (transform) {
      log("transform: [".concat(transform, "]"));
    }
    log("colorDepth: ".concat(colorDepth));
    log("fp64: ".concat(fp64));
    log("skip: ".concat(skip));
    (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__.parse)(data, _loaders_gl_las__WEBPACK_IMPORTED_MODULE_1__.LASLoader, {
      las: {
        colorDepth: colorDepth,
        fp64: fp64
      }
    }).then(function (parsedData) {
      var attributes = parsedData.attributes;
      var loaderData = parsedData.loaderData;
      var pointsFormatId = loaderData.pointsFormatId !== undefined ? loaderData.pointsFormatId : -1;
      if (!attributes.POSITION) {
        log("No positions found in file (expected for all LAS point formats)");
        return;
      }
      var readAttributes = {};
      switch (pointsFormatId) {
        case 0:
          if (!attributes.intensity) {
            log("No intensities found in file (expected for LAS point format 0)");
            return;
          }
          readAttributes = readIntensities(attributes.POSITION, attributes.intensity);
          break;
        case 1:
          if (!attributes.intensity) {
            log("No intensities found in file (expected for LAS point format 1)");
            return;
          }
          readAttributes = readIntensities(attributes.POSITION, attributes.intensity);
          break;
        case 2:
          if (!attributes.intensity) {
            log("No intensities found in file (expected for LAS point format 2)");
            return;
          }
          readAttributes = readColorsAndIntensities(attributes.POSITION, attributes.COLOR_0, attributes.intensity);
          break;
        case 3:
          if (!attributes.intensity) {
            log("No intensities found in file (expected for LAS point format 3)");
            return;
          }
          readAttributes = readColorsAndIntensities(attributes.POSITION, attributes.COLOR_0, attributes.intensity);
          break;
      }
      var pointsChunks = chunkArray(readPositions(readAttributes.positions), MAX_VERTICES * 3);
      var colorsChunks = chunkArray(readAttributes.colors, MAX_VERTICES * 4);
      var meshIds = [];
      for (var j = 0, lenj = pointsChunks.length; j < lenj; j++) {
        var geometryId = "geometry-".concat(j);
        var meshId = "mesh-".concat(j);
        meshIds.push(meshId);
        xktModel.createGeometry({
          geometryId: geometryId,
          primitiveType: "points",
          positions: pointsChunks[j],
          colorsCompressed: colorsChunks[j]
        });
        xktModel.createMesh({
          meshId: meshId,
          geometryId: geometryId
        });
      }
      var entityId = _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.createUUID();
      xktModel.createEntity({
        entityId: entityId,
        meshIds: meshIds
      });
      var rootMetaObjectId = _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.createUUID();
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
        stats.numVertices = readAttributes.positions.length / 3;
      }
      resolve();
    }, function (errMsg) {
      reject(errMsg);
    });
  });
  function readPositions(positionsValue) {
    if (positionsValue) {
      if (center) {
        var centerPos = _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.vec3();
        var numPoints = positionsValue.length;
        for (var i = 0, len = positionsValue.length; i < len; i += 3) {
          centerPos[0] += positionsValue[i + 0];
          centerPos[1] += positionsValue[i + 1];
          centerPos[2] += positionsValue[i + 2];
        }
        centerPos[0] /= numPoints;
        centerPos[1] /= numPoints;
        centerPos[2] /= numPoints;
        for (var _i = 0, _len = positionsValue.length; _i < _len; _i += 3) {
          positionsValue[_i + 0] -= centerPos[0];
          positionsValue[_i + 1] -= centerPos[1];
          positionsValue[_i + 2] -= centerPos[2];
        }
      }
      if (transform) {
        var mat = _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.mat4(transform);
        var pos = _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.vec3();
        for (var _i2 = 0, _len2 = positionsValue.length; _i2 < _len2; _i2 += 3) {
          pos[0] = positionsValue[_i2 + 0];
          pos[1] = positionsValue[_i2 + 1];
          pos[2] = positionsValue[_i2 + 2];
          _lib_math_js__WEBPACK_IMPORTED_MODULE_2__.math.transformPoint3(mat, pos, pos);
          positionsValue[_i2 + 0] = pos[0];
          positionsValue[_i2 + 1] = pos[1];
          positionsValue[_i2 + 2] = pos[2];
        }
      }
    }
    return positionsValue;
  }
  function readColorsAndIntensities(attributesPosition, attributesColor, attributesIntensity) {
    var positionsValue = attributesPosition.value;
    var colors = attributesColor.value;
    var colorSize = attributesColor.size;
    var intensities = attributesIntensity.value;
    var colorsCompressedSize = intensities.length * 4;
    var positions = [];
    var colorsCompressed = new Uint8Array(colorsCompressedSize / skip);
    var count = skip;
    for (var i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, len = intensities.length; i < len; i++, k += colorSize, j += 4, l += 3) {
      if (count <= 0) {
        colorsCompressed[m++] = colors[k + 0];
        colorsCompressed[m++] = colors[k + 1];
        colorsCompressed[m++] = colors[k + 2];
        colorsCompressed[m++] = Math.round(intensities[i] / 65536 * 255);
        positions[n++] = positionsValue[l + 0];
        positions[n++] = positionsValue[l + 1];
        positions[n++] = positionsValue[l + 2];
        count = skip;
      } else {
        count--;
      }
    }
    return {
      positions: positions,
      colors: colorsCompressed
    };
  }
  function readIntensities(attributesPosition, attributesIntensity) {
    var positionsValue = attributesPosition.value;
    var intensities = attributesIntensity.value;
    var colorsCompressedSize = intensities.length * 4;
    var positions = [];
    var colorsCompressed = new Uint8Array(colorsCompressedSize / skip);
    var count = skip;
    for (var i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, len = intensities.length; i < len; i++, k += 3, j += 4, l += 3) {
      if (count <= 0) {
        colorsCompressed[m++] = 0;
        colorsCompressed[m++] = 0;
        colorsCompressed[m++] = 0;
        colorsCompressed[m++] = Math.round(intensities[i] / 65536 * 255);
        positions[n++] = positionsValue[l + 0];
        positions[n++] = positionsValue[l + 1];
        positions[n++] = positionsValue[l + 2];
        count = skip;
      } else {
        count--;
      }
    }
    return {
      positions: positions,
      colors: colorsCompressed
    };
  }
  function chunkArray(array, chunkSize) {
    if (chunkSize >= array.length) {
      return [array]; // One chunk
    }

    var result = [];
    for (var i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
}


/***/ }),

/***/ "./src/parsers/parseMetaModelIntoXKTModel.js":
/*!***************************************************!*\
  !*** ./src/parsers/parseMetaModelIntoXKTModel.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseMetaModelIntoXKTModel: () => (/* binding */ parseMetaModelIntoXKTModel)
/* harmony export */ });
/**
 * @desc Parses JSON metamodel into an {@link XKTModel}.
 *
 * @param {Object} params Parsing parameters.
 * @param {JSON} params.metaModelData Metamodel data.
 * @param {String[]} [params.excludeTypes] Types to exclude from parsing.
 * @param {String[]} [params.includeTypes] Types to include in parsing.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when JSON has been parsed.
 */
function parseMetaModelIntoXKTModel(_ref) {
  var metaModelData = _ref.metaModelData,
    xktModel = _ref.xktModel,
    includeTypes = _ref.includeTypes,
    excludeTypes = _ref.excludeTypes,
    log = _ref.log;
  if (log) {
    log("Using parser: parseMetaModelIntoXKTModel");
  }
  return new Promise(function (resolve, reject) {
    var metaObjects = metaModelData.metaObjects || [];
    var propertySets = metaModelData.propertySets || [];
    xktModel.modelId = metaModelData.revisionId || ""; // HACK
    xktModel.projectId = metaModelData.projectId || "";
    xktModel.revisionId = metaModelData.revisionId || "";
    xktModel.author = metaModelData.author || "";
    xktModel.createdAt = metaModelData.createdAt || "";
    xktModel.creatingApplication = metaModelData.creatingApplication || "";
    xktModel.schema = metaModelData.schema || "";
    for (var i = 0, len = propertySets.length; i < len; i++) {
      var propertySet = propertySets[i];
      xktModel.createPropertySet({
        propertySetId: propertySet.id,
        propertySetName: propertySet.name,
        propertySetType: propertySet.type,
        properties: propertySet.properties
      });
    }
    var includeTypesMap;
    if (includeTypes) {
      includeTypesMap = {};
      for (var _i = 0, _len = includeTypes.length; _i < _len; _i++) {
        includeTypesMap[includeTypes[_i]] = true;
      }
    }
    var excludeTypesMap;
    if (excludeTypes) {
      excludeTypesMap = {};
      for (var _i2 = 0, _len2 = excludeTypes.length; _i2 < _len2; _i2++) {
        excludeTypesMap[excludeTypes[_i2]] = true;
      }
    }
    var metaObjectsMap = {};
    for (var _i3 = 0, _len3 = metaObjects.length; _i3 < _len3; _i3++) {
      var newObject = metaObjects[_i3];
      metaObjectsMap[newObject.id] = newObject;
    }
    var countMetaObjects = 0;
    for (var _i4 = 0, _len4 = metaObjects.length; _i4 < _len4; _i4++) {
      var metaObject = metaObjects[_i4];
      var type = metaObject.type;
      if (excludeTypesMap && excludeTypesMap[type]) {
        continue;
      }
      if (includeTypesMap && !includeTypesMap[type]) {
        continue;
      }
      if (metaObject.parent !== undefined && metaObject.parent !== null) {
        var metaObjectParent = metaObjectsMap[metaObject.parent];
        if (metaObject.type === metaObjectParent.type) {
          // Don't create redundant sub-objects
          continue;
        }
      }
      var propertySetIds = [];
      if (metaObject.propertySetIds) {
        for (var j = 0, lenj = metaObject.propertySetIds.length; j < lenj; j++) {
          var propertySetId = metaObject.propertySetIds[j];
          if (propertySetId !== undefined && propertySetId !== null && propertySetId !== "") {
            propertySetIds.push(propertySetId);
          }
        }
      }
      if (metaObject.propertySetId !== undefined && metaObject.propertySetId !== null && metaObject.propertySetId !== "") {
        propertySetIds.push(metaObject.propertySetId);
      }
      xktModel.createMetaObject({
        metaObjectId: metaObject.id,
        metaObjectType: metaObject.type,
        metaObjectName: metaObject.name,
        parentMetaObjectId: metaObject.parent,
        propertySetIds: propertySetIds.length > 0 ? propertySetIds : null
      });
      countMetaObjects++;
    }
    if (log) {
      log("Converted meta objects: " + countMetaObjects);
    }
    resolve();
  });
}


/***/ }),

/***/ "./src/parsers/parsePCDIntoXKTModel.js":
/*!*********************************************!*\
  !*** ./src/parsers/parsePCDIntoXKTModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parsePCDIntoXKTModel: () => (/* binding */ parsePCDIntoXKTModel)
/* harmony export */ });
/**
 * @desc Parses PCD point cloud data into an {@link XKTModel}.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load an LAZ point cloud model into it.
 *
 * ````javascript
 * utils.loadArraybuffer(""./models/pcd/ism_test_cat.pcd"", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     await parsePCDIntoXKTModel({
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
 * @param {ArrayBuffer} params.data PCD file data.
 * @param {Boolean} [params.littleEndian=true] Whether PCD binary data is Little-Endian or Big-Endian.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when PCD has been parsed.
 */
function parsePCDIntoXKTModel(_ref) {
  var data = _ref.data,
    xktModel = _ref.xktModel,
    _ref$littleEndian = _ref.littleEndian,
    littleEndian = _ref$littleEndian === void 0 ? true : _ref$littleEndian,
    stats = _ref.stats,
    log = _ref.log;
  if (log) {
    log("Using parser: parsePCDIntoXKTModel");
  }
  return new Promise(function (resolve, reject) {
    var textData = decodeText(new Uint8Array(data));
    var header = parseHeader(textData);
    var positions = [];
    var normals = [];
    var colors = [];
    if (header.data === 'ascii') {
      var offset = header.offset;
      var _data = textData.substr(header.headerLen);
      var lines = _data.split('\n');
      for (var i = 0, l = lines.length; i < l; i++) {
        if (lines[i] === '') {
          continue;
        }
        var line = lines[i].split(' ');
        if (offset.x !== undefined) {
          positions.push(parseFloat(line[offset.x]));
          positions.push(parseFloat(line[offset.y]));
          positions.push(parseFloat(line[offset.z]));
        }
        if (offset.rgb !== undefined) {
          var rgb = parseFloat(line[offset.rgb]);
          var r = rgb >> 16 & 0x0000ff;
          var g = rgb >> 8 & 0x0000ff;
          var b = rgb >> 0 & 0x0000ff;
          colors.push(r, g, b, 255);
        } else {
          colors.push(255);
          colors.push(255);
          colors.push(255);
        }
      }
    }
    if (header.data === 'binary_compressed') {
      var sizes = new Uint32Array(data.slice(header.headerLen, header.headerLen + 8));
      var compressedSize = sizes[0];
      var decompressedSize = sizes[1];
      var decompressed = decompressLZF(new Uint8Array(data, header.headerLen + 8, compressedSize), decompressedSize);
      var dataview = new DataView(decompressed.buffer);
      var _offset = header.offset;
      for (var _i = 0; _i < header.points; _i++) {
        if (_offset.x !== undefined) {
          positions.push(dataview.getFloat32(header.points * _offset.x + header.size[0] * _i, littleEndian));
          positions.push(dataview.getFloat32(header.points * _offset.y + header.size[1] * _i, littleEndian));
          positions.push(dataview.getFloat32(header.points * _offset.z + header.size[2] * _i, littleEndian));
        }
        if (_offset.rgb !== undefined) {
          colors.push(dataview.getUint8(header.points * _offset.rgb + header.size[3] * _i + 0));
          colors.push(dataview.getUint8(header.points * _offset.rgb + header.size[3] * _i + 1));
          colors.push(dataview.getUint8(header.points * _offset.rgb + header.size[3] * _i + 2));
          //    colors.push(255);
        } else {
          colors.push(1);
          colors.push(1);
          colors.push(1);
        }
      }
    }
    if (header.data === 'binary') {
      var _dataview = new DataView(data, header.headerLen);
      var _offset2 = header.offset;
      for (var _i2 = 0, row = 0; _i2 < header.points; _i2++, row += header.rowSize) {
        if (_offset2.x !== undefined) {
          positions.push(_dataview.getFloat32(row + _offset2.x, littleEndian));
          positions.push(_dataview.getFloat32(row + _offset2.y, littleEndian));
          positions.push(_dataview.getFloat32(row + _offset2.z, littleEndian));
        }
        if (_offset2.rgb !== undefined) {
          colors.push(_dataview.getUint8(row + _offset2.rgb + 2));
          colors.push(_dataview.getUint8(row + _offset2.rgb + 1));
          colors.push(_dataview.getUint8(row + _offset2.rgb + 0));
        } else {
          colors.push(255);
          colors.push(255);
          colors.push(255);
        }
      }
    }
    xktModel.createGeometry({
      geometryId: "pointsGeometry",
      primitiveType: "points",
      positions: positions,
      colors: colors && colors.length > 0 ? colors : null
    });
    xktModel.createMesh({
      meshId: "pointsMesh",
      geometryId: "pointsGeometry"
    });
    xktModel.createEntity({
      entityId: "geometries",
      meshIds: ["pointsMesh"]
    });
    if (log) {
      log("Converted drawable objects: 1");
      log("Converted geometries: 1");
      log("Converted vertices: " + positions.length / 3);
    }
    if (stats) {
      stats.sourceFormat = "PCD";
      stats.schemaVersion = "";
      stats.title = "";
      stats.author = "";
      stats.created = "";
      stats.numObjects = 1;
      stats.numGeometries = 1;
      stats.numVertices = positions.length / 3;
    }
    resolve();
  });
}
function parseHeader(data) {
  var header = {};
  var result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
  var result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.substr(result1 - 1));
  header.data = result2[1];
  header.headerLen = result2[0].length + result1;
  header.str = data.substr(0, header.headerLen);
  header.str = header.str.replace(/\#.*/gi, ''); // Strip comments
  header.version = /VERSION (.*)/i.exec(header.str); // Parse
  header.fields = /FIELDS (.*)/i.exec(header.str);
  header.size = /SIZE (.*)/i.exec(header.str);
  header.type = /TYPE (.*)/i.exec(header.str);
  header.count = /COUNT (.*)/i.exec(header.str);
  header.width = /WIDTH (.*)/i.exec(header.str);
  header.height = /HEIGHT (.*)/i.exec(header.str);
  header.viewpoint = /VIEWPOINT (.*)/i.exec(header.str);
  header.points = /POINTS (.*)/i.exec(header.str);
  if (header.version !== null) {
    header.version = parseFloat(header.version[1]);
  }
  if (header.fields !== null) {
    header.fields = header.fields[1].split(' ');
  }
  if (header.type !== null) {
    header.type = header.type[1].split(' ');
  }
  if (header.width !== null) {
    header.width = parseInt(header.width[1]);
  }
  if (header.height !== null) {
    header.height = parseInt(header.height[1]);
  }
  if (header.viewpoint !== null) {
    header.viewpoint = header.viewpoint[1];
  }
  if (header.points !== null) {
    header.points = parseInt(header.points[1], 10);
  }
  if (header.points === null) {
    header.points = header.width * header.height;
  }
  if (header.size !== null) {
    header.size = header.size[1].split(' ').map(function (x) {
      return parseInt(x, 10);
    });
  }
  if (header.count !== null) {
    header.count = header.count[1].split(' ').map(function (x) {
      return parseInt(x, 10);
    });
  } else {
    header.count = [];
    for (var i = 0, l = header.fields.length; i < l; i++) {
      header.count.push(1);
    }
  }
  header.offset = {};
  var sizeSum = 0;
  for (var _i3 = 0, _l = header.fields.length; _i3 < _l; _i3++) {
    if (header.data === 'ascii') {
      header.offset[header.fields[_i3]] = _i3;
    } else {
      header.offset[header.fields[_i3]] = sizeSum;
      sizeSum += header.size[_i3] * header.count[_i3];
    }
  }
  header.rowSize = sizeSum; // For binary only
  return header;
}
function decodeText(array) {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(array);
  }
  var s = '';
  for (var i = 0, il = array.length; i < il; i++) {
    s += String.fromCharCode(array[i]);
  }
  try {
    return decodeURIComponent(escape(s));
  } catch (e) {
    return s;
  }
}
function decompressLZF(inData, outLength) {
  // https://gitlab.com/taketwo/three-pcd-loader/blob/master/decompress-lzf.js
  var inLength = inData.length;
  var outData = new Uint8Array(outLength);
  var inPtr = 0;
  var outPtr = 0;
  var ctrl;
  var len;
  var ref;
  do {
    ctrl = inData[inPtr++];
    if (ctrl < 1 << 5) {
      ctrl++;
      if (outPtr + ctrl > outLength) throw new Error('Output buffer is not large enough');
      if (inPtr + ctrl > inLength) throw new Error('Invalid compressed data');
      do {
        outData[outPtr++] = inData[inPtr++];
      } while (--ctrl);
    } else {
      len = ctrl >> 5;
      ref = outPtr - ((ctrl & 0x1f) << 8) - 1;
      if (inPtr >= inLength) throw new Error('Invalid compressed data');
      if (len === 7) {
        len += inData[inPtr++];
        if (inPtr >= inLength) throw new Error('Invalid compressed data');
      }
      ref -= inData[inPtr++];
      if (outPtr + len + 2 > outLength) throw new Error('Output buffer is not large enough');
      if (ref < 0) throw new Error('Invalid compressed data');
      if (ref >= outPtr) throw new Error('Invalid compressed data');
      do {
        outData[outPtr++] = outData[ref++];
      } while (--len + 2);
    }
  } while (inPtr < inLength);
  return outData;
}


/***/ }),

/***/ "./src/parsers/parsePLYIntoXKTModel.js":
/*!*********************************************!*\
  !*** ./src/parsers/parsePLYIntoXKTModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parsePLYIntoXKTModel: () => (/* binding */ parsePLYIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/core */ "@loaders.gl/core");
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _loaders_gl_ply__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/ply */ "@loaders.gl/ply");
/* harmony import */ var _loaders_gl_ply__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_ply__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



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
 @returns {Promise} Resolves when PLY has been parsed.
 */
function parsePLYIntoXKTModel(_x) {
  return _parsePLYIntoXKTModel.apply(this, arguments);
}
function _parsePLYIntoXKTModel() {
  _parsePLYIntoXKTModel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
    var data, xktModel, stats, log, parsedData, attributes, hasColors, colorsValue, colorsCompressed, i, len;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          data = _ref.data, xktModel = _ref.xktModel, stats = _ref.stats, log = _ref.log;
          if (log) {
            log("Using parser: parsePLYIntoXKTModel");
          }
          if (data) {
            _context.next = 4;
            break;
          }
          throw "Argument expected: data";
        case 4:
          if (xktModel) {
            _context.next = 6;
            break;
          }
          throw "Argument expected: xktModel";
        case 6:
          _context.prev = 6;
          _context.next = 9;
          return (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_0__.parse)(data, _loaders_gl_ply__WEBPACK_IMPORTED_MODULE_1__.PLYLoader);
        case 9:
          parsedData = _context.sent;
          _context.next = 16;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](6);
          if (log) {
            log("Error: " + _context.t0);
          }
          return _context.abrupt("return");
        case 16:
          attributes = parsedData.attributes;
          hasColors = !!attributes.COLOR_0;
          if (hasColors) {
            colorsValue = hasColors ? attributes.COLOR_0.value : null;
            colorsCompressed = [];
            for (i = 0, len = colorsValue.length; i < len; i += 4) {
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
            color: !hasColors ? [1, 1, 1] : null
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
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 12]]);
  }));
  return _parsePLYIntoXKTModel.apply(this, arguments);
}


/***/ }),

/***/ "./src/parsers/parseSTLIntoXKTModel.js":
/*!*********************************************!*\
  !*** ./src/parsers/parseSTLIntoXKTModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseSTLIntoXKTModel: () => (/* binding */ parseSTLIntoXKTModel)
/* harmony export */ });
/* harmony import */ var _lib_faceToVertexNormals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/faceToVertexNormals.js */ "./src/lib/faceToVertexNormals.js");
/* harmony import */ var _lib_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/math.js */ "./src/lib/math.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



/**
 * @desc Parses STL file data into an {@link XKTModel}.
 *
 * * Supports binary and ASCII STL formats.
 * * Option to create a separate {@link XKTEntity} for each group of faces that share the same vertex colors.
 * * Option to smooth face-aligned normals loaded from STL.
 * * Option to reduce XKT file size by ignoring STL normals and relying on xeokit to auto-generate them.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load an STL model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("./models/stl/binary/spurGear.stl", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseSTLIntoXKTModel({data, xktModel});
 *
 *     xktModel.finalize();
 * });
 * ````
 *
 * @param {Object} params Parsing params.
 * @param {ArrayBuffer|String} [params.data] STL file data. Can be binary or string.
 * @param {Boolean} [params.autoNormals=false] When true, the parser will ignore the STL geometry normals, and the STL
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the STL.
 * Overrides ````smoothNormals```` when ````true````. This ignores the normals in the STL, and loads no
 * normals from the STL into the {@link XKTModel}, resulting in the XKT file storing no normals for the STL model. The
 * xeokit-sdk will then automatically generate the normals within its shaders. The disadvantages are that auto-normals
 * may slow rendering down a little bit, and that the normals can only be face-aligned (and thus rendered using flat
 * shading). The advantages, however, are a smaller XKT file size, and the ability to apply certain geometry optimizations
 * during parsing, such as removing duplicated STL vertex positions, that are not possible when normals are loaded
 * for the STL vertices.
 * @param {Boolean} [params.smoothNormals=true] When true, automatically converts face-oriented STL normals to vertex normals, for a smooth appearance. Ignored if ````autoNormals```` is ````true````.
 * @param {Number} [params.smoothNormalsAngleThreshold=20] This is the threshold angle between normals of adjacent triangles, below which their shared wireframe edge is not drawn.
 * @param {Boolean} [params.splitMeshes=true] When true, creates a separate {@link XKTEntity} for each group of faces that share the same vertex colors. Only works with binary STL (ie. when ````data```` is an ArrayBuffer).
 * @param {XKTModel} [params.xktModel] XKTModel to parse into.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when STL has been parsed.
 */
function parseSTLIntoXKTModel(_x) {
  return _parseSTLIntoXKTModel.apply(this, arguments);
}
function _parseSTLIntoXKTModel() {
  _parseSTLIntoXKTModel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
    var data, splitMeshes, autoNormals, smoothNormals, smoothNormalsAngleThreshold, xktModel, stats, log;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          data = _ref.data, splitMeshes = _ref.splitMeshes, autoNormals = _ref.autoNormals, smoothNormals = _ref.smoothNormals, smoothNormalsAngleThreshold = _ref.smoothNormalsAngleThreshold, xktModel = _ref.xktModel, stats = _ref.stats, log = _ref.log;
          if (log) {
            log("Using parser: parseSTLIntoXKTModel");
          }
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            if (!data) {
              reject("Argument expected: data");
              return;
            }
            if (!xktModel) {
              reject("Argument expected: xktModel");
              return;
            }
            var rootMetaObjectId = _lib_math_js__WEBPACK_IMPORTED_MODULE_1__.math.createUUID();
            var rootMetaObject = xktModel.createMetaObject({
              metaObjectId: rootMetaObjectId,
              metaObjectType: "Model",
              metaObjectName: "Model"
            });
            var ctx = {
              data: data,
              splitMeshes: splitMeshes,
              autoNormals: autoNormals,
              smoothNormals: smoothNormals,
              smoothNormalsAngleThreshold: smoothNormalsAngleThreshold,
              xktModel: xktModel,
              rootMetaObject: rootMetaObject,
              nextId: 0,
              log: log || function (msg) {},
              stats: {
                numObjects: 0,
                numGeometries: 0,
                numTriangles: 0,
                numVertices: 0
              }
            };
            var binData = ensureBinary(data);
            if (isBinary(binData)) {
              parseBinary(ctx, binData);
            } else {
              parseASCII(ctx, ensureString(data));
            }
            if (stats) {
              stats.sourceFormat = "STL";
              stats.schemaVersion = "";
              stats.title = "";
              stats.author = "";
              stats.created = "";
              stats.numMetaObjects = 2;
              stats.numPropertySets = 0;
              stats.numObjects = 1;
              stats.numGeometries = 1;
              stats.numTriangles = ctx.stats.numTriangles;
              stats.numVertices = ctx.stats.numVertices;
            }
            resolve();
          }));
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseSTLIntoXKTModel.apply(this, arguments);
}
function isBinary(data) {
  var reader = new DataView(data);
  var numFaces = reader.getUint32(80, true);
  var faceSize = 32 / 8 * 3 + 32 / 8 * 3 * 3 + 16 / 8;
  var numExpectedBytes = 80 + 32 / 8 + numFaces * faceSize;
  if (numExpectedBytes === reader.byteLength) {
    return true;
  }
  var solid = [115, 111, 108, 105, 100];
  for (var i = 0; i < 5; i++) {
    if (solid[i] !== reader.getUint8(i, false)) {
      return true;
    }
  }
  return false;
}
function parseBinary(ctx, data) {
  var reader = new DataView(data);
  var faces = reader.getUint32(80, true);
  var r;
  var g;
  var b;
  var hasColors = false;
  var colors;
  var defaultR;
  var defaultG;
  var defaultB;
  var lastR = null;
  var lastG = null;
  var lastB = null;
  var newMesh = false;
  var alpha;
  for (var index = 0; index < 80 - 10; index++) {
    if (reader.getUint32(index, false) === 0x434F4C4F /*COLO*/ && reader.getUint8(index + 4) === 0x52 /*'R'*/ && reader.getUint8(index + 5) === 0x3D /*'='*/) {
      hasColors = true;
      colors = [];
      defaultR = reader.getUint8(index + 6) / 255;
      defaultG = reader.getUint8(index + 7) / 255;
      defaultB = reader.getUint8(index + 8) / 255;
      alpha = reader.getUint8(index + 9) / 255;
    }
  }
  var dataOffset = 84;
  var faceLength = 12 * 4 + 2;
  var positions = [];
  var normals = [];
  var splitMeshes = ctx.splitMeshes;
  for (var face = 0; face < faces; face++) {
    var start = dataOffset + face * faceLength;
    var normalX = reader.getFloat32(start, true);
    var normalY = reader.getFloat32(start + 4, true);
    var normalZ = reader.getFloat32(start + 8, true);
    if (hasColors) {
      var packedColor = reader.getUint16(start + 48, true);
      if ((packedColor & 0x8000) === 0) {
        r = (packedColor & 0x1F) / 31;
        g = (packedColor >> 5 & 0x1F) / 31;
        b = (packedColor >> 10 & 0x1F) / 31;
      } else {
        r = defaultR;
        g = defaultG;
        b = defaultB;
      }
      if (splitMeshes && r !== lastR || g !== lastG || b !== lastB) {
        if (lastR !== null) {
          newMesh = true;
        }
        lastR = r;
        lastG = g;
        lastB = b;
      }
    }
    for (var i = 1; i <= 3; i++) {
      var vertexstart = start + i * 12;
      positions.push(reader.getFloat32(vertexstart, true));
      positions.push(reader.getFloat32(vertexstart + 4, true));
      positions.push(reader.getFloat32(vertexstart + 8, true));
      if (!ctx.autoNormals) {
        normals.push(normalX, normalY, normalZ);
      }
      if (hasColors) {
        colors.push(r, g, b, 1); // TODO: handle alpha
      }
    }

    if (splitMeshes && newMesh) {
      addMesh(ctx, positions, normals, colors);
      positions = [];
      normals = [];
      colors = colors ? [] : null;
      newMesh = false;
    }
  }
  if (positions.length > 0) {
    addMesh(ctx, positions, normals, colors);
  }
}
function parseASCII(ctx, data) {
  var faceRegex = /facet([\s\S]*?)endfacet/g;
  var faceCounter = 0;
  var floatRegex = /[\s]+([+-]?(?:\d+.\d+|\d+.|\d+|.\d+)(?:[eE][+-]?\d+)?)/.source;
  var vertexRegex = new RegExp('vertex' + floatRegex + floatRegex + floatRegex, 'g');
  var normalRegex = new RegExp('normal' + floatRegex + floatRegex + floatRegex, 'g');
  var positions = [];
  var normals = [];
  var colors = null;
  var normalx;
  var normaly;
  var normalz;
  var result;
  var verticesPerFace;
  var normalsPerFace;
  var text;
  while ((result = faceRegex.exec(data)) !== null) {
    verticesPerFace = 0;
    normalsPerFace = 0;
    text = result[0];
    while ((result = normalRegex.exec(text)) !== null) {
      normalx = parseFloat(result[1]);
      normaly = parseFloat(result[2]);
      normalz = parseFloat(result[3]);
      normalsPerFace++;
    }
    while ((result = vertexRegex.exec(text)) !== null) {
      positions.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
      normals.push(normalx, normaly, normalz);
      verticesPerFace++;
    }
    if (normalsPerFace !== 1) {
      ctx.log("Error in normal of face " + faceCounter);
      return -1;
    }
    if (verticesPerFace !== 3) {
      ctx.log("Error in positions of face " + faceCounter);
      return -1;
    }
    faceCounter++;
  }
  addMesh(ctx, positions, normals, colors);
}
var nextGeometryId = 0;
function addMesh(ctx, positions, normals, colors) {
  var indices = new Int32Array(positions.length / 3);
  for (var ni = 0, len = indices.length; ni < len; ni++) {
    indices[ni] = ni;
  }
  normals = normals && normals.length > 0 ? normals : null;
  colors = colors && colors.length > 0 ? colors : null;
  if (!ctx.autoNormals && ctx.smoothNormals) {
    (0,_lib_faceToVertexNormals_js__WEBPACK_IMPORTED_MODULE_0__.faceToVertexNormals)(positions, normals, {
      smoothNormalsAngleThreshold: ctx.smoothNormalsAngleThreshold
    });
  }
  var geometryId = "" + nextGeometryId++;
  var meshId = "" + nextGeometryId++;
  var entityId = "" + nextGeometryId++;
  ctx.xktModel.createGeometry({
    geometryId: geometryId,
    primitiveType: "triangles",
    positions: positions,
    normals: !ctx.autoNormals ? normals : null,
    colors: colors,
    indices: indices
  });
  ctx.xktModel.createMesh({
    meshId: meshId,
    geometryId: geometryId,
    color: colors ? null : [1, 1, 1],
    metallic: 0.9,
    roughness: 0.1
  });
  ctx.xktModel.createEntity({
    entityId: entityId,
    meshIds: [meshId]
  });
  ctx.xktModel.createMetaObject({
    metaObjectId: entityId,
    metaObjectType: "Default",
    metaObjectName: "STL Mesh",
    parentMetaObjectId: ctx.rootMetaObject.metaObjectId
  });
  ctx.stats.numGeometries++;
  ctx.stats.numObjects++;
  ctx.stats.numVertices += positions.length / 3;
  ctx.stats.numTriangles += indices.length / 3;
}
function ensureString(buffer) {
  if (typeof buffer !== 'string') {
    return decodeText(new Uint8Array(buffer));
  }
  return buffer;
}
function ensureBinary(buffer) {
  if (typeof buffer === 'string') {
    var arrayBuffer = new Uint8Array(buffer.length);
    for (var i = 0; i < buffer.length; i++) {
      arrayBuffer[i] = buffer.charCodeAt(i) & 0xff; // implicitly assumes little-endian
    }

    return arrayBuffer.buffer;
  } else {
    return buffer.buffer;
  }
}
function decodeText(array) {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(array);
  }
  var s = '';
  for (var i = 0, il = array.length; i < il; i++) {
    s += String.fromCharCode(array[i]); // Implicitly assumes little-endian.
  }

  return decodeURIComponent(escape(s));
}


/***/ }),

/***/ "@loaders.gl/core":
/*!***********************************!*\
  !*** external "@loaders.gl/core" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/core");

/***/ }),

/***/ "@loaders.gl/gltf":
/*!***********************************!*\
  !*** external "@loaders.gl/gltf" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/gltf");

/***/ }),

/***/ "@loaders.gl/images":
/*!*************************************!*\
  !*** external "@loaders.gl/images" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/images");

/***/ }),

/***/ "@loaders.gl/las":
/*!**********************************!*\
  !*** external "@loaders.gl/las" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/las");

/***/ }),

/***/ "@loaders.gl/ply":
/*!**********************************!*\
  !*** external "@loaders.gl/ply" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/ply");

/***/ }),

/***/ "@loaders.gl/polyfills":
/*!****************************************!*\
  !*** external "@loaders.gl/polyfills" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/polyfills");

/***/ }),

/***/ "@loaders.gl/textures":
/*!***************************************!*\
  !*** external "@loaders.gl/textures" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@loaders.gl/textures");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "pako":
/*!***********************!*\
  !*** external "pako" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("pako");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./index.dist.node.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClampToEdgeWrapping: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.ClampToEdgeWrapping),
/* harmony export */   GIFMediaType: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.GIFMediaType),
/* harmony export */   JPEGMediaType: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.JPEGMediaType),
/* harmony export */   LinearFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.LinearFilter),
/* harmony export */   LinearMipMapLinearFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.LinearMipMapLinearFilter),
/* harmony export */   LinearMipMapNearestFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.LinearMipMapNearestFilter),
/* harmony export */   LinearMipmapLinearFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.LinearMipmapLinearFilter),
/* harmony export */   LinearMipmapNearestFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.LinearMipmapNearestFilter),
/* harmony export */   MirroredRepeatWrapping: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.MirroredRepeatWrapping),
/* harmony export */   NearestFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.NearestFilter),
/* harmony export */   NearestMipMapLinearFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.NearestMipMapLinearFilter),
/* harmony export */   NearestMipMapNearestFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.NearestMipMapNearestFilter),
/* harmony export */   NearestMipmapLinearFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.NearestMipmapLinearFilter),
/* harmony export */   NearestMipmapNearestFilter: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.NearestMipmapNearestFilter),
/* harmony export */   PNGMediaType: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.PNGMediaType),
/* harmony export */   RepeatWrapping: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.RepeatWrapping),
/* harmony export */   XKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.XKTModel),
/* harmony export */   XKT_INFO: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.XKT_INFO),
/* harmony export */   buildBoxGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildBoxGeometry),
/* harmony export */   buildBoxLinesGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildBoxLinesGeometry),
/* harmony export */   buildCylinderGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildCylinderGeometry),
/* harmony export */   buildGridGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildGridGeometry),
/* harmony export */   buildPlaneGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildPlaneGeometry),
/* harmony export */   buildSphereGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildSphereGeometry),
/* harmony export */   buildTorusGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildTorusGeometry),
/* harmony export */   buildVectorTextGeometry: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.buildVectorTextGeometry),
/* harmony export */   convert2xkt: () => (/* reexport safe */ _src_convert2xkt_js__WEBPACK_IMPORTED_MODULE_3__.convert2xkt),
/* harmony export */   parseCityJSONIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseCityJSONIntoXKTModel),
/* harmony export */   parseGLTFIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseGLTFIntoXKTModel),
/* harmony export */   parseGLTFJSONIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseGLTFJSONIntoXKTModel),
/* harmony export */   parseIFCIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseIFCIntoXKTModel),
/* harmony export */   parseLASIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseLASIntoXKTModel),
/* harmony export */   parseMetaModelIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseMetaModelIntoXKTModel),
/* harmony export */   parsePCDIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parsePCDIntoXKTModel),
/* harmony export */   parsePLYIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parsePLYIntoXKTModel),
/* harmony export */   parseSTLIntoXKTModel: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.parseSTLIntoXKTModel),
/* harmony export */   writeXKTModelToArrayBuffer: () => (/* reexport safe */ _src_index_js__WEBPACK_IMPORTED_MODULE_2__.writeXKTModelToArrayBuffer)
/* harmony export */ });
/* harmony import */ var _loaders_gl_polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/polyfills */ "@loaders.gl/polyfills");
/* harmony import */ var _loaders_gl_polyfills__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_loaders_gl_polyfills__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:util */ "node:util");
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_util__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/index.js */ "./src/index.js");
/* harmony import */ var _src_convert2xkt_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/convert2xkt.js */ "./src/convert2xkt.js");


(0,_loaders_gl_polyfills__WEBPACK_IMPORTED_MODULE_0__.installFilePolyfills)();

global.TextEncoder = node_util__WEBPACK_IMPORTED_MODULE_1__.TextEncoder;
// Use the V8's TextEncoder impl., otherwise the @loaders.gl/polyfill's one gets used, which is failing (at Array::push) for large metadata


 // convert2xkt is only bundled for Node.js
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=xeokit-convert.cjs.js.map