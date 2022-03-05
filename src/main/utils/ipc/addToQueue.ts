import { ipcMain, BrowserWindow } from 'electron';
import {
  addPostToQueue,
  updatePostStatus,
} from '../../database/DatabaseQueries';
import updatePostListUI from '../updatePostsListUI';

ipcMain.handle(
  'addToQueue',
  async (
    _event,
    args: { id: string; media: string; mediaType: string; caption: string }
  ) => {
    const { id, media, mediaType, caption } = args;

    let err = false;
    // eslint-disable-next-line no-return-assign
    addPostToQueue(media, mediaType, caption).catch(() => (err = true));
    updatePostStatus(id, 'posted');
    updatePostListUI();
    BrowserWindow.getAllWindows()[0].webContents.send('showNewPostToast', id);

    return !err;
  }
);
