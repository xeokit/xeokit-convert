import {nodeResolve} from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './index.dist.browser.js',
    output: [
        {
            file: './dist/xeokit-convert.es.js',
            include: '/node_modules/',
            format: 'es',
            name: 'bundle'
        }
    ],
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs(),
        copy({
            targets: [
                {
                    src: './node_modules/web-ifc/web-ifc.wasm',
                    dest: 'dist'
                }
            ]
        })
    ]
}