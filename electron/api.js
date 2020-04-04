const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const ROOT = 'data';

const newFile = (fileName, content = "") => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, function(error) {
      if(error) {
        console.log(error);
        reject(error);
      } else {
        resolve(200);
      }
    });
  })
};

const listFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, function(error, data) {
      if(error) {
        reject(error);
      } else {
        resolve({
          status: 200,
          data: data,
        });
      }
    });
  })
};

module.exports = () => {
  ipcMain.on('add-folder', async(event, arg) => {
    const newID = uuid.v1();
    const nowTime = Date.now();
    const conf = {
      name: arg.name || 'new folder',
      id: newID,
      folder: arg.folder || 0,
      create_time: nowTime,
      update_time: nowTime,
    };
    const result = await newFile(path.join(__dirname, `${ROOT}/folder/${newID}.json`), JSON.stringify(conf));
    if(result === 200) {
      event.returnValue = {
        status: 200,
      };
    }
  });

  ipcMain.on('fetch-folders-structure', async (event, arg) => {
    event.returnValue = await listFile(path.join(__dirname, `${ROOT}/folder`));
  })
};

