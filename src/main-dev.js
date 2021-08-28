import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器相关样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
/* 导入字体图标 */
// import './assets/fonts/iconfont.css'

//导入网页加载时的进度条效果的Js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求的根路径 
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios请求拦截器，电商后台的api文档中说了必须在请求头中使用 `Authorization` 字段提供 `token` 令牌，登录后的Authorization为null，因为登录时文档并未要求要有token
axios.interceptors.request.use(config => {
//在request拦截器中。展示进度条 NProgress.start()
  NProgress.start()
    //config是请求对象，为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
//在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
  })
//这样每个vue的组件都可以通过this直接访问到$http 从而发起ajax请求
// $这里是为了区别，比如一个已经定义的属性，方法等也叫http
Vue.prototype.$http = axios

Vue.config.productionTip = false

//全局的
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') /* 转为字符串再调用此函数，第一个表示总长多少位，不足就用第二个参数 */
  const d = (dt.getDate()+'').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//注册为全局可用的组件 用Vue.use也行,是自动注册
Vue.component('tree-table', TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
