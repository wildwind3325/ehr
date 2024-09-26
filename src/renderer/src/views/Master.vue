<template>
  <div class="container">
    <div class="sider">
      <div class="sider-header div-center">
        <img alt="" src="../assets/img/logo.png" class="sider-header-logo" />
        <span class="sider-header-title">EHR系统</span>
      </div>
      <el-scrollbar class="sider-menu">
        <el-menu active-text-color="#409eff" background-color="#304156" text-color="#f4f4f5" :default-active="path"
          @select="selectMenu">
          <el-menu-item index="/home">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="/md">
            <template #title>
              <el-icon>
                <Operation />
              </el-icon>
              <span>基础数据</span>
            </template>
            <el-menu-item index="/md/department">
              <el-icon>
                <Document />
              </el-icon>
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="/md/employee">
              <el-icon>
                <Document />
              </el-icon>
              <span>员工管理</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div style="flex-grow: 1;">
      <div class="header">
        <el-button type="warning" @click="logout">注销</el-button>
      </div>
      <el-scrollbar class="content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import api from '../util/api';
export default {
  name: 'Master',
  data() {
    return {
      path: ''
    };
  },
  async mounted() {
    this.path = this.$route.fullPath;
    let res = await api.call('login', 'status');
    if (res.code === 0 && !res.data) {
      localStorage.setItem('target_uri', this.path);
      this.$router.replace('/');
    }
  },
  updated() {
    if (this.path !== this.$route.fullPath) {
      this.path = this.$route.fullPath;
    }
  },
  methods: {
    selectMenu(val) {
      this.$router.replace(val);
    },
    async logout() {
      await api.call('login', 'logout');
      this.$router.replace('/');
    }
  }
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.sider {
  width: 200px;
  height: 100vh;
  background-color: #304156;
}

.sider-header {
  width: 200px;
  height: 50px;
}

.sider-header-logo {
  display: block;
  height: 32px;
}

.sider-header-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-left: 8px;
}

.sider-menu {
  width: 200px;
  height: calc(100vh - 50px);
}

.el-menu {
  border-right: 0px;
}

.header {
  width: calc(100vw - 200px);
  height: 50px;
  padding: 0px 20px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

.content {
  width: calc(100vw - 240px);
  height: calc(100vh - 70px);
  padding: 10px 20px;
}
</style>