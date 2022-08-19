const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
    {
        target: 'node',
        entry: './index.dist.node.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: "xeokit-convert.cjs.js",
            library: {
                name: 'convert2xkt',
                type: 'umd',
            }
        },
        // optimization: {
        //     minimize: false
        // },
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
    }
];
