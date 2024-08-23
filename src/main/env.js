var log4js = require('log4js');
var path = require('path');
var Sequelize = require('sequelize');

import cm from './dao/cm';

var config = {};

var init = () => {
  log4js.configure({
    appenders: {
      app: {
        type: 'file',
        filename: 'logs/app.log',
        maxLogSize: 10485760,
        numBackups: 3
      },
      error: {
        type: 'file',
        filename: 'logs/error.log',
        maxLogSize: 10485760,
        numBackups: 3
      }
    },
    categories: {
      default: {
        appenders: ['app'],
        level: 'info'
      },
      error: {
        appenders: ['error'],
        level: 'info'
      }
    }
  });

  let db_file = path.join(__dirname, '../../data/default.db');
  if (process.env.NODE_ENV !== 'development')
    db_file = path.join(process.cwd(), './data/default.db');
  let conn = new Sequelize({
    dialect: 'sqlite',
    storage: db_file,
    logging: false
  });
  cm.set('default', conn);
};

export { config, init };