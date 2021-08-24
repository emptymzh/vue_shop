<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
   <el-row>
       <el-col>
           <el-button  type="primary" @click="dialogVisible">添加角色</el-button>
       </el-col>
   </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolesData" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
              <!-- 这里class 里有表达式所以用数组 -->
              <el-row :class="['bdbottom',index1===0?'bdtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                  <!-- 渲染一级权限 -->
                  <el-col :span=5>
                      <el-tag>{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二级和三级 -->
                  <el-col :span=19>
                      <el-row :class="[index2!==0?'bdtop':'']" v-for="(item2,index2) in item1.children" :key="item2.id">
                          <el-col :span=6>
                              <el-tag type="success">{{item2.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                              </el-col>
                          <el-col :span=18>
                                    <!-- 这里获取不到item1.id所以用的是scope.row -->
                              <el-tag type="warning" closable @close="removeRightById(scope.row,item3.id)" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="showDeleteDialog(scope.row.id)" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting">分配权限</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加对话框 -->
<el-dialog @close="addDialogClose" title="添加角色"  :visible.sync="addDialogVisible"  width="30%" >
    <!-- 添加对话框中的表单 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="addForm.roleName" ></el-input>
    </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="addForm.roleDesc" ></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
    <!-- 编辑的对话框 -->
<el-dialog @close=" editDialogClose" title="编辑角色"  :visible.sync="editDialogVisible"  width="30%" >
    <!-- 编辑的表单 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="editForm.roleName" ></el-input>
    </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="editForm.roleDesc" ></el-input>
    </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
</el-dialog>
   <!-- 分配权限的对话框 -->
<el-dialog @close="setRightDialogClosed" title="分配权限"  :visible.sync="setRightDialogVisible"  width="50%" >
    <!-- 树形控件 -->
    <el-tree  ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" :data="treeData" :props="treeProps" ></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            rolesData:[],
            addDialogVisible: false,
            addForm:{
                roleName:'',
                roleDesc:''
            },
            addFormRules:{
                roleName:[{required:true,message:'请输入角色名',trigger:'blur'},
                 {min:3,max:10,message:'角色名长度3~10之间',trigger:'blur'}],
                roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'},
                 {min:3,max:15,message:'角色描述长度3~15之间',trigger:'blur'}]
            },
            editDialogVisible: false,
            editForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            editFormRules:{
                roleName:[{required:true,message:'请输入角色名',trigger:'blur'},
                 {min:3,max:10,message:'角色名长度3~10之间',trigger:'blur'}],
                roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'},
                 {min:3,max:15,message:'角色描述长度3~15之间',trigger:'blur'}]
            },
            deleteDialogVisible:false,
            setRightDialogVisible:false,
            treeData:[],
            //树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            //默认选中的节点Id值的数组
            defKeys:[],
            //角色分配权限所用到
            roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200) return this.$message.error('获取权限列表失败')
            this.rolesData=res.data
        },
        //根据id删除对应权限
         async removeRightById(role,rightId){
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err) 
         if(confirmResult !=='confirm'){
             return this.$message.info('取消了删除')
         }
            const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status!==200) return this.$message.error('删除失败')
            this.getRolesList()
         },
        //展示分配权限的对话框
        async showSetRightDialog(role){
            //为角色分配权限做铺垫
            this.roleId=role.id
            //获取所有权限的数据
            const {data:res}=await this.$http.get(`rights/tree`)
            if(res.meta.status!==200) return this.$message.error('获取权限列表失败')
            //保存获取到的tree类型的权限数据
            this.treeData=res.data
            //递归获取三级节点的id
            this.getLeafKeys(role,this.defKeys)
            this.setRightDialogVisible=!this.setRightDialogVisible
        },
        //通过递归，获取角色三级权限的id并且保存到deKeys中
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>this.getLeafKeys(item,arr))
        },
        //监听分配权限对话框的关闭事件
        setRightDialogClosed(){
          this.defKeys=[]  
        },
        //点击为角色分配权限
        async allotRights(){
            const keys =[this.$refs.treeRef.getCheckedKeys(),
            this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr=keys.join(',')
            const {data: res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
            if(res.meta.status!==200) return this.$message.error('权限分配失败')
            this.$message.success('权限分配成功')
            this.getRolesList()
            this.setRightDialogVisible=!this.setRightDialogVisible
        },
         dialogVisible(){
         this.addDialogVisible = !this.addDialogVisible
        },
        //重置表单
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
       async addRole(){
          //预校验格式是否正确
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return 
        //可用发起添加角色的请求
        const {data:res}=await this.$http.post('roles',this.addForm)
        if(res.meta.status!==201){
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible=false
        //重新获取角色数据列表
        this.getRolesList()
      })
        },
        //重置编辑表单
        editDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
       //展示编辑角色的对话框(主要是得到让Id传到editForm里面)
        async showEditDialog(id){
        const{data: res}=await this.$http.get(`roles/${id}`)
        if(res.meta.status !==200)  {
          return this.$message.error('查询角色失败')
        }
        this.editForm=res.data
        this.editDialogVisible=!this.editDialogVisible
    },
        editRole(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return 
            const {data:res}=await this.$http.put(`roles/${this.editForm.roleId}`,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
                if(res.meta.status!==200) return this.$message.error('编辑失败')
            //关闭对话框
            this.editDialogVisible=!this.editDialogVisible
            //刷新数据
            this.getRolesList()
            })
        },
        //删除角色
        async showDeleteDialog(id){
          this.deleteDialogVisible=!this.deleteDialogVisible
          const confirmResult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
          return this.$message.info('已经取消')
        }
        const {data:res}=await this.$http.delete(`roles/${id}`)
        if(res.meta.status!==200) return this.$message.error('删除失败')
        this.getRolesList()
        this.$message.success('删除成功')
        }
    }
};
</script>

<style lang="less" scoped>
 .el-tag{
    margin:7px;
 }
 .bdtop{
     border-top:1px solid #eee;
 }
 .bdbottom{
     border-bottom:1px solid #eee;
 }
 .vcenter{
     display: flex;
     align-items:center
 }
</style>