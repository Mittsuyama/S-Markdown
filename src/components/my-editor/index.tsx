import React from 'react';
import './my-editor.less';

export default (props: any) => {
  const { content, mode } = props;

  const editorRender = () => {
    return (
      <div className="editor-container">editor</div>
    );
  };

  const readerRender = () => {
    return (
      <div className="reader-container">reader</div>
    );
  };

  return (
    <div className="markdown-container">
      {mode !== 'read' ? editorRender() : null }
      {mode !== 'edit' ? readerRender() : null }
    </div>
  )
}
