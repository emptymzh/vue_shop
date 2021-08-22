<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 头像区 -->
          <div class="avatar_box">
              <img src="../assets/logo.png" alt="">
          </div>
          <!-- 登录表单区 -->
          <!-- :model不是双向绑定只有bind的作用，父向子传值,这里没有用props传值达到父向子传值的目的-->
          <!-- ref后的loginFormRef就是这个表单组件(el-form)的引用对象，就能使用其相关方法 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="username" >
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-s-goods"></el-input>
             </el-form-item>
          <!-- 按钮区域 -->
        <el-form-item  class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
           </el-form-item>
        </el-form>
      </div> 
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 这是表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //这是表单的验证规则对象
            loginFormRules:{
                username: [{ required: true, message: '请输入登录名称', trigger: 'blur' },
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur'},
                { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }]
            }
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        //表单提交时验证（验证的是prop绑定了的） 用validate方法 valid是布尔值
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
                //右边的式子被axios封装成了个对象，里面的data属性才是返回来的数据
                //es6的解构赋值
                const {data: res}=await this.$http.post('login',this.loginForm)
                if(res.meta.status!==200){
                    return this.$message.error('登录失败!')
                }
                this.$message.success('登录成功')
                //1.将登录成功后的token保存到客户端的sessionStorage中
                //项目的后续API接口都需要登录之后才能访问
                //sessionStorage和localStorage都是用来存储客户端临时信息的对象，但后者是永久的除非用户清除，前者生命周期是当前窗口
                window.sessionStorage.setItem("token",res.data.token)
                //2.通过编程式导航跳转到后台主页
                //在 Vue 实例内部，你可以通过 $router访问路由实例 router.push
                this.$router.push('/home')
            })
        }
    }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
   .login_form{
      position: absolute;
      bottom:0;
      width: 100%;
      box-sizing: border-box;
      padding:0 20px;
 
  }
  
}
.avatar_box {
  width: 130px;
  height: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
  }
}
.btns{
      display: flex;
      justify-content: flex-end;
 } 
 
</style>