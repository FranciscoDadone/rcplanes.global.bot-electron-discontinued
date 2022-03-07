import { ipcMain } from 'electron';
import { getGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.handle('getGeneralConfig', async () => {
  const config: {
    id: number;
    upload_rate: number;
    description_boilerplate: string;
    fetching_enabled: boolean;
  } = await getGeneralConfig();
  return config;
});
