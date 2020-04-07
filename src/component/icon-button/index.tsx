import React from 'react';
import './icon-button.less';

const sizeSelect = (size: string) => {
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
  return buttonClass;
};

export default (props: any) => {
  const { icon, click, size } = props;
  return (
    <div className={`${sizeSelect(size)} icon-button-box`} onClick={click}>
      <i className={`iconfont ${icon}`} />
    </div>
  );
}
