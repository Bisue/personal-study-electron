export {};
import type { ElectronApis } from './electron-apis';

declare global {
  interface Window {
    electron: ElectronApis;
  }
}
