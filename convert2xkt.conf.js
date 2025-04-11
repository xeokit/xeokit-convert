export default {

    "sourceConfigs": { // Conversion options for supported input file types

        //----------------------------------------------------------------------------
        // Configs for converting LAS and LAZ files
        //
        // Some of these configs are only used when the glTF files are accompanied
        // by xeokit's JSON metadata files.
        //
        // These apply for glTF files that are given as a single input file,
        // and also for each glTF files provided with a manifest, eg.
        //
        // node convert2xkt.js -s model.glb -o model.xkt
        // node convert2xkt -a model.glb.manifest.json -o model.xkt.manifest.json
        //
        // We specify the settings separately for '.glb' and '.gltf' files,
        // just for simplicity.
        //----------------------------------------------------------------------------

        "las": {                    // Conversion options for LAS input files
            "center": false,        // Center the point positions?
            "transform": [          // Transform point positions by this matrix; this happens after optionally centering them
                1.0, 0.0, 0.0, 0.0, // Rotate -90 about X axis
                0.0, 0.0, -1.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ],
            "colorDepth": "auto",   // 8, 16 or "auto"
            "fp64": true,           // Expect 64-bit color values
            "skip": 1,              // Convert every nth point (default = 1)
            "minTileSize": 1000      // Minimum RTC tile (default = 1000)
        },

        "laz": {
            "center": false,
            "transform": [
                1.0, 0.0, 0.0, 0.0,
                0.0, 0.0, -1.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ],
            "colorDepth": "auto",
            "fp64": true,
            "skip": 1,
            "minTileSize": 1000
        },

        //----------------------------------------------------------------------------
        // Configs for converting glTF and GLB files, supplied singularly
        // or as sets of files with a manifest.
        //
        // includeTypes and excludeTypes are only used when the glTF files are accompanied
        // by xeokit's JSON metadata files.
        //
        // These apply for glTF files that are given as a single input file,
        // and also for each glTF files provided with a manifest, eg.
        //
        // node convert2xkt.js -s model.glb -o model.xkt
        // node convert2xkt -a model.glb.manifest.json -o model.xkt.manifest.json
        //
        // We specify the settings separately for '.glb' and '.gltf' files,
        // just for simplicity.
        //----------------------------------------------------------------------------

        "gltf": {

            // Reuse geometries? Setting this false will likely make the XKT bigger.

            "reuseGeometries": true,

            // Include textures in XKT?

            "includeTextures": true,

            // Convert normal vectors?

            "includeNormals": false,

            // Only convert these IFC types (when metadata JSON files also provided);
            // comment this out when you want to convert all types (but perhaps want to
            // exclude some types with excludeTypes).

            // "includeTypes":[],

            // Exclude these IFC types from being converted (when metadata JSON files
            // also provided)

            "excludeTypes": [],

            // convert2xkt will divide huge double-precision vertex coordinates into
            // a tiled relative-to-center (RTC) coordinate system, so that the xeokit
            // viewer can render it without rounding errors on GPUs (which are normally
            // single-precision). Setting this to a smaller value may improve precision,
            // but will cause the viewer to do more work while rendering it
            // (i.e. more draw calls). We recommend using the default value unless you get
            // precision problems when rendering (i.e. jittering, or misalignment of objects).

            "minTileSize": 1000,

            // When converting .gltf source files that are accompanied by metadata JSON
            // files, this will cause the metadata JSON files to not be embedded within the XKT output
            // files, and instead be output separately. When converting split glTF / GLB models
            // and outputting a manifest of split XKT files, the JSON files will be listed in the
            // manifest alongside the XKT files.

            "externalMetadata": true
        },

        "glb": {
            "reuseGeometries": true,
            "includeTextures": true,
            "includeNormals": false,
            // "includeTypes":[],
            "excludeTypes": [],
            "minTileSize": 200,

            // When converting GLB source files that are accompanied by metadata JSON
            // files, this will cause the metadata JSON files to not be embedded within the XKT output
            // files, and instead be output separately. When converting split glTF / GLB models
            // and outputting a manifest of split XKT files, the JSON files will be listed in the
            // manifest alongside the XKT files.

            "externalMetadata": true
        },

        //----------------------------------------------------------------------------
        // Configs for converting CityJSON files
        //----------------------------------------------------------------------------

        "json": {
            "center": false,        // Center the point positions?
            "transform": [          // Transform point positions by this matrix; this happens after optionally centering them
                1.0, 0.0, 0.0, 0.0,
                0.0, 0.0, -1.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ],
            "minTileSize": 1000
        }
    }
};