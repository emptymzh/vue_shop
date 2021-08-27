import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
import Order from './components/oreder/Order.vue'
import Report from './components/report/Report.vue'
Vue.use(Router)

const router = new Router({
  //解决vue ui的热更新问题

  routes: [
    { path:'/',redirect:'/login'},
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
      redirect:'/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report}
    ]}
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //若访问登录页直接放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  //无token 返回登录页面
  if (!tokenStr) return next('/login')
  //有token 也放行
  next()
})

export default router

