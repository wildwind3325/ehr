import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

var log4js = require('log4js');

import './util/enhance';
import * as api from './api';
import * as env from './env';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

env.init();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron.ehr');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.handle('api', async (event, ...args) => {
    try {
      if (args.length < 2) throw new Error('调用参数错误');
      let module = args[0], action = args[1], data = args[2] ? JSON.parse(args[2]) : {};
      if (!api[module]) throw new Error('找不到模块');
      let method = api[module][action];
      if (!method) throw new Error('找不到方法');
      return await method.call(api[module], data);
    } catch (err) {
      log4js.getLogger('error').error(err.message, err);
      return {
        code: 1,
        msg: err.message
      };
    }
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});