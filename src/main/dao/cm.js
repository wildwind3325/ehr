var conns = {};

var cm = {
  set(name, conn) {
    conns[name] = conn;
  },
  get(name) {
    return conns[name || 'default'];
  }
};

export default cm;