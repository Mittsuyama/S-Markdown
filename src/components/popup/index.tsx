import React, { useState, useEffect } from 'react';
import './popup.less';

export default (props: any) => {
  const [isShow, setIsShow] = useState(false);
  const [display, setDisplay] = useState('none');
  const [opacity, setOpacity] = useState(0);
  const { trigger, content } = props;

  useEffect(() => {
    if(isShow) {
      setDisplay('block');
      setTimeout(() => {
        setOpacity(1);
      }, 100);
    } else {
      setOpacity(0);
      setTimeout(() => {
        setDisplay('none');
      }, 100);
    }
  }, [isShow]);

  return (
    <div 
      className="popup-container"
      onMouseEnter={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
    >
      {trigger}
      <div 
        className="popup-box"
        style={{ display, opacity }}
        onMouseEnter={() => setIsShow(false)}
      >{content}</div>
    </div>
  );
}
