<template>
  <div style="display: flex;">
    <el-scrollbar style="width: 300px; height: calc(100vh - 70px);">
      <el-tree :props="{ label: 'name', children: 'children' }" :data="dept_tree" default-expand-all />
    </el-scrollbar>
    <el-scrollbar style="width: 300px; height: calc(100vh - 70px); ">
      <el-table :data="employees" border stripe>
        <el-table-column prop="code" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" />
      </el-table>
    </el-scrollbar>
    <el-scrollbar style="width: calc(100vw - 840px); height: calc(100vh - 70px); ">
      <div class="toolbar">
        <div class="toolbar-function">
        </div>
        <div class="toolbar-search">
          <el-button type="success" icon="Plus" @click="add">新建</el-button>
        </div>
      </div>
      <el-form :model="form" :label-width="120">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.gender" clearable>
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="form.mobile" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select v-model="form.department_id">
                <el-option v-for="(item, index) in departments" :key="index" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务">
              <el-input v-model="form.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证">
              <el-input v-model="form.id_no" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日">
              <el-date-picker v-model="form.birth_day" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职日期">
              <el-date-picker v-model="form.entry_date" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职日期">
              <el-date-picker v-model="form.leave_date" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.memo" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import api from '../../util/api';
export default {
  name: 'Employee',
  data() {
    return {
      dept_tree: [{
        id: 0,
        code: '',
        name: '部门信息',
        children: []
      }],
      departments: [],
      employees: [],
      form: {}
    };
  },
  async mounted() {
    let res = await api.call('department', 'list');
    if (res.code !== 0) {
      this.$message({
        type: 'error',
        message: '加载数据失败：' + res.msg
      });
    } else {
      this.departments = res.data;
      this.dept_tree[0].children = res.data;
    }
    // await this.query();
  },
  methods: {
  }
}
</script>

<style scoped></style>