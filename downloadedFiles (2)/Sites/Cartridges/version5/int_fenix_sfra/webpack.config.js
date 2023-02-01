/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* globals cat, cd, cp, echo, exec, exit, find, ls, mkdir, rm, target, test */
'use strict';

require('shelljs/make');
var path = require('path');
var webpack = require('sgmf-scripts').webpack;
var ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];
var jsFiles = require('sgmf-scripts').createJsPath();
var scssFiles = require('sgmf-scripts').createScssPath();
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var bootstrapPackages = {
    // Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
    // Button: 'exports-loader?Button!bootstrap/js/src/button',
    // Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
    // Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
    // Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
    // Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
    // Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
    // Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
    // Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
    // Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/src/util'
};

module.exports = [{
    mode: 'development',
    name: 'js',
    entry: jsFiles,
    output: {
        path: path.resolve('./cartridge/static'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /bootstrap(.)*\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', 'es2015'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread'],
                    cacheDirectory: true
                }
            }
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: 4,
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: false,
                    sourceMap: false,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                },
            }),
        ],
    }
}, {
    mode: 'none',
    name: 'scss',
    entry: scssFiles,
    output: {
        path: path.resolve('./cartridge/static'),
        filename: '[name].css'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('autoprefixer')()
                        ]
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve('node_modules'),
                            path.resolve('node_modules/flag-icon-css/sass')
                        ]
                    }
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ]
}];


// for local debugging
//   plugins: [new webpack.optimize.UglifyJsPlugin({
//       output: {beautify: true},
//       mangle: false,
//       compress: {
//         drop_console: false
//       }
//   })]

// for production
//   plugins: [new webpack.optimize.UglifyJsPlugin({
//       minimize: true,
//       sourceMap: false,
//       output: {beautify: true},
//       mangle: {
//         except: ['$', 'exports', 'require']
//       },
//       compress: {
//         drop_console: false
//       }
//   })]