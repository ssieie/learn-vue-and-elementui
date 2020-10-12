<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--  表格  -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index
                  index-text="#" boder>
        <!--  是否有效  -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--  排序  -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 1">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 2">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--  操作  -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @close="addCateClosed">

      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            v-model="selectedKeys"
            :props="cascaderProps"
            @change="prendCateChanged"
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
    <!--  编辑dialog  -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateForm" label-width="100px">
        <el-form-item label="分类名称" prop="editCateName">
          <el-input v-model="editCateForm.editCateName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureEditCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, addCate, editCate, removeCate } from '../../network/goods/getcatelist'

export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      // table列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editDialogVisible: false,// 控制显示编辑dialog
      editCateForm: {
        editCateName: '',
        cateId: ''
      },
      editCateFormRules: {
        editCateName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      getCateList(this.querInfo).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data
      })
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    getParentCateList () {
      getCateList({ type: 2 }).then((res) => {
        console.log(res)
      })
    },
    prendCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        addCate(this.addCateForm).then(res => {
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加成功')
          this.getCateList(this.querInfo)
          this.addCateDialogVisible = false
        })
      })
    },
    editCate (id) {
      this.editCateForm.cateId = id
      this.editDialogVisible = true
    },
    sureEditCate () {
      editCate(this.editCateForm.cateId, this.editCateForm.editCateName).then(res => {
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getCateList(this.querInfo)
        this.editDialogVisible = false
      })
    },
    deleteCate (id) {
      this.$MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeCate(id).then(res=>{
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          this.getCateList(this.querInfo)
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .el-row {
    margin-bottom: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
