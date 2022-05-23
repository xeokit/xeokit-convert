const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [

    // CJS
    {
        target: 'node',
        entry: ["regenerator-runtime/runtime.js", './index.dist.node.js'],
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: "xeokit-convert.cjs.js",
            library: {
                name: 'convert2xkt',
                type: 'umd',
            },
        },
        externalsPresets: {node: true}, // in order to ignore built-in modules like path, fs, etc.
        externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {from: "./node_modules/web-ifc/web-ifc.wasm", to: "web-ifc.wasm"}
                ],
            }),
        ],
        devtool: 'source-map'
    },

    // ES6
    {
        target: 'web',
        entry: ["regenerator-runtime/runtime.js", './src/convert2xkt.js'],
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: "convert2xkt.umd.js",
            library: {
                //       name: 'convert2xkt',
                type: 'umd',
            },
        },
        externalsPresets: {node: false}, // in order to ignore built-in modules like path, fs, etc.
        externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
        // module: {
        //     rules: [
        //         {
        //             test: /\.(js)$/,
        //             exclude: /node_modules/,
        //             use: {
        //                 loader: 'babel-loader',
        //                 options: {
        //                     presets: ['@babel/preset-env']
        //                 }
        //             }
        //         }
        //     ]
        // },
        devtool: 'source-map'
    }
];
