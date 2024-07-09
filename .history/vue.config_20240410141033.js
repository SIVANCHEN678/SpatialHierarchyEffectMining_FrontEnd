const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack:config=>{
    // svg图标加载
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/icons/svg'))
      .end()

    config.module
      .rule('icons')// 定义一个名叫 icons 的规则
      .test(/\.svg$/)// 设置 icons 的匹配正则
      .include.add(path.join(__dirname,'src/icons/svg'))// 设置当前规则的作用目录，只在当前目录下才执行当前规则
      .end()
      .use('svg-sprite')// 指定一个名叫 svg-sprite 的 loader 配置
      .loader('svg-sprite-loader')// 该配置使用 svg-sprite-loader 作为处理 loader
      .options({// 该 svg-sprite-loader 的配置
        symbolId:'icon-[name]'
      })
      .end()
  },
  devServer: {

    // 代理配置
    proxy: {
        '/api': {
      
        //target: 'http://10.16.65.45:8088', // 本机
       target: 'http://localhost:8088', // 我们要代理的地址   10.16.30.211:8088
        //target: 'http://10.16.30.211:8088',
        // target: 'http://10.16.30.211:8088',
        changeOrigin: true, // 允许跨域
  // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {
            '^/api': ''  
        }
      },
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
})
