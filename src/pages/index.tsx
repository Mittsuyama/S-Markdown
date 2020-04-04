import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './index.less';
// @ts-ignore
const { ipcRenderer } = window.electron;

export default () => {
  // @ts-ignore
  const { register, handleSubmit } = useForm();
  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetchFolders();
    setInfo([]);
  }, []);

  return (
    <div className="home-container">
      <div className="info-container">{infoRender(info)}</div>
      <div className="form-container">
        <form onSubmit={handleSubmit(addFolder)} className="item">
          <input type="text" name="name" ref={register}/>
          <input type="text" name="folder" ref={register}/>
          <input type="submit"/>
        </form>
        <div className="item">new document</div>
        <div className="item">delete folder</div>
        <div className="item">delete document</div>
      </div>
    </div>
  );
}

const addFolder = (value: any) => {
  const result = ipcRenderer.sendSync('add-folder', value);
  console.log(value);
};

const infoRender = (info: any) => {
   return (
     <div>files list</div>
   );
};

const fetchFolders = () => {
  const result = ipcRenderer.sendSync('fetch-folders-structure');
  if(result.status === 200) {
    console.log(result.data);
  }
};
