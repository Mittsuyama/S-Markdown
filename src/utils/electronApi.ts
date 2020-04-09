import ajax from './electronAjax';

export const queryUserInfo = () => ajax('fetch-user-info', {});

export const queryFolderList = () => ajax('fetch-folder-list', {});

export const queryAddFolder = (params: any) => ajax('add-folder', params);

export const queryUpdateFolder = (params: any) => ajax('update-folder', params);

export const queryAddDocument = (params: any) => ajax('add-document', params);

export const queryDocumentList = (params: any) => ajax('fetch-document-list', params);

export const queryDocument = (params: any) => ajax('fetch-document', params);
