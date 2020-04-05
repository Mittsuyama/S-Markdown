import ajax from './electronAjax';

export const queryFolderList = () => ajax('fetch-folder-list', {});

export const queryAddFolder = (params: any) => ajax('add-folder', params);

export const queryUpdateFolder = (params: any) => ajax('update-folder', params);
