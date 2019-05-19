const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'; 

module.exports = {
    entry: {
        main: './src/air.js',
        vendors: [ 'vue', 'axios', 'vue-axios', 'vue-router', 'vuex' ]
    },
    output: {
        filename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
        chunkFilename: devMode ? 'js/[name].chunk.js' : 'js/[name].chunk.[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: devMode ? '/' : 'https://sokyo.gitee.io/dist/'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    transformAssetUrls: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            {
                test:  /\.(sc|c)ss$/,
                use: [
                    devMode
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            minimize: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|svg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: 'img/[name].[hash:7].[ext]',
                        publicPath: devMode ? '/' : 'https://sokyo.gitee.io/dist/'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'air',
            inject: true
        })
    ]
};