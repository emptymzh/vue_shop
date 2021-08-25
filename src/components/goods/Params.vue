<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row class="cat_sort">
        <el-col>
          <span>选择商品的分类:</span>
          <!-- 选择商品分类的级联选择框 change-on-select默认true可以选择任意级别分类,若不写这个属性就是默认的只能选择最后一级 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini`"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag @close="handleClose(i,scope.row)" closable v-for="(item, i) in scope.row.attr_vals"  :key="i">
                  {{ item }}
                </el-tag>
                <!-- 标签的输入文本框 -->
                <el-input 
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  @click="deleteDialog(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini`"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag @close="handleClose(i,scope.row)" closable v-for="(item, i) in scope.row.attr_vals"  :key="i">
                  {{ item }}
                </el-tag>
                <!-- 标签的输入文本框 -->
                <el-input 
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  @click="deleteDialog(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      @close="addDialogClose"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 参数表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      @close="editDialogClose"
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 参数表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        //这里的value值会存放到v-model双向绑定的数组里面
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定到的数组
      selectedKeys: [],
      //被激活的标签的页签名称 这里写那个切到哪个
      activeName: "many",
      //动态参数的数据
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      attr_id: "",
      editDialogVisible: false,
      editForm: {
        attr_name: "",
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ]
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      this.cateList = res.data;
    },
    //级联选择框发生变化触发
    handleChange() {
      this.getParamsData();
    },
    //获取参数列表的数据
    async getParamsData() {
      // 选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        //防止你选的不是三级但仍然可以对动态参数等表格的数据进行操作
        this.manyTableData =[]
        this.onlyTableData =[]
        return this.$message.error("请重新选择");
      }
      //选中了三级分类,获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      //将attr_vals中的字符串转为数组
      res.data.forEach((item) => {
        //用三元表达式解决空字符串被转为[""]
        item.attr_vals = item.attr_vals?item.attr_vals.split(","):[]
        //控制文本框的显示与隐藏 下面两个属性都是自己定义的
        item.inputVisible=false
        item.inputValue=''
      })
      if (this.activeName === "many") return (this.manyTableData = res.data);
      if (this.activeName === "only") return (this.onlyTableData = res.data);
    },
    //tabs 页签的点击事件的处理函数
    handleTabClick() {
      this.getParamsData();
    },
    //添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.data !== 201) this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.addDialogVisible = !this.addDialogVisible;
        this.getParamsData();
      });
    },
    //重置
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    showEditDialog(id) {
      this.editDialogVisible = !this.editDialogVisible;
      this.attr_id = id;
    },
    //修改对话框
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.$message.success("修改成功");
        this.editDialogVisible = !this.editDialogVisible;
        this.getParamsData();
      });
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //删除
    async deleteDialog(attr_id) {
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getParamsData();
    },
    //文本框失去焦点或按下了enter
    handleInputConfirm(){
        
    },
    showInput(row){
        row.inputVisible= true
        //让文本框自动获得焦点
        //$nextTick也是个生命周期的钩子函数
        //当页面上元素被重新渲染，才会执行回调函数
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //在鼠标失去焦点和按下enter后
   async handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
            row.inputValue=''
            row.inputVisible=false
            return 
        }
        row.attr_vals.push(row.inputValue.trim())
        //发起请求保存这次操作的数据
        this.saveAttrVals(row)
    },
    //将attr_vals的操作保存到数据库
   async saveAttrVals(row){
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(",")})
        if(res.meta.status!==200) return this.$message.error('修改参数失败')
        this.$message.success('修改成功')
    },
    //删除对应的参数可选项
    handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
    }
  },
  //计算属性
  computed: {
    //需要被禁用就返回true 否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的Id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") return "动态属性";
      if (this.activeName === "only") return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.cat_sort {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>