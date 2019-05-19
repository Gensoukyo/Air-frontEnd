const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      },
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: [
        new MiniCssExtractPlugin({
	      filename: "css/[name].[hash:5].css",
	      chunkFilename: "css/[id].[hash:5].css"
	    }),
        new webpack.HashedModuleIdsPlugin()
    ]
});