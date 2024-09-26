import DB from '../../dao/db';

class DepartmentController {
  constructor() {
  }

  async list(data) {
    let db = new DB();
    if (data.pageSize) {
      let result = await db.findByPage({
        fields: [],
        table: 'department',
        where: '',
        params: {},
        pageSize: data.pageSize,
        pageNumber: data.pageNumber,
        orderBy: ''
      });
      return {
        code: 0,
        data: result
      };
    } else {
      let list = await db.find('select * from `department`');
      return {
        code: 0,
        data: list
      };
    }
  }

  async add(data) {
    let db = new DB();
    let list = await db.find('select * from `department` where `code` = :code or `name` = :name', data);
    if (list.length > 0) {
      return {
        code: 1,
        msg: '该记录已存在'
      };
    }
    let date = new Date().format('yyyy-MM-dd HH:mm:ss');
    let item = Object.assign({
      created_at: date,
      updated_at: date
    }, data);
    await db.insert('department', item);
    item = await db.findById('department', item.id);
    return {
      code: 0,
      data: item
    };
  }

  async edit(data) {
    let db = new DB();
    let item = await db.findById('department', data.id);
    if (!item) {
      return {
        code: 1,
        msg: '未找到指定的记录'
      };
    }
    let list = await db.find('select * from `department` where `id` <> :id and (`code` = :code or `name` = :name)', data);
    if (list.length > 0) {
      return {
        code: 1,
        msg: '该记录已存在'
      };
    }
    item = Object.assign({ updated_at: new Date().format('yyyy-MM-dd HH:mm:ss') }, data);
    await db.update('department', item);
    item = await db.findById('department', item.id);
    return {
      code: 0,
      data: item
    };
  }

  async remove(data) {
    let db = new DB();
    let item = await db.findById('department', data.id);
    if (!item) {
      return {
        code: 1,
        msg: '未找到指定的记录'
      };
    }
    await db.delete('department', data.id);
    return { code: 0 };
  }
}

export default new DepartmentController();