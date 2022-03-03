import { ipcMain } from 'electron';
import { addWatermark } from '../addWatermark';

ipcMain.handle('postProcessImage', async (_event, args) => {
  const image = await addWatermark(args.path, 'test.png', args.username);
  return image;
});
