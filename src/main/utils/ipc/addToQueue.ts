import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import {
  addPostToQueue,
  updatePostStatus,
} from '../../database/DatabaseQueries';
import updatePostListUI from '../updatePostsListUI';
import { uploadToImgur } from '../uploadToImgur';

const fs = require('fs');

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../storage')
  : path.join(process.resourcesPath, 'storage');

ipcMain.handle(
  'addToQueue',
  async (
    _event,
    args: { id: string; media: string; mediaType: string; caption: string }
  ) => {
    const { id, media, mediaType, caption } = args;

    let mediaToSave = media;

    if (mediaType === 'VIDEO') {
      const imgurLink = await uploadToImgur(
        path.join(STORAGE_PATH, `${id}.mp4`)
      );
      console.log(imgurLink);
      mediaToSave = imgurLink;
    }

    let err = false;
    // eslint-disable-next-line no-return-assign
    addPostToQueue(mediaToSave, mediaType, caption).catch(() => (err = true));
    updatePostStatus(id, 'posted');

    const extension = mediaType === 'IMAGE' ? 'png' : 'mp4';
    const pathToDelete = path.join(STORAGE_PATH, `${id}.${extension}`);
    fs.unlinkSync(pathToDelete);

    BrowserWindow.getAllWindows()[0].webContents.send('showNewPostToast', id);
    updatePostListUI();

    return !err;
  }
);
