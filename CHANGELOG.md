# xeokit-convert Changelog

## [1.3.0](https://github.com/xeokit/xeokit-convert/compare/v1.2.0...v1.3.0) (2025-05-28)


### Features

* Not calculating edges for meshes containing to many triangles ([4dadf2c](https://github.com/xeokit/xeokit-convert/commit/4dadf2c70cdf51443cdc87bf944ad825ef100da3))

### Other changes

* upgrade loaders.gl to 4.x

# [v1.2.0](https://github.com/xeokit/xeokit-convert/compare/v1.1.25...v1.2.0) (2025-04-17)

### Features
* Dropped Code Bundling:
  Starting with this version, we no longer publish a bundled artifact to npm.

* Dropped CommonJS Module Support:
  This version also drops official support for CommonJS modules. While existing CommonJS imports may still work, they are no longer guaranteed to be supported or maintained.

* No Other Functional Changes:
This release does not introduce any other changes to package functionality.

#### Breaking Changes:
As a result of these changes, the following import patterns are no longer supported:
```js
// ❌ No longer supported:
const { XKT_INFO } = require("./dist/xeokit-convert.cjs.js");
import { XKT_INFO } from "./dist/xeokit-convert.cjs.js";
import { convert2xkt } from 'https://cdn.jsdelivr.net/npm/@xeokit/xeokit-convert/dist/xeokit-convert.cjs.js';
```
Please refer to the updated README.md for supported import patterns and migration guidance.

# [v1.1.25](https://github.com/xeokit/xeokit-convert/compare/v1.1.24...v1.1.25)

### 27 February 2025

-  Extend gltfToXktConvert to handle extras attribute for IfcAxisLabels - [#194](https://github.com/xeokit/xeokit-convert/pull/194)
-  refactor: write conversionDate in ISO format in manifest - [#190](https://github.com/xeokit/xeokit-convert/pull/190)

# [v1.1.24](https://github.com/xeokit/xeokit-convert/compare/v1.1.23...v1.1.24)

### 9 January 2025

-  fix: [XEOK190] use native TextEncoder - [#189](https://github.com/xeokit/xeokit-convert/pull/189)
-  [FIX] First argument to DataView constructor must be an ArrayBuffer - [#181](https://github.com/xeokit/xeokit-convert/pull/181)

# [v1.1.23](https://github.com/xeokit/xeokit-convert/compare/v1.1.22...v1.1.23)

### 11 October 2024

-  fix: switch library for TextEncoder - [#179](https://github.com/xeokit/xeokit-convert/pull/179)

# [v1.1.22](https://github.com/xeokit/xeokit-convert/compare/v1.1.21...v1.1.22)

### 6 September 2024

-  Improved gltf geometry reuse - [#175](https://github.com/xeokit/xeokit-convert/pull/175)

# [v1.1.21](https://github.com/xeokit/xeokit-convert/compare/v1.1.20...v1.1.21)

### 6 September 2024

-  [FIX] Fix glTF geometry reuse - [#174](https://github.com/xeokit/xeokit-convert/pull/174)

# [v1.1.20](https://github.com/xeokit/xeokit-convert/compare/v1.1.19...v1.1.20)

### 26 August 2024

-  Implement xkt's V11 export - [#172](https://github.com/xeokit/xeokit-convert/pull/172)

# [v1.1.19](https://github.com/xeokit/xeokit-convert/compare/v1.1.18...v1.1.19)

### 5 August 2024

-  Rebuild - [#170](https://github.com/xeokit/xeokit-convert/pull/170)
-  Convert glTF with nodes without 'name' attributes - [#169](https://github.com/xeokit/xeokit-convert/pull/169)
-  chore: update package.json run scripts - [#165](https://github.com/xeokit/xeokit-convert/pull/165)

# [v1.1.18](https://github.com/xeokit/xeokit-convert/compare/v1.1.17...v1.1.18)

### 3 June 2024

-  [FIX] Fix LAS/LAS intensities for v1.2 - [#161](https://github.com/xeokit/xeokit-convert/pull/161)

# [v1.1.17](https://github.com/xeokit/xeokit-convert/compare/v1.1.16...v1.1.17)

### 6 May 2024

-  Make convert2xkt configs optional - [#155](https://github.com/xeokit/xeokit-convert/pull/155)

# [v1.1.16](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-9...v1.1.16)

### 27 April 2024

-  [FIX] Convert nested named glTF nodes - [#152](https://github.com/xeokit/xeokit-convert/pull/152)
-  [FIX] Support glTF line loop primitive - [#150](https://github.com/xeokit/xeokit-convert/pull/150)
-  Fix file extension detection - [#147](https://github.com/xeokit/xeokit-convert/pull/147)
-  Fix source file extension detection - [#146](https://github.com/xeokit/xeokit-convert/pull/146)

# [v1.1.15-beta-9](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-8...v1.1.15-beta-9)

### 14 April 2024

-  Use path lib to get input filename extension - [#144](https://github.com/xeokit/xeokit-convert/pull/144)

# [v1.1.15-beta-8](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-7...v1.1.15-beta-8)

### 10 April 2024

-  Fix file path for JSON metamodel file in manifest for Windoze - [#140](https://github.com/xeokit/xeokit-convert/pull/140)

# [v1.1.15-beta-7](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-6...v1.1.15-beta-7)

### 27 March 2024

-  Removed tests - [#138](https://github.com/xeokit/xeokit-convert/pull/138)
-  Fix output path for Windows - [#137](https://github.com/xeokit/xeokit-convert/pull/137)

# [v1.1.15-beta-6](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-5...v1.1.15-beta-6)

### 14 March 2024

-  Fix conversion of manifests with external metamodels - [#135](https://github.com/xeokit/xeokit-convert/pull/135)
-  Remove duplicate information for "Converting IFC file data into XKT data" within the documentation - [#134](https://github.com/xeokit/xeokit-convert/pull/134)

# [v1.1.15-beta-12](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-11...v1.1.15-beta-12)

### 24 April 2024

-  [FIX] Support glTF line loop primitive - [#150](https://github.com/xeokit/xeokit-convert/pull/150)

# [v1.1.15-beta-11](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-10...v1.1.15-beta-11)

### 18 April 2024

-  Fix file extension detection - [#147](https://github.com/xeokit/xeokit-convert/pull/147)

# [v1.1.15-beta-10](https://github.com/xeokit/xeokit-convert/compare/v1.1.15-beta-1...v1.1.15-beta-10)

### 18 April 2024

-  Fix source file extension detection - [#146](https://github.com/xeokit/xeokit-convert/pull/146)
-  Use path lib to get input filename extension - [#144](https://github.com/xeokit/xeokit-convert/pull/144)
-  Fix file path for JSON metamodel file in manifest for Windoze - [#140](https://github.com/xeokit/xeokit-convert/pull/140)
-  Removed tests - [#138](https://github.com/xeokit/xeokit-convert/pull/138)
-  Fix output path for Windows - [#137](https://github.com/xeokit/xeokit-convert/pull/137)
-  Fix conversion of manifests with external metamodels - [#135](https://github.com/xeokit/xeokit-convert/pull/135)
-  Remove duplicate information for "Converting IFC file data into XKT data" within the documentation - [#134](https://github.com/xeokit/xeokit-convert/pull/134)
-  Gltf triangles indices - [#133](https://github.com/xeokit/xeokit-convert/pull/133)
-  Support glb json independent splitting - [#132](https://github.com/xeokit/xeokit-convert/pull/132)

# [v1.1.15-beta-1](https://github.com/xeokit/xeokit-convert/compare/v1.1.12...v1.1.15-beta-1)

### 25 January 2024

-  Implement LAS skip option - [#126](https://github.com/xeokit/xeokit-convert/pull/126)
-  Enhanced configurability for LAS, CityJSON and IFC conversion - [#121](https://github.com/xeokit/xeokit-convert/pull/121)

# [v1.1.12](https://github.com/xeokit/xeokit-convert/compare/v1.1.11...v1.1.12)

### 10 January 2024

-  Fix disabletextures and disablenormals options - [#120](https://github.com/xeokit/xeokit-convert/pull/120)

# [v1.1.9](https://github.com/xeokit/xeokit-convert/compare/v1.1.8...v1.1.9)

### 10 August 2023

-  Update README - [#114](https://github.com/xeokit/xeokit-convert/pull/114)
-  Support split file output from ifc2gltf - [#113](https://github.com/xeokit/xeokit-convert/pull/113)

# [v1.1.8](https://github.com/xeokit/xeokit-convert/compare/v1.1.7...v1.1.8)

### 3 August 2023

-  support line-strip - [#112](https://github.com/xeokit/xeokit-convert/pull/112)
-  add commander in dependences, needed by cli - [#110](https://github.com/xeokit/xeokit-convert/pull/110)
-  Bump web-ifc - [#106](https://github.com/xeokit/xeokit-convert/pull/106)

# [v1.1.6](https://github.com/xeokit/xeokit-convert/compare/v1.1.3...v1.1.6)

### 20 December 2022

-  Update READMD to include TypeError: fetch failed - [#91](https://github.com/xeokit/xeokit-convert/pull/91)

# [v1.1.3](https://github.com/xeokit/xeokit-convert/compare/v1.1.2...v1.1.3)

### 3 September 2022

-  Improve memory performance - [#78](https://github.com/xeokit/xeokit-convert/pull/78)

# [v1.1.2](https://github.com/xeokit/xeokit-convert/compare/v1.1.1...v1.1.2)

### 22 August 2022

-  LoadAllGeometry does not return IFCSpace meshes, here is a workaround - [#76](https://github.com/xeokit/xeokit-convert/pull/76)

# [v1.1.0](https://github.com/xeokit/xeokit-convert/compare/1.0.7...v1.1.0)

### 16 August 2022

-  Support texture params in XKT10 - [#67](https://github.com/xeokit/xeokit-convert/pull/67)
-  Make sure to export `.external` attribute for `MetaObject` JSON DTO - [#61](https://github.com/xeokit/xeokit-convert/pull/61)
-  Convert to XKT v10 - [#50](https://github.com/xeokit/xeokit-convert/pull/50)
-  Set exit code to zero when converting is successful completed - [#47](https://github.com/xeokit/xeokit-convert/pull/47)
-  Convert glTF using loaders.gl - [#39](https://github.com/xeokit/xeokit-convert/pull/39)

# [1.0.7](https://github.com/xeokit/xeokit-convert/compare/1.0.0-beta.8...1.0.7)

### 14 April 2022

-  Peformance improvement: avoid expensive `glTF` data loading/decoding. - [#27](https://github.com/xeokit/xeokit-convert/pull/27)
-  add rotateX - [#15](https://github.com/xeokit/xeokit-convert/pull/15)

# [1.0.0-beta.8]()

### 30 November 2021

-  enable using the published npm package as CLI - [#6](https://github.com/xeokit/xeokit-convert/pull/6)
