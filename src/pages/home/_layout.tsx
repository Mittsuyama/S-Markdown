import React, { useEffect, useState } from 'react';
import IconButton from '@/component/icon-button';
import '@/styles/home-layout.less';

export default(props: any) => {
  const { history } = props;
  const { pathname } = history.location;
  const [selectMenu, setSelectMenu] = useState(0);
  const menuList = [
    { name: 'DOCS', icon: 'icon-document', link: 'doc' },
    { name: 'TAGS', icon: 'icon-tag', link: 'tag' },
    { name: 'STARS', icon: 'icon-shoucang', link: 'star' },
    { name: 'LATEST', icon: 'icon-shijian', link: 'latest' },
    { name: 'TRASH', icon: 'icon-shanchu', link: 'trash' },
  ];

  useEffect(() => {
    const name = pathname.split("/")[2];
    menuList.forEach((item: any, index: number) => {
      if(item.link === name) {
        setSelectMenu(index);
      }
    });
  }, [pathname]);

  const handleMenuClick = (pathname: string) => {
    history.push(`/home/${pathname}`);
  };

  const clickHeight = 110;
  const noneClickHeight = 60;

  return (
    <div className="home-layout-container">
      <div className="navigation-container">
        <div className="nav-head"> </div>
        <div className="nav-main">
          <div
            className="nav-slide-block"
            style={{
              height: clickHeight,
              top: noneClickHeight * selectMenu
            }}
          />
          {menuList.map((item: any, index: number) => {
            return (
              <div
                className="menu-item"
                key={item.name}
                style={{ height: index === selectMenu ? clickHeight : noneClickHeight }}
                onClick={() => handleMenuClick(item.link)}
              >
                <div
                  className="menu-item-box"
                  style={{
                    color: index === selectMenu ? 'white': '#31506E',
                    maxHeight: index === selectMenu ? 200: 30,
                  }}
                >
                  <i className={`iconfont ${item.icon}`}/>
                  <div
                    className="menu-text"
                    style={{ opacity : index === selectMenu ? 1 : 0 }}
                  >{item.name}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="nav-foot">
          <IconButton icon={'icon-setting1'}/>
        </div>
      </div>
      <div className="home-main">{props.children}</div>
    </div>
  )
}
