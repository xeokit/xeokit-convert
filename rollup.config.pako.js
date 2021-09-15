import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './src/XKTModel/lib/pako.js',
    output: [
        {
            file: './src/XKTModel/lib/pako.es.js',
            format: 'es',
            name: 'bundle'
        }
    ],
    plugins: [commonjs()]
}