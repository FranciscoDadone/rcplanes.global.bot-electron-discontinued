import { ipcMain } from 'electron';
import { getAllPostsJSON } from '../../database/DatabaseQueries';

ipcMain.handle('getAllPosts', async () => {
  const posts = await getAllPostsJSON();
  return posts;
});
