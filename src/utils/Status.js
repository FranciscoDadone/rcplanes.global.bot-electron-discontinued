const { BrowserWindow } = require('electron');

function setStatus(newStatus) {
  BrowserWindow.getAllWindows()[0].webContents.send('status', newStatus);
}

module.exports = {
  setStatus,
};
