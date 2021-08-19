<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        logout(){
            //清空token
            window.sessionStorage.clear('token')
            //退出跳转至登录页面
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>

</style>