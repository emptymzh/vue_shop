import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
/* 导入字体图标 */
// import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求的根路径 
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios请求拦截器，电商后台的api文档中说了必须在请求头中使用 `Authorization` 字段提供 `token` 令牌，登录后的Authorization为null，因为登录时文档并未要求要有token
axios.interceptors.request.use(config=>{
    //config是请求对象，为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
  })
//这样每个vue的组件都可以通过this直接访问到$http 从而发起ajax请求
// $这里是为了区别，比如一个已经定义的属性，方法等也叫http
Vue.prototype.$http = axios

Vue.config.productionTip = false

//注册为全局可用的组件 用Vue.use也行,是自动注册
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
