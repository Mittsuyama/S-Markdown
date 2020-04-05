import React from 'react';
import './iconButton.less';

const sizeSelect = (size: string, icon: string, click: any) => {
  let buttonClass: string;
  switch (size) {
    case "big":
      buttonClass = "big";
      break;
    case "small":
      buttonClass = "small";
      break;
    default:
      buttonClass = "normal";
  }
  return (
    <div className={`${buttonClass} icon-button-box`} onClick={click}>
      <i className={`iconfont ${icon}`} />
    </div>
  )
};

export default (props: any) => {
  const { icon, click, size } = props;
  return (
    <div>
      {sizeSelect(size, icon, click)}
    </div>
  );
}
