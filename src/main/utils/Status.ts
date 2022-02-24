const { BrowserWindow } = require('electron');

function setStatus(newStatus: string) {
  BrowserWindow.getAllWindows()[0].webContents.send('status', newStatus);
}

module.exports = {
  setStatus,
};
