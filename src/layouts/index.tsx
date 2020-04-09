import React, { useEffect, useState } from 'react';
import IconButton from '@/components/icon-button';
import Popup from '@/components/popup';
import '@/styles/navigation.less';

export default(props: any) => {
  const { history } = props;
  const { pathname } = history.location;
  const [selectMenu, setSelectMenu] = useState(0);
  let hoverMenu = [];
  const menuList = [
    { name: 'HOME', icon: 'icon-yidiandiantubiao04', link: 'home' },
    { name: 'DOCS', icon: 'icon-document', link: 'doc' },
    { name: 'TAGS', icon: 'icon-tag', link: 'tag' },
    { name: 'STARS', icon: 'icon-star', link: 'star' },
    { name: 'LATEST', icon: 'icon-shijian', link: 'latest' },
    { name: 'COMMENT', icon: 'icon-luntan', link: 'comment' },
    { name: 'IMAGES', icon: 'icon-tupian', link: 'image' },
    { name: 'TRASH', icon: 'icon-shanchu', link: 'trash' },
  ];

  useEffect(() => {
    const name = pathname.split("/")[1];
    menuList.forEach((item: any, index: number) => {
      if(item.link === name) {
        setSelectMenu(index);
      }
    });
  }, [pathname]);

  const handleMenuClick = (pathname: string) => {
    const { location } = props;
    const pathList = location.pathname.split("/");
    if(pathList.length < 3) {
      history.push(`/${pathname}`);
    } else {
       history.push({
        pathname: `/${pathname}/${pathList[3]}`,
        query: location.query,
      })
    }
  };
  
  const changeFolderBoxState = (show: boolean, id: number) => {
    if(show) {
      hoverMenu[id] = { display: 'block' };
      setTimeout(() => {
        hoverMenu[id] = {
          display: 'block',
          opacity: 1,
        };
        console.log(hoverMenu[id]);
      }, 20);
    } else {
      hoverMenu[id] = { opacity: 0 };
      setTimeout(() => {
        hoverMenu[id] = {};
      }, 20);
    }
  };

  return (
    <div className="home-layout-container">
      <div className="navigation-container">
        <div className="nav-head"> </div>
        <div className="nav-main">
          <div
            className="nav-slide-block"
            style={{
              top: 60 * selectMenu
            }}
          />
          {menuList.map((item: any, index: number) => {
            return (
              <Popup
                key={item.name}
                method="hover"
                position="right"
                margin={40}
                content={item.name}
                trigger={
                  <div
                    className="menu-item"
                    key={item.name}
                    onClick={() => handleMenuClick(item.link)}
                  >
                    <i 
                      className={`iconfont ${item.icon}`}
                      style={{ color: index == selectMenu ? '#6792DA' : '#777'}}
                    />
                  </div>
                }
              />
            );
          })}
        </div>
        <div className="nav-foot">
          <IconButton icon={'icon-setting1'}/>
        </div>
      </div>
      <div className="navigation-main">{props.children}</div>
    </div>
  )
}
