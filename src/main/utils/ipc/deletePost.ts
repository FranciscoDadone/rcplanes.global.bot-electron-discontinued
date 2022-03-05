import { ipcMain } from 'electron';
import path from 'path';
import { updatePostStatus } from '../../database/DatabaseQueries';
import updatePostListUI from '../updatePostsListUI';

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
    updatePostStatus(id, 'deleted').catch(() => (err = true));
    updatePostListUI();

    const extension = mediaType === 'IMAGE' ? 'png' : 'mp4';
    const pathToDelete = path.join(STORAGE_PATH, `${id}.${extension}`);
    fs.unlinkSync(pathToDelete);

    return !err;
  }
);
