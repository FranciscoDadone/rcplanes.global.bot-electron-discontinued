import { ipcMain } from 'electron';
import { getAllNonDeletedPosts } from '../../database/DatabaseQueries';

ipcMain.handle('getPosts', async () => {
  const posts = await getAllNonDeletedPosts();
  return posts;
});
