import React from 'react';
import './home.less';

export default (props: any) => {
  return (
    <div className="home-container">
      <div className="navigation">navigation</div>
      <div className="folder">{props.children}</div>
    </div>
  );
}
