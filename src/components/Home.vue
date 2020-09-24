<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/1.png" width="56px" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loguot">退出</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 左边 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div @click="toggleCollapse" class="toggle-button">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#fdeff2"
          text-color="rgb(82, 94, 95)"
          active-text-color="#990033"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '../network/home'

export default {
  name: 'Home',
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'el-icon-user',
        103: 'el-icon-receiving',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-document',
        145: 'el-icon-data-line',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loguot() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList() {
      getMenuList().then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
      })
    },
    // 点击按钮切换折叠，展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #e9dfe5;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: rgb(82, 94, 95);
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 8px;
    }
  }
}
.el-aside {
  background-color: #fdeff2;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ffffff;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #f6bfbc;
  color: whitesmoke;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
