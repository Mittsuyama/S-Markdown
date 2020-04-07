import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@/component/icon-button';
import './input-modal.less';

export default (props: any) => {
  const { show, setValue, ok, title } = props;
  const [name, setName] = useState('');
  const [opacity, setOpacity] = useState(0);
  const [display, setDisplay] = useState('none');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleOk = (event: any) => {
    event.preventDefault();
    setValue({
      show: false,
    });
    ok(name);
    setName('');
  };

  const handleCancel = () => {
    setValue({
      show: false,
      value: '',
    });
    setName('');
  };

  useEffect(() => {
    if(show) {
      setDisplay('block');
      setTimeout(() => {
        setOpacity(1);
        // @ts-ignore
        inputRef.current.focus();
      }, 20);
    } else {
      setOpacity(0);
      setTimeout(() => {
        setDisplay('none');
      }, 20);
    }
  }, [show]);

  return (
    <div
      ref={containerRef}
      className="input-modal-container"
      style={{ display }}
      onClick={handleCancel}
    >
      <div
        className={`modal-box`}
        style={ opacity ? { top: '20%', opacity } : { top: '10%', opacity }}
        onClick={e => e.stopPropagation()}
      >
        <div className="title-box">
          <div className="title">{title}</div>
        </div>
        <form onSubmit={handleOk}>
          <div className="input-box">
            <input
              type="text"
              placeholder="FOLDER NAME"
              value={name}
              onChange={event => setName(event.target.value)}
              ref={inputRef}
            />
          </div>
          <div className="button-box">
            <div className="ok" onClick={handleOk}>
              <i className="iconfont icon-queren" />
            </div>
            <div className="cancel" onClick={handleCancel}>
              <i className="iconfont icon-guanbi" />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
