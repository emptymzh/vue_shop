<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
            <el-col> <el-button @click="addDialog" type="primary">添加分类</el-button></el-col>
        </el-row>
        <!--tree-table要安装相应插件=> vue-table-with-tree-grid-->
    <tree-table show-index index-text="#" border :expand-type="false" :selection-type="false" :data="cateList" :columns="columns">
    <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
        <i class="el-icon-error" v-else style="color:red;"></i>
    </template>
    <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="warning">二级</el-tag>
        <el-tag size="mini" v-else type="danger">三级</el-tag>
    </template>
    <template slot="operation" slot-scope="scope">
        <el-button @click="showEditDialog(scope.row.cat_id)" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button @click="deleteDialog(scope.row.cat_id)" type="danger" icon="el-icon-search">删除</el-button>
    </template>
    </tree-table>
        <!-- 分页区 -->
          <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog @close="addFormClosed"
  title="添加分类"
  :visible.sync="addDialogVisible"
  width="50%">
  <!-- 表单 -->
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
<el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addForm.cat_name"></el-input>
</el-form-item>
<el-form-item label="父级分类:">
<!-- 级联选择器中的option绑定数据源  注意显示不全，记得在global.css中设置下el-cascader-panel-->
<!-- props指定配置对象 -->
<el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parenCateChange"></el-cascader>
</el-form-item>
</el-form>
 <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑的对话框 -->
<el-dialog @close="editDialogClosed" 
  title="修改分类"
  :visible.sync="editDialogVisible"
  width="50%">
<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
<el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name"></el-input>
</el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialog">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
    data(){
        return {
            //商品分类的数据列表
            cateList:[],
            //总数据条数
            total:0,
            //tree-table指定列的定义 具体可看github上的官方例子
            columns:[{
            label:'分类名称',
            //只有第一列用prop可用自动获取到cat_name
            prop:'cat_name'
            },
            {
            label:'是否有效',
            type: 'template',
            //当前列使用的模板名称
            template:'isok'
            },
            {
            label:'排序',
            type:'template',
            template:'order'
            },
            {
            label:'操作',
            type:'template',
            template:'operation'
            }
            ],
            //查询要传入的参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            addDialogVisible:false,
            addForm:{
                //父级分类的ID
                cat_pid:0,
                cat_name:'',
                cat_level:0
            },
            addFormRules:{
             cat_name:[ { required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                expandTrigger: 'hover',
                checkStrictly:true,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //选中的父级分类的Id数组
            selectedKeys:[],
            editDialogVisible:false,
            cat_id:0,
            editForm:{
              cat_name: ""
            },
            editFormRules:{
              cat_name:[ { required: true, message: '请输入分类名称', trigger: 'blur' }]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
       async getCateList(){
          const {data:res} =await this.$http.get('categories',{params:this.queryInfo})
          if(res.meta.status!==200) return this.$message.error('获取商品分类失败')
          //将数据列表赋值给cateList
          this.cateList=res.data.result
          this.total=res.data.total
        },
    //监听pagesize的改变
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getCateList()
    },
    //监听pagenum的改变
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getCateList()
    },
    //展示添加分类的对话框
    addDialog(){
        this.getParentCateList()
        this.addDialogVisible=!this.addDialogVisible
    },
    //获取父级分类的数据列表
    async getParentCateList(){
      const{data:res}= await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status!==200) return this.$message.error('获取父级分类数据失败')
      this.parentCateList=res.data
    },
     //选择项发生变化触发
    parenCateChange(){
        //length大于0说明选了父级分类
        if(this.selectedKeys.length>0){
        //只选择数组的最后一项的id
         this.addForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
         //为当前分类的等级赋值
        this.addForm.cat_level =this.selectedKeys.length
          }else{
            this.addForm.cat_pid=0
            this.addForm.cat_level=0
        }
        },
    addCate(){
        this.$refs.addFormRef.validate(async valid=>{
            if(!valid) return
          const {data:res}=await this.$http.post(`categories`,this.addForm5)
          if(res.meta.status!==201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addDialogVisible=!this.addDialogVisible
        })
    },
    //重置表单
    addFormClosed(){
        this.$refs.addFormRef.resetFields()
        this.selectedKeys=[]
        this.addForm.cat_level=0
        this.addForm.cat_pid=0
    },
    //展示编辑的对话框
    showEditDialog(id){
      this.editDialogVisible=!this.editDialogVisible
      this.cat_id=id
    },
    //提交编辑的内容
  editDialog(){
     this.$refs.editFormRef.validate(async valid=>{
       if(!valid) return 
      const {data:res}= await this.$http.put(`categories/${this.cat_id}`,{cat_name:this.editForm.cat_name})
      if(res.meta.status!==200) return this.$message.error('更新失败')
      this.getCateList()
      this.editDialogVisible=!this.editDialogVisible
     })
    },
    //重置编辑表单
  editDialogClosed(){
    this.$refs.editFormRef.resetFields()
  },
  //删除操作
  async deleteDialog(id){
   const confirmResult=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
    if(confirmResult!=='confirm') return this.$message.info('取消成功')
    const {data:res} =await this.$http.delete(`categories/${id}`)
    if(res.meta.status!==200) return this.$message.error('删除分类失败')
    this.$message.success('删除分类成功')
    this.getCateList()
  }
    }
};
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>