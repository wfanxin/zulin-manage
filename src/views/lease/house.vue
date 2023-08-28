<template>
	<section class="app-container">
		<!--工具条-->
    <el-row >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="filters.company_name" clearable placeholder="租赁公司"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.shop_number" clearable placeholder="商铺号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table v-loading="loading" :data="data" highlight-current-row style="width: 100%;">
      <el-table-column prop="company_name" label="公司名称">
      </el-table-column>
      <el-table-column prop="company_address" label="公司地址">
      </el-table-column>
      <el-table-column prop="contact_name" label="联系人" width="120">
      </el-table-column>
      <el-table-column prop="contact_mobile" label="联系电话" width="160">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="user_name" label="创建人" width="120" v-if="this.roleKey === 'admin'">
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

	  <!--页码-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>

    <!--编辑界面-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false" width="70%">
      <el-form :model="editForm" label-width="110px" :rules="formRules" ref="form" class="dialogForm">
        <div class="form-item-title">租金</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="租赁公司" prop="company_id">
              <el-select v-model="editForm.company_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in company_list"
                  :key="item.id"
                  :label="item.company_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始租期" prop="begin_lease_date">
              <el-input v-model="editForm.begin_lease_date" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="装修期" prop="repair_period">
              <el-input v-model="editForm.repair_period" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="单价㎡/元/日" prop="unit_price">
              <el-input v-model="editForm.unit_price" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="租金涨幅方式" prop="increase_type">
              <el-input v-model="editForm.increase_type" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商铺号" prop="shop_number">
              <el-input v-model="editForm.shop_number" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="计租日期" prop="stat_lease_date">
              <el-input v-model="editForm.stat_lease_date" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="业态/品类" prop="category">
              <el-input v-model="editForm.category" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="履约保证金" prop="performance_bond">
              <el-input v-model="editForm.performance_bond" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租赁面积㎡" prop="lease_area">
              <el-input v-model="editForm.lease_area" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="租赁年限" prop="lease_year">
              <el-input-number v-model="editForm.lease_year" :min="1" :max="100" auto-complete="off"></el-input-number>
            </el-form-item>
            <el-form-item label="租赁合同编号" prop="contract_number">
              <el-input v-model="editForm.contract_number" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="租金支付方式" prop="pay_method">
              <el-select v-model="editForm.pay_method" placeholder="请选择">
                <el-option
                  v-for="item in pay_method_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-item-title">物业费</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="物业合同编号" prop="property_contract_number">
              <el-input v-model="editForm.property_contract_number" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="单价㎡/元/月" prop="property_unit_price">
              <el-input v-model="editForm.property_unit_price" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全责任人" prop="property_safety_person">
              <el-input v-model="editForm.property_safety_person" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="物业支付方式" prop="property_pay_method">
              <el-select v-model="editForm.property_pay_method" placeholder="请选择">
                <el-option
                  v-for="item in pay_method_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="property_contact_info">
              <el-input v-model="editForm.property_contact_info" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="物业涨幅方式" prop="property_increase_type">
              <el-input v-model="editForm.property_increase_type" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetForm()">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createData" :loading="addIsLoading">添加</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="editIsLoading">修改</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import {
  list,
  add,
  edit,
  del
} from '@/api/house'
import {
  fun_getRole
} from '@/utils/common'

export default {
  data() {
    return {
      roleKey: '',
      filters: {
        company_name: '',
        shop_number: ''
      },
      addIsLoading: false,
      editIsLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      editForm: {},
      formRules: {
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
      },
      loading: false,
      data: [],
      company_list: [],
      pay_method_list: [],
      page: 1,
      pageSize: 20,
      total: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 搜索方法
    handleSearch() {
      this.page = 1
      this.getList()
    },
    createData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.editForm)
          add(params).then(res => {
            this.addIsLoading = false
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => { this.addIsLoading = false })
        }
      })
    },
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.editForm)
          edit(params).then(res => {
            this.editIsLoading = false
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => { this.editIsLoading = false })
        }
      })
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogTitle = '添加'
      this.editForm = {
        company_name: '',
        company_address: '',
        contact_name: '',
        contact_mobile: '',
        remark: ''
      }
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '编辑'
      this.editForm = {
        id: row.id,
        company_name: row.company_name,
        company_address: row.company_address,
        contact_name: row.contact_name,
        contact_mobile: row.contact_mobile,
        remark: row.remark
      }
      this.dialogFormVisible = true
    },
    handleDel(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {})
    },
    resetForm() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },
    getList() {
      const params = Object.assign({}, this.filters)
      params.page = this.page
      params.pageSize = this.pageSize
      this.loading = true
      list(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.total = res.total
          this.data = res.data
          this.company_list = res.company_list
          this.pay_method_list = res.pay_method_list
        }
      }).catch(() => { this.loading = false })
    }
  },
  mounted() {
    this.roleKey = fun_getRole()
    this.getList()
  }
}
</script>
<style scoped>
.form-item-title {
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #DCDFE6;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.input-class {
  width: 200px;
}
</style>