const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
        contentBase: path.resolve(__dirname,'dist'),
        host: 'localhost',
        historyApiFallback: true,
        compress: true,
        port: 3000,
        proxy: {
          '/api': 'http://localhost:8080',
          '/assets': 'http://localhost:8080'
        }
    }
});
