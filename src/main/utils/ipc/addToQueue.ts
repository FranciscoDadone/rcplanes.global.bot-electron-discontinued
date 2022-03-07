import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import {
  addPostToQueue,
  updatePostStatus,
  getUtil,
  setUtil,
} from '../../database/DatabaseQueries';
import { uploadToImgur } from '../uploadToImgur';
import { updatePostsUI } from './updatePostsUI';

const fs = require('fs');

const STORAGE_PATH = process.env.NODE_ENV
  ? path.join(__dirname, '../../../../storage')
  : path.join(process.resourcesPath, 'storage');

ipcMain.handle(
  'addToQueue',
  async (
    _event,
    args: {
      id: string;
      media: string;
      mediaType: string;
      caption: string;
      owner: string;
    }
  ) => {
    const { id, media, mediaType, caption, owner } = args;

    let mediaToSave = media;

    if (mediaType === 'VIDEO') {
      const imgurLink = await uploadToImgur(
        path.join(STORAGE_PATH, `${id}.mp4`),
        'VIDEO'
      );
      mediaToSave = imgurLink;
    }

    let err = false;
    // eslint-disable-next-line no-return-assign
    addPostToQueue(mediaToSave, mediaType, caption, owner).catch(
      // eslint-disable-next-line no-return-assign
      () => (err = true)
    );
    updatePostStatus(id, 'posted');

    const extension = mediaType === 'IMAGE' ? 'png' : 'mp4';
    const pathToDelete = path.join(STORAGE_PATH, `${id}.${extension}`);
    fs.unlinkSync(pathToDelete);

    BrowserWindow.getAllWindows()[0].webContents.send('showNewPostToast', id);
    updatePostsUI();

    const util = await getUtil();
    await setUtil(
      util.last_upload_date,
      util.total_posted_medias,
      util.queued_medias + 1
    );

    return !err;
  }
);
