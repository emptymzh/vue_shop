<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <!-- el-row是栅格系统的组件 -->
      <el-row :gutter="20">
        <!-- 列于列之间的间隙 -->
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区-->
      <el-table border stripe :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!--作用域插槽:子组件的数据通过slot-scope属性接受(接受的好像是父组件的数据)，传递到了父组件 里面是个对象-->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <!-- 删除 -->
            <el-button @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="small"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip 
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button @click="setRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog @close="addDialogClose" title="添加用户" :visible.sync="addDialogVisible" width="30%" >
    <!-- 内容主题 -->
   <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
    <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
      <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
      <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
</el-dialog>
  <!-- 修改用户信息的对话框 -->
  <el-dialog @close="editDialogClosed" title="修改用户信息" :visible.sync="editDialogVisible"  width="50%">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" > <!-- 这里并不需要校验 所以不用prop -->
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email" >   
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 取消和确定 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 分配角色对话框 -->
  <el-dialog @close="setRoleDialogClosed" title="分配角色"  :visible.sync="setRoleDialogVisible"  width="50%">
    <div>
      <p>当前的用户:{{userInfo.username}}</p>
      <p>当前的角色:{{userInfo.role_name}}</p>
      <p>分配新角色:
  <el-select v-model="selectedRoleId" placeholder="请选择">
      <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id"> <!-- 这个value的值传到selectedRoleId中 -->
      </el-option>
  </el-select>
      </p>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
      //注意定义这个变量不在return 中
      //验证邮箱的自定义规则
      var checkEmail=(rule,value,cb)=>{
        const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          //合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
       //验证手机号的自定义规则
      var checkMobile=(rule,value,cb)=>{
        const regMobile=/^(0|86|17952)?(13[0-9]|15[0123456789]|17[678]|18[0-9]14[57])[0-9]{8}$/
     if(regMobile.test(value)){
          //合法的手机号码
          return cb()
        }
        cb(new Error('请输入合法的手机号码'))
      }
    return {
     
      //用户列表的参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false, //控制对话框的显示与隐藏
      editDialogVisible:false,
      setRoleDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色的数据列表
      rolesList:[],
      //已选中的角色id值
      selectedRoleId:'',
      //查询到的用户信息对象
      editForm:{},
      //修改查询到的用户的验证规则
      editFormRules:{
          email:[{required:true,message:'请输入邮箱',trigger:'blur'},
         {validator:checkEmail,trigger:'blur'}],
         mobile:[{required:true,message:'请输入电话号码',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}]
      },
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //表单的验证规则对象
      addFormRules:{
        username:[{required:true,message:'请输入用户名',trigger:'blur'},
        {min:3,max:10,message:'用户名长度3~10之间',trigger:'blur'}],
        password:[{required:true,message:'请输入密码',trigger:'blur'},
        {min:6,max:15,message:'密码长度6~15之间',trigger:'blur'}],
         email:[{required:true,message:'请输入邮箱',trigger:'blur'},
         {validator:checkEmail,trigger:'blur'}],
         mobile:[{required:true,message:'请输入电话号码',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getUserList()
    },
    //监听switch开关状态的改变   
   async userStateChanged(userinfo){
    //  const {data: res}=await this.$http.put('users/'+userinfo.id+'/state/'+userinfo.mg_state)  
    const {data: res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
    if(res.meta.status!=200) {
        userinfo.mg_state= !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
    }
    this.$message.success('更新用户状态成功')
    },
    dialogVisible(){
      this.addDialogVisible = !this.addDialogVisible
    },
    //监听添加用户对话框的关闭事件,重置表单
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新用户
    addUser(){
      //预校验格式是否正确
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return 
        //可用发起添加用户的请求
        const {data:res}=await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible=false
        //重新获取用户数据列表
        this.getUserList()
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(id){
   
        const{data: res}=await this.$http.get(`users/${id}`)
        if(res.meta.status !==200)  {
          return this.$message.error('查询用户失败')
        }
        this.editForm=res.data
        this.editDialogVisible=!this.editDialogVisible
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //预校验然后修改信息并且提交
    editUserInfo(){
      this.$refs.editFormRef.validate(valid=>{
        if(!valid) return this.$message.error('请输入正确的内容')
        //发起修改数据的请求
        this.$http.put(`users/${this.editForm.id}`,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status!==200) return this.$message.error("更新用户信息失败")
        //关闭对话框
        this.editDialogVisible=!this.editDialogVisible
        //刷新数据列表
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    //删除用户
    async removeUserById(id){
      //confirm方法返回的是一个Promise对象，可不向官方文档一样用then，直接用async await
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err) //这里的catch就是抛出异常，这样点取消就不报错了 
        //如果用户确认删除 返回的是个字符串 confirm
        //点取消 返回的是cancel
       if(confirmResult!=='confirm'){
         return this.$message.info('已经取消')
       }
       const{data:res}=await this.$http.delete(`users/${id}`)
       if(res.meta.status!==200) return this.$message.error('删除失败')
       this.$message.success('已经删除')
       this.getUserList()
    },
    //展示分配角色的对话框
   async setRole(userInfo){
      this.userInfo=userInfo
      const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200) return this.$message.error('获取角色列表失败')
      this.rolesList =res.data
      this.setRoleDialogVisible=!this.setRoleDialogVisible

    },
  //点击按钮 分配角色
   async saveRoleInfo(){
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status!==200) return this.$message.error('更新角色失败')
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible=false
    },
    //对话框关闭后就重置分配新角色的选择框
    setRoleDialogClosed(){
      this.selectedRoleId=''
    }
  }
};
</script>

<style lang="less" scoped>
</style>