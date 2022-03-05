import { ipcMain } from 'electron';
import { deleteHashtag } from '../../database/DatabaseQueries';

ipcMain.on('deleteHashtag', async (_event, args) => {
  deleteHashtag(args[0]);
});
