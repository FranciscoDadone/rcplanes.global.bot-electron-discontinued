import { ipcMain } from 'electron';
import { getAllHashtagsToFetch } from '../../database/DatabaseQueries';

ipcMain.handle('getHashtagsToFetch', async () => {
  const hashtags = await getAllHashtagsToFetch();
  return hashtags;
});
