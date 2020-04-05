const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const ROOT = 'data';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, function(error, data) {
      if(error) {
        reject(error);
      } else {
        resolve(JSON.parse(data.toString()));
      }
    })
  })
};

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
      event.reply('add-folder-reply', { status: 200 });
    }
  });

  ipcMain.on('fetch-folder-list', async (event, _) => {
    const result = await listFile(path.join(__dirname, `${ROOT}/folder`));
    if(result.status === 200) {
      const { data } = result;
      let promiseList = [];
      data.forEach(item => {
        if(item.substr(-4, 4) === 'json') {
          promiseList.push(readFile(path.join(__dirname, `${ROOT}/folder/${item}`)));
        }
      });
      Promise.all(promiseList).then(value => {
        let dic = {
          0: {
            children: [],
            name: 'root',
          },
        };
        value.forEach(item => dic[item.id] = { ...item, children: [] });
        value.forEach(item => dic[item.folder].children.push(item.id));
        const buildTree = (root) => {
          let list = [];
          const { children } = dic[root];
          if(children.length > 0) {
            children.forEach(item => {
              list.push({
                ...dic[item],
                children: buildTree(item),
              });
            });
          }
          return list;
        };
        event.reply('fetch-folder-list-reply', { status: 200, data: buildTree('0') });
      });
    }
  })
};

