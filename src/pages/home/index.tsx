import React from 'react';
import '@/styles/home.less';

export default(props: any) => {
  return (
    <div className="home-container">
      <div className="home-left">
        <div className="left-head">head</div>
        <div className="left-main">
          <div className="file-list">file</div>
        </div>
      </div>
      <div className="home-right">
        <div className="folder-list">folder</div>
      </div>
    </div>
  );
}
