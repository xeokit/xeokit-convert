/**
 * A texture shared by {@link XKTTextureSet}s.
 *
 * * Created by {@link XKTModel#createTexture}
 * * Stored in {@link XKTTextureSet#textures}, {@link XKTModel#textures} and {@link XKTModel#texturesList}
 *
 * @class XKTTexture
 */
class XKTTexture {

    /**
     * @private
     */
    constructor(cfg) {

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
         * Base64-encoded texture image data.
         *
         * @type {String}
         */
        this.imageData = cfg.imageData;

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
    }
}

export {XKTTexture};