const { BrowserWindow } = require('electron');

export function sendShowPosts(posts: any) {
  BrowserWindow.getAllWindows()[0].webContents.send('showPosts', posts);
}

module.exports = {
  sendShowPosts,
};
