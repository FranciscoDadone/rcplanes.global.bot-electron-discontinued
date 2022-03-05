import { ipcMain, BrowserWindow } from 'electron';
import { getAllPostsJSON } from '../../database/DatabaseQueries';

ipcMain.handle('getAllPosts', async () => {
  const posts = await getAllPostsJSON();
  BrowserWindow.getAllWindows()[0].webContents.send('allPostsData', posts);
});
