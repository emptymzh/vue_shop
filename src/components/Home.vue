<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 通过判断是否折叠变化侧边栏宽度 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--unique-opened这里得属性绑定不然它会认为true是字符串而不是布尔值 
          或者直接用unique-opened -->
        <el-menu :router="true" :collapse="isCollapse" :collapse-transition="false" :unique-opened="true" background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <!-- 一级菜单 -->
          <!-- 官网里的这个Index值时固定写死的，你用v-for大家都一样这样点一个展开就都展开了
           且它里面的值要是字符串-->
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
              <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="icons[index]"></i>
              <span >{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+aftItem.path" v-for="aftItem in item.children" :key="aftItem.id">
               <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{aftItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            icons:['el-icon-s-custom','el-icon-copy-document','el-icon-s-goods','el-icon-s-order','el-icon-s-platform'],
            isCollapse:false
        }
    },
// vuejs生命周期中的created()
// created：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
// mounted：在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  created(){
      this.getMenuList()
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear("token");
      //退出跳转至登录页面
      this.$router.push("/login");
    },
    //从后台获取所有的左侧菜单
    async getMenuList(){
        //被axios封装了，返回的是个对象，里面有个data属性，这个才是真正返回的值
        const {data: res}=await this.$http.get('menus')
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.menuList=res.data
        console.log(res.data);
    },
    //点击按钮 切换菜单折叠
   toggleCollapse(){
      this.isCollapse= !this.isCollapse
    }
  }
};
</script>

<style lang="less" scoped>
// el-header等组件 组件名也是它的类名
.el-header {
  display: flex;
  padding-left: 0;
  background-color: #373d41;
  justify-content: space-between;
  //  将弹性 <div> 元素中的所有项目在当前的侧轴居中对齐,这样退出按钮就吗没有填满了
  align-items: center;
  font-size: 20px;
  color: #fff;
  div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button{
    height: 24px;
    background-color: #4a5064;
    color:#fff;
    font-size: 10px;
    text-align:center;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor:pointer;
  }
  .el-menu{
    border-right:none;
  }
  
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100%;
}
</style>