import { ipcMain } from 'electron';
import updatePostsListUI from '../updatePostsListUI';

ipcMain.handle('getPosts', async () => {
  updatePostsListUI();
});
