import React, { useEffect, useState } from 'react';
import {
  queryFolderList,
  queryAddFolder,
  queryUpdateFolder,
} from '@/utils/electronApi';
import IconButton from '@/component/icon-button';
import InputModal from '@/component/ipnut-modal';

import '@/styles/folder-layout.less'
import shouldUpdateWithError from 'react-hook-form/dist/logic/shouldUpdateWithError';

// @ts-ignore
const { ipcRenderer, remote } = window.electron;
const { Menu, MenuItem } = remote;

export default (props: any) => {
  const [search, setSearch] = useState('');
  const [folderList, setFolderList] = useState([]);
  const [selectFolder, setSelectFolder] = useState(['3aa59af0-771d-11ea-9526-5358559de70f']);
  const [modal, setModal] = useState({
    show: false,
    title: '',
    ok: (value: string) => {},
  });

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

  const handleAddFolder = (folder: string, name: string) => {
    (async function() {
      const result: any = await queryAddFolder({ name, folder });
      if(result.status === 200) {
        fetch();
      }
    })();
  };

  const handleShowAddFolderModal = (folder: string) => {
    console.log(folder);
    setModal({
      show: true,
      title: 'NEW FOLDER',
      ok: (name) => handleAddFolder(folder, name),
    });
  };

  const handleFolderClick = (id: string) => {
    setSelectFolder([id]);
  };

  const handleFolderExpandChange = (id: string, expand: boolean) => {
    (async function() {
      const result: any = await queryUpdateFolder({
        id,
        content: {
          expand: !expand,
        },
      });
      if(result.status === 200) {
        fetch();
      }
    })();
  };

  const getContextMenu = (menuList: any) => {
    const menu = new Menu();
    menuList.forEach((item: any) => {
      const { label, click, type, checked } = item;
      switch(type) {
        case 'separator':
          menu.append(new MenuItem({ type }));
          break;
        case 'checkbox':
          menu.append(new MenuItem({ label, click, type, checked }));
          break;
        default:
          menu.append(new MenuItem({ label, click }));
          break;
      }
    });
    return menu;
  };

  const handleFolderContextMenuClick = (e: any, id: string, expand: boolean) => {
    if(selectFolder.length < 2) {
      setSelectFolder([id]);
      const menu = getContextMenu([
        { label: 'New Folder', click: () => {handleShowAddFolderModal(id)} },
        { label: 'New Document', click: () => {} },
        { type: 'separator' },
        { label: 'Expand',
          type: 'checkbox',
          checked: expand,
          click: () => handleFolderExpandChange(id, expand)
          },
        { type: 'separator' },
        { label: 'Move to Another Folder', click: () => {} },
        { label: 'Move to Trash', click: () => {} },
        { type: 'separator' },
        { label: 'Star Folder', click: () => {} },
        { label: 'Rename', click: () => {} },
        { label: 'Get Info', click: () => {} },
        { label: 'copy link', click: () => {} },
      ]);
      // @ts-ignore
      menu.popup(window.electron.remote.getCurrentWindow());
    }
  };

  const folderListRender = (layer: number, list :any) => {
    return (
      <div className="folder-list-box">
        {list.map((item: any) => {
          return (
            <div className="folder-box" key={item.id}>
              <div
                className={`folder-item ${selectFolder.includes(item.id)
                ? 'folder-select'
                : null }`}
                onClick={() => handleFolderClick(item.id)}
                onContextMenu={e => handleFolderContextMenuClick(e, item.id, item.expand)}
              >
                <span
                  className="title"
                  style={{ paddingLeft: 30 * layer }}
                >{item.name}</span>
                {item.children.length > 0 ? (
                  <i
                    style={{ width: 40, height: 35 }}
                    className={`iconfont ${item.expand ? 'icon-zhankai' : 'icon-youjiantou' }`}
                    onClick={() => handleFolderExpandChange(item.id, item.expand)}
                  />
                ) : (
                  <span />
                ) }
              </div>
              {item.children.length > 0 && item.expand
                ? folderListRender(layer + 1, item.children)
                : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="folder-layout-container">
      <div className="folder-container">
        <div className="folder-head">
          <div className="folder-head-drag-box" />
          <div className="input-box">
            <i className="iconfont icon-search" />
            <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="SEARCH DOCUMENT"
            />
          </div>
          <div className="folder-add-box">
            <IconButton
              icon={'icon-icon_newfolder'}
              click={() => handleShowAddFolderModal('0')}
            />
          </div>
        </div>
        <div className="folder-main">
          {folderListRender(0, folderList)}
        </div>
      </div>
      <div className="folder-editor-container">{props.children}</div>
      <InputModal
        show={modal.show}
        title={modal.title}
        setValue={(value: any) => setModal({ ...modal, ...value})}
        ok={modal.ok}
      />
    </div>
  )
}
