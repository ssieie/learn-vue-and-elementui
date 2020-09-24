<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <el-row :gutter="24">
        <el-col :span="10">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUsers(queryInfo)"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsers(queryInfo)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" stripe border>
        <el-table-column width="50" type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button
                @click="showEditDialog(scope.row)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button
                @click="removeUser(scope.row)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="handleClose">
      <!-- 内容主体区 -->
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
      <!-- 底部区 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息dialog -->
    <el-dialog title="修改用户" :visible.sync="setShowDialog" width="50%">
      <el-form disabled label-width="70px" :model="setForm">
        <el-form-item label="用户名">
          <el-input v-model="setForm.username"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="setFormRef" :model="setForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="setForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="setForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="setShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="setUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除的dialog -->
    <el-dialog title="提示" :visible.sync="deleteUserDialog" width="35%">
      <span>确认要删除吗</span>
      <span slot="footer">
        <el-button @click="deleteUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers } from '../../network/users'
import { setUsers } from '../../network/home/setUsers'
import { addUsers } from '../../network/home/addUsers'
import { getUserInfoById } from '../../network/home/getuserbyid'
import { setUserInfoById } from '../../network/home/setuserinfobyid'
import { removeUserInfo } from '../../network/home/removeuser'

export default {
  name: 'User',
  data() {
    // 自定义验证规则
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      userlist: [],
      total: 0,
      dialogVisible: false, // 添加
      setShowDialog: false, //修改
      deleteUserDialog: false, //删除
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      }, //添加用户表单
      setForm: {
        username: '',
        email: '',
        mobile: '',
        id: '',
      },
      removeUserId: '',
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      }, //添加表单验证规则
    }
  },
  created() {
    this.getUsers(this.queryInfo)
  },
  methods: {
    /**
     * 网络请求
     */
    getUsers(queryInfo) {
      getUsers(queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        }
        this.userlist = res.data.users
        this.total = res.data.total
      })
    },
    /**
     * 处理事件
     */
    // 监听pagesize改变的时间
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers(this.queryInfo)
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsers(this.queryInfo)
    },
    // 监听switch开关状态的改变
    userStateChanged(userInfo) {
      setUsers(userInfo).then((res) => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败!')
        }
        this.$message.success('更新用户状态成功')
      })
    },
    // 关闭dialog前清除验证及文本
    handleClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUsers() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        addUsers(this.addForm).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.dialogVisible = false
          this.getUsers(this.queryInfo)
        })
      })
    },
    showEditDialog(id) {
      this.setShowDialog = true
      getUserInfoById(id.id).then((res) => {
        this.setForm.username = res.data.username
        this.setForm.email = res.data.email
        this.setForm.mobile = res.data.mobile
        this.setForm.id = res.data.id
      })
    },
    setUserInfo() {
      console.log(this.setForm)
      this.$refs.setFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请确认修改信息合法')
        setUserInfoById(this.setForm).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.setShowDialog = false
          this.getUsers(this.queryInfo)
        })
      })
    },
    // 删除用户提示确认
    deleteConfirm() {
      removeUserInfo(this.removeUserId).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.deleteUserDialog = false
        this.$message.success(res.meta.msg)
        this.getUsers(this.queryInfo)
      })
    },
    removeUser(userInfo) {
      this.removeUserId = userInfo.id
      this.deleteUserDialog = true
    },
  },
}
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>