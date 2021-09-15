/**
 * Represents the usage of a {@link XKTGeometry} by an {@link XKTEntity}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTEntity#meshes} and {@link XKTModel#meshesList}
 * * Specifies color and opacity
 *
 * @class XKTMesh
 */
class XKTMesh {

    /**
     * @private
     */
    constructor(cfg) {

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
         * @type {Uint8Array}
         */
        this.color = cfg.color || new Uint8Array(3);

        /**
         * PBR metallness of this XKTMesh.
         *
         * @type {Number}
         */
        this.metallic = (cfg.metallic !== null && cfg.metallic !== undefined) ? cfg.metallic : 0;

        /**
         * PBR roughness of this XKTMesh.
         *
         * @type {Number}
         */
        this.roughness = (cfg.roughness !== null && cfg.roughness !== undefined) ? cfg.roughness : 1;

        /**
         * Opacity of this XKTMesh.
         *
         * @type {Number}
         */
        this.opacity = (cfg.opacity !== undefined && cfg.opacity !== null) ? cfg.opacity : 1.0;

        /**
         * The owner {@link XKTEntity}.
         *
         * Set by {@link XKTModel#createEntity}.
         *
         * @type {XKTEntity}
         */
        this.entity = null; // Set after instantiation, when the Entity is known
    }
}

export {XKTMesh};