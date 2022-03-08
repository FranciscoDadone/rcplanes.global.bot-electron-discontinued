import { ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('hideModal', async () => {
  BrowserWindow.getAllWindows()[0].webContents.send(
    'hideModalToRenderer',
    false
  );
});

ipcMain.handle('hideEdit', async () => {
  BrowserWindow.getAllWindows()[0].webContents.send(
    'hideEditModalToRenderer',
    false
  );
});
