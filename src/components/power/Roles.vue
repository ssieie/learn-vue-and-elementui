<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="isShowAddCharacter = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleslist" stripe border max-height="460">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bd-top' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row
                      :class="[i3 === 0 ? '' : 'bd-top']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >
                      <el-col>
                        <el-tag
                          type="warning"
                          closable
                          @close="removeRightById(scope.row, item3.id)"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="onEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="onDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色dialog -->
    <el-dialog title="添加角色" :visible.sync="isShowAddCharacter" width="50%">
      <el-form
        ref="addCharacterForm"
        :rules="addcharacterRules"
        :model="addcharacter"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addcharacter.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addcharacter.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowAddCharacter = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息的dialog -->
    <el-dialog title="修改角色" :visible.sync="isShowEditDialog" width="50%">
      <el-form
        ref="editcharacterForm"
        :rules="addcharacterRules"
        :model="editcharacter"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editcharacter.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editcharacter.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmAdd"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 删除前确认dialog -->
    <el-dialog title="警告" :visible.sync="isShowConfirmDelete" width="30%">
      <span>确认删除吗</span>
      <span slot="footer">
        <el-button @click="isShowConfirmDelete = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRightsList } from '../../network/rights/getrightslist'
import { getRolesList } from '../../network/rights/getroleslist'
import { addRoles } from '../../network/rights/addroles'
import { getRolesId } from '../../network/rights/getrolesid'
import { submitEdit } from '../../network/rights/submiteditroles'
import { deleteRoles } from '../../network/rights/deleteroles'
import { deleteRightById } from '../../network/rights/deleterightbyid'
import { giveRight } from '../../network/rights/giveright'

export default {
  name: 'roles',
  data() {
    return {
      roleslist: [],
      rightslist: [],
      defKeys: [], //默认勾选项
      defRoleId: '',
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      addcharacter: {
        roleName: '',
        roleDesc: '',
      }, //添加的角色信息
      editcharacter: {
        roleName: '',
        roleDesc: '',
        roleId: '',
      }, //修改角色信息
      addcharacterRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      }, //添加角色form验证规则
      isShowAddCharacter: false, //是否展示添加角色dialog
      isShowEditDialog: false, //是否显示修改信息dialog
      isShowConfirmDelete: false, //是否显示确认删除dialog
      setRightDialogVisible: false, //是否显示分配权限dialog
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      getRolesList().then((res) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.roleslist = res.data
        if (res.meta.status === 200) return this.$message.success(res.meta.msg)
      })
    },
    confirmAdd() {
      this.$refs.addCharacterForm.validate((valid) => {
        if (valid) {
          addRoles(this.addcharacter).then((res) => {
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            } else {
              this.isShowAddCharacter = false
              this.getRolesList()
              return this.$message.success(res.meta.msg)
            }
          })
        } else {
          return this.$message.error('请输入有效数据')
        }
      })
    },
    onEdit(id) {
      this.isShowEditDialog = true
      getRolesId(id).then((res) => {
        this.editcharacter.roleName = res.data.roleName
        this.editcharacter.roleDesc = res.data.roleDesc
        this.editcharacter.roleId = res.data.roleId
      })
    },
    editConfirmAdd() {
      this.$refs.editcharacterForm.validate((valid) => {
        if (valid) {
          submitEdit(this.editcharacter).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            } else {
              this.isShowEditDialog = false
              this.getRolesList()
              return this.$message.success('修改成功')
            }
          })
        } else {
          return this.$message.error('请输入有效数据')
        }
      })
    },
    onDelete(id) {
      this.editcharacter.roleId = id
      this.isShowConfirmDelete = true
    },
    confirmDelete() {
      deleteRoles(this.editcharacter.roleId).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.isShowConfirmDelete = false
          this.getRolesList()
          return this.$message.success('删除成功')
        }
      })
    },
    // 删除权限
    removeRightById(role, rightId) {
      this.$MessageBox
        .confirm('确认删除权限吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          deleteRightById(role.id, rightId).then((res) => {
            if (res.meta.status === 200) {
              role.children = res.data
              return this.$message.success(res.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message.info('已经取消删除')
        })
    },
    // 展示分配权限对话框
    showSetRightDialog(role) {
      getRightsList().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rightslist = res.data
      })
      this.defRoleId = role.id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //获取默认权限ID
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const keysStr = keys.join(',')
      giveRight(this.defRoleId, keysStr).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    },
  },
}
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>