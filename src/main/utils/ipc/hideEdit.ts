import { ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('hideEdit', async (_ev, args) => {
  BrowserWindow.getAllWindows()[0].webContents.send(
    'hideEditModalToRenderer',
    args
  );
});
