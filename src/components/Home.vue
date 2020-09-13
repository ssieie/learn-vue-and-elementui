<template>
  <div>
    <el-button type="info" @click="loguot">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    loguot() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>