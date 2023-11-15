const electronApis = {
  // This is a simple example of an Electron API that can be called from the renderer process:
  testApi: () => {
    console.log('testApi called');
  },
};

export type ElectronApis = typeof electronApis;

export default electronApis;
