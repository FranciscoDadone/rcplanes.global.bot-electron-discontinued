import { ipcMain, BrowserWindow } from 'electron';
import { getCredentials } from '../../database/DatabaseQueries';

ipcMain.handle('getCredentials', async () => {
  const credentials = await getCredentials();
  BrowserWindow.getAllWindows()[0].webContents.send('credentials', credentials);
});
