import { ipcMain } from 'electron';
import path from 'path';
import { updatePostStatus } from '../../database/DatabaseQueries';
import { updatePostsUI } from './updatePostsUI';

const fs = require('fs');

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../storage')
  : path.join(process.resourcesPath, 'storage');

ipcMain.handle(
  'deletePost',
  async (_event, args: { id: string; mediaType: string }) => {
    const { id, mediaType } = args;

    let err = false;
    // eslint-disable-next-line no-return-assign
    await updatePostStatus(id, 'deleted').catch(() => (err = true));
    updatePostsUI();

    const extension = mediaType === 'IMAGE' ? 'png' : 'mp4';
    const pathToDelete = path.join(STORAGE_PATH, `${id}.${extension}`);
    try {
      fs.unlinkSync(pathToDelete);
    } catch (_err) {
      console.log('Aready deleted! (', pathToDelete, ')');
    }

    return !err;
  }
);
