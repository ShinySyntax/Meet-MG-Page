const path = require('path');
const webpack = require('webpack');
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/', //vueConf.baseUrl, // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: './static/', // 静态资源目录 (js, css, img, fonts) 
    indexPath: 'index.html',
    lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    css: { // 配置高于chainWebpack中关于css loader的配置
        // modules: true, // 是否开启支持‘foo.module.css’样式
        // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
        sourceMap: false, // 是否在构建样式地图，false将提高构建速度
        loaderOptions: { // css预设器配置项
            sass: {
                data: ''//`@import "@/_admin/assets/scss/mixin.scss";`
            }
        }
    },
    // module: {
    //     rules: [
    //       { test: /\.m4a$/, use: 'raw-loader' }
    //     ]
    //   },
    chainWebpack:(config)=>{//配置路径别名
        config.resolve.alias
        .set('@_',resolve('./src/_admin'))
    //     ,config.plugin('provide').use(webpack.ProvidePlugin, [{
    //      'window.Quill': 'quill/dist/quill.js',
    // 'Quill': 'quill/dist/quill.js'
    //     }])
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: { // 第三方插件配置
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, "src/_admin/assets/style/less/common.less")] // 引入全局样式变量
        },
    },
    configureWebpack: {
        plugins: [
          new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery",
                'window.Quill': 'quill/dist/quill.js',
                'Quill': 'quill/dist/quill.js'
                // "window.Quill": "quill",
                // "Quill":"quill"
            })
        ],
        module: {
            rules: [
            { test: /\.m4a$/, use: 'raw-loader' },
            {
              test: /\.js$/,
              exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
              loader: 'babel-loader'
            }
            ]
        },
    },
    devServer: {
        open: false,
        host: '0.0.0.0',
        port: 9070,
        https: false,
        hotOnly: false,
        proxy: {
            "/tioadmin": {
                //服务器
                target: "http://121.43.236.18:6061",
                // target: "http://120.26.108.188:6061",
                // target: "http://116.62.211.142:6061",
                // target: "http://47.97.67.167:6061",

                changeOrigin: true,
                pathRewrite: {
                '^/tioadmin': '' 
                },
                // cookieDomainRewrite:'192.168.1.8'//重写cookie 的domain
                cookieDomainRewrite:''//重写cookie 的domain
            },
            
        },
        before: app => {}
    }
}