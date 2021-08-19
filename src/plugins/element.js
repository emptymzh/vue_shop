import Vue from 'vue'
import { Button } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示组件    element-ui里面的都可以合并到 一个{}
import { Message } from 'element-ui'
//Vue的插件(组件)是一个对象,
//Vue.use()里可以是一个对象也可以是一个函数，如果是函数就会被当作install
// 插件对象必须有install字段.install字段是一个函数.
// 初始化插件对象需要通过Vue.use()，因为它会Vue.use直接调用了这个Install方法,
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//一般插件会用USE导入 公共方法用prototype
//Message需要全局挂载  $message是自己的一个自定义属性
//每一个vue组件都是Vue的实例，所以组件内this可以拿到Vue.prototype上添加的属性和方法。
Vue.prototype.$message=Message
