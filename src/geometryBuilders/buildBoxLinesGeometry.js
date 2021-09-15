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
function buildBoxLinesGeometry(cfg = {}) {

    let xSize = cfg.xSize || 1;
    if (xSize < 0) {
        console.error("negative xSize not allowed - will invert");
        xSize *= -1;
    }

    let ySize = cfg.ySize || 1;
    if (ySize < 0) {
        console.error("negative ySize not allowed - will invert");
        ySize *= -1;
    }

    let zSize = cfg.zSize || 1;
    if (zSize < 0) {
        console.error("negative zSize not allowed - will invert");
        zSize *= -1;
    }

    const center = cfg.center;
    const centerX = center ? center[0] : 0;
    const centerY = center ? center[1] : 0;
    const centerZ = center ? center[2] : 0;

    const xmin = -xSize + centerX;
    const ymin = -ySize + centerY;
    const zmin = -zSize + centerZ;
    const xmax = xSize + centerX;
    const ymax = ySize + centerY;
    const zmax = zSize + centerZ;

    return {
        primitiveType: "lines",
        positions: [
            xmin, ymin, zmin,
            xmin, ymin, zmax,
            xmin, ymax, zmin,
            xmin, ymax, zmax,
            xmax, ymin, zmin,
            xmax, ymin, zmax,
            xmax, ymax, zmin,
            xmax, ymax, zmax
        ],
        indices: [
            0, 1,
            1, 3,
            3, 2,
            2, 0,
            4, 5,
            5, 7,
            7, 6,
            6, 4,
            0, 4,
            1, 5,
            2, 6,
            3, 7
        ]
    }
}

export {buildBoxLinesGeometry};
