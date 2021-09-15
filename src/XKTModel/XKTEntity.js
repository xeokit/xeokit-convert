import {math} from "../lib/math.js";

/**
 * An object within an {@link XKTModel}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTModel#entities} and {@link XKTModel#entitiesList}
 * * Has one or more {@link XKTMesh}s, each having an {@link XKTGeometry}
 *
 * @class XKTEntity
 */
class XKTEntity {

    /**
     * @private
     * @param entityId
     * @param meshes
     */
    constructor(entityId,  meshes) {

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
        this.aabb = math.AABB3();

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
    }
}

export {XKTEntity};