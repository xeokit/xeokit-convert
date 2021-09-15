import {math} from "../../lib/math.js";

function quantizePositions (positions, lenPositions, aabb, quantizedPositions) {
    const xmin = aabb[0];
    const ymin = aabb[1];
    const zmin = aabb[2];
    const xwid = aabb[3] - xmin;
    const ywid = aabb[4] - ymin;
    const zwid = aabb[5] - zmin;
    const maxInt = 65535;
    const xMultiplier = maxInt / xwid;
    const yMultiplier = maxInt / ywid;
    const zMultiplier = maxInt / zwid;
    const verify = (num) => num >= 0 ? num : 0;
    for (let i = 0; i < lenPositions; i += 3) {
        quantizedPositions[i + 0] = Math.floor(verify(positions[i + 0] - xmin) * xMultiplier);
        quantizedPositions[i + 1] = Math.floor(verify(positions[i + 1] - ymin) * yMultiplier);
        quantizedPositions[i + 2] = Math.floor(verify(positions[i + 2] - zmin) * zMultiplier);
    }
}

var createPositionsDecodeMatrix = (function () {
    const translate = math.mat4();
    const scale = math.mat4();
    return function (aabb, positionsDecodeMatrix) {
        positionsDecodeMatrix = positionsDecodeMatrix || math.mat4();
        const xmin = aabb[0];
        const ymin = aabb[1];
        const zmin = aabb[2];
        const xwid = aabb[3] - xmin;
        const ywid = aabb[4] - ymin;
        const zwid = aabb[5] - zmin;
        const maxInt = 65535;
        math.identityMat4(translate);
        math.translationMat4v(aabb, translate);
        math.identityMat4(scale);
        math.scalingMat4v([xwid / maxInt, ywid / maxInt, zwid / maxInt], scale);
        math.mulMat4(translate, scale, positionsDecodeMatrix);
        return positionsDecodeMatrix;
    };
})();

function transformAndOctEncodeNormals(modelNormalMatrix, normals, lenNormals, compressedNormals, lenCompressedNormals) {
    // http://jcgt.org/published/0003/02/01/
    let oct, dec, best, currentCos, bestCos;
    let i, ei;
    let localNormal = math.vec3();
    let worldNormal =  math.vec3();
    for (i = 0; i < lenNormals; i += 3) {
        localNormal[0] = normals[i];
        localNormal[1] = normals[i + 1];
        localNormal[2] = normals[i + 2];

        math.transformVec3(modelNormalMatrix, localNormal, worldNormal);
        math.normalizeVec3(worldNormal, worldNormal);

        // Test various combinations of ceil and floor to minimize rounding errors
        best = oct = octEncodeVec3(worldNormal, 0, "floor", "floor");
        dec = octDecodeVec2(oct);
        currentCos = bestCos = dot(worldNormal, 0, dec);
        oct = octEncodeVec3(worldNormal, 0, "ceil", "floor");
        dec = octDecodeVec2(oct);
        currentCos = dot(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(worldNormal, 0, "floor", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(worldNormal, 0, "ceil", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        compressedNormals[lenCompressedNormals + i + 0] = best[0];
        compressedNormals[lenCompressedNormals + i + 1] = best[1];
        compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
    }
    lenCompressedNormals += lenNormals;
    return lenCompressedNormals;
}

function octEncodeNormals(normals, lenNormals, compressedNormals, lenCompressedNormals) { // http://jcgt.org/published/0003/02/01/
    let oct, dec, best, currentCos, bestCos;
    for (let i = 0; i < lenNormals; i += 3) {
        // Test various combinations of ceil and floor to minimize rounding errors
        best = oct = octEncodeVec3(normals, i, "floor", "floor");
        dec = octDecodeVec2(oct);
        currentCos = bestCos = dot(normals, i, dec);
        oct = octEncodeVec3(normals, i, "ceil", "floor");
        dec = octDecodeVec2(oct);
        currentCos = dot(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(normals, i, "floor", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(normals, i, "ceil", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        compressedNormals[lenCompressedNormals + i + 0] = best[0];
        compressedNormals[lenCompressedNormals + i + 1] = best[1];
        compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
    }
    lenCompressedNormals += lenNormals;
    return lenCompressedNormals;
}

/**
 * @private
 */
function octEncodeVec3(array, i, xfunc, yfunc) { // Oct-encode single normal vector in 2 bytes
    let x = array[i] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
    let y = array[i + 1] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
    if (array[i + 2] < 0) {
        let tempx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
        let tempy = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
        x = tempx;
        y = tempy;
    }
    return new Int8Array([
        Math[xfunc](x * 127.5 + (x < 0 ? -1 : 0)),
        Math[yfunc](y * 127.5 + (y < 0 ? -1 : 0))
    ]);
}

/**
 * Decode an oct-encoded normal
 */
function octDecodeVec2(oct) {
    let x = oct[0];
    let y = oct[1];
    x /= x < 0 ? 127 : 128;
    y /= y < 0 ? 127 : 128;
    const z = 1 - Math.abs(x) - Math.abs(y);
    if (z < 0) {
        x = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
        y = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
    }
    const length = Math.sqrt(x * x + y * y + z * z);
    return [
        x / length,
        y / length,
        z / length
    ];
}

/**
 * Dot product of a normal in an array against a candidate decoding
 * @private
 */
function dot(array, i, vec3) {
    return array[i] * vec3[0] + array[i + 1] * vec3[1] + array[i + 2] * vec3[2];
}

/**
 * @private
 */
const geometryCompression = {
    quantizePositions,
    createPositionsDecodeMatrix,
    transformAndOctEncodeNormals,
    octEncodeNormals,
};

export {geometryCompression}