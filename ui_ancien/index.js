const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const args = process.argv;
const webpackConfig = require('./config.webpack');

new WebpackDevServer(webpack(webpackConfig), {
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    contentBase: './public/'
}).listen(3000, 'localhost');
