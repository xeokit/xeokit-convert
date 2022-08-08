/*----------------------------------------------------------------------------------------------------------------------
 * NOTE: The values of these constants must match those within xeokit-sdk
 *--------------------------------------------------------------------------------------------------------------------*/

/**
 * Texture wrapping mode in which the texture repeats to infinity.
 */
export const RepeatWrapping = 1000;

/**
 * Texture wrapping mode in which the last pixel of the texture stretches to the edge of the mesh.
 */
export const ClampToEdgeWrapping = 1001;

/**
 * Texture wrapping mode in which the texture repeats to infinity, mirroring on each repeat.
 */
export const MirroredRepeatWrapping = 1002;

/**
 * Texture magnification and minification filter that returns the nearest texel to the given sample coordinates.
 */
export const NearestFilter = 1003;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and returns the nearest texel to the given sample coordinates.
 */
export const NearestMipMapNearestFilter = 1004;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured
 * and returns the nearest texel to the given sample coordinates.
 */
export const NearestMipmapNearestFilter = 1004;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured
 * and returns the nearest texel to the center of the pixel at the given sample coordinates.
 */
export const NearestMipmapLinearFilter = 1005;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured
 * and returns the nearest texel to the center of the pixel at the given sample coordinates.
 */
export const NearestMipMapLinearFilter = 1005;

/**
 * Texture magnification and minification filter that returns the weighted average of the four nearest texels to the given sample coordinates.
 */
export const LinearFilter = 1006;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and
 * returns the weighted average of the four nearest texels to the given sample coordinates.
 */
export const LinearMipmapNearestFilter = 1007;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and
 * returns the weighted average of the four nearest texels to the given sample coordinates.
 */
export const LinearMipMapNearestFilter = 1007;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured,
 * finds within each mipmap the weighted average of the nearest texel to the center of the pixel, then returns the
 * weighted average of those two values.
 */
export const LinearMipmapLinearFilter = 1008;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured,
 * finds within each mipmap the weighted average of the nearest texel to the center of the pixel, then returns the
 * weighted average of those two values.
 */
export const LinearMipMapLinearFilter = 1008;

/**
 * Media type for GIF images.
 */
export const GIFMediaType = 10000;

/**
 * Media type for JPEG images.
 */
export const JPEGMediaType = 10001;

/**
 * Media type for PNG images.
 */
export const PNGMediaType = 10002;