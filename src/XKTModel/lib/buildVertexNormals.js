import {math} from "./math.js";

/**
 * Builds vertex normal vectors from positions and indices.
 *
 * @private
 */
function buildVertexNormals(positions, indices, normals) {

    const a = math.vec3();
    const b = math.vec3();
    const c = math.vec3();
    const ab = math.vec3();
    const ac = math.vec3();
    const crossVec = math.vec3();
    const nvecs = new Array(positions.length / 3);

    for (let i = 0, len = indices.length; i < len; i += 3) {

        const j0 = indices[i];
        const j1 = indices[i + 1];
        const j2 = indices[i + 2];

        a[0] = positions[j0 * 3];
        a[1] = positions[j0 * 3 + 1];
        a[2] = positions[j0 * 3 + 2];

        b[0] = positions[j1 * 3];
        b[1] = positions[j1 * 3 + 1];
        b[2] = positions[j1 * 3 + 2];

        c[0] = positions[j2 * 3];
        c[1] = positions[j2 * 3 + 1];
        c[2] = positions[j2 * 3 + 2];

        math.subVec3(b, a, ab);
        math.subVec3(c, a, ac);

        const normVec = math.vec3();

        math.normalizeVec3(math.cross3Vec3(ab, ac, crossVec), normVec);

        if (!nvecs[j0]) {
            nvecs[j0] = [];
        }
        if (!nvecs[j1]) {
            nvecs[j1] = [];
        }
        if (!nvecs[j2]) {
            nvecs[j2] = [];
        }

        nvecs[j0].push(normVec);
        nvecs[j1].push(normVec);
        nvecs[j2].push(normVec);
    }

    normals = (normals && normals.length === positions.length) ? normals : new Float32Array(positions.length);

    for (let i = 0, len = nvecs.length; i < len; i++) {  // Now go through and average out everything

        const count = nvecs[i].length;

        let x = 0;
        let y = 0;
        let z = 0;

        for (let j = 0; j < count; j++) {
            x += nvecs[i][j][0];
            y += nvecs[i][j][1];
            z += nvecs[i][j][2];
        }

        normals[i * 3] = (x / count);
        normals[i * 3 + 1] = (y / count);
        normals[i * 3 + 2] = (z / count);
    }

    return normals;
}

export {buildVertexNormals};