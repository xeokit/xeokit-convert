/**
 * A texture shared by {@link XKTTextureSet}s.
 *
 * * Created by {@link XKTModel#createTexture}
 * * Stored in {@link XKTTextureSet#textures}, {@link XKTModel#textures} and {@link XKTModel#texturesList}
 *
 * @class XKTTexture
 */
import {RepeatWrapping, LinearMipMapNearestFilter} from "../constants.js";

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

        /**
         * Whether this XKTTexture is to be compressed.
         *
         * @type {Boolean}
         */
        this.compressed = (!!cfg.compressed);

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
        this.minFilter = cfg.minFilter || LinearMipMapNearestFilter;

        /**
         * How the texture is sampled when a texel covers more than one pixel. Supported values
         * are {@link LinearFilter} and {@link NearestFilter}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.magFilter = cfg.magFilter || LinearMipMapNearestFilter;

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
        this.wrapS = cfg.wrapS || RepeatWrapping;

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
        this.wrapT = cfg.wrapT || RepeatWrapping;

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
        this.wrapR = cfg.wrapR || RepeatWrapping
    }
}

export {XKTTexture};