<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button @click="goAddpage" type="primary">添加商品</el-button>
          </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="goodsList" stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column prop="goods_number" label="商品重量"></el-table-column>
        <el-table-column label="创建时间">
            <!-- 添加时间的过滤器 -->
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
         <template slot-scope="scope">
              <el-button @click="showEditDialog(scope.row.goods_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button @click="deleteDialog(scope.row.goods_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
         </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- background 可以添加页码的背景-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        background
        :page-sizes="[5, 10, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
       <!--编辑的对话框  -->
    <el-dialog @close="editDialogClosed" title="修改" :visible.sync="editVisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
  <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="editForm.goods_name"></el-input>
  </el-form-item>
    <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="editForm.goods_price"></el-input>
  </el-form-item>
    <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="editForm.goods_weight"></el-input>
  </el-form-item>
      </el-form>
      <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialog">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            goodsList:[],
            total:0,
      editVisible:false,
      goods_id:0,
      editForm:{
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      editFormRules:{
         goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ]
      },
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        //根据分页获取对应的商品列表
        async getGoodsList(){
           const {data:res}=await this.$http.get(`goods`,{params:this.queryInfo})
           if(res.meta.status!==200) return this.$message.error('获取商品列表失败')
           this.goodsList=res.data.goods
           this.total=res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
        },  
        handleCurrentChange(newNum){
            this.queryInfo.pagenum=newNum
            this.getGoodsList()
        },
        //编辑操作
        showEditDialog(id){
          this.editVisible=!this.editVisible
          this.goods_id=id

        },
        editDialog(){
         this.$refs.editFormRef.validate(async valid=>{
           if(!valid) return 
           const {data:res}=await this.$http.put(`goods/${this.goods_id}`,this.editForm)
          if(res.meta.status!==201) return this.$message.error('修改商品失败')
          this.getGoodsList()
          this.editVisible=!this.editVisible
         })
     
        },
        //重置
        editDialogClosed(){
          this.$refs.editFormRef.resetFields()
        },
        //删除操作
       async deleteDialog(id){
        const  confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
            return this.$message.info('已经取消')
        }
        const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200){
            return this.$message.error('删除商品分类')
        }
        this.$message.success('删除成功')
        this.getGoodsList()
        },
        //跳转到商品添加页面
        goAddpage(){
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scoped>
.el-table {
  font-size: 12px;
}
</style>