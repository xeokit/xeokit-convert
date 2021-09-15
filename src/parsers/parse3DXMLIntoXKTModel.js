import {ZIPArchive} from "./ZIPArchive.js";
import {math} from "../lib/math.js";

const supportedSchemas = ["4.2"];

/**
 * @desc Loads 3DXML into an {@link XKTModel}.
 *
 * Supports 3DXML Schema 4.2.
 *
 * @param {Object} params Parsing parameters.
 * @param {ArrayBuffer} params.data 3DXML BLOB data.
 * @param {DOMParser} params.domParser A DOMParser implementation (eg. ````xmldom````), required when
 * we're not running in a browser and ````window.DOMParser```` is not available.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Boolean} [params.autoNormals=false] When true, the parser will ignore the 3DXML geometry normals, and the 3DXML
 * data will rely on the xeokit ````Viewer```` to automatically generate them. This has the limitation that the
 * normals will be face-aligned, and therefore the ````Viewer```` will only be able to render a flat-shaded representation
 * of the 3DXML model. This is ````false```` by default because CAD models tend to prefer smooth shading.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 */
function parse3DXMLIntoXKTModel({data, domParser, xktModel, autoNormals = false, stats = {}, log}) {

    return new Promise(function (resolve, reject) {

        const isBrowser = (typeof window !== 'undefined');

        if (isBrowser) {
            domParser = new DOMParser();

        } else if (!domParser) {
            reject("Config expected: domParser (needed when running in node.js)");
            return;
        }

        if (!data) {
            reject("Config expected: data");
            return;
        }

        if (!xktModel) {
            reject("Config expected: xktModel");
            return;
        }

        const zipArchive = new ZIPArchive(domParser);

        zipArchive.init(data).then(() => {

            const rootMetaObjectId = math.createUUID();

            xktModel.createMetaObject({
                metaObjectId: rootMetaObjectId,
                metaObjectType: "Model",
                metaObjectName: "Model"
            });

            const modelMetaObjectId = math.createUUID();

            xktModel.createMetaObject({
                metaObjectId: modelMetaObjectId,
                metaObjectType: "3DXML",
                metaObjectName: "3DXML",
                parentMetaObjectId: rootMetaObjectId
            });

            const ctx = {
                rootMetaObjectId: modelMetaObjectId,
                zipArchive: zipArchive,
                edgeThreshold: 10,
                xktModel: xktModel,
                autoNormals: autoNormals,
                info: {
                    references: {}
                },
                log: (msg) => {
                    if (log) {
                        log(msg);
                    }
                },
                warn: (msg) => {
                    if (log) {
                        log("Warning: " + msg);
                    }
                },
                error: (msg) => {
                    if (log) {
                        log("Error: " + msg);
                    }
                },
                nextId: 0,
                materials: {},
                stats: {
                    numObjects: 0,
                    numGeometries: 0,
                    numTriangles: 0,
                    numVertices: 0,

                    sourceFormat: "3DXML",
                    schemaVersion: "",
                    title: "",
                    author: "",
                    created: ""
                }
            };

            parseDocument(ctx).then(() => {
                ctx.log("Converted drawable objects: " + ctx.stats.numObjects);
                ctx.log("Converted geometries: " + ctx.stats.numGeometries);
                ctx.log("Converted triangles: " + ctx.stats.numTriangles);
                ctx.log("Converted vertices: " + ctx.stats.numVertices);

                if (stats) {
                    stats.numTriangles = ctx.stats.numTriangles;
                    stats.numVertices = ctx.stats.numVertices;
                    stats.numObjects = ctx.stats.numObjects;
                    stats.numGeometries = ctx.stats.numGeometries;
                }

                resolve();
            });


        }, (errMsg) => {
            reject(errMsg);
        });
    });
}

async function parseDocument(ctx) {
    const files = await ctx.zipArchive.getFile("Manifest.xml");
    const node = files.json;
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Manifest":
                await parseManifest(ctx, child);
                break;
        }
    }
}

async function parseManifest(ctx, manifest) {
    const children = manifest.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Root":
                const rootFileSrc = child.children[0];
                const files = await ctx.zipArchive.getFile(rootFileSrc);
                const json = files.json;
                await parseRoot(ctx, json);
                break;
        }
    }
}

async function parseRoot(ctx, node) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Model_3dxml":
                await parseModel(ctx, child);
                break;
        }
    }
}

async function parseModel(ctx, node) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Header":
                parseHeader(ctx, child);
                break;
            case "ProductStructure":
                await parseProductStructure(ctx, child);
                break;
            case "DefaultView":
                parseDefaultView(ctx, child);
                break;
        }
    }
}

function parseHeader(ctx, node) {
    const children = node.children;
    const metaData = {};
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "SchemaVersion":
                ctx.stats.schemaVersion = child.children[0];
                if (!isSchemaVersionSupported(ctx, ctx.stats.schemaVersion)) {
                    ctx.error("3DXML schema version not supported: " + ctx.stats.schemaVersion + " - supported versions are: " + supportedSchemas.join(","));
                } else {
                    ctx.log("Parsing 3DXML schema version: " + ctx.stats.schemaVersion);
                }
                break;
            case "Title":
                ctx.stats.title = child.children[0];
                break;
            case "Author":
                ctx.stats.author = child.children[0];
                break;
            case "Created":
                ctx.stats.created = child.children[0];
                break;
        }
    }
}

function isSchemaVersionSupported(ctx, schemaVersion) {
    for (let i = 0, len = supportedSchemas.length; i < len; i++) {
        if (schemaVersion === supportedSchemas[i]) {
            return true;
        }
    }
    return false;
}

async function parseProductStructure(ctx, productStructureNode) {

    const referenceReps = await parseReferenceReps(ctx, productStructureNode);

    // Parse out an intermediate scene DAG representation, that we can then
    // recursive descend through to build the XKTModel.

    const children = productStructureNode.children;

    const reference3Ds = {};
    const instanceReps = {};
    const instance3Ds = {};

    // Map all the elements

    for (let i = 0, len = children.length; i < len; i++) {

        const child = children[i];

        let isAggregatedBy;
        let isInstanceOf;
        let relativeMatrix;

        switch (child.type) {
            case "Reference3D":
                reference3Ds[child.id] = {
                    type: "Reference3D",
                    id: child.id,
                    name: child.name,
                    instance3Ds: {},
                    instanceReps: {}
                };
                break;

            case "InstanceRep":
                for (let j = 0, lenj = child.children.length; j < lenj; j++) {
                    const child2 = child.children[j];
                    switch (child2.type) {
                        case "IsAggregatedBy":
                            isAggregatedBy = child2.children[0];
                            break;
                        case "IsInstanceOf":
                            isInstanceOf = child2.children[0];
                            break;
                    }
                }
                instanceReps[child.id] = {
                    type: "InstanceRep",
                    id: child.id,
                    name: child.name,
                    isAggregatedBy: isAggregatedBy,
                    isInstanceOf: isInstanceOf,
                    referenceReps: {}
                };
                break;

            case "Instance3D":
                for (let j = 0, lenj = child.children.length; j < lenj; j++) {
                    const child2 = child.children[j];
                    switch (child2.type) {
                        case "IsAggregatedBy":
                            isAggregatedBy = child2.children[0];
                            break;
                        case "IsInstanceOf":
                            isInstanceOf = child2.children[0];
                            break;
                        case "RelativeMatrix":
                            relativeMatrix = child2.children[0];
                            break;
                    }
                }
                instance3Ds[child.id] = {
                    type: "Instance3D",
                    id: child.id,
                    name: child.name,
                    isAggregatedBy: isAggregatedBy,
                    isInstanceOf: isInstanceOf,
                    relativeMatrix: relativeMatrix,
                    reference3Ds: {}
                };
                break;
        }
    }

    // Connect Reference3Ds to the Instance3Ds they aggregate

    for (let id in instance3Ds) {
        const instance3D = instance3Ds[id];
        const reference3D = reference3Ds[instance3D.isAggregatedBy];
        if (reference3D) {
            reference3D.instance3Ds[instance3D.id] = instance3D;
        } else {
        }
    }

    // Connect Instance3Ds to the Reference3Ds they instantiate

    for (let id in instance3Ds) {
        const instance3D = instance3Ds[id];
        const reference3D = reference3Ds[instance3D.isInstanceOf];
        instance3D.reference3Ds[reference3D.id] = reference3D;
        reference3D.instance3D = instance3D;
    }

    // Connect InstanceReps to the ReferenceReps they instantiate

    for (let id in instanceReps) {
        const instanceRep = instanceReps[id];
        const referenceRep = referenceReps[instanceRep.isInstanceOf];
        if (referenceRep) {
            instanceRep.referenceReps[referenceRep.id] = referenceRep;
        }
    }

    // Connect Reference3Ds to the InstanceReps they aggregate

    for (let id in instanceReps) {
        const instanceRep = instanceReps[id];
        const reference3D = reference3Ds[instanceRep.isAggregatedBy];
        if (reference3D) {
            reference3D.instanceReps[instanceRep.id] = instanceRep;
        }
    }

    // Find the root Reference3D

    const parentMatrix = math.identityMat4();

    for (let id in reference3Ds) {
        const reference3D = reference3Ds[id];
        if (!reference3D.instance3D) {
            parseReference3D(ctx, reference3D, ctx.rootMetaObjectId, parentMatrix);
            return;
        }
    }

    ctx.error("No root Reference3D element found in this modelNode - can't load 3DXML file.");

}

function parseInstance3D(ctx, instance3D, parentMetaObjectId, parentMatrix) {

    const objectId = ctx.nextId++;

    const rotationMatrix = math.identityMat4();
    const translationMatrix = math.identityMat4();
    const localMatrix = math.identityMat4();
    const worldMatrix = math.identityMat4();

    if (instance3D.relativeMatrix) {

        const relativeMatrix = parseFloatArray(instance3D.relativeMatrix, 12);

        const translate = [relativeMatrix[9], relativeMatrix[10], relativeMatrix[11]];

        math.translationMat4v(translate, translationMatrix)
        math.mat3ToMat4(relativeMatrix.slice(0, 9), rotationMatrix);
        math.mulMat4(rotationMatrix, translationMatrix, localMatrix);

        math.mulMat4(parentMatrix, localMatrix, worldMatrix);

        ctx.xktModel.createMetaObject({
            metaObjectId: objectId,
            metaObjectType: "Default",
            metaObjectName: instance3D.name,
            parentMetaObjectId: parentMetaObjectId
        });

        for (let id in instance3D.reference3Ds) {
            parseReference3D(ctx, instance3D.reference3Ds[id], objectId, worldMatrix);
        }

    } else {

        ctx.xktModel.createMetaObject({
            metaObjectId: objectId,
            metaObjectType: "Default",
            metaObjectName: instance3D.name,
            parentMetaObjectId: parentMetaObjectId
        });

        for (let id in instance3D.reference3Ds) {
            parseReference3D(ctx, instance3D.reference3Ds[id], objectId, parentMatrix);
        }
    }
}

function parseReference3D(ctx, reference3D, parentMetaObjectId, parentMatrix) {
    for (let id in reference3D.instance3Ds) {
        parseInstance3D(ctx, reference3D.instance3Ds[id], parentMetaObjectId, parentMatrix);
    }
    for (let id in reference3D.instanceReps) {
        parseInstanceRep(ctx, reference3D.instanceReps[id], parentMetaObjectId, parentMatrix);
    }
}

function parseInstanceRep(ctx, instanceRep, parentMetaObjectId, parentMatrix) {

    if (instanceRep.referenceReps) {

        for (let id in instanceRep.referenceReps) {

            const referenceRep = instanceRep.referenceReps[id];

            for (let id2 in referenceRep) {
                if (id2 === "id") {
                    continue; // HACK
                }
                const meshCfg = referenceRep[id2];
                const colorize = meshCfg.color;

                const meshId = "" + ctx.nextId++;
                const entityId = "" + ctx.nextId++;

                ctx.xktModel.createMesh({
                    meshId: meshId,
                    geometryId: meshCfg.geometryId,
                    matrix: parentMatrix,
                    color: colorize
                });

                ctx.xktModel.createEntity({
                    entityId: entityId,
                    meshIds: [meshId]
                });

                ctx.stats.numObjects++;

                ctx.xktModel.createMetaObject({
                    metaObjectId: entityId,
                    metaObjectType: "Default",
                    metaObjectName: instanceRep.name,
                    parentMetaObjectId: parentMetaObjectId
                });
            }
        }
    }
}

async function parseReferenceReps(ctx, node) {
    const referenceReps = {};
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "ReferenceRep":
                if (child.associatedFile) {
                    const src = stripURN(child.associatedFile);
                    const childId = child.id;
                    const file = await ctx.zipArchive.getFile(src);
                    const materialIds = file.xmlDoc.getElementsByTagName("MaterialId");
                    await loadCATMaterialRefDocuments(ctx, materialIds);
                    const referenceRep = {
                        id: childId
                    };
                    parse3DRepDocument(ctx, file.json, referenceRep);
                    referenceReps[childId] = referenceRep;
                }
                break;
        }
    }
    return referenceReps;
}

function parseDefaultView(ctx, node) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Viewpoint":
                const children2 = child.children;
                ctx.viewpoint = {};
                for (let i2 = 0, len2 = children2.length; i2 < len2; i2++) {
                    const child2 = children2[i];
                    switch (child2.type) {
                        case "Position":
                            ctx.viewpoint.eye = parseFloatArray(child2.children[0], 3);
                            break;
                        case "Sight":
                            ctx.viewpoint.look = parseFloatArray(child2.children[0], 3);
                            break;
                        case "Up":
                            ctx.viewpoint.up = parseFloatArray(child2.children[0], 3);
                            break;
                    }
                }
                break;
            case "DefaultViewProperty":
                break;
        }
    }
}

function parse3DRepDocument(ctx, node, result) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "XMLRepresentation":
                parseXMLRepresentation(ctx, child, result);
                break;
        }
    }
}

function parseXMLRepresentation(ctx, node, result) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Root":
                parse3DRepRoot(ctx, child, result);
                break;
        }
    }
}

function parse3DRepRoot(ctx, node, result) {
    switch (node["xsi:type"]) {
        case "BagRepType":
            break;
        case "PolygonalRepType":
            break;
    }
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Rep":
                parse3DRepRep(ctx, child, result);
                break;
        }
    }
}

function parse3DRepRep(ctx, node, result) {

    switch (node["xsi:type"]) {
        case "BagRepType":
            break;
        case "PolygonalRepType":
            break;
    }

    const meshesResult = {};
    const children = node.children;

    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Rep":
                parse3DRepRep(ctx, child, result);
                break;
            case "Edges": // Ignoring edges because we auto-generate them
                break;
            case "Faces":
                meshesResult.primitive = "triangles";
                parseFaces(ctx, child, meshesResult);
                break;
            case "VertexBuffer":
                parseVertexBuffer(ctx, child, meshesResult);
                break;
            case "SurfaceAttributes":
                parseSurfaceAttributes(ctx, child, meshesResult);
                break;
        }
    }

    if (meshesResult.positions) {

        const geometryId = "" + ctx.nextId++;

        ctx.xktModel.createGeometry({
            geometryId: geometryId,
            primitiveType: meshesResult.primitive,
            positions: meshesResult.positions,
            normals: meshesResult.normals,
            indices: meshesResult.indices,
        });

        result[geometryId] = {
            geometryId: geometryId,
            color: meshesResult.color || [1.0, 1.0, 1.0, 1.0],
            materialId: meshesResult.materialId
        };

        ctx.stats.numGeometries++;
        ctx.stats.numVertices += meshesResult.positions ? meshesResult.positions.length / 3 : 0;
        ctx.stats.numTriangles += meshesResult.indices ? meshesResult.indices.length / 3 : 0;
    }
}

function parseFaces(ctx, node, result) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Face":
                parseFace(ctx, child, result);
                break;
        }
    }
}

function parseFace(ctx, node, result) {
    const strips = node.strips;
    if (strips) {
        const arrays = parseIntArrays(strips);
        if (arrays.length > 0) {
            result.primitive = "triangles";
            const indices = [];
            for (let i = 0, len = arrays.length; i < len; i++) {
                const array = convertTriangleStrip(arrays[i]);
                for (let j = 0, lenj = array.length; j < lenj; j++) {
                    indices.push(array[j]);
                }
            }
            result.indices = indices; // TODO
        }
    } else {
        const triangles = node.triangles;
        if (triangles) {
            result.primitive = "triangles";
            result.indices = parseIntArray(triangles);
        }
    }
    const children = node.children; // Material
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "SurfaceAttributes":
                parseSurfaceAttributes(ctx, child, result);
                break;
        }
    }
}

function convertTriangleStrip(indices) {
    const ccw = false;
    const indices2 = [];
    for (let i = 0, len = indices.length; i < len - 2; i++) {
        if (ccw) {
            if (i & 1) { //
                indices2.push(indices[i]);
                indices2.push(indices[i + 1]);
                indices2.push(indices[i + 2]);
            } else {
                indices2.push(indices[i]);
                indices2.push(indices[i + 2]);
                indices2.push(indices[i + 1]);
            }
        } else {
            if (i & 1) { //
                indices2.push(indices[i]);
                indices2.push(indices[i + 2]);
                indices2.push(indices[i + 1]);
            } else {
                indices2.push(indices[i]);
                indices2.push(indices[i + 1]);
                indices2.push(indices[i + 2]);
            }
        }
    }
    return indices2;
}

function parseVertexBuffer(ctx, node, result) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Positions":
                result.positions = parseFloatArray(child.children[0], 3);
                break;
            case "Normals":
                if (!ctx.autoNormals) {
                    result.normals = parseFloatArray(child.children[0], 3);
                }
                break;
            case "TextureCoordinates": // TODO: Support dimension and channel?
                result.uv = parseFloatArray(child.children[0], 2);
                break;
        }
    }
}

function parseIntArrays(str) {
    const coordStrings = str.split(",");
    const array = [];
    for (let i = 0, len = coordStrings.length; i < len; i++) {
        const coordStr = coordStrings[i].trim();
        if (coordStr.length > 0) {
            const elemStrings = coordStr.trim().split(" ");
            const arr = new Int16Array(elemStrings.length);
            let arrIdx = 0;
            for (let j = 0, lenj = elemStrings.length; j < lenj; j++) {
                if (elemStrings[j] !== "") {
                    arr[arrIdx++] = parseInt(elemStrings[j]);
                }
            }
            array.push(arr);
        }
    }
    return array;
}

function parseFloatArray(str, numElems) {
    str = str.split(",");
    const arr = new Float64Array(str.length * numElems);
    let arrIdx = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const value = str[i].split(" ");
        for (let j = 0, lenj = value.length; j < lenj; j++) {
            if (value[j] !== "") {
                arr[arrIdx++] = parseFloat(value[j]);
            }
        }
    }
    return arr;
}

function parseIntArray(str) {
    str = str.trim().split(" ");
    const arr = new Int32Array(str.length);
    let arrIdx = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const value = str[i];
        arr[arrIdx++] = parseInt(value);
    }
    return arr;
}

function parseSurfaceAttributes(ctx, node, result) {
    result.color = [1, 1, 1, 1];
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Color":
                result.color[0] = child.red;
                result.color[1] = child.green;
                result.color[2] = child.blue;
                result.color[3] = child.alpha;
                break;
            case "MaterialApplication":
                const children2 = child.children;
                for (let j = 0, lenj = children2.length; j < lenj; j++) {
                    const child2 = children2[j];
                    switch (child2.type) {
                        case "MaterialId":
                            const materialId = getIDFromURI(child2.id);
                            const material = ctx.materials[materialId];
                            if (!material) {
                                ctx.error("material  not found: " + materialId);
                            }
                            result.materialId = materialId;
                            break;
                    }
                }
                break;
        }
    }
}

async function loadCATMaterialRefDocuments(ctx, materialIds) {
    const loaded = {};

    async function load(i) {
        if (i >= materialIds.length) {
            return;
        }
        const materialId = materialIds[i];
        const colonIdx = src.lastIndexOf(":");
        let src = materialId.id;
        if (colonIdx > 0) {
            src = src.substring(colonIdx + 1);
        }
        const hashIdx = src.lastIndexOf("#");
        if (hashIdx > 0) {
            src = src.substring(0, hashIdx);
        }
        if (!loaded[src]) {
            await loadCATMaterialRefDocument(ctx, src);
            loaded[src] = true;
            await load(i + 1);
        } else {
            await load(i + 1);
        }
    }

    await load(0);
}

async function loadCATMaterialRefDocument(ctx, src) { // Loads CATMaterialRef.3dxml
    const fileData = await ctx.zipArchive.getFile(src);
    await parseCATMaterialRefDocument(ctx, fileData.json);
}

async function parseCATMaterialRefDocument(ctx, node) { // Parse CATMaterialRef.3dxml
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (child.type === "Model_3dxml") {
            await parseModel_3dxml(ctx, child);
        }
    }
}

async function parseModel_3dxml(ctx, node) { // Parse CATMaterialRef.3dxml
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (child.type === "CATMaterialRef") {
            await parseCATMaterialRef(ctx, child);
        }
    }
}

async function parseCATMaterialRef(ctx, node) {

    const domainToReferenceMap = {};
    const children = node.children;

    for (let j = 0, lenj = children.length; j < lenj; j++) {
        const child2 = children[j];
        switch (child2.type) {
            case "MaterialDomainInstance":
                let isAggregatedBy;
                let isInstanceOf;
                for (let k = 0, lenk = child2.children.length; k < lenk; k++) {
                    const child3 = child2.children[k];
                    switch (child3.type) {
                        case "IsAggregatedBy":
                            isAggregatedBy = child3.children[0];
                            break;
                        case "IsInstanceOf":
                            isInstanceOf = child3.children[0];
                            break;
                    }
                }
                domainToReferenceMap[isInstanceOf] = isAggregatedBy;
                break;
        }
    }

    for (let j = 0, lenj = children.length; j < lenj; j++) {
        const child2 = children[j];
        switch (child2.type) {
            case "MaterialDomain":
                if (child2.associatedFile) {
                    const childId = child2.id;
                    const src = stripURN(child2.associatedFile);
                    const fileData = await ctx.zipArchive.getFile(src);
                    ctx.materials[domainToReferenceMap[childId]] = parseMaterialDefDocument(ctx, fileData.json);
                }
        }
    }
}

function parseMaterialDefDocument(ctx, node) {
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "Osm":
                return parseMaterialDefDocumentOsm(ctx, child);
        }
    }
    return {};
}

function parseMaterialDefDocumentOsm(ctx, node) {
    const materialCfg = {};
    const children = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        switch (child.type) {
            case "RenderingRootFeature":
                break;
            case "Feature":
                if (child.Alias === "RenderingFeature") {
                    // Parse the coefficients, then parse the colors, scaling those by their coefficients.
                    const coeffs = {};
                    const children2 = child.children;
                    for (let j = 0, lenj = children2.length; j < lenj; j++) {
                        const child2 = children2[j];
                        switch (child2.Name) {
                            case "AmbientCoef":
                                coeffs.ambient = parseFloat(child2.Value);
                                break;
                            case "DiffuseCoef":
                                coeffs.diffuse = parseFloat(child2.Value);
                                break;
                            case "EmissiveCoef":
                                coeffs.emissive = parseFloat(child2.Value);
                                break;
                            case "SpecularExponent":
                                coeffs.specular = parseFloat(child2.Value);
                                break;
                        }
                    }
                    for (let j = 0, lenj = children2.length; j < lenj; j++) {
                        const child2 = children2[j];
                        switch (child2.Name) {
                            case "AmbientColor":
                                materialCfg.ambient = parseRGB(child2.Value, coeffs.ambient);
                                break;
                            case "DiffuseColor":
                                materialCfg.diffuse = parseRGB(child2.Value, coeffs.diffuse);
                                break;
                            case "EmissiveColor":
                                materialCfg.emissive = parseRGB(child2.Value, coeffs.emissive);
                                break;
                            case "SpecularColor":
                                materialCfg.specular = parseRGB(child2.Value, coeffs.specular);
                                break;
                            case "Transparency":
                                const alpha = 1.0 - parseFloat(child2.Value); // Degree of transparency, not degree of opacity
                                if (alpha < 1.0) {
                                    materialCfg.alpha = alpha;
                                    materialCfg.alphaMode = "blend";
                                }
                                break;
                        }
                    }
                }
                break;
        }
    }
    return materialCfg;
}

function parseRGB(str, coeff) {
    coeff = (coeff !== undefined) ? coeff : 0.5;
    const openBracketIndex = str.indexOf("[");
    const closeBracketIndex = str.indexOf("]");
    str = str.substring(openBracketIndex + 1, closeBracketIndex - openBracketIndex);
    str = str.split(",");
    const arr = new Float32Array(str.length);
    let arrIdx = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        const value = str[i].trim().split(" ");
        for (let j = 0, lenj = value.length; j < lenj; j++) {
            if (value[j] !== "") {
                arr[arrIdx++] = parseFloat(value[j]) * coeff;
            }
        }
    }
    return arr;
}

function stripURN(str) {
    const subStr = "urn:3DXML:";
    return (str.indexOf(subStr) === 0) ? str.substring(subStr.length) : str;
}

function getIDFromURI(str) {
    const hashIdx = str.lastIndexOf("#");
    return hashIdx !== -1 ? str.substring(hashIdx + 1) : str;
}

export {parse3DXMLIntoXKTModel};