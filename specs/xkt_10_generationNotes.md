# Notes on Parsing glTF into XKT

## Overview of XKT document model elements

This section gives a brief introduction to the XKT elements.

An XKT document model consists of these classes:

* XKTModel - the XKTmodel
* XKTGeometry - an element of geometry (primitive type, positions, normals, uvs, indices, edgeindices)
* XKTMesh - an instance of an XKTGeometry (matrix, geometry, color)
* XKTEntity - an object composed of one or more XKTMeshes
* XKTTile - a 3D region that contains one or more XKTEntity's

Cardinality of the elements are:

* XKTMode contains one or more XKTTiles
* XKTTile contains one or more XKTEntities
* XKTEntity contains one ore more XKTMeshes
* Each XKTMesh belongs to exactly one XKTEntity
* Each XKTGeometry can belong to one or more XKTMeshes

An XKTGeometry is "shared" or "reused" when it is used by multiple XKTMeshes.

When written to XKT, each XKTGeometry's positions will be quantized to 16-bit integers. When that XKTGometry is used by only one XKTMesh,
then its positions will transformed by that XKTMesh's matrix. All single-use XKTGeometry positions will be quantized to an AABB that
encloses the collective boundary of all the single-use XKTGeometrys' positions. The XKT file will then contain that singlular dequantization
matrix for those XKTGeometries. The Viewer will ignore matrices belonging to these XKTMeshes, because the positions are pretransformed
like this, and the matries are therefore redundant.

XKTGeometries that ARE reused by multiple Meshes will NOT have their positions transformed. The Viewer, when rendering, will transform
those positions using the matrices belonging to the XKTMeshes that use them.

Each XKTMesh that reuses an XKTGeometry will have its matrix adjusted (using translations) so that its transform are relative to the
center of the XKTTile that contains its parent XKTEntity.

When loading an XKT, the Viewer will calculate the dequantization matrix for single-use XKTGeometries from the AABBs belonging to the
XKTTiles that contain their XKTMeshes and XKTEntities.

# Step 1: Parse glTF scene node hierarchy into a document model

## Parsing the glTF

Iterate the gltf scene node hierarchy, from the root node downwards:

````
- at each "node", create an XKTEntity
    - At each "meshId" at that node, create an XKTMesh

      The XKTMesh gets an instancing matrix that is build from the glTF node and all nodes on the way up to the
      scene's root node. The XKTMesh also gets a color from the glTF material used by the glTF mesh.

      Now, for each "meshId", parse the glTF positions and indices and create an XKTGeometry. Cache the XKTGeometry.
      Instead of creating a new XKTGeometry each time, try to reuse one from the cache.
````

As mentioned above, XKT components cardinality looks like below:

````
XKTEntity (1)->(1..n) XKTMesh (1..n)->(1) XKTGeometry
````

- Each XKTEntity has one or more XKTMeshes.
- Each XKTMesh is used by exactly one XKTEntity.
- Each XKTMesh has exactly one XKTGeometry.
- Each XKTGeometry can be used by one or more XKTMeshes.
- An XKTMesh connects it's XKTEntity to an XKTGeometry, providing a matrix to position that XKTGEometry for the
  XKTEntity, and a color to render the XKTGeometry with. This allows an XKTEntity to be composed of multiple parts, each
  part having a different color (and primitive type, triangles, lines, points etc). For new, we'll just think about
  triangles.

At this point, the components have the following properties:

XKTEntity
 - XKTMeshes (one or more)
 - ID
 - 
XKTMesh
- matrix
- color - RGBA base color, metallness scalar (0..1), roughness scalar (0..1). Just use 1 for metallness and roughness
  for now.
- XKTGeometry (exactly one)

XKTGeometry
- 3D positions (double-precision and in "model space", where they are ready to be transformed by an XKTMesh matrix. These
  positions could have large values, far from the origin.)
- indices (for triangles and lines, we always have indices. These are ignored for points, which we won't discuss today)
- geometryIndex - a counter, which indicates the order in which the XKTGeometry was created; the first one created has
  geometryIndex=0. We use this when we serialize everything to the XKT binary file.

Recall that an XKTGeometry could either be used by multipel XKTMeshes, or could be exclusievely used by one XKTMesh.

Also recall that each XKTMesh belongs to exactly one XKTEntity.

# Step 2: Pre-process the XKT components

Now having created our XKT document elements, we need to pre-process them before we can serialize them to XKT.
  
## Step 2.1 Bake transforms into single-use XKTGeometries

For XKTGeometries that are not used by more than one XKTMesh, we'll go ahead and transform their 
positions into World-space coordinates, and throw away the XKTMesh's matrix. 

````
- At each XKTMesh:
    - If it's XKTGeometry is NOT shared by any other XKTMesh
        - Transform the XKTGeometry positions by the XKTMesh's matrix.
        - Replace the XKTMesh's matrix with the identity matrix (ie. a blank matrix that has no transforms)
````

## Step 2.2 Create AABBs for XKTEntities

Now we'll calculate the World-space AABB for each XKTEntity.
````
- At each XKTEntity:
    - Create an AABB for the XKTEntity, that encloses the positions of XKTGeometries belonging to its XKTMeshes, after
      the positions are transformed by the XKTMesh's matrices.
      Don't modify the XKTGeometry's positions, just get their boundaries after that transformation.
      Note that when the XKTMesh has an identity matrix (see previous step), we we don't really have to do the
      transform, and could just use the positions directly.
````

At this point, we now have:

XKTEntity
- XKTMeshes (one or more)
- ID
- AABB enclosing its XKTMeshes

XKTMesh
- matrix - if XKTMesh has only one XKTGeometry, this is now an identity matrix, with no transforms in it.
- color - RGBA base color, metallness scalar (0..1), roughness scalar (0..1). Just use 1 for metallness and roughness
  for now.
- XKTGeometry (always exactly one)

XKTGeometry
- positions - when XKTGeometry is shared by multiple meshes, these are in "model space"; when XKTGeometry is used by
  only one XKTMesh, these are pre-transformed by the XKTMesh's matrix (before the matrix was replaced with the identity
  matrix) and are now in "World space". We could still transform these by the identity matrix, but that would be
  redundant and would not change them.
- indices - (for triangles and lines, we always have indices. These are ignored for points, which we won't discuss
  today)
- geometryIndex

## Step 2.3 Create XKTTiles

Now we need to create XKTTiles to organize our XKTEntities into spatial regions.

Begin building a k-d tree, which we'll then use to create XKTTiles. Initially, the tree starts off with one node, the
root, which has an AABB that encloses the AABBs of all XKTEntities.

We then insert each XKTEntity into the k-d tree, building the node heirarchy as we go. Note that a k-d tree is a binary
space partioning tree, in which each node has an AABB, and may have left and right child nodes, where the child nodes
each have an AABB that is the half-space of the parent's AABB. At each level, the half-spaces are split on a different
axis. So, at level 1, children split their parent's AABB on the X-Z plane, then on level 2 split on the X-Y plane, then
on level 3 split on Y-Z plane, then level 4 split on X-Z, and so on. The split is made at the mid-point on the current
splitting axis.

We then end up with a tree where all nodes have AABBs and some nodes have XKTEntities. Both branch and leaf nodes can
have XKTEntities.

An XKTEntity belongs to a node when

- it does not fit within either child half-space of that node's AABB, or
- the node's ABBB is smaller than some minimum size threshold (where we stop recusively splitting it), or
- the node's depth is at some maxiumum (so we don't end up with super deep trees and too many distanct tile sizes)

Now, iterate over all nodes in the tree.

For each node that has XKTEntities, create an XKTTile. Each XKTTile gets those XKTEntities and the AABB that encloses
them. We compute that AABB from the XKTEntities, rather than the XKTTile, just because it's more tight. Probably also OK
to compute from the XKTTile's AABB though, although maybe less tight.

Cardinality between the components is:

````
XKTTile (1)-->(1..n) XKTEntity (1) -> (1..n) XKTMesh (1..n) -> (1) XKTGeometry
````

Each component has the following properties:

XKTTile
- XKTEntities (one or more)
- AABB that encloses the XKTEntities.

XKTEntity
- XKTMeshes (one or more)
- ID

XKTMesh
- matrix - if XKTMesh has only one XKTGeometry, this is now the empty, identity matrix, with no transforms in it.
- color
- XKTGeometry (always exactly one)

XKTGeometry
- positions
- when XKTGeometry is shared by multiple meshes, these are in "model space";
- when XKTGeometry is used by only one XKTMesh, these are pre-transformed by the XKTMesh's matrix (before the matrix was
  replaced with the identity matrix) and are now in "World space". We could still transform these by the identity
  matrix, but that would be redundant and would not change them.
- indices - (for triangles and lines, we always have indices. These are ignored for points, which we won't discuss
  today)
- geometryIndex

## Step 2.4 Make positions of single-use XKTGeometries relative to the center of their XKTTiles, quantize them to their XKTTiles' AABB

````
With each XKTTile
  with each contained XKTEntity
    with each owned XKTMesh
       with the XKTGeometry
         IF the XKTGeometry is NOT used by any other XKTMesh

            - subtract the center of the XKTTile's AABB from the XKTGeometry positions
            - make a temporary AABB that has the same size as the XKTTile's AABB, but is centered at (0,0,0)
            - quantize the positions to the extents of the temporary AABB (discard the temporary AABB)
            - do not bother creating a dequantization matrix - to save space in the XKT, 
              viewer will recreate the temporary (centered) AABB from the XKTTile's AABB 
              and recreate the dequantization matrix from that
````

## Step 2.5 For each reused XKTGeometry, adjust its XKTMesh's matrix so it's transform is relative to the center of the parent XKTTile

````
With each XKTTile
   with each contained XKTEntity
      with each owned XKTMesh
         with the XKTGeometry
            IF the XKTGeometry IS used by any multiple XKTMeshes
               - post-multiply a translation to the XKTMesh's matrix; 
                 the translation is the distance from the World-space 
                 origin (0,0,0) to the center of the XKTTile's AABB
````

At this point, we now have:

XKTTile
- XKTEntities (one or more)
- AABB that encloses the XKTEntities.

XKTEntity
- XKTMeshes (one or more)
- ID

XKTMesh
- matrix
- recall: if XKTMesh has only one XKTGeometry, this is now the identity matrix, with no transforms in it.
- Otherwise, it is a matrix that will transform the XKTGeometry positions RELATIVE to the center of the XKTTile's AABB
  center.
- color
- XKTGeometry (recall: exactly one)

XKTGeometry
- positions
- Recall: when XKTGeometry is NOT shared by multiple XKTMeshes, these are
  quantized to an AABB that matches the size of the XKTTile's AABB, but is centered at (0,0,0).
- When the XKTGeometry is not shared, these positions are still doubles,
  that are in absolute World-space coordinates, having been transformed
  by the XKTMesh's matrix, before we replaced matrix with an empty identity matrix.
- indices
- geometryIndex

    
# Step 3. Create a single dequantization matrix for all reused XKTGeometries
  
The XKTGeometries that are reused by multiple XKTMeshes get a single, shared dequantization matrix, 
that the Viewer will use to transform their positions from 16-bit integers back into floating-point model coordinates.

````
Create an AABB with inverse extents (-MAX,-MAX,-MAX, +MAX, +MAX, +MAX)
With each XKTGeometry
   - IF the XKTGeometry is used by many XKTMeshes
      - expand the AABB to enclose the XKTGeometry's positions
````

Then create a single dequantization matrix from that AABB. This matrix will be used in the Viewer to dequantize the
positions of ALL reused XKTGeometries.

Recall that, for XKTGeometries that ARE NOT reused, we earlier transformed them by their XKTMesh's matrix (baking the
transform into them, and then replacing that matrix with the identity matrix because it's now redundant). To dequantize
those XKTGeometries, recall that the Viewer will recompute their dequantization matrixes from the XKTTile AABBs.

```
With each XKTGeometry
   - IF the XKTGeometry is used by many XKTMeshes
   - quantize the positions to the AABB we just created
````

Disacard the AABB we just created.

In total, we now we have:

XKTTile
- XKTEntities (one or more)
- AABB that encloses the XKTEntities.

XKTEntity
- XKTMeshes (one or more)
- ID

XKTMesh
- matrix
- recall: if XKTMesh has only one XKTGeometry, this is now the identity matrix, with no transforms in it.
- Otherwise, it is a matrix that will transform the XKTGeometry positions RELATIVE to the center of the XKTTile's AABB
  center.
- color
- XKTGeometry (recall: exactly one)

XKTGeometry
- positions
- Recall: when XKTGeometry is NOT shared by multiple XKTMeshes, these are
  quantized to an AABB that matches the size of the XKTTile's AABB, but is centered at (0,0,0).
- When the XKTGeometry is not shared, these positions are still doubles,
  that are in absolute World-space coordinates, having been transformed
  by the XKTMesh's matrix, before we replaced matrix with an empty identity matrix.
- indices
- geometryIndex

reusedGeometriesDecodeMatrix - A single dequantization matrix for all reused XKTGeometries.

# Step 4. Serialize all XKT components to a binary XKT file
  
The layout of the XKT file (v10) is described here: https://github.com/xeokit/xeokit-convert/blob/main/specs/xkt_v10.md

See that document for more details on the XKT format.

Now we'll describe how to populate the arrays in that format, using some psuedocode.

With these variables:

````
- geometriesList // The list of all XKTGeometries, in order of their creation.
- numGeometries // The length of the list of XKTGeometries

- countPositions = 0
- countNormals = 0
- countColors = 0;
- countUVs = 0
- countIndices = 0
- countEdgeIndices = 0
````

Do this:
````javascript
for (geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {

    let geometry = geometriesList [geometryIndex];

    let primitiveType = 1;

    switch (geometry.primitiveType) {
        case "triangles":
            primitiveType = 1;
            break;
        case "points":
            primitiveType = 2;
            break;
        case "lines":
            primitiveType = 3;
            break;
        case "line-strip":
            primitiveType = 4;
            break;
        case "triangle-strip":
            primitiveType = 5;
            break;
        case "triangle-fan":
            primitiveType = 6;
            break;
        default:
            primitiveType = 1
    }

    eachGeometryPrimitiveType [geometryIndex] = primitiveType;
    eachGeometryPositionsPortion [geometryIndex] = countPositions;
    eachGeometryNormalsPortion [geometryIndex] = countNormals;
    eachGeometryColorsPortion [geometryIndex] = countColors;
    eachGeometryUVsPortion [geometryIndex] = countUVs;
    eachGeometryIndicesPortion [geometryIndex] = countIndices;
    eachGeometryEdgeIndicesPortion [geometryIndex] = countEdgeIndices;

    if (geometry.positionsQuantized) {
        positions.set(geometry.positionsQuantized, countPositions);
        countPositions += geometry.positionsQuantized.length;
    }

    if (geometry.normalsOctEncoded) { // Ignore this for now
        normals.set(geometry.normalsOctEncoded, countNormals);
        countNormals += geometry.normalsOctEncoded.length;
    }

    if (geometry.colorsCompressed) { // ignore this for now
        colors.set(geometry.colorsCompressed, countColors);
        countColors += geometry.colorsCompressed.length;
    }

    if (geometry.uvs) { // Ignore this for now
        uvs.set(geometry.uvs, countUVs);
        countUVs += geometry.uvs.length;
    }

    if (geometry.indices) {
        indices.set(geometry.indices, countIndices);
        countIndices += geometry.indices.length;
    }

    if (geometry.edgeIndices) { // ignore this for now
        edgeIndices.set(geometry.edgeIndices, countEdgeIndices);
        countEdgeIndices += geometry.edgeIndices.length;
    }
}
````

Now we have populated these arrays:

- positions // Uint16Array containing all concatenated geometry positions, as quantized integers
- normals: // Int8Array containing all concatenated normals, as oct-encoded integers (ignore for now)
- colors // Uint8Array containing all concatenated vertex colors, as integers (ignore for now)
- uvs // Float32Array containing all concatenated vertex UV coordinates (ignore for now)
- indices // Uint32Array containing all concatenated geometry indices
- edgeIndices // Uint32Array containing all concatenated geometry edge indices (ignore for now)

- eachGeometryPrimitiveType // Uint8Array containing the primitive type for each geometry
- eachGeometryPositionsPortion // Uint32Array base index into positions array for each geometry
- eachGeometryNormalsPortion // Uint32Array base index into normals array for each geometry
- eachGeometryColorsPortion // Uint32Array base index into vertex colors array for each geometry
- eachGeometryUVsPortion // Uint32Array base index into uvs array for each geometry
- eachGeometryIndicesPortion // Uint32Array base index into indices array for each geometry
- eachGeometryEdgeIndicesPortion: // Uint32Array base index into edgeIndices array for each geometry

Each entry in the "eachGeometryXXXPortion" arrays corresponds to an XKTGeometry, and is
an index of the first element of a portion of the positions, normals, colors, uvs, indices
and edgeIndices arrays that is used by the XKTGeometry.

When an XKTGeometry does not use a portion of one of these arrays, then its entry will have the same
value as the following entry.

For example, imagine three XKTGeometries, A, B and C:

- A has 3 positions but no normals
- B has 5 positions and 5 normals
- C has 4 positions and 4 normals

````
positions= [ // Some random positions

   24567, 31234, 17654, // XKTGeometry A
   43210, 19876, 28765,
   15043, 23456, 56789,

   21987, 30567, 12345, // XKTGeometry B
   20876, 29487, 16987,
   45678, 54321, 32109,
   87654, 98765, 65432,
   78901, 87654, 54321,

   98765, 87654, 10987, // XKTGeometry C
   54321, 65432, 23456,
   12345, 23456, 34567,
   65432, 76543, 87654  
]
````

````
normals = [ // Some random normals

   12, 200, 43, // XKTGeometry A
   98, 156, 77,
   34, 23, 45,

   87, 123, 200, // XKTGeometry C
   45, 34, 167,
   89, 123, 56,
   23, 190, 45
]
````

````
eachGeometryPrimitiveType = [ // Primitives
   0, // Triangles
   0, // Triangles
   0 // Triangles
]
````

````
eachGeometryPositionsPortion = [
   0, // XKTGeometry A has 3 positions, in elements [0-8]
   9, // XKTGeometry B has 5 positions, in elements [9-23]
   23 // XKTGeometry C has 4 positions in elements [23-35] (the rest of the positions array)
]
````

````
eachGeometryNormalsPortion = [
   0, // XKTGeometry A has 3 normals, in elements [0-8]
   9, // XKTGeometry B has 0 normals
   9 // XKTGeometry C has 4 normals in elements [9-20]
]
````

Note that since XKTGeometry B has no normals, it gets a normals array portion of zero length,
which is indicated by XKTGeometry C (the next in sequence) having an eachGeometryNormalsPortion entry
with the same value (9).

We'll skip describing how to populate the textures arrays for this description.

````javascript
let entityIndex = 0;
let countEntityMeshesPortion = 0;
let eachMeshMaterialAttributesIndex = 0;
let matricesIndex = 0;
let meshIndex = 0;

reusedGeometriesDecodeMatrix.set(reusedGeometriesDecodeMatrix) // Created in Step (3)

for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {

    let tile = tilesList [tileIndex];
    let tileEntities = tile.entities;
    let numTileEntities = tileEntities.length;

    if (numTileEntities === 0) {
        continue; // Empty XKTTile, not likely
    }

    eachTileEntitiesPortion[tileIndex] = entityIndex;

    let tileAABB = tile.aabb;

    for (let j = 0; j < numTileEntities; j++) {

        let entity = tileEntities[j];
        let entityMeshes = entity.meshes;
        let numEntityMeshes = entityMeshes.length;

        for (let k = 0; k < numEntityMeshes; k++) {

            let mesh = entityMeshes[k];
            let geometry = mesh.geometry;
            let geometryIndex = geometry.geometryIndex;

            eachMeshGeometriesPortion [countEntityMeshesPortion + k] = geometryIndex;

            if (mesh.geometry.numInstances > 1) {
                matrices.set(mesh.matrix, matricesIndex);
                eachMeshMatricesPortion [meshIndex] = matricesIndex;
                matricesIndex += 16;
            }

            eachMeshTextureSet[meshIndex] = mesh.textureSet ? mesh.textureSet.textureSetIndex : -1;

            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[0] * 255); // Color RGB
            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[1] * 255);
            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[2] * 255);
            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.opacity * 255); // Opacity
            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.metallic * 255); // Metallic
            eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.roughness * 255); // Roughness

            meshIndex++;
        }

        eachEntityId [entityIndex] = entity.entityId;
        eachEntityMeshesPortion[entityIndex] = countEntityMeshesPortion;

        entityIndex++;
        countEntityMeshesPortion += numEntityMeshes;
    }

    const tileAABBIndex = tileIndex * 6;

    eachTileAABB.set(tileAABB, tileAABBIndex);
}
````

Now we have populated these arrays:

- reusedGeometriesDecodeMatrix // Float32Array - the single dequantization matrix used by all reused XKTGeometries (16
  elements)
- matrices // Float32Array modeling matrices for XKTMeshes that reused XKTGeometries
- eachMeshGeometriesPortion // Uint32Array - For each XKTMesh, an index into the eachGeometry* arrays
- eachMeshMatricesPortion // Unit32Array - for each XKTMesh that shares (reuses) its XKTGeometry, an index into matrices
  array
- eachMeshMaterialAttributes // Uint8Array - for each XKTMesh, RGBA, metallic and roughness (6 values)
- eachEntityId // string[] - for each XKTEntity, its ID
- eachEntityMeshesPortion // Uint32Array - For each entity, the index of the first element of eachMeshes* arrays
- eachTileAABB // Float64Array AABB for each XKTTile (6 values)
- eachTileEntitiesPortion // Uint32Array - For each XKTTile, the index of the first element of eachEntity* arrays

Notes:

For each XKTMesh that does not share its XKTGeometry, just write 0 into eachMeshMatricesPortion. When loading the
XKT, the Viewer will be able to infer whether the XKTMesh shares its geometry and has a matrix. If the XKTMesh
does not share it's geometry, the Viewer will infer an identity (empty) matrix for it.

As mentioned in Step 3, the Viewer will calculate the positions decode matrix for each reused XKTGeometry
from the AABB of the XKTTile that contains the XKTEntitys that contain the XKTMeshes that use it.





