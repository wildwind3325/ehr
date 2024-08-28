import DB from '../dao/db';

class LoginController {
  constructor() {
    this.user = null;
  }

  async login(data) {
    let db = new DB();
    let user = await db.findOne('select * from `user` where `account` = :account and `password` = :password', data);
    if (!user) {
      return {
        code: 1,
        msg: '登录失败，错误的用户名或密码。'
      };
    } else {
      this.user = user;
      return { code: 0 };
    }
  }

  logout(data) {
    this.user = null;
    return { code: 0 };
  }

  status(data) {
    return {
      code: 0,
      data: this.user
    };
  }
}

export default new LoginController();