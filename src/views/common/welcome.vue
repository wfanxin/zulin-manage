<template>
  <div>
    <el-row style="margin: 30px 0 30px 0;">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="23">
        <el-select v-model="company_id" filterable placeholder="请选择租赁公司">
          <el-option
            v-for="item in company_list"
            :key="item.id"
            :label="item.company_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="10">
        <div class="histogram-title">租金</div>
        <ve-pie :data="chartData1"></ve-pie>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="10">
        <div class="histogram-title">物业费</div>
        <ve-pie :data="chartData2"></ve-pie>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      company_id: '',
      company_list: [],

      chartData1: {
        columns: ['年份', '金额'],
        rows: [
          { 年份: 2022, 金额: 0 },
          { 年份: 2023, 金额: 0 },
          { 年份: 2024, 金额: 0 }
        ]
      },
      chartData2: {
        columns: ['年份', '金额'],
        rows: [
          { 年份: 2022, 金额: 0 },
          { 年份: 2023, 金额: 10 },
          { 年份: 2024, 金额: 20 }
        ]
      }
    }
  }
}
</script>
<style>
.histogram-title {
  text-align: center;
  font-size: 20px;
  margin-bottom: 30px;
}
</style>
