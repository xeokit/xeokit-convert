import {math} from '../lib/math.js';

/**
 * @desc Creates torus-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a torus-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildTorusGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const torus = buildTorusGeometry({
 *      center: [0,0,0],
 *      radius: 1.0,
 *      tube: 0.5,
 *      radialSegments: 32,
 *      tubeSegments: 24,
 *      arc: Math.PI * 2.0
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "torusGeometry",
 *      primitiveType: torus.primitiveType, // Will be "triangles"
 *      positions: torus.positions,
 *      normals: torus.normals,
 *      indices: torus.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redTorusMesh",
 *      geometryId: "torusGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 * const xktEntity = xktModel.createEntity({
 *      entityId: "redTorus",
 *      meshIds: ["redTorusMesh"]
 * });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildTorusGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center] 3D point indicating the center position.
 * @param {Number} [cfg.radius=1] The overall radius.
 * @param {Number} [cfg.tube=0.3] The tube radius.
 * @param {Number} [cfg.radialSegments=32] The number of radial segments.
 * @param {Number} [cfg.tubeSegments=24] The number of tubular segments.
 * @param {Number} [cfg.arc=Math.PI*0.5] The length of the arc in radians, where Math.PI*2 is a closed torus.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildTorusGeometry(cfg = {}) {

    let radius = cfg.radius || 1;
    if (radius < 0) {
        console.error("negative radius not allowed - will invert");
        radius *= -1;
    }
    radius *= 0.5;

    let tube = cfg.tube || 0.3;
    if (tube < 0) {
        console.error("negative tube not allowed - will invert");
        tube *= -1;
    }

    let radialSegments = cfg.radialSegments || 32;
    if (radialSegments < 0) {
        console.error("negative radialSegments not allowed - will invert");
        radialSegments *= -1;
    }
    if (radialSegments < 4) {
        radialSegments = 4;
    }

    let tubeSegments = cfg.tubeSegments || 24;
    if (tubeSegments < 0) {
        console.error("negative tubeSegments not allowed - will invert");
        tubeSegments *= -1;
    }
    if (tubeSegments < 4) {
        tubeSegments = 4;
    }

    let arc = cfg.arc || Math.PI * 2;
    if (arc < 0) {
        console.warn("negative arc not allowed - will invert");
        arc *= -1;
    }
    if (arc > 360) {
        arc = 360;
    }

    const center = cfg.center;
    let centerX = center ? center[0] : 0;
    let centerY = center ? center[1] : 0;
    const centerZ = center ? center[2] : 0;

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    let u;
    let v;
    let x;
    let y;
    let z;
    let vec;

    let i;
    let j;

    for (j = 0; j <= tubeSegments; j++) {
        for (i = 0; i <= radialSegments; i++) {

            u = i / radialSegments * arc;
            v = 0.785398 + (j / tubeSegments * Math.PI * 2);

            centerX = radius * Math.cos(u);
            centerY = radius * Math.sin(u);

            x = (radius + tube * Math.cos(v)) * Math.cos(u);
            y = (radius + tube * Math.cos(v)) * Math.sin(u);
            z = tube * Math.sin(v);

            positions.push(x + centerX);
            positions.push(y + centerY);
            positions.push(z + centerZ);

            uvs.push(1 - (i / radialSegments));
            uvs.push((j / tubeSegments));

            vec = math.normalizeVec3(math.subVec3([x, y, z], [centerX, centerY, centerZ], []), []);

            normals.push(vec[0]);
            normals.push(vec[1]);
            normals.push(vec[2]);
        }
    }

    let a;
    let b;
    let c;
    let d;

    for (j = 1; j <= tubeSegments; j++) {
        for (i = 1; i <= radialSegments; i++) {

            a = (radialSegments + 1) * j + i - 1;
            b = (radialSegments + 1) * (j - 1) + i - 1;
            c = (radialSegments + 1) * (j - 1) + i;
            d = (radialSegments + 1) * j + i;

            indices.push(a);
            indices.push(b);
            indices.push(c);

            indices.push(c);
            indices.push(d);
            indices.push(a);
        }
    }

    return {
        primitiveType: "triangles",
        positions: positions,
        normals: normals,
        uv: uvs,
        indices: indices
    };
}

export {buildTorusGeometry};
