# webpack-concat-plugin
Concat files for Webpack 4.X

###Example

```js

const WebPackConcatPlugin = require('webpack-concat');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    // build path -> path where files are located
    // it will concat **files** in given order and
    // concat them into single **output** file
    plugins: [
        new WebPackConcatPlugin({
            buildPath: ['build', 'prod'],
            output: 'output.js',
            files: ['file1.js', 'file2.js']
        }),
    ]
};


```