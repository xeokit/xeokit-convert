import { XKTModel, writeXKTModelToArrayBuffer } from '@xeokit/xeokit-convert';
import fs from 'fs';

const xktModel = new XKTModel();

// Create metamodel - this part is optional

// Create property sets to hold info about the model

xktModel.createPropertySet({
  propertySetId: "tableTopPropSet",
  propertySetType: "Default",
  propertySetName: "Table Top",
  properties: [
      {
          id: "tableTopMaterial",
          type: "Default",
          name: "Table top material",
          value: "Marble"
      },
      {
          id: "tableTopDimensions",
          type: "Default",
          name: "Table top dimensions",
          value: "90x90x3 cm"
      }
  ]
});

xktModel.createPropertySet({
  propertySetId: "tableLegPropSet",
  propertySetType: "Default",
  propertySetName: "Table Leg",
  properties: [
      {
          id: "tableLegMaterial",
          type: "Default",
          name: "Table leg material",
          value: "Pine"
      },
      {
          id: "tableLegDimensions",
          type: "Default",
          name: "Table leg dimensions",
          value: "5x5x50 cm"
      }
  ]
});

// Create a hierarchy of metaobjects to describe the structure of the model

xktModel.createMetaObject({ // Root XKTMetaObject, has no XKTEntity
  metaObjectId: "table",
  metaObjectName: "The Table",
  metaObjectType: "furniture"
});

xktModel.createMetaObject({
  metaObjectId: "redLeg",
  metaObjectName: "Red Table Leg",
  metaObjectType: "furniturePart",
  parentMetaObjectId: "table",
  propertySetIds: ["tableLegPropSet"]
});

xktModel.createMetaObject({
  metaObjectId: "greenLeg",
  metaObjectName: "Green Table Leg",
  metaObjectType: "furniturePart",
  parentMetaObjectId: "table",
  propertySetIds: ["tableLegPropSet"]
});

xktModel.createMetaObject({
  metaObjectId: "blueLeg",
  metaObjectName: "Blue Table Leg",
  metaObjectType: "furniturePart",
  parentMetaObjectId: "table",
  propertySetIds: ["tableLegPropSet"]
});

xktModel.createMetaObject({
  metaObjectId: "yellowLeg",
  metaObjectName: "Yellow Table Leg",
  metaObjectType: "furniturePart",
  parentMetaObjectId: "table",
  propertySetIds: ["tableLegPropSet"]
});

xktModel.createMetaObject({
  metaObjectId: "pinkTop",
  metaObjectName: "The Pink Table Top",
  metaObjectType: "furniturePart",
  parentMetaObjectId: "table",
  propertySetIds: ["tableTopPropSet"]
});

// Create an XKTGeometry that defines a box shape, as a triangle mesh

xktModel.createGeometry({
  geometryId: "boxGeometry",
  primitiveType: "triangles", // Also "lines" and "points"
  positions: [
      1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1,
      -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1,
      -1, -1, -1, -1, -1, 1, -1, 1, 1, -1
  ],
  normals: [ // Only for "triangles"
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, -1, 0, 0, -1, 0, 0,
      -1, 0, 0, -1
  ],
  indices: [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
  ]
});

// Create five XKTMeshes, which represent the table top and legs.
// Each XKTMesh has its own color, position, orientation and size,
// and uses the XKTGeometry to define its shape.
// An XKTGeometry can be used by multiple XKTMeshes.

xktModel.createMesh({
  meshId: "redLegMesh",
  geometryId: "boxGeometry",
  position: [-4, -6, -4],
  scale: [1, 3, 1],
  rotation: [0, 0, 0],
  color: [1, 0, 0],
  opacity: 1
});

xktModel.createMesh({
  meshId: "greenLegMesh",
  geometryId: "boxGeometry",
  position: [4, -6, -4],
  scale: [1, 3, 1],
  rotation: [0, 0, 0],
  color: [0, 1, 0],
  opacity: 1
});

xktModel.createMesh({
  meshId: "blueLegMesh",
  geometryId: "boxGeometry",
  position: [4, -6, 4],
  scale: [1, 3, 1],
  rotation: [0, 0, 0],
  color: [0, 0, 1],
  opacity: 1
});

xktModel.createMesh({
  meshId: "yellowLegMesh",
  geometryId: "boxGeometry",
  position: [-4, -6, 4],
  scale: [1, 3, 1],
  rotation: [0, 0, 0],
  color: [1, 1, 0],
  opacity: 1
});

xktModel.createMesh({
  meshId: "pinkTopMesh",
  geometryId: "boxGeometry",
  position: [0, -3, 0],
  scale: [6, 0.5, 6],
  rotation: [0, 0, 0],
  color: [1, 0, 1],
  opacity: 1
});

// Create five XKTEntities, which represent abstract, named objects in the model.
// Each XKTEntity has an XKTMesh.
// An XKTEntity can have multiple XKTMeshes.
// An XKTMesh can only belong to one XKTEntity.

xktModel.createEntity({
  entityId: "redLeg",
  meshIds: ["redLegMesh"]
});

xktModel.createEntity({
  entityId: "greenLeg",
  meshIds: ["greenLegMesh"]
});

xktModel.createEntity({
  entityId: "blueLeg",
  meshIds: ["blueLegMesh"]
});

xktModel.createEntity({
  entityId: "yellowLeg",
  meshIds: ["yellowLegMesh"]
});

xktModel.createEntity({
  entityId: "pinkTop",
  meshIds: ["pinkTopMesh"]
});

await xktModel.finalize();

const xktArrayBuffer = writeXKTModelToArrayBuffer(xktModel, "", {}, {zip: false});

const buffer = Buffer.from(xktArrayBuffer);
fs.writeFileSync("./myModel.xkt", buffer);