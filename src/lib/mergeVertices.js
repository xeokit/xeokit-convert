/**
 * Given geometry defined as an array of positions, optional normals, option uv and an array of indices, returns
 * modified arrays that have duplicate vertices removed.
 *
 * @private
 */
function mergeVertices(positions, indices, mergedPositions, mergedIndices) {
    const positionsMap = {};
    const indicesLookup = [];
    const precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    const precision = 10 ** precisionPoints;
    let uvi = 0;
    for (let i = 0, len = positions.length; i < len; i += 3) {
        const vx = positions[i];
        const vy = positions[i + 1];
        const vz = positions[i + 2];
        const key = `${Math.round(vx * precision)}_${Math.round(vy * precision)}_${Math.round(vz * precision)}`;
        if (positionsMap[key] === undefined) {
            positionsMap[key] = mergedPositions.length / 3;
            mergedPositions.push(vx);
            mergedPositions.push(vy);
            mergedPositions.push(vz);
        }
        indicesLookup[i / 3] = positionsMap[key];
        uvi += 2;
    }
    for (let i = 0, len = indices.length; i < len; i++) {
        mergedIndices[i] = indicesLookup[indices[i]];
    }
}

export {mergeVertices};