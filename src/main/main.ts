import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import { Post } from './models/Post';

// Database
import { connect, close } from './database/DatabaseHandler';
import { getAllNonDeletedPosts } from './database/DatabaseQueries';

// Tasks
const BackgroundTasks = require('./BackgroundTasks');

// Show posts (IPC Handler)
const showPostsIPC = require('./utils/ipc/sendShowPosts');

// PostProcessImage (IPC Handler)
require('./utils/ipc/postPorcessImage');

// SaveToQueue (IPC Handler)
require('./utils/ipc/addToQueue');

// SaveToQueue (IPC Handler)
require('./utils/ipc/deletePost');

// GetPosts (IPC Handler)
require('./utils/ipc/getPosts');

// GetAllPosts (IPC Handler)
require('./utils/ipc/getAllPosts');

// HideModal (IPC Handler)
require('./utils/ipc/hideModal');

// getHashtagsToFetch (IPC Handler)
require('./utils/ipc/getHashtagsToFetch');

// deleteHashtag (IPC Handler)
require('./utils/ipc/deleteHashtag');

// addHashtag (IPC Handler)
require('./utils/ipc/addHashtag');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
   new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    close();
    app.quit();
  }
});

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(() => {
    createWindow();
    (async () => {
      connect();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      getAllNonDeletedPosts().then((postsDB: Post[]) => {
        showPostsIPC.sendShowPosts(postsDB);
      });
      BackgroundTasks.startHashtagFetching();
    })();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
