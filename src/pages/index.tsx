import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './index.less';
import electronAjax  from '@/utils/electronAjax';
import { history } from 'umi';

export default () => {
  // @ts-ignore
  history.push('/home');
  const { register, handleSubmit } = useForm();
  const [folderList, setFolderList] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const addFolder = async (value: any) => {
    const result: any = await electronAjax('add-folder', value);
    if(result.status === 200) {
      fetch();
    }
  };

  const fetch = () => {
    (async function() {
      const result: any = await electronAjax('fetch-folder-list', {});
      if(result.status === 200) {
        setFolderList(result.data);
      }
    })();
  };

  const folderListRender = (folder: any) => {
    return (
      folder.map((item: any) => {
        return (
          <div className="item" key={item.id}>
            {item.id} - {item.name}
            {item.children.length > 0 ? folderListRender(item.children) : null}
          </div>
        );
      })
    );
  };

  return (
    <div className="home-container">
      <div className="info-container">{folderListRender(folderList)}</div>
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
