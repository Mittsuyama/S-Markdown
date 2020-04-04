import React, { useState, useEffect } from 'react';
import './index.less';
// @ts-ignore
const { ipcRenderer } = window.electron;

export default () => {
  const [info, setInfo] = useState([]);
  const [addFolderInput, setAddFolderInput] = useState("");

  useEffect(() => {
    setInfo([]);
  }, []);

  return (
    <div className="home-container">
      <div className="info-container">{infoRender(info)}</div>
      <div className="form-container">
        <div className="item">
          <input
            type="text"
            value={addFolderInput}
            onChange={(event) => {
              setAddFolderInput(event.target.value);
            }}/>
            <button onClick={() => addFolder(addFolderInput)}>ADD FOLDER</button>
        </div>
        <div className="item">new document</div>
        <div className="item">delete folder</div>
        <div className="item">delete document</div>
      </div>
    </div>
  );
}

const addFolder = (value: string) => {
  const result = ipcRenderer.sendSync('add-folder', value);
  console.log(result);
};

const infoRender = (info: any) => {
   return (
     <div>files list</div>
   );
};
