import React, { useEffect, useState } from 'react';
import {
  queryFolderList,
  queryAddFolder,
  queryUpdateFolder,
  queryAddDocument,
  queryDocumentList,
} from '@/utils/electronApi';
import IconButton from '@/components/icon-button';
import InputModal from '@/components/ipnut-modal';

import '@/styles/folder-layout.less'
import shouldUpdateWithError from 'react-hook-form/dist/logic/shouldUpdateWithError';
import ex from 'umi/dist';

// @ts-ignore
const { ipcRenderer, remote } = window.electron;
const { Menu, MenuItem } = remote;

export default (props: any) => {
  const [search, setSearch] = useState('');
  const [folderList, setFolderList] = useState([]);
  const [expandList, setExpandList] = useState(['0']);
  const [docList, setDocList] = useState({});
  const [selectFolder, setSelectFolder] = useState(['0']);
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
    (async function() {
      const result: any = await queryDocumentList({ folder: expandList });
      if(result.status === 200) {
        setDocList(result.data);
      }
    })();
  }, [expandList]);

  useEffect(() => {
    fetch();
  }, []);

  const handleAddFolder = (folder: string, name: string) => {
    (async function() {
      const result: any = await queryAddFolder({ name, folder });
      if(result.status === 200) {
        handleFolderExpandChange(folder, false);
        handleFolderClick(result.data.id);
        fetch();
      }
    })();
  };

  const handleAddDocument = async (folder: string, name: string) => {
    const result: any = await queryAddDocument({ name, folder });
    if(result.status === 200) {
      handleFolderExpandChange(folder, false);
      handleFolderClick(result.data.id);
    }
  };

  const handleShowAddFolderModal = (folder: string) => {
    setModal({
      show: true,
      title: 'NEW FOLDER',
      ok: (name) => handleAddFolder(folder, name),
    });
  };

  const handleShowAddDocumentModal = (folder: string) => {
    setModal({
      show: true,
      title: 'NEW DOCUMENT',
      ok: (name) => handleAddDocument(folder, name),
    });
  };

  const handleFolderClick = (id: string) => {
    setSelectFolder([id]);
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

  const handleDocumentDoubleClick = (e: any, folder: string, id: string) => {
    const { pathname } = props.history.location;
    const pathList = pathname.split("/");
    props.history.push({
      pathname: `/${pathList[1]}/${pathList[2]}/${id}`,
      query: {
        folder,
      }
    });
  };

  const handleFolderContextMenuClick = (e: any, id: string, expand: boolean) => {
    if(selectFolder.length < 2) {
      setSelectFolder([id]);
      const menu = getContextMenu([
        { label: 'New Folder', click: () => {handleShowAddFolderModal(id)} },
        { label: 'New Document', click: () => {handleShowAddDocumentModal(id)} },
        { type: 'separator' },
        { label: 'Expand',
          type: 'checkbox',
          checked: expand,
          click: () => handleFolderExpandChange(id, expand)
        },
        { type: 'separator' },
        { label: 'Move to Another Folder', click: () => {} },
        { label: 'Delete', click: () => {} },
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

  const handleDocumentContextMenuClick = (e: any, folder: string, id: string) => {
    if(selectFolder.length < 2) {
      setSelectFolder([id]);
      const menu = getContextMenu([
        { label: 'New Folder', click: () => {handleShowAddFolderModal(folder)} },
        { label: 'New Document', click: () => {handleShowAddDocumentModal(folder)} },
        { type: 'separator' },
        { type: 'separator' },
        { label: 'Move to Another Folder', click: () => {} },
        { label: 'Delete', click: () => {} },
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

  const handleFolderExpandChange = (id: string, expand: boolean) => {
    if(expand) {
      let tempList: any = [];
      expandList.forEach(item => item === id ? null : tempList.push(item));
      setExpandList(tempList);
    } else {
      setExpandList([ ...expandList, id ]);
    }
  };

  const documentListRender = (pathname: string, layer: number, list: any) => {
    return (
      <div className="folder-list-box">
        {list.sort((a: any, b: any) => {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        }).map((item: any) => {
          const isIncluded = selectFolder.includes(item.id);
          return (
            <div className="folder-box" key={item.id}>
              <div
                // style={{ fontWeight: isIncluded ? 'bold' : 'normal'}}
                className={`folder-item ${isIncluded? 'folder-select': null }`}
                onClick={() => handleFolderClick(item.id)}
                onContextMenu={e => handleDocumentContextMenuClick(e, item.folder, item.id)}
                onDoubleClick={e => handleDocumentDoubleClick(e, pathname, item.id)}
              >
                <span
                  className="title"
                  style={{ paddingLeft: 30 * layer }}
                ><i className="iconfont icon-document" />{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const folderListRender = (pathname: string, layer: number, list :any) => {
    return (
      <div className={`folder-box-${layer ? 'item' : 'head'}`}>
        {list.map((item: any) => {
          const isIncluded = selectFolder.includes(item.id);
          return (
            <div key={item.id}>
              <div
                className={`folder-box-${layer ? 'item' : 'head'}`}
                onClick={() => handleFolderClick(item.id)}
                onContextMenu={e => handleFolderContextMenuClick(
                    e, 
                    item.id, 
                    expandList.includes(item.id)
                  )}>
                <div
                  className="title"
                  style={{ paddingLeft: 30 * layer }}>
                  <i className="iconfont icon-folder" />
                  <span>{item.name}</span>
                   <i
                    style={{ width: 40, height: 35 }}
                    className={`iconfont ${expandList.includes(item.id)
                      ? 'icon-zhankai'
                      : 'icon-youjiantou' }`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFolderExpandChange(item.id, expandList.includes(item.id));
                    }}
                  />
               </div>
              </div>
              {item.children.length > 0 && expandList.includes(item.id)
                ? folderListRender(`${pathname} / ${item.name}`, layer + 1, item.children)
                : null}
              {docList.hasOwnProperty(item.id) && expandList.includes(item.id)
                // @ts-ignore
                ? documentListRender(`${pathname} / ${item.name}`, layer + 1, docList[item.id])
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
          {folderListRender('', 0, folderList)}
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
