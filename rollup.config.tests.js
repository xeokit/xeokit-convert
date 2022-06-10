import {nodeResolve} from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy";

export default [
    // Copy xeokit-sdk to test assets dir
    {
        input: "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js",
        output: {
            file: './assets/lib/xeokit-sdk.es.js',
            format: 'es',
            name: 'bundle'
        },
        plugins: [
            nodeResolve(),
            copy({
                targets: [
                    {
                        src: './node_modules/web-ifc/web-ifc.wasm',
                        dest: 'visualTests'
                    },
                    {
                        src: './node_modules/web-ifc/web-ifc-api.js',
                        dest: 'assets/lib'
                    }

                ]
            })
        ]
    },
    // Transpile web-ifc to test assets dir
    {
        input: './node_modules/web-ifc/web-ifc-api.js',
        output: [
            {
                file: './assets/lib/web-ifc-browser.es.js',
                format: 'es',
                name: 'bundle'
            }
        ]
    }
];