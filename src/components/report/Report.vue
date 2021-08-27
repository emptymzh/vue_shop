<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 2 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 1200px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
//1.导入echarts
// * 一次性全部导入模块变量
import * as echarts from "echarts";
import _ from "lodash";

export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
      },
    };
  },
  created() {},
  async mounted() {
    // 3 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取折线图失败");
    //  4 指定图表的配置项和数据 
      /* api返回的不完整，所以要将options和api返回的合并下 */
    const result =_.merge(res.data,this.options)
    //5 展示数据

    myChart.setOption(result);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>