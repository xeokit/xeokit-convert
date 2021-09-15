/**
 * A kd-Tree node, used internally by {@link XKTModel}.
 *
 * @private
 */
class KDNode {

    /**
     * Create a KDNode with an axis-aligned 3D World-space boundary.
     */
    constructor(aabb) {

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
    }
}

export {KDNode};