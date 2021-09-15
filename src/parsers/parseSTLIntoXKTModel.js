import {faceToVertexNormals} from "../lib/faceToVertexNormals.js";
import {math} from "../lib/math.js";

/**
 * @desc Parses STL file data into an {@link XKTModel}.
 *
 * * Supports binary and ASCII STL formats.
 * * Option to create a separate {@link XKTEntity} for each group of faces that share the same vertex colors.
 * * Option to smooth face-aligned normals loaded from STL.
 * * Option to reduce XKT file size by ignoring STL normals and relying on xeokit to auto-generate them.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load an STL model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("./models/stl/binary/spurGear.stl", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseSTLIntoXKTModel({data, xktModel});
 *
 *     xktModel.finalize();
 * });
 * ````
 *
 * @param {Object} params Parsing params.
 * @param {ArrayBuffer|String} [params.data] STL file data. Can be binary or string.
 * @param {Boolean} [params.autoNormals=false] When true, the parser will ignore the STL geometry normals, and the STL
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the STL.
 * Overrides ````smoothNormals```` when ````true````. This ignores the normals in the STL, and loads no
 * normals from the STL into the {@link XKTModel}, resulting in the XKT file storing no normals for the STL model. The
 * xeokit-sdk will then automatically generate the normals within its shaders. The disadvantages are that auto-normals
 * may slow rendering down a little bit, and that the normals can only be face-aligned (and thus rendered using flat
 * shading). The advantages, however, are a smaller XKT file size, and the ability to apply certain geometry optimizations
 * during parsing, such as removing duplicated STL vertex positions, that are not possible when normals are loaded
 * for the STL vertices.
 * @param {Boolean} [params.smoothNormals=true] When true, automatically converts face-oriented STL normals to vertex normals, for a smooth appearance. Ignored if ````autoNormals```` is ````true````.
 * @param {Number} [params.smoothNormalsAngleThreshold=20] This is the threshold angle between normals of adjacent triangles, below which their shared wireframe edge is not drawn.
 * @param {Boolean} [params.splitMeshes=true] When true, creates a separate {@link XKTEntity} for each group of faces that share the same vertex colors. Only works with binary STL (ie. when ````data```` is an ArrayBuffer).
 * @param {XKTModel} [params.xktModel] XKTModel to parse into.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
async function parseSTLIntoXKTModel({
                                        data,
                                        splitMeshes,
                                        autoNormals,
                                        smoothNormals,
                                        smoothNormalsAngleThreshold,
                                        xktModel,
                                        stats,
                                        log
                                    }) {

    return new Promise(function (resolve, reject) {

        if (!data) {
            reject("Argument expected: data");
            return;
        }

        if (!xktModel) {
            reject("Argument expected: xktModel");
            return;
        }

        const rootMetaObjectId = math.createUUID();

        const rootMetaObject = xktModel.createMetaObject({
            metaObjectId: rootMetaObjectId,
            metaObjectType: "Model",
            metaObjectName: "Model"
        });

        const ctx = {
            data,
            splitMeshes,
            autoNormals,
            smoothNormals,
            smoothNormalsAngleThreshold,
            xktModel,
            rootMetaObject,
            nextId: 0,
            log: (log || function (msg) {
            }),
            stats: {
                numObjects: 0,
                numGeometries: 0,
                numTriangles: 0,
                numVertices: 0
            }
        };

        const binData = ensureBinary(data);

        if (isBinary(binData)) {
            parseBinary(ctx, binData);
        } else {
            parseASCII(ctx, ensureString(data));
        }

        if (stats) {
            stats.sourceFormat = "STL";
            stats.schemaVersion = "";
            stats.title = "";
            stats.author = "";
            stats.created = "";
            stats.numMetaObjects = 2;
            stats.numPropertySets = 0;
            stats.numObjects = 1;
            stats.numGeometries = 1;
            stats.numTriangles = ctx.stats.numTriangles;
            stats.numVertices = ctx.stats.numVertices;
        }

        resolve();
    });
}

function isBinary(data) {
    const reader = new DataView(data);
    const numFaces = reader.getUint32(80, true);
    const faceSize = (32 / 8 * 3) + ((32 / 8 * 3) * 3) + (16 / 8);
    const numExpectedBytes = 80 + (32 / 8) + (numFaces * faceSize);
    if (numExpectedBytes === reader.byteLength) {
        return true;
    }
    const solid = [115, 111, 108, 105, 100];
    for (let i = 0; i < 5; i++) {
        if (solid[i] !== reader.getUint8(i, false)) {
            return true;
        }
    }
    return false;
}

function parseBinary(ctx, data) {
    const reader = new DataView(data);
    const faces = reader.getUint32(80, true);
    let r;
    let g;
    let b;
    let hasColors = false;
    let colors;
    let defaultR;
    let defaultG;
    let defaultB;
    let lastR = null;
    let lastG = null;
    let lastB = null;
    let newMesh = false;
    let alpha;
    for (let index = 0; index < 80 - 10; index++) {
        if ((reader.getUint32(index, false) === 0x434F4C4F /*COLO*/) &&
            (reader.getUint8(index + 4) === 0x52 /*'R'*/) &&
            (reader.getUint8(index + 5) === 0x3D /*'='*/)) {
            hasColors = true;
            colors = [];
            defaultR = reader.getUint8(index + 6) / 255;
            defaultG = reader.getUint8(index + 7) / 255;
            defaultB = reader.getUint8(index + 8) / 255;
            alpha = reader.getUint8(index + 9) / 255;
        }
    }
    let dataOffset = 84;
    let faceLength = 12 * 4 + 2;
    let positions = [];
    let normals = [];
    let splitMeshes = ctx.splitMeshes;
    for (let face = 0; face < faces; face++) {
        let start = dataOffset + face * faceLength;
        let normalX = reader.getFloat32(start, true);
        let normalY = reader.getFloat32(start + 4, true);
        let normalZ = reader.getFloat32(start + 8, true);
        if (hasColors) {
            let packedColor = reader.getUint16(start + 48, true);
            if ((packedColor & 0x8000) === 0) {
                r = (packedColor & 0x1F) / 31;
                g = ((packedColor >> 5) & 0x1F) / 31;
                b = ((packedColor >> 10) & 0x1F) / 31;
            } else {
                r = defaultR;
                g = defaultG;
                b = defaultB;
            }
            if (splitMeshes && r !== lastR || g !== lastG || b !== lastB) {
                if (lastR !== null) {
                    newMesh = true;
                }
                lastR = r;
                lastG = g;
                lastB = b;
            }
        }
        for (let i = 1; i <= 3; i++) {
            let vertexstart = start + i * 12;
            positions.push(reader.getFloat32(vertexstart, true));
            positions.push(reader.getFloat32(vertexstart + 4, true));
            positions.push(reader.getFloat32(vertexstart + 8, true));
            if (!ctx.autoNormals) {
                normals.push(normalX, normalY, normalZ);
            }
            if (hasColors) {
                colors.push(r, g, b, 1); // TODO: handle alpha
            }
        }
        if (splitMeshes && newMesh) {
            addMesh(ctx, positions, normals, colors);
            positions = [];
            normals = [];
            colors = colors ? [] : null;
            newMesh = false;
        }
    }
    if (positions.length > 0) {
        addMesh(ctx, positions, normals, colors);
    }
}

function parseASCII(ctx, data) {
    const faceRegex = /facet([\s\S]*?)endfacet/g;
    let faceCounter = 0;
    const floatRegex = /[\s]+([+-]?(?:\d+.\d+|\d+.|\d+|.\d+)(?:[eE][+-]?\d+)?)/.source;
    const vertexRegex = new RegExp('vertex' + floatRegex + floatRegex + floatRegex, 'g');
    const normalRegex = new RegExp('normal' + floatRegex + floatRegex + floatRegex, 'g');
    const positions = [];
    const normals = [];
    const colors = null;
    let normalx;
    let normaly;
    let normalz;
    let result;
    let verticesPerFace;
    let normalsPerFace;
    let text;
    while ((result = faceRegex.exec(data)) !== null) {
        verticesPerFace = 0;
        normalsPerFace = 0;
        text = result[0];
        while ((result = normalRegex.exec(text)) !== null) {
            normalx = parseFloat(result[1]);
            normaly = parseFloat(result[2]);
            normalz = parseFloat(result[3]);
            normalsPerFace++;
        }
        while ((result = vertexRegex.exec(text)) !== null) {
            positions.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
            normals.push(normalx, normaly, normalz);
            verticesPerFace++;
        }
        if (normalsPerFace !== 1) {
            ctx.log("Error in normal of face " + faceCounter);
            return -1;
        }
        if (verticesPerFace !== 3) {
            ctx.log("Error in positions of face " + faceCounter);
            return -1;
        }
        faceCounter++;
    }
    addMesh(ctx, positions, normals, colors);
}

let nextGeometryId = 0;

function addMesh(ctx, positions, normals, colors) {

    const indices = new Int32Array(positions.length / 3);
    for (let ni = 0, len = indices.length; ni < len; ni++) {
        indices[ni] = ni;
    }

    normals = normals && normals.length > 0 ? normals : null;
    colors = colors && colors.length > 0 ? colors : null;

    if (!ctx.autoNormals && ctx.smoothNormals) {
        faceToVertexNormals(positions, normals, {smoothNormalsAngleThreshold: ctx.smoothNormalsAngleThreshold});
    }

    const geometryId = "" + nextGeometryId++;
    const meshId = "" + nextGeometryId++;
    const entityId = "" + nextGeometryId++;

    ctx.xktModel.createGeometry({
        geometryId: geometryId,
        primitiveType: "triangles",
        positions: positions,
        normals: (!ctx.autoNormals) ? normals : null,
        colors: colors,
        indices: indices
    });

    ctx.xktModel.createMesh({
        meshId: meshId,
        geometryId: geometryId,
        color: colors ? null : [1, 1, 1],
        metallic: 0.9,
        roughness: 0.1
    });

    ctx.xktModel.createEntity({
        entityId: entityId,
        meshIds: [meshId]
    });

    ctx.xktModel.createMetaObject({
        metaObjectId: entityId,
        metaObjectType: "Default",
        metaObjectName: "STL Mesh",
        parentMetaObjectId: ctx.rootMetaObject.metaObjectId
    });

    ctx.stats.numGeometries++;
    ctx.stats.numObjects++;
    ctx.stats.numVertices += positions.length / 3;
    ctx.stats.numTriangles += indices.length / 3;
}

function ensureString(buffer) {
    if (typeof buffer !== 'string') {
        return decodeText(new Uint8Array(buffer));
    }
    return buffer;
}

function ensureBinary(buffer) {
    if (typeof buffer === 'string') {
        const arrayBuffer = new Uint8Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            arrayBuffer[i] = buffer.charCodeAt(i) & 0xff; // implicitly assumes little-endian
        }
        return arrayBuffer.buffer || arrayBuffer;
    } else {
        return buffer;
    }
}

function decodeText(array) {
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder().decode(array);
    }
    let s = '';
    for (let i = 0, il = array.length; i < il; i++) {
        s += String.fromCharCode(array[i]); // Implicitly assumes little-endian.
    }
    return decodeURIComponent(escape(s));
}

export {parseSTLIntoXKTModel};
