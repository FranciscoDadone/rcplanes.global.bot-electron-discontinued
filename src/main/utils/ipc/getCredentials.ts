import { ipcMain } from 'electron';
import { getCredentials } from '../../database/DatabaseQueries';

ipcMain.handle('getCredentials', async () => {
  const credentials = await getCredentials();
  return credentials;
});
