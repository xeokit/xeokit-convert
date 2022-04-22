import {nodeResolve} from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy";

export default {
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
                }
            ]
        })
    ]
}