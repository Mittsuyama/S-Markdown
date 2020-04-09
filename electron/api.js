const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const ROOT = 'data';

const getPath = (pathname) => {
  return path.join(__dirname, `${ROOT}/${pathname}`);
};

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
const updateFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(error, data) {
      if(error) {
        reject(error);
      } else {
        const origin = JSON.parse(data.toString());
        const newContent = {
          ...origin,
          ...content,
        };
        fs.writeFile(path, JSON.stringify(newContent),
          function(error) {
          if(error) {
            reject(error);
          } else {
            resolve(200);
          }
        })
      }
    });
  });
};

module.exports = () => {
  ipcMain.on('add-folder', async(event, arg) => {
    const newID = uuid.v1();
    const nowTime = Date.now();
    const conf = {
      name: arg.name || 'new Folder',
      id: newID,
      folder: arg.folder || 0,
      create_time: nowTime,
      update_time: nowTime,
    };
    const result = await newFile(getPath(`/folder/${newID}.json`), JSON.stringify(conf));
    if(result === 200) {
      event.returnValue = { status: 200, data: { id: newID }};
    }
  });
  ipcMain.on('fetch-folder-list', async (event, _) => {
    const result = await listFile(getPath(`/folder`));
    if(result.status === 200) {
      const { data } = result;
      let promiseList = [];
      data.forEach(item => {
        if(item.substr(-4, 4) === 'json') {
          promiseList.push(readFile(getPath(`/folder/${item}`)));
        }
      });
      Promise.all(promiseList).then(data => {
        let dic = {
          0: {
            children: [],
            name: 'root',
          },
        };
        const value = data.sort((a, b) => {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });
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
        event.returnValue = { status: 200, data: buildTree('0') };
      });
    }
  });
  ipcMain.on('update-folder', async (event, arg) => {
    const result = await updateFile(getPath(`/folder/${arg.id}.json`), arg.content);
    if(result === 200) {
      event.returnValue = { status: 200 };
    }
  });
  ipcMain.on('fetch-user-info', async (event, arg) => {
    const result = await readFile(getPath('/user.json'));
    if(result.status === 200) {
      event.returnValue = { status: 200, data: result.data };
    }
  });
  ipcMain.on('add-document', (event, arg) => {
    const newID = `${arg.folder}=doc=${uuid.v1()}`;
    const nowTime = Date.now();
    const conf = {
      name: arg.name || 'New Document',
      id: newID,
      folder: arg.folder,
      create_time: nowTime,
      update_time: nowTime,
      tag: [],
      star: [],
      subtitle: '',
      content: `# ${arg.name}`,
    };
    fs.mkdir(getPath(`/document/${newID}`),
      function(error) {
      if(error) {
        console.log(error);
      } else {
        (async function() {
          const result = await newFile(
            getPath(`/document/${newID}/${newID}.json`),
            JSON.stringify(conf)
          );
          if(result === 200) {
            event.returnValue = { status: 200, data: { id: newID } };
          }
        })();
      }
    });
  });
  ipcMain.on('fetch-document-list', async (event, arg) => {
    const result = await listFile(getPath(`/document`));
    if(result.status === 200) {
      const promiseList = result.data.reduce((pre, current) => {
        const names = current.split('=doc=');
        if(names.length > 1 && arg.folder.includes(names[0])) {
          pre.push(readFile(getPath(`/document/${current}/${current}.json`)));
        }
        return pre;
      }, []);
     Promise.all(promiseList).then(result => {
        let data = {};
        result.forEach(item => {
          if(!data.hasOwnProperty(item.folder)) {
            data[item.folder] = [];
          }
          data[item.folder].push(item);
        });
        event.returnValue = { status: 200, data };
      });
    }
  });
  ipcMain.on('fetch-document', async (event, arg) => {
    const { id } = arg;
    const result = await readFile(getPath(`/document/${id}/${id}.json`));
    event.returnValue = { status : 200, data: result };
  });
};

