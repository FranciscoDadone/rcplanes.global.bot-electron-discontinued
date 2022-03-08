import { ipcMain } from 'electron';
import {
  removePostFromQueue,
  getUtil,
  setUtil,
} from '../../database/DatabaseQueries';

ipcMain.handle('deleteFromQueue', async (_event, id) => {
  await removePostFromQueue(id);
  const util = await getUtil();
  setUtil(
    util.last_upload_date,
    util.total_posted_medias,
    util.queued_medias - 1
  );
});
