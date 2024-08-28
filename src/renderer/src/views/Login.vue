<template>
  <div class="div-center login-page">
    <div class="div-center login-box">
      <div class="login-box-title">用户登录</div>
      <div class="login-box-item">
        <el-input ref="account" v-model="account" prefix-icon="User" placeholder="请输入账号" />
      </div>
      <div class="login-box-item">
        <el-input ref="password" v-model="password" type="password" prefix-icon="Lock" placeholder="请输入密码"
          @keyup.enter.native="login" />
      </div>
      <div class="login-box-item">
        <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../util/api';
export default {
  name: 'Login',
  data() {
    return {
      account: localStorage.getItem('account') || '',
      password: ''
    };
  },
  async mounted() {
    let target = localStorage.getItem('target_uri') || '/home';
    let res = await api.call('login', 'status');
    if (res.code === 0 && res.data) {
      localStorage.removeItem('target_uri');
      this.$router.replace(target);
    } else {
      if (!this.account) {
        this.$refs.account.focus();
      } else {
        this.$refs.password.focus();
      }
    }
  },
  methods: {
    async login() {
      if (!this.account || !this.password) {
        this.$message({
          type: 'warning',
          message: '请先输入完整的信息'
        });
        return;
      }
      try {
        let res = await api.call('login', 'login', JSON.stringify({
          account: this.account,
          password: this.password
        }));
        if (res.code !== 0) {
          this.$message({
            type: 'error',
            message: '登录失败：' + res.msg
          });
          return;
        }
        let target = localStorage.getItem('target_uri') || '/home';
        localStorage.removeItem('target_uri');
        localStorage.setItem('account', this.account);
        this.$router.replace(target);
      } catch (err) {
        this.$message({
          type: 'error',
          message: '登录失败：' + err.message
        });
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #2d3a4b;
}

.login-box {
  width: 300px;
  flex-direction: column;
}

.login-box-title {
  font-size: 32px;
  color: #ffffff;
}

.login-box-item {
  width: 100%;
  margin-top: 20px;
}
</style>