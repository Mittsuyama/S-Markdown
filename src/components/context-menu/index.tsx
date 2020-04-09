import React, { useRef } from 'react';
import './context-menu.less';

export default (props: any) => {
  const { show, setValue, position, menuList } = props;

  const handleCancel = () => {
    setValue({
      show: false,
    });
  };

  return (
    <div
      className="context-menu-container"
      style={{ display : show ? 'block' : 'none'}}
      onClick={() => handleCancel()}
      onContextMenu={() => handleCancel()}

    >
      <div
        className="context-menu-box"
        style={position}
        onClick={e => e.stopPropagation()}
      >
        {menuList.map((item: any) => {
          return (
            <div
              className="context-menu-item"
              key={item.name}
              onClick={item.click}
            >
              <div className="left">
                <i className={`iconfont ${item.icon}`}/>
                <span className="title">{item.name.toUpperCase()}</span>
              </div>
              <div className="right">
                {item.hotkey}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
