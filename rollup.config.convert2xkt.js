import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import minify from 'rollup-plugin-minify-es';

export default {
    input: './src/convert2xkt.js',
    output: [
        {
            file: './dist/convert2xkt.cjs.js',
            include: '/node_modules/',
            format: 'cjs',
            name: 'bundle'
        }
    ],
    external: [
        'fs', "crypto", "path"
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