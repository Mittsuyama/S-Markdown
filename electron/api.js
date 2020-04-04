const { ipcMain } = require('electron');
const fs = require('fs');
const uuid = require('uuid');

module.exports = () => {
  ipcMain.on('add-folder', (event, arg) => {
    event.returnValue = uuid.v1();
  });
};

