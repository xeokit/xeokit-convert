/**
 * @desc Creates grid-shaped geometry arrays..
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a grid-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildGridGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const grid = buildGridGeometry({
 *      size: 1000,
 *      divisions: 500
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "gridGeometry",
 *      primitiveType: grid.primitiveType, // Will be "lines"
 *      positions: grid.positions,
 *      indices: grid.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redGridMesh",
 *      geometryId: "gridGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redGrid",
 *      meshIds: ["redGridMesh"]
 * });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildGridGeometry
 * @param {*} [cfg] Configs
 * @param {Number} [cfg.size=1] Dimension on the X and Z-axis.
 * @param {Number} [cfg.divisions=1] Number of divisions on X and Z axis..
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildGridGeometry(cfg = {}) {

    let size = cfg.size || 1;
    if (size < 0) {
        console.error("negative size not allowed - will invert");
        size *= -1;
    }

    let divisions = cfg.divisions || 1;
    if (divisions < 0) {
        console.error("negative divisions not allowed - will invert");
        divisions *= -1;
    }
    if (divisions < 1) {
        divisions = 1;
    }

    size = size || 10;
    divisions = divisions || 10;

    const step = size / divisions;
    const halfSize = size / 2;

    const positions = [];
    const indices = [];
    let l = 0;

    for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {

        positions.push(-halfSize);
        positions.push(0);
        positions.push(k);

        positions.push(halfSize);
        positions.push(0);
        positions.push(k);

        positions.push(k);
        positions.push(0);
        positions.push(-halfSize);

        positions.push(k);
        positions.push(0);
        positions.push(halfSize);

        indices.push(l++);
        indices.push(l++);
        indices.push(l++);
        indices.push(l++);
    }

    return {
        primitiveType: "lines",
        positions: positions,
        indices: indices
    };
}


export {buildGridGeometry};
