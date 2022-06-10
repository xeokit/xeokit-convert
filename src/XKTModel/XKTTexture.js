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
    }
}

export {XKTTexture};