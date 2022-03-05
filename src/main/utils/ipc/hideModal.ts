import { ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('hideModal', async () => {
  BrowserWindow.getAllWindows()[0].webContents.send(
    'hideModalToRenderer',
    false
  );
});
