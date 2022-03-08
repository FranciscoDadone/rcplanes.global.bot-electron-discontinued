import { ipcMain } from 'electron';
import { getQueue } from '../../database/DatabaseQueries';

ipcMain.handle('getQueue', async () => {
  const posts = await getQueue();
  return posts;
});
