// @ts-ignore
const { ipcRenderer } = window.electron;

export default (url: string, params: any) => {
  return new Promise((resolve, _) => {
    const _value = ipcRenderer.send(url, params);
    ipcRenderer.on(`${url}-reply`, (event: any, arg: any) => {
      resolve(arg);
    });
  })
}
