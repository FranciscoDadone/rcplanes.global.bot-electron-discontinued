import { ipcMain } from 'electron';
import { setGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.on('setGeneralConfig', async (_event, args: any) => {
  setGeneralConfig(args.upload_rate, args.description_boilerplate);
});
