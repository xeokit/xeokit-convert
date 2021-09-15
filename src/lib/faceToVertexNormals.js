import {math} from "./math.js";

/**
 * Converts surface-perpendicular face normals to vertex normals. Assumes that the mesh contains disjoint triangles
 * that don't share vertex array elements. Works by finding groups of vertices that have the same location and
 * averaging their normal vectors.
 *
 * @returns {{positions: Array, normals: *}}
 * @private
 */
function faceToVertexNormals(positions, normals, options = {}) {
    const smoothNormalsAngleThreshold = options.smoothNormalsAngleThreshold || 20;
    const vertexMap = {};
    const vertexNormals = [];
    const vertexNormalAccum = {};
    let acc;
    let vx;
    let vy;
    let vz;
    let key;
    const precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    const precision = 10 ** precisionPoints;
    let posi;
    let i;
    let j;
    let len;
    let a;
    let b;
    let c;

    for (i = 0, len = positions.length; i < len; i += 3) {

        posi = i / 3;

        vx = positions[i];
        vy = positions[i + 1];
        vz = positions[i + 2];

        key = `${Math.round(vx * precision)}_${Math.round(vy * precision)}_${Math.round(vz * precision)}`;

        if (vertexMap[key] === undefined) {
            vertexMap[key] = [posi];
        } else {
            vertexMap[key].push(posi);
        }

        const normal = math.normalizeVec3([normals[i], normals[i + 1], normals[i + 2]]);

        vertexNormals[posi] = normal;

        acc = math.vec4([normal[0], normal[1], normal[2], 1]);

        vertexNormalAccum[posi] = acc;
    }

    for (key in vertexMap) {

        if (vertexMap.hasOwnProperty(key)) {

            const vertices = vertexMap[key];
            const numVerts = vertices.length;

            for (i = 0; i < numVerts; i++) {

                const ii = vertices[i];

                acc = vertexNormalAccum[ii];

                for (j = 0; j < numVerts; j++) {

                    if (i === j) {
                        continue;
                    }

                    const jj = vertices[j];

                    a = vertexNormals[ii];
                    b = vertexNormals[jj];

                    const angle = Math.abs(math.angleVec3(a, b) / math.DEGTORAD);

                    if (angle < smoothNormalsAngleThreshold) {

                        acc[0] += b[0];
                        acc[1] += b[1];
                        acc[2] += b[2];
                        acc[3] += 1.0;
                    }
                }
            }
        }
    }

    for (i = 0, len = normals.length; i < len; i += 3) {

        acc = vertexNormalAccum[i / 3];

        normals[i + 0] = acc[0] / acc[3];
        normals[i + 1] = acc[1] / acc[3];
        normals[i + 2] = acc[2] / acc[3];

    }
}

export {faceToVertexNormals};