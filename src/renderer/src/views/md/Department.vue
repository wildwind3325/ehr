<template>
  <div class="toolbar">
    <div class="toolbar-function">
      <el-button type="success" icon="Plus" @click="add">新建</el-button>
    </div>
    <div class="toolbar-search">
      <el-button type="primary" icon="Search" @click="query(1)">查询</el-button>
    </div>
  </div>
  <el-table :data="items" border>
    <el-table-column label="编号" width="150" align="center">
      <template #default="scope">
        <el-input v-model="editItem.code" v-if="editIndex === scope.$index" />
        <span v-else>{{ scope.row.code }}</span>
      </template>
    </el-table-column>
    <el-table-column label="名称">
      <template #default="scope">
        <el-input v-model="editItem.name" v-if="editIndex === scope.$index" />
        <span v-else>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180" align="center">
      <template #default="scope">
        <el-button-group v-if="editIndex !== scope.$index">
          <el-button type="warning" icon="Edit" size="small" @click="edit(scope.row, scope.$index)" />
          <el-button type="danger" icon="Delete" size="small" @click="remove(scope.row, scope.$index)" />
        </el-button-group>
        <el-button-group v-else>
          <el-button type="warning" icon="Check" size="small" @click="save(scope.$index)" />
          <el-button type="danger" icon="Close" size="small" @click="cancel" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageNumber" :page-size="10" :total="total" style="margin-top: 10px;"
    @current-change="query" />
</template>

<script>
import api from '../../util/api';
export default {
  name: 'Department',
  data() {
    return {
      items: [],
      pageNumber: 1,
      total: 0,
      editItem: {},
      editIndex: -1
    };
  },
  async mounted() {
    await this.query();
  },
  methods: {
    async query(pageNumber) {
      try {
        let res = await api.call('department', 'list', JSON.stringify({
          pageSize: 10,
          pageNumber: pageNumber || this.pageNumber
        }));
        if (res.code !== 0) {
          this.$message({
            type: 'error',
            message: '加载数据失败：' + res.msg
          });
        } else {
          this.total = res.data.total;
          this.pageNumber = res.data.pageNumber;
          this.items = res.data.rows;
          if (this.editIndex >= 0) this.cancel();
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '加载数据失败：' + err.message
        });
      }
    },
    add() {
      if (this.editIndex !== -1) return;
      this.editItem = {
        id: 0,
        code: '',
        name: ''
      };
      this.items.unshift(this.editItem);
      this.editIndex = 0;
    },
    edit(row, index) {
      if (this.editIndex !== -1) return;
      this.editItem = {
        id: row.id,
        code: row.code,
        name: row.name
      };
      this.editIndex = index;
    },
    async save(index) {
      if (!this.editItem.code || !this.editItem.name) {
        this.$message({
          type: 'warning',
          message: '请先输入完整的信息'
        });
        return;
      }
      let action = 'add';
      if (this.editItem.id !== 0) action = 'edit';
      let res = await api.call('department', action, JSON.stringify(this.editItem));
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: '操作失败：' + res.msg
        });
      } else {
        this.items.splice(index, 1, res.data);
        this.editIndex = -1;
        this.$message({
          type: 'success',
          message: '操作成功'
        });
      }
    },
    cancel() {
      if (this.editItem.id === 0) {
        this.items.splice(this.editIndex, 1);
      }
      this.editItem = {};
      this.editIndex = -1;
    },
    remove(row, index) {
      this.$confirm('是否确认删除？')
        .then(async () => {
          let res = await api.call('department', 'remove', JSON.stringify({ id: row.id }));
          if (res.code !== 0) {
            this.$message({
              type: 'error',
              message: '操作失败：' + res.msg
            });
          } else {
            this.items.splice(index, 1);
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          }
        })
        .catch(() => { });
    }
  }
}
</script>