import {math} from "./math.js";

/**
 * Builds face-aligned vertex normal vectors from positions and indices.
 *
 * @private
 */
function buildFaceNormals(positions, indices, normals) {

    const a = math.vec3();
    const b = math.vec3();
    const c = math.vec3();

    const normVec = math.vec3();

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

        triangleNormal(a,b,c, normVec);

        normals[j0 * 3 + 0] = normVec[0];
        normals[j0 * 3 + 1] = normVec[1];
        normals[j0 * 3 + 2] = normVec[2];

        normals[j1 * 3 + 0] = normVec[0];
        normals[j1 * 3 + 1] = normVec[1];
        normals[j1 * 3 + 2] = normVec[2];

        normals[j2 * 3 + 0] = normVec[0];
        normals[j2 * 3 + 1] = normVec[1];
        normals[j2 * 3 + 2] = normVec[2];
    }
}

function triangleNormal(a, b, c, normal = math.vec3()) {
    const p1x = b[0] - a[0];
    const p1y = b[1] - a[1];
    const p1z = b[2] - a[2];

    const p2x = c[0] - a[0];
    const p2y = c[1] - a[1];
    const p2z = c[2] - a[2];

    const p3x = p1y * p2z - p1z * p2y;
    const p3y = p1z * p2x - p1x * p2z;
    const p3z = p1x * p2y - p1y * p2x;

    const mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
    if (mag === 0) {
        normal[0] = 0;
        normal[1] = 0;
        normal[2] = 0;
    } else {
        normal[0] = p3x / mag;
        normal[1] = p3y / mag;
        normal[2] = p3z / mag;
    }

    return normal
}

export {buildFaceNormals};