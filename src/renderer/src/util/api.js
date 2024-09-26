export default {
  async call(module, action, data) {
    try {
      window.$spin.show();
      let result = await window.electron.ipcRenderer.invoke('api', module, action, data);
      return result;
    } catch (err) {
      return {
        code: 1,
        msg: err.message
      };
    } finally {
      window.$spin.hide();
    }
  }
};