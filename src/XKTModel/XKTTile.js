/**
 * @desc A box-shaped 3D region within an {@link XKTModel} that contains {@link XKTEntity}s.
 *
 * * Created by {@link XKTModel#finalize}
 * * Stored in {@link XKTModel#tilesList}
 *
 * @class XKTTile
 */
class XKTTile {

    /**
     * Creates a new XKTTile.
     *
     * @private
     * @param aabb
     * @param entities
     */
    constructor(aabb, entities) {

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
    }
}

export {XKTTile};