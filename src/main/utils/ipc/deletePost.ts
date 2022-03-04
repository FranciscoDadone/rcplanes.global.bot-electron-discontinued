import { ipcMain } from 'electron';
import { updatePostStatus } from '../../database/DatabaseQueries';
import updatePostListUI from '../updatePostsListUI';

ipcMain.handle('deletePost', async (_event, args: { id: string }) => {
  const { id } = args;

  let err = false;
  // eslint-disable-next-line no-return-assign
  updatePostStatus(id, 'deleted').catch(() => (err = true));
  updatePostListUI();

  return !err;
});
