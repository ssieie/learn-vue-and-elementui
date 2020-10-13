<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置参数！" :closable="false" type="warning"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addDialogVisible = true">添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,i) in scope.row.attr_vals" @close="handleClose(i,scope.row)" :key="i">
                  {{item}}
                </el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button class="new_btn" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-deit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addDialogVisible = true">添加参数
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag closable v-for="(item,i) in scope.row.attr_vals" @close="handleClose(i,scope.row)" :key="i">
                    {{item}}
                  </el-tag>
                  <el-input
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    class="input-new-tag"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button class="new_btn" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-deit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--  所有dialog  -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--  编辑dialog  -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from '../../network/goods/getcatelist'
import {
  getCateParams,
  addParams,
  getParamsNameById,
  editParams,
  removeParams
} from '../../network/goods/getcateparams'

export default {
  name: 'Params',
  data () {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      isDisabled: true,
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: '',
        cate_id: ''
      },
      editFormRules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      getCateList().then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data
      })
    },
    handleChange () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        this.isDisabled = true
        return
      }
      this.isDisabled = false
      getCateParams(this.cateId, this.activeName).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        addParams(this.cateId, this.addForm.attr_name, this.activeName).then(res => {
          if (res.meta.status !== 201) return this.$message.error('添加参数失败')
          this.getParamsData()
          this.addDialogVisible = false
        })
      })
    },
    showEditDialog (id) {
      this.editForm.cate_id = id
      getParamsNameById(this.cateId, id, this.activeName).then(res => {
        console.log(res)
        this.editForm.attr_name = res.data.attr_name
      })
      this.editDialogVisible = true
    },
    editParams () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        editParams(this.cateId, this.editForm.cate_id, this.editForm.attr_name, this.activeName).then(res => {
          if (res.meta.status !== 200) return this.$message.error('更新失败')
          this.$message.success('更新成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      console.log(this.manyTableData, this.onlyTableData)
    },
    removeCateParams (id) {
      this.$MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeParams(this.cateId, id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.getParamsData()
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    handleInputConfirm (row) {
      // 判断输入标签的内容是否有效数据，去除两边空格判断字符串长度，为0则return出去不在执行下面内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      editParams(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' ')).then(res => {
        if (res.meta.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
      })
    },
    showInput (row) {
      row.inputVisible = true
      // 使输入框获取焦点，$nextTick只有在页面重新渲染过后才会调用回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (i, row) {
      row.attr_vals.splice(i,1)
      editParams(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' ')).then(res => {
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
      })
    }
  },
  computed: {
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题属性
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped lang="less">
  .cat_opt {
    margin: 15px 0;
  }

  .el-table {
    margin: 15px 0 0 0;
  }

  .el-tag {
    margin-left: 10px;
  }

  .new_btn, .input-new-tag {
    margin: 5px 0 0 10px;
    width: 90px;
  }
</style>
