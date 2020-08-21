import { PropsFromRedux } from "./index";

export type AppProps = PropsFromRedux & {
  classes?: any;
  dicomdir?: any;
  activeDcmIndex?: number;
  isOpen?: [];
};

export interface AppState {
  isExpanded: boolean;
  visibleMainMenu: boolean;
  visibleFileManager: boolean;
  openMenu: boolean;
  visibleOpenMultipleFilesDlg: boolean;
  visibleZippedFileDlg: boolean;
  sliceIndex: number;
  sliceMax: number;
  openImageEdit: boolean;
  openTools: boolean;
  visibleMprOrthogonal: boolean;
  visibleMprSagittal: boolean;
  visibleMprAxial: boolean;
  visibleCoronal: boolean;
  visibleExplorer: boolean;
  listOpenFilesScrolling: boolean;
}
