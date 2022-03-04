import { ipcMain, BrowserWindow } from 'electron';
import {
  addPostToQueue,
  updatePostStatus,
} from '../../database/DatabaseQueries';
import updatePostListUI from '../updatePostsListUI';

ipcMain.handle(
  'addToQueue',
  async (_event, args: { id: string; image: string; caption: string }) => {
    const { id, image, caption } = args;

    let err = false;
    // eslint-disable-next-line no-return-assign
    addPostToQueue(image, caption).catch(() => (err = true));
    updatePostStatus(id, 'posted');
    updatePostListUI();
    BrowserWindow.getAllWindows()[0].webContents.send('showNewPostToast', id);

    return !err;
  }
);
