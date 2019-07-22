'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://192.168.15.157:8091',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        // headers: {
        //   //这边可以设置headers
        //   // Host: 'open.gt.com'
        // }
        //使用如下设置请求head的Host可以动态透传
        onProxyReq(proxyReq, req, res) {
          //req.headers.host 这是node.js 获取host的方法必须小写
          proxyReq.setHeader('Host',req.headers.host)
        }
      },
      '/oauth-server': {
        target: 'http://192.168.15.157:8084',
        changeOrigin: true,
        pathRewrite: {
          '^/oauth-server': ''
        }
      },
      '/merchant': {
        target: 'http://192.168.15.157:8388',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/merchant': ''
        // }
      },
      '/admin': { // lowis: http://192.168.3.244:8188  //oma: http://192.168.22.35:8188  //http://192.168.15.157:8188, // recall: http://192.168.3.239:8188 //leo:http://192.168.22.168:8188 // cc:http://192.168.15.162:8188 // h-z:http://192.168.15.57:8080 // wing: http://192.168.23.171:8188
        target: 'http://192.168.15.157:8188',
        changeOrigin: true
      },
      '/oss': { //http://192.168.15.157:8188, // recall: http://192.168.3.239:8777 //leo:http://192.168.22.168:8188 // cc:http://192.168.15.161:8188 // h-z:http://192.168.15.57:8080 // wing: http://192.168.23.171:8188
        target: 'http://192.168.3.239:8777',
        changeOrigin: true
      },
      '/agent': {
        target: 'http://192.168.15.157:8588',
        changeOrigin: true,
      //   pathRewrite: {
      //     '^/agent': ''
      //   }
      }
    },

    // Various Dev Server settings

    // can be overwritten by process.env.HOST
    // if you want dev by ip, please set host: '0.0.0.0'
    // host: 'mer.gt.com',
    // host: 'manage.gt.com',
    // host: 'open.gt.com',
    host: '0.0.0.0',
    // port: 9527, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build:prod --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
