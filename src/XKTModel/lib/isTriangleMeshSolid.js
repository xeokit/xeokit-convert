/**
 * Uses edge adjacency counts to identify if the given triangle mesh can be rendered with backface culling enabled.
 *
 * If all edges are connected to exactly two triangles, then the mesh will likely be a closed solid, and we can safely
 * render it with backface culling enabled.
 *
 * Otherwise, the mesh is a surface, and we must render it with backface culling disabled.
 *
 * @private
 */
const isTriangleMeshSolid = (indices, positions) => {

    let numPositions = 0;
    const positionToAdjustedIndex = {};
    const adjustedIndices = [];
    const edgeAdjCounts = {};

    for (let i = 0, len = indices.length; i < len; i++) {

        const index = indices[i];
        const x = positions[index * 3];
        const y = positions[index * 3 + 1];
        const z = positions[index * 3 + 2];
        const positionHash = ("" + x + "," + y + "," + z);

        let adjustedIndex = positionToAdjustedIndex[positionHash];

        if (adjustedIndex === undefined) {
            adjustedIndex = numPositions++;
        }

        adjustedIndices[i] = adjustedIndex;

        positionToAdjustedIndex[positionHash] = adjustedIndex;
    }

    for (let i = 0, len = adjustedIndices.length; i < len; i += 3) {

        const a = adjustedIndices[i];
        const b = adjustedIndices[i + 1];
        const c = adjustedIndices[i + 2];

        let a2 = a;
        let b2 = b;
        let c2 = c;

        if (a > b && a > c) {
            if (b > c) {
                a2 = a;
                b2 = b;
                c2 = c;
            } else {
                a2 = a;
                b2 = c;
                c2 = b;
            }
        } else if (b > a && b > c) {
            if (a > c) {
                a2 = b;
                b2 = a;
                c2 = c;
            } else {
                a2 = b;
                b2 = c;
                c2 = a;
            }
        } else if (c > a && c > b) {
            if (a > b) {
                a2 = c;
                b2 = a;
                c2 = b;
            } else {
                a2 = c;
                b2 = b;
                c2 = a;
            }
        }

        let edgeHash = "" + a2 + "-" + b2;
        let edgeAdjCount = edgeAdjCounts[edgeHash];
        edgeAdjCounts[edgeHash] = (edgeAdjCount === undefined) ? 1 : edgeAdjCount + 1;

        edgeHash = "" + b2 + "-" + c2;
        edgeAdjCount = edgeAdjCounts[edgeHash];
        edgeAdjCounts[edgeHash] = (edgeAdjCount === undefined) ? 1 : edgeAdjCount + 1;

        if (a2 > c2) {
            const temp = c2;
            c2 = a2;
            a2 = temp;
        }
        edgeHash = "" + c2 + "-" + a2;
        edgeAdjCount = edgeAdjCounts[edgeHash];
        edgeAdjCounts[edgeHash] = (edgeAdjCount === undefined) ? 1 : edgeAdjCount + 1;
    }

    for (let edgeHash in edgeAdjCounts) {
        if (edgeAdjCounts[edgeHash] !== 2) { // Surface
            return false;
        }
    }

    return true; // Watertight
};

export {isTriangleMeshSolid};