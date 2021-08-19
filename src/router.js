import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'


Vue.use(Router)

const router = new Router({
  //解决vue ui的热更新问题

  routes: [
    { path:'/',redirect:'/login'},
    { path: '/login', component: Login },
    { path:'/home',component: Home}
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

