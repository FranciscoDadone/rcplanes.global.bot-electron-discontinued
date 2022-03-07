import { ipcMain, BrowserWindow } from 'electron';
import { getGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.handle('getGeneralConfig', async () => {
  const config: {
    id: number;
    upload_rate: number;
    description_boilerplate: string;
  } = await getGeneralConfig();
  return config;
});
