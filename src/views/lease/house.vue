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
      <el-form :model="editForm" label-width="110px" :rules="formRules" ref="form">
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
            <el-form-item label="单价元/㎡/日" prop="unit_price">
              <el-input v-model="editForm.unit_price" auto-complete="off" class="input-class"></el-input>
            </el-form-item>
            <el-form-item label="租金涨幅">
              <el-button type="primary" size="small" @click="setIncrease">配置</el-button>
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
            <el-form-item label="单价元/㎡/月" prop="property_unit_price">
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
            <el-form-item label="物业涨幅">
              <el-button type="primary" size="small" @click="setIncrease">配置</el-button>
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

    <el-dialog title="租金涨幅配置" :visible.sync="dialogSetTableVisible" :close-on-click-modal="false" :show-close="false" width="600px">
      <el-form>
        <el-row>
          <el-form-item label="涨幅方式" prop="pay_method" label-width="75px">
            <el-select v-model="editForm.increase_type" placeholder="请选择">
              <el-option
                v-for="item in increase_type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-for="(item, index) in editForm.increase_content" :key="index">
          <template v-if="editForm.increase_type === 1">
            <el-col :span="12">
              <el-form-item :label="'第'+(index+1)+'年'" label-width="75px">
                <el-input v-model="item.percent" auto-complete="off" placeholder="递增比例" class="input-class"><template slot="append">%</template></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="editForm.increase_type === 2">
            <el-col :span="12">
              <el-form-item :label="'第'+(index+1)+'年'" label-width="75px">
                <el-input v-model="item.unit_price" auto-complete="off" placeholder="租金单价" class="input-class"><template slot="append">元/㎡/日</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.year_price" auto-complete="off" placeholder="年租金" class="input-class"><template slot="append">元</template></el-input>
            </el-col>
          </template>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSetTableVisible = false">确 定</el-button>
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
        company_id: [{ required: true, message: '请选择租赁公司', trigger: 'blur' }],
        shop_number: [{ required: true, message: '请输入商铺号', trigger: 'blur' }],
        lease_area: [{ required: true, message: '请输入租赁面积', trigger: 'blur' }],
        lease_year: [{ required: true, message: '请输入租赁年限', trigger: 'blur' }],
        unit_price: [{ required: true, message: '请输入租金单价', trigger: 'blur' }],
        pay_method: [{ required: true, message: '请选择租金支付方式', trigger: 'blur' }],
        property_unit_price: [{ required: true, message: '请输入物业费单价', trigger: 'blur' }],
        property_pay_method: [{ required: true, message: '请选择物业支付方式', trigger: 'blur' }]
      },
      dialogSetTableVisible: false,
      loading: false,
      data: [],
      company_list: [],
      pay_method_list: [],
      increase_type_list: [],
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
        company_id: '',
        shop_number: '',
        lease_area: '',
        begin_lease_date: '',
        stat_lease_date: '',
        lease_year: 1,
        repair_period: '',
        category: '',
        contract_number: '',
        unit_price: '',
        performance_bond: '',
        pay_method: '',
        increase_type: 1,
        increase_content: [],

        property_contract_number: '',
        property_safety_person: '',
        property_contact_info: '',
        property_unit_price: '',
        property_pay_method: '',
        property_increase_type: '',
        property_increase_content: []
      }
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '编辑'
      this.editForm = {
        id: row.id,
        company_id: row.company_id,
        shop_number: row.shop_number,
        lease_area: row.lease_area,
        begin_lease_date: row.begin_lease_date,
        stat_lease_date: row.stat_lease_date,
        lease_year: row.lease_year,
        repair_period: row.repair_period,
        category: row.category,
        contract_number: row.contract_number,
        unit_price: row.unit_price,
        performance_bond: row.performance_bond,
        pay_method: row.pay_method,
        increase_type: row.increase_type,
        increase_content: [],

        property_contract_number: row.property_contract_number,
        property_safety_person: row.property_safety_person,
        property_contact_info: row.property_contact_info,
        property_unit_price: row.property_unit_price,
        property_pay_method: row.property_pay_method,
        property_increase_type: row.property_increase_type,
        property_increase_content: []
      }
      this.dialogFormVisible = true
    },
    setIncrease() {
      this.editForm.increase_content = []
      for (let index = 0; index < this.editForm.lease_year; index++) {
        this.editForm.increase_content.push({
          percent: '',
          unit_price: '',
          year_price: ''
        })
      }
      this.dialogSetTableVisible = true
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
          this.increase_type_list = res.increase_type_list
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