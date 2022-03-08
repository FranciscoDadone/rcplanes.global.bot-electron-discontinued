import { ipcMain } from 'electron';
import { swapInQueue } from '../../database/DatabaseQueries';

ipcMain.on(
  'updateQueue',
  async (
    _event,
    queue: {
      r1: {
        id: number;
        media: string;
        mediaType: string;
        caption: string;
        owner: string;
      };
      r2: {
        id: number;
        media: string;
        mediaType: string;
        caption: string;
        owner: string;
      };
    }
  ) => {
    swapInQueue(queue.r1, queue.r2);
  }
);
