<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <el-table :data="rights" stripe border max-height="500">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scpoed">
            <el-tag v-if="scpoed.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scpoed.row.level === '1'" type="success"
              >二级权限</el-tag
            >
            <el-tag v-else type="danger">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '../../network/rights/getrightslist'

export default {
  name: 'rights',
  data() {
    return {
      rights: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      getRightsList().then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rights = res.data
        if (res.meta.status === 200) return this.$message.success(res.meta.msg)
      })
    },
  },
}
</script>

<style lang='less' scoped>
.el-table {
  font-size: 12px;
}
</style>