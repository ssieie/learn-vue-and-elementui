<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="250"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80"></el-table-column>
        <el-table-column label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | filterDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="editOrder"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form v-model="addressForm" ref="editCateForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="city"
            v-model="addressForm.address1"
            @change="changeProvince"
            change-on-select
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList } from '../../network/order/getorderlist'
import { getProgress } from '../../network/order/progress'
import city from '../../common/city_data2017_element'

export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }
        ]
      },
      city,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      getOrderList(this.queryInfo).then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取参数失败')
        this.total = res.data.total
        this.orderList = res.data.goods
        this.$message.success('获取参数成功')
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    editOrder () {
      this.dialogVisible = true
      console.log(city)
    },
    changeProvince () {
    },
    showProgressBox () {
      this.progressDialogVisible = true
      getProgress().then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
        this.$message.success('获取物流信息成功')
        this.progressInfo = res.data
        console.log(this.progressInfo)
      })
    }
  }
}
</script>

<style scoped lang="less">
  .el-table {
    margin-top: 15px;
  }
</style>
