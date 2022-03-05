import { ipcMain, BrowserWindow } from 'electron';
import { getAllHashtagsToFetch } from '../../database/DatabaseQueries';

ipcMain.handle('getHashtagsToFetch', async () => {
  const hashtags = await getAllHashtagsToFetch();
  BrowserWindow.getAllWindows()[0].webContents.send(
    'hashtagsToFetch',
    hashtags
  );
});
