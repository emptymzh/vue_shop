import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
//这里使用了路由懒加载 使得login home welcom组件放到了一个文件夹打包，当路由被访问的时候才加载对应组件
const Login = () => import(/* webpackChunkName: "login_home_Welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_Welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_Welcome" */ './components/Welcome.vue')

const  Users= () => import(/* webpackChunkName: "users_rights_roles" */ './components/user/Users.vue')
const  Rights= () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Rights.vue')
const  Roles= () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Roles.vue')

const  Cate= () => import(/* webpackChunkName: "cate_params" */ './components/goods/Cate.vue')
const  Params= () => import(/* webpackChunkName: "cate_params" */ './components/goods/Params.vue')

const  List= () => import(/* webpackChunkName: "list_add" */ './components/goods/List.vue')
const  Add= () => import(/* webpackChunkName: "list_add" */ './components/goods/Add.vue')

const  Order= () => import(/* webpackChunkName: "order_report" */ './components/oreder/Order.vue')
const  Report= () => import(/* webpackChunkName: "order_report" */ './components/report/Report.vue')

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

