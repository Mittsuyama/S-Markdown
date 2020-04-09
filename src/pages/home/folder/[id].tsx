import React, { useState, useEffect } from 'react';
import { queryDocument } from '@/utils/electronApi';
import IconButton from '@/components/icon-button';
import MyEditor from '@/components/my-editor';

import '@/styles/editor.less';

export default (props: any) => {
  const { id } = props.match.params;
  const { folder } = props.history.location.query;
  const [content, setContent] = useState({});
  console.log(folder);

  const fetch = () => {
    (async function() {
      const result: any = await queryDocument({ id });
      if(result.status === 200) {
        setContent(result.data);
      }
    })();
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleBackClick = () => {
    console.log('back');
  };

  const handleSettingClick = () => {
  };

  return (
    <div className="editor-container">
      <div className="editor-head">
        <div className="back">
        </div>
        <div className="title">
          <span>
            <span className="folder">{folder}</span>
            <span className="name">{content.name}</span>
          </span>
        </div>
        <div className="function-box">
          <IconButton
            size="small"
            icon={"icon-more"}
            click={() => handleSettingClick()}
          />
        </div>
      </div>
      <div className="editor-main">
        <MyEditor mode="split" content={content} />
      </div>
    </div>
  );
}
