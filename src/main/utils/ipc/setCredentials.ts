import { ipcMain } from 'electron';
import { setCredentials } from '../../database/DatabaseQueries';

ipcMain.on('setCredentials', async (_event, args: any) => {
  setCredentials(
    args.access_token,
    args.client_secret,
    args.client_id,
    args.ig_account_id
  );
});
