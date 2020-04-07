// @ts-ignore
const { ipcRenderer } = window.electron;

export default (url: string, params: any) => {
  return new Promise((resolve, _) => {
    resolve(ipcRenderer.sendSync(url, params));
  })
}
