// Bot-only deployment for Heroku
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/bot-only-index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[contenthash].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/templates/app/bot-only.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/templates/app/bot-only.html',
            filename: 'bot/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../../../node_modules/@deriv/bot-web-ui/dist/bot'),
                    to: 'bot',
                },
                {
                    from: path.resolve(__dirname, '../src/public/images/favicons'),
                    to: 'public/images/favicons',
                },
                {
                    from: path.resolve(__dirname, '../src/public/images/common/logos'),
                    to: 'public/images/common/logos',
                },
            ],
        }),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 4096000
    }
}; 