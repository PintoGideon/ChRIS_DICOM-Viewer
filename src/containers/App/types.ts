export interface AppProps {
  classes?: any;
  dicomdir?: any;
  activeDcmIndex?: number;
  isOpen?: [];
}

export interface AppState {
  isExpanded: boolean;
  visibleMainMenu: boolean;
  visibleFileManager: boolean;
}
