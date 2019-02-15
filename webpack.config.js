const path = require('path')
const webpack = require('webpack')
const config = require('./configs/config')
const vueLoaderConfig = require('./configs/vue-loader.conf');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const weexLoaderOptions = {
  loaders: {
    scss: ['sass-loader'],
    sass: [{
      loader: 'sass-loader',
      options: { indentedSyntax: true }
    }],
    less: ['less-loader'],
    stylus: ['stylus-loader'],
    styl: ['stylus-loader']
  }
}
const vueLoaderOptions = {
  optimizeSSR: false,
  postcss: [
    // to convert weex exclusive styles.
    require('postcss-plugin-weex')(),
    require('autoprefixer')({
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }),
    require('postcss-plugin-px2rem')({
      // base on 750px standard.
      rootValue: 75,
      // to leave 1px alone.
      minPixelValue: 1.01
    })
  ],
  compilerModules: [
    {
      postTransformNode: el => {
        // to convert vnode for weex components.
        require('weex-vue-precompiler')()(el)
      }
    }
  ]
}

function createConfig (option = {}) {
  const { isWeex, minify } = option
  const suffix = `.${isWeex ? 'weex' : 'web'}${minify ? '.min': '' }.js`
  const webpackConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules(?!\/.*(weex).*)/
      }, {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: isWeex ? 'weex-loader' : 'vue-loader',
          options: isWeex ? weexLoaderOptions : vueLoaderOptions
        }]
      },
      {
        test: /\.scss$/,
        loader: "css!sass",//这样写样式和脚本会混在一个文件，也就是不分离样式，webpack有插件可以实现分离样式
        exclude: /node_modules/
      }]
    },
    node: config.nodeConfiguration,
    plugins: [
      new FileManagerPlugin({
        onEnd: {
          copy: [
            { source: `dist/${option.outputName}.weex.min.js`, destination: '/Users/mac/Downloads/dl_dr_android/trunk/dl_dr/app/src/main/assets/' },
            { source: `dist/${option.outputName}.weex.min.js`, destination: '/Users/mac/Downloads/dl_dr_ios/trunk/dl_dr/Weex/bundlejs/' }
          ]
        }
      })
    ]
  }
  const webConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules(?!\/.*(weex).*)/
      }, {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: Object.assign(vueLoaderConfig({useVue: true, usePostCSS: false}), {
            /**
             * important! should use postTransformNode to add $processStyle for
             * inline style prefixing.
             */
            optimizeSSR: false,
            postcss: [
              // to convert weex exclusive styles.
              require('postcss-plugin-weex')(),
              require('autoprefixer')({
                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
              }),
              require('postcss-plugin-px2rem')({
                // base on 750px standard.
                rootValue: 75,
                // to leave 1px alone.
                minPixelValue: 1.01
              })
            ],
            compilerModules: [
              {
                postTransformNode: el => {
                  // to convert vnode for weex components.
                  require('weex-vue-precompiler')()(el)
                }
              }
            ]
            
          })
        }]
      }]
    },
    plugins: []
  }
  const weexConfig = {
    entry: option.entry,
    output: {
      path: path.resolve(__dirname, option.outputPath || 'dist'),
      filename: (option.outputName || 'bundle') + suffix
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader'
          }]
        },
        {
          test: /\.vue(\?[^?]+)?$/,
          use: [{
            loader: 'weex-loader',
            options: vueLoaderConfig({useVue: false})
          }]
        },
        {
          test: /\.(otf|eot|svg|ttf|woff|woff2)/,
          use: "url-loader?limit=50000&name=[path][name].[ext]"
        },
        {
          test: /\.css/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
		node: config.nodeConfiguration,
    plugins: [
          /**
           * Plugin: webpack.DefinePlugin
           * Description: The DefinePlugin allows you to create global constants which can be configured at compile time. 
           *
           * See: https://webpack.js.org/plugins/define-plugin/
           */
          
    ]
  }

  // if (minify && isWeex) {
  //   weexConfig.plugins.push(new UglifyJSPlugin())
  //   weexConfig.plugins.push(new webpack.BannerPlugin({
  //     banner:  '// { "framework": "Vue" }\n"use weex:vue";\n',
  //     raw: true
  //   }))
  //   weexConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('release')
  //   }))
  //   return weexConfig
  // }
  // if (!minify && isWeex) {
  //   weexConfig.plugins.push(new webpack.BannerPlugin({
  //     banner:  '// { "framework": "Vue" }\n"use weex:vue";\n',
  //     raw: true
  //   }))
  //   weexConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('debug')
  //   }))
  //   return weexConfig
  // }
  // if (minify && !isWeex) {
  //   webConfig.plugins.push(new UglifyJSPlugin())
  //   webConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('release')
  //   }))
  //   return webConfig
  // }
  // if (!minify && !isWeex) {
  //   webConfig.plugins.push(new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify('debug')
  //   }))
  //   return webConfig
  // }
  if (minify && isWeex) {
    webpackConfig.plugins.push(new UglifyJSPlugin())
    webpackConfig.plugins.push(new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
      raw: true
    }))
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('release')
    }))
    return webpackConfig
  }
  if (!minify && isWeex) {
    webpackConfig.plugins.push(new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" }\n"use weex:vue";\n',
      raw: true
    }))
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
    }))
    return webpackConfig
  }
  if (minify && !isWeex) {
    webpackConfig.plugins.push(new UglifyJSPlugin())
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('release')
    }))
    return webpackConfig
  }
  if (!minify && !isWeex) {
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
    }))
    return webpackConfig
  }

}

function generateWebpackConfigs (options) {
  const buildOptions = []
  for (const name in options) {
    const option = typeof options[name] === 'string'
      ? ({ entry: options[name] })
      : options[name]
    option.outputName = name
    buildOptions.push(Object.assign({}, option, { isWeex: true, minify: false }))
    buildOptions.push(Object.assign({}, option, { isWeex: false, minify: false }))
    buildOptions.push(Object.assign({}, option, { isWeex: true, minify: true }))
    buildOptions.push(Object.assign({}, option, { isWeex: false, minify: true }))
  }
  return buildOptions.map(createConfig)
}

module.exports = generateWebpackConfigs({
  app: path.resolve('src/entries', 'app.js'),
  home: path.resolve('src/entries', 'home.js'),
  message: path.resolve('src/entries/message', 'message.js'), // 消息
  follow_up: path.resolve('src/entries/follow_up', 'follow_up.js'), // 今日随访
  no_follow_up: path.resolve('src/entries/no_follow_up', 'no_follow_up.js'), // 逾期未随访
  follow: path.resolve('src/entries/follow', 'follow.js'), // 重点关注
  warning: path.resolve('src/entries/warning', 'warning.js'), // 预警
  record: path.resolve('src/entries/record', 'record.js'), // 随访记录
  untie: path.resolve('src/entries/untie', 'untie.js'), //已解绑
  prescriptionReview: path.resolve('src/entries/prescription', 'prescriptionReview.js'), // 处方审核
  review: path.resolve('src/entries/prescription', 'review.js'),

  // 用户
  archives: path.resolve('src/entries/onhealth', 'archives.js'), // 健康档案
  presentation: path.resolve('src/entries/onhealth', 'presentation.js'), // 健康报告
  historicalReport: path.resolve('src/entries/onhealth', 'historicalReport.js'), // 历史健康报告
  reportDetails: path.resolve('src/entries/onhealth', 'reportDetails.js'),
  generationReport: path.resolve('src/entries/onhealth', 'generationReport.js'), // 已生成报告

  prescription: path.resolve('src/entries/onhealth', 'prescription.js'), // 饮食处方
  foodReplace: path.resolve('src/entries/onhealth', 'foodReplace.js'), // 更换推荐
  itemModify: path.resolve('src/entries/onhealth', 'itemModify.js'), // 各项修改

  healthBehavior: path.resolve('src/entries/onhealth', 'healthBehavior.js'), // 健康行为

  dietaryRecords: path.resolve('src/entries/diet', 'dietaryRecords.js'), // 饮食记录
  dieteticDiary: path.resolve('src/entries/diet', 'dieteticDiary.js'), // 饮食日志
  
  recordAnswer: path.resolve('src/entries/answer', 'recordAnswer.js'), // 答题记录
  recordDetails: path.resolve('src/entries/answer', 'recordDetails.js'), // 答题详情

  // 随访
  teamIntroduce: path.resolve('src/entries/team', 'teamIntroduce.js'), // 团队介绍
  
  // 我的
  statistics: path.resolve('src/entries/statistics', 'statistics.js'), // 随访统计
  managementTeam: path.resolve('src/entries/team', 'managementTeam.js'), // 管理团队
  doctorTeam: path.resolve('src/entries/team', 'doctorTeam.js'), // 医生团队
  addMembers: path.resolve('src/entries/team', 'addMembers.js'), // 添加成员
  createTeam: path.resolve('src/entries/team', 'createTeam.js'), // 创建团队
})
