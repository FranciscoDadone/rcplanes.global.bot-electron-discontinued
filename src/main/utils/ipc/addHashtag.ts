import { ipcMain } from 'electron';
import { addHashtagToFetch } from '../../database/DatabaseQueries';

ipcMain.on('addHashtag', async (_event, args) => {
  addHashtagToFetch(args[0]);
});
