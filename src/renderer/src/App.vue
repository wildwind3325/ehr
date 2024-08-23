<template>
  <el-config-provider :locale="locale">
    <div v-loading.fullscreen.lock="loading"></div>
    <router-view />
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import zh from 'element-plus/dist/locale/zh-cn.mjs';
export default {
  name: 'App',
  components: {
    ElConfigProvider
  },
  data() {
    return {
      locale: zh,
      loading: false
    };
  },
  mounted() {
    window.$spin = {
      show: () => { this.loading = true; },
      hide: () => { this.loading = false; }
    };
  }
};
</script>