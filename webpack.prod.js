const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
       runtimeChunk: 'single'
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new MiniCssExtractPlugin({
	      filename: "[name].css",
	      chunkFilename: "[id].css"
	    }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});