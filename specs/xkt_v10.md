# XKT Format Specification v10

* 2 November 2023

This document provides an overview of the ````.xkt```` v10 file format. The ````.xkt```` format is xeokit's native binary
format, which is designed to rapidly load large, double-precision models into a xeokit viewer running in the browser.

## Contents

- [Objectives](#overview)
- [zlib Deflation](#zlib-deflation)

## Where we use XKT

The ````xkt```` format is used by these three packages within xeokit:

| Library | Description |
|---|---|
| [xeokit-convert](https://github.com/xeokit/xeokit-convert) |  JavaScript library providing tools to generate ````.xkt```` files, and to convert various source formats into ````xkt````. |
| [xeokit-sdk](https://github.com/xeokit/xeokit-sdk) | The core xeokit SDK, providing JavaScript components for building custom viewers that load ````xkt```` files.  |
| [xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer) | xeokit's bundled BIM viewer, built from components provided in ````xeokit-sdk````. Loads models from ````xkt```` files.  |


The [xeokit-convert](https://github.com/xeokit/xeokit-convert) package implements an
in-memory [document model](https://github.com/xeokit/xeokit-convert/tree/master/src/XKTModel) that represents the
contents of an ````xkt```` file. We designed the classes that comprise the document model to align closely with the ````xkt```` format,
so that they may be used to help understand the format.

The [xeokit-xkt](https://github.com/xeokit/xeokit-xkt) package provides a
viewer [plugin](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js~XKTLoaderPlugin.html)
that loads ````xkt````. The plugin has a parser for each ````xkt```` version,
including [a parser](https://github.com/xeokit/xeokit-sdk/blob/master/src/plugins/XKTLoaderPlugin/parsers/ParserV10.js)
for ````xkt```` v10. The implementation of that parser is also useful for understanding the ````xkt```` format.

The [xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-vewer) package implements a BIM viewer, using components
from ````xeokit-sdk````.

## Features

The ````.xkt```` v10 format aims to organize model geometry into a compact payload, while at the same time preserving the
model's full double-precision coordinate accuracy.

#### File Elements

* A ***model*** represents a single model, which is spatially partitioned into tiles.
* A ***tile*** represents a spatial, box-shaped region within a model. A tile contains one or more entities, along with
  a World-space axis-aligned bounding box (AABB) that encloses them.
* A ***geometry*** represents a geometry mesh, which has vertex positions, vertex normals, triangle indices, edge
  indices, an RGB color, and an opacity.
* A ***mesh*** represents the use of a geometry by an entity, with surface material properties applied (color, roughness
  and metal-ness).
* An ***entity*** represents a 3D object, which has a unique ID, and at least one mesh.
* The ***metadata*** is an optional chunk of embedded JSON that classifies all the objects in the model, describing their structural hierarchy. It contains:
    * ***property sets*** - optional sets of arbitrary properties that are shared among metaobjects.
    * ***metaobjects*** - metadata on each object, connected into a structural hierarchy. Each metaobject can be associated with a property set.

#### Minimal Data Size

The format uses the following techniques to minimize size:

- Reuse geometric primitives among entities to reduce redundant data,
- [Quantize](#quantization) 32-bit geometry vertex positions to unsigned 16-bit integers,
- Make positions relative to the center of tiles,
- [Oct-encode](#oct-encoding) 32-bit vertex normals to unsigned 8-bit integers, and
- Deflate everything using [zlib](http://www.zlib.net/).

#### Double-Precision Coordinate Accuracy

While many IFC models rely on double-precision coordinates, WebGL and most GPUs can only support single-precision (
accurate to ~7 digits). For a geographically large model with many details, this can result in "jittering", a problem
described in xeokit SDK [Issue #401](https://github.com/xeokit/xeokit-sdk/issues/401).

The ````.xkt```` v10 format addresses this by partitioning the model's entities into *tiles*, where the vertex positions
of the primitives used by tile's entities are relative to the center of their tile, a technique known as *
Relative-to-Center*
(RTC) coordinates. RTC coordinates are commonly used in flight simulators, and geo-spatial visualization libraries, such
as [CesiumJS](https://cesium.com/cesiumjs/).

#### Tiles

**Tiles** organize the XKT's objects into box-shaped regions. These regions are arbitrary and may overlap.

* **Tiles** are implicit in XKT.
* Each **tile** has an axis-aligned bounding box (AABB) that is ````[xmin,ymin,zmin,xmas,ymax,zmax]````.
* Each **tile** contains a set of **entities**
* Each **entity** has a set of **meshes**.
* Each **mesh** belongs to one **entity**.
* When a **mesh** shares a **geometry**, the **mesh** has a matrix that scales, rotates and translates the **geometry** positions. The translation is relative to the center of the AABB. Positions of all reused Geometries are all quantized to 16-bit integers and will be dequantized in the WebGL shader my multiplying them with the same dequantization matrix, which is given in ````reused_geometries_decode_matrix````, before multiplying them by the **mesh**'s transform matrix.
* When a **mesh** has its own unique **geometry**, the **geometry** positions are relative to the center of the AABB. These **geometry** positions are also quantized to 16-bit integers, within the range of the AABB.

#### Multiple Primitive Types

The ````.xkt```` v10 format supports triangle meshes, line segments and point clouds. Triangle meshes can be closed
solids or open surfaces.

#### Pre-Computed Edge Indices

The ````.xkt```` v10 format includes pre-computed edge indices for triangle meshes, to highlight their edges in the
xeokit renderer.

#### Inline Metadata

We embed model metadata as a chunk of JSON within the ````xkt```` v10 file. TODO: format


## File Layout

The table below lists the sections within ````.xkt```` v10.0.

Sections deflated with [zlib](http://www.zlib.net/) are flagged in the fourth column.

Section | Type | Description | zlib Deflated? |
|---|---|---|---|
| ````version```` | Uint32 | The ````.xkt```` file format version. This is the first four bytes in the file, and will have the value ````10````.| | 
| ````size_index```` | Uint32 | Byte size of the index. The index is the following block of elements that are each prefixed with ````size_````. The index provides a table of the sizes of elements within the file. | |
| ````size_metadata```` | Uint32 | Byte size of deflated ````metadata````. This is the start of the index. | |
| ````size_texture_data```` | uint32 | Byte size of deflated ````texture_data```. | |
| ````size_each_texture_data_portion```` | uint32 | Byte size of deflated ````each_texture_data_portion```. | |
| ````size_each_texture_attributes```` | uint32 | Byte size of deflated ````each_texture_attributes```. | |
| ````size_positions```` | Uint32 | Byte size of deflated ````positions````. | |
| ````size_normals```` | Uint32 | Byte size of deflated ````normals````. | |
| ````size_colors```` | Uint32 | Byte size of deflated ````colors````. | |
| ````size_uvs```` | Uint32 | Byte size of deflated ````uvs````. | |
| ````size_indices```` | Uint32 | Byte size of deflated ````indices````. | |
| ````size_edge_indices```` | Uint32 | Byte size of deflated ````edge_indices````. | |
| ````size_each_texture_set_textures```` | Uint32 | Byte size of deflated ````size_each_texture_set_textures````. | |
| ````size_matrices```` | Uint32 | Byte size of deflated ````matrices````. | |
| ````size_reused_geometries_decode_matrix```` | Uint32 | Byte size of deflated ````reused_geometries_decode_matrix````. | |
| ````size_each_geometry_primitive_type```` | Uint32 | Byte size of deflated ````each_geometry_primitive_type````. | |
| ````size_each_geometry_positions_portion```` | Uint32 | Byte size of deflated ````each_geometry_positions_portion````. | |
| ````size_each_geometry_normals_portion```` | Uint32 | Byte size of deflated ````each_geometry_normals_portion````. | |
| ````size_each_geometry_colors_portion```` | Uint32 | Byte size of deflated ````each_geometry_colors_portion````. | |
| ````size_each_geometry_uvs_portion```` | Uint32 | Byte size of deflated ````each_geometry_uvs_portion````. | |
| ````size_each_geometry_indices_portion```` | Uint32 | Byte size of deflated ````each_geometry_indices_portion````. | |
| ````size_each_geometry_edge_indices_portion```` | Uint32 | Byte size of deflated ````each_geometry_edge_indices_portion````. | |
| ````size_each_mesh_geometries_portion```` | Uint32 | Byte size of deflated ````each_mesh_geometries_portion````. | |
| ````size_each_mesh_matrices_portion```` | Uint32 | Byte size of deflated ````each_mesh_matrices_portion````. | |
| ````size_each_mesh_texture_set```` | Uint32 | Byte size of deflated ````each_mesh_texture_set````. | |
| ````size_each_mesh_material_attributes```` | Uint32 | Byte size of deflated ````each_mesh_material_attributes````. | |
| ````size_each_entity_id```` | Uint32 | Byte size of deflated ````each_entity_id````. | |
| ````size_each_entity_meshes_portion```` | Uint32 | Byte size of deflated ````each_entity_meshes_portion````. | |
| ````size_each_tile_aabb```` | Uint32 | Byte size of deflated ````each_tile_aabb````. | |
| ````size_each_tile_entities_portion```` | Uint32 | Byte size of deflated ````each_tile_entities_portion````. | |
| ````metadata```` | JSON | Metadata - see schema: [xkt_v10_metadata_schema.md](https://github.com/xeokit/xeokit-convert/tree/master/specs/xkt_v10_metadata_schema.md). | Deflated |
| ````texture_data```` | Uint8[] | Concatenation of all textures data. | Deflated |
| ````each_texture_data_portion```` | Uint32[] | For each texture, base index of a portion in ````texture_data````. | Deflated |
| ````each_texture_attributes```` | Unit16[] | For each texture, ````8```` attributes, each encoded as a 16-bit integer; ````mediaType````, ````width````, ````height````, ````minFilter````, ````magFilter````, ````wrapS````, ````wrapT````, ````wrapR````. | Deflated |
| ````positions````  | Uint16[] | [Quantized](#quantization) vertex positions shared by types of geometries. Each primitive can have a portion of this array. Portions for geometries that are only used by one entity are in [World Space](#world-space) coordinates. Portions for geometries that are used by multiple entities are in [Model Space](#Model-space) coordinates. | Deflated |
| ````normals```` | Uint8[] | [Oct-encoded](#oct-encoding) vertex normals shared by geometries that represent triangle meshes. Each primitive can have a portion of this array. | Deflated |
| ````colors```` | Uint8[] | Vertex colors shared by geometries. Each primitive can have a portion of this array. | Deflated |
| ````indices```` | Uint32[] | Geometry indices shared by geometries that represent triangle meshes and line segments. Each primitive has a portion of this array. | Deflated |
| ````edge_indices```` | Uint32[] | Geometry edge indices for geometries that represent triangle meshes, used for edge enhancement effects. Has two elements per edge. Each triangle mesh primitive has a portion of this array. | Deflated |
| ````matrices```` | Float32[] | Modeling matrices for reused geometries. Has sixteen elements per matrix. Each reused geometry has a portion of this array. | Deflated |
| ````reused_geometries_decode_matrix```` | Float32[] | A singular dequantization matrix for ````positions```` belonging to geometries that are shared by multiple entities. Has sixteen elements. | Deflated |
| ````each_geometry_primitive_type```` | Uint8 | Primitive type for each geometry (0=solid triangle mesh, 1=open triangle mesh surface, 2=points, 3=lines). | Deflated |
| ````each_geometry_positions_portion```` | Uint32[] | For each geometry, base index of a portion in ````positions````. This is provided for all geometry primitive types. | Deflated |
| ````each_geometry_normals_portion```` | Uint32[] | For each triangles geometry that needs vertex normals, base index of a portion in ````normals````. This is only used by triangles geometry primitive types, and is optional. When no normals are provided for a geometry, this will have the same value as for the previous geometry, or ````0```` if this is the first geometry in the ````xkt```` file. | Deflated |
| ````each_geometry_colors_portion```` | Uint32[] | For each geometry that needs vertex colors, base index of a portion in ````colors````. This is only used by geometries that need vertex colors, and is optional. When no vertex colors are provided for a geometry, this will have the same value as for the previous geometry, or ````0```` if this is the first geometry in the ````xkt```` file. | Deflated |
| ````each_geometry_indices_portion```` | Uint32[] | For each triangle and line geometry, base index of a portion in ````indices````. This is only used by geometries that need vertex colors, and is optional. When no vertex colors are provided for a geometry, this will have the same value as for the previous geometry, or ````0```` if this is the first geometry in the ````xkt```` file.| Deflated |
| ````each_geometry_edge_indices_portion```` | Uint32[] | For each geometry that represents a triangle mesh, base index of a portion in ````edge_indices````. | Deflated |
| ````each_mesh_geometries_portion```` | Uint32[] | For each mesh, an index into the ````each_geometry*```` arrays. | Deflated |
| ````each_mesh_matrices_portion```` | Uint32[] | For each mesh that shares its geometry, an index to its first element in ````matrices````, to indicate the modeling matrix that transforms the shared geometry's Local-space vertex positions. This is ignored for meshes that don't share geometry, because the vertex positions of non-shared geometries are pre-transformed into World-space. | Deflated |
| ````each_mesh_material```` | Uint8[] | For each mesh, an RGBA integer color of format ````[0..255, 0..255, 0..255, 0..255]````, and PBR metallic and roughness factors, of format ````[0..255, 0..255]````. | Deflated |
| ````each_entity_id```` | String | An ID for each entity. This is a string-encoded JSON array of strings. | Deflated |
| ````each_entity_meshes_portion```` | Uint32[] | For each entity, the base index of the entity's portion of the ````each_mesh*```` arrays. | Deflated |
| ````each_tile_aabb```` | Float64[] | A World-space, axis-aligned bounding box (AABB) for each tile. Each AABB has six full-precision values that indicate the min and max extents of the box on each axis: *xmin*, *ymin*, *zmin*, *xmax*, *ymax* and *zmax*.| Deflated |
| ````each_tile_entities_portion```` | Uint32[] | For each tile, an index to the first element of tile's portion of the ````each_entity_*```` arrays. | Deflated |

## Metadata

See [xkt_v10_metadata_schema.json](https://github.com/xeokit/xeokit-convert/blob/master/specs/xkt_v10_metadata.schema.json).

## zlib Deflation

Note the last column in the table above, which indicates that some of the elements are deflated
using [zlib](http://www.zlib.net/). The [xeokit-gltf-to-xkt](https://github.com/xeokit/xeokit-gltf-to-xkt) tool and the
[XKTLoaderPlugin](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js~XKTLoaderPlugin.html)
plugin both use
[pako.js](https://github.com/nodeca/pako), which is a JavaScript port of zlib, to deflate and inflate.

When loading ````.xkt````, ````XKTLoaderPlugin```` inflates those elements before parsing them.

## Metadata JSON

----------------
TODO
----------------