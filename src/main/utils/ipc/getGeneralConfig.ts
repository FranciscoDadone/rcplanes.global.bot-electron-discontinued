import { ipcMain, BrowserWindow } from 'electron';
import { getGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.handle('getGeneralConfig', async () => {
  const config: {
    id: number;
    upload_rate: number;
    description_boilerplate: string;
  } = await getGeneralConfig();
  BrowserWindow.getAllWindows()[0].webContents.send('generalConfig', {
    upload_rate: config.upload_rate,
    description_boilerplate: config.description_boilerplate,
  });
  return config;
});
