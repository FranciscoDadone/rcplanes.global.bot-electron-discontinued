import { ipcMain } from 'electron';
import { setGeneralConfig } from '../../database/DatabaseQueries';

ipcMain.on(
  'setGeneralConfig',
  async (
    _event,
    args: {
      upload_rate: number;
      description_boilerplate: string;
      hashtag_fetching_enabled: boolean;
    }
  ) => {
    setGeneralConfig(
      args.upload_rate,
      args.description_boilerplate,
      args.hashtag_fetching_enabled
    );
  }
);
