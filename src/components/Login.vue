<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt/>
      </div>
      <!-- 这里的rules，prop，model做数据验证用 -->
      <el-form ref="loginFormRef" class="login_form" :model="form" :rules="ruleForm">
        <el-form-item label-width="0" prop="username">
          <el-input prefix-icon="el-icon-user-solid" placeholder="用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-unlock"
            placeholder="密码"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetLogin" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginInfo } from '../network/login'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      ruleForm: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
        ],
        password: [
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetLogin () {
      //resetFields()方法对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      /**
       * validate()方法对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用
       * 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
       */
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        getLoginInfo(this.form).then((res) => {
          if (res.meta.status != 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: rgb(81, 62, 99);
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: solid 1px #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }
</style>
