import React from 'react';
import { history } from 'umi';

export default (props: any) => {
  history.push('/home/doc');
  return (
    <div>index</div>
  );
}
