import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import minify from 'rollup-plugin-minify-es';

export default {
    input: './src/convert2xkt_browser.js',
    output: [
        {
            file: './dist/convert2xkt_browser.cjs.js',
            include: '/node_modules/',
            format: 'cjs',
            name: 'bundle'
        }
    ],
    external: [
        "crypto"
    ],
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs(),
        minify()
    ]
}