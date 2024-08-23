import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { autoUpdater } from 'electron-updater';

var log4js = require('log4js');

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
      let method = api[args[0]][args[1]];
      return await method.call(api[args[0]], args);
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

autoUpdater.setFeedURL('https://apps.onwings.com:8050/update/ehr/');
autoUpdater.autoDownload = false;
log4js.getLogger().info('开始检查更新');
autoUpdater.checkForUpdates();

autoUpdater.on('update-available', function (info) {
  log4js.getLogger().info('有更新可用');
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', function (info) {
  log4js.getLogger().info('无更新可用');
});

autoUpdater.on('download-progress', function (progressObj) {
  log4js.getLogger().info('下载进度：' + progressObj.percent + '%');
});

autoUpdater.on('update-downloaded', function () {
  log4js.getLogger().info('下载完毕开始安装');
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});