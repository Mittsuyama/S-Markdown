import React, { useEffect, useState } from 'react';
import IconButton from '@/component/iconButton';

import {
  queryAddFolder,
  queryFolderList,
  queryUpdateFolder
} from '@/utils/electronApi';

import './home.less';

export default (props: any) => {
  const menuList = [
    { name: 'DOCUMENTS', link: 'document', icon: 'icon-document' },
    { name: 'STARS', link: 'star', icon: 'icon-shoucang' },
    { name: 'TAGS', link: 'tag', icon: 'icon-tag' },
    { name: 'LATEST', link: 'latest', icon: 'icon-shijian' },
    { name: 'TRASH', link: 'trash', icon: 'icon-shanchu' },
  ];

  const [folderList, setFolderList] = useState([]);

  const fetch = () => {
    (async function() {
      const result: any = await queryFolderList();
      if(result.status === 200) {
        setFolderList(result.data);
      }
    })();
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSettingClick = () => {};

  const handleAddFolder = async (folder: string) => {
    const result: any = await queryAddFolder({
      name: 'New Folder', folder
    });
    if(result.status === 200) {
      fetch();
    }
  };

  const handleFolderMenu = async (event: any, id: string) => {
    event.stopPropagation();
  };

  const handleExpandFolder = async (event: any, expand: number, id: string) => {
    event.stopPropagation();
    const result: any = await queryUpdateFolder({
      id, content: { expand: !expand }
    });
    if(result.status === 200) {
      fetch();
    }
  };

  const handleClickItem = (id: string) => {
    console.log(id);
  };

  const folderListRender = (layer: number, list: any) => {
    return (
      <div className='list-box'>
        {list.map((item: any, index: number) => {
          return (
            <div
              key={item.id}
              onClick={() => handleClickItem(item.id)}
              className="item">
              <div className="item-head" style={{ paddingLeft: layer * 15}}>
                <div className="title">
                  {item.children.length > 0
                    ? <i
                      className={`icon-box iconfont icon-${item.expand ? 'zhankai' : 'youjiantou'}`}
                      onClick={(event) => {
                        const _ = handleExpandFolder(event, item.expand, item.id);
                      }}/>
                    : <span className="icon-box"/>}
                  <span className="title">{item.name}</span>
                </div>
                <div className="add-kid">
                  <IconButton
                    size={"small"}
                    icon={"icon-caidan"}
                    click={(event: any) => {
                    const _ = handleFolderMenu(event, item.id);
                  }}/>
                </div>
              </div>
              {item.expand && item.children.length > 0
                ? folderListRender(layer + 1, item.children)
                : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className="navigation">
        <div className="nav-head" />
        <div className="nav-main">
          <div className="menu-list">
            {menuList.map((item: any) => {
              return (
                <div key={item.name} className={'item'}>
                  <i className={`iconfont ${item.icon}`}/>
                  <span className="title">{item.name}</span>
                </div>
              );
            })}
            <div className="gap" />
          </div>
          <div className="folder-list">
            <div className="head">
              <div className="title-box">
                <i className="iconfont icon-folder-o"/>
                <span>FOLDER</span>
              </div>
              <div className="add-box">
                <IconButton
                  size={'small'}
                  icon={'icon-tianjia'}
                  click={() => handleAddFolder('0')}/>
              </div>
            </div>
            <div className="main">
              {folderListRender(1, folderList)}
            </div>
          </div>
        </div>
        <div className={'foot'}>
          <IconButton icon={'icon-setting'} click={handleSettingClick}/>
        </div>
      </div>
      <div className="folder">{props.children}</div>
    </div>
  );
}
