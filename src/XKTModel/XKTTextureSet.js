/**
 * A set of textures shared by {@link XKTMesh}es.
 *
 * * Created by {@link XKTModel#createTextureSet}
 * * Registered in {@link XKTMesh#material}, {@link XKTModel#materials} and {@link XKTModel#.textureSetsList}
 *
 * @class XKTMetalRoughMaterial
 */
class XKTTextureSet {

    /**
     * @private
     */
    constructor(cfg) {

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
    }
}

export {XKTTextureSet};