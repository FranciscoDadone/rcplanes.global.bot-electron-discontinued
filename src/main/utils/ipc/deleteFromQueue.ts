import { ipcMain, BrowserWindow } from 'electron';
import { removePostFromQueue, getQueue } from '../../database/DatabaseQueries';

ipcMain.handle('deleteFromQueue', async (_event, id) => {
  await removePostFromQueue(id);
  getQueue().then((data) => {
    BrowserWindow.getAllWindows()[0].webContents.send('updateQueueUI', data);
  });
});
