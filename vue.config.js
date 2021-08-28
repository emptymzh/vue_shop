module.exports = {
    /* 禁用Eslint */
    lintOnSave: false,
    // 通过chainWebpack 自定义打包入口   main.js应该直接命名位mai-dev.js的，但是有个依赖就是要main.js，会报错
    //生产模式
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            //配置成CDN资源 用到了里面相关的 它就会去windows全局找，然后直接去网上找资源  显著减少了打包文件的体积
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
                })
        })
        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
                })
        })
    }
}

