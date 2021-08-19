import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
/* 导入字体图标 */
// import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//这样每个vue的组件都可以通过this直接访问到$http 从而发起ajax请求
// $这里是为了区别，比如一个已经定义的属性，方法等也叫http
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
