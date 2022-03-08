import { ipcMain } from 'electron';
import { getUtil, getGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.handle('getUtil', async () => {
  const util = await getUtil();
  return util;
});

ipcMain.handle('getUtilAndPostingRate', async () => {
  const util = await getUtil();
  const config = await getGeneralConfig();
  return {
    id: util.id,
    last_upload_date: util.last_upload_date,
    queued_medias: util.queued_medias,
    total_posted_medias: util.total_posted_medias,
    description_boilerplate: config.description_boilerplate,
    hashtag_fetching_enabled: config.hashtag_fetching_enabled,
    upload_rate: config.upload_rate,
  };
});
