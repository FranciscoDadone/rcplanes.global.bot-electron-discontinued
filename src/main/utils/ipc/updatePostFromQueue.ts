import { ipcMain } from 'electron';
import { updateQueuePostCaption } from '../../database/DatabaseQueries';

ipcMain.handle(
  'updatePostFromQueue',
  async (
    _event,
    args: {
      id: string;
      caption: string;
    }
  ) => {
    await updateQueuePostCaption(args.id, args.caption);
  }
);
