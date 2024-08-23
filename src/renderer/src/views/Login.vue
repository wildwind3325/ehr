<template>
  <div>Login</div>
  <el-button type="success" @click="callApi">调用</el-button>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    async callApi() {
      let str = await window.electron.ipcRenderer.invoke('api', 'common', 'login');
      alert(JSON.stringify(str));
    }
  }
};
</script>