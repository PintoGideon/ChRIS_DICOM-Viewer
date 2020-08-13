import { Item } from "../../components/OpenMultipleFilesDlg/types";
export const DCM_IS_OPEN = "DCM_IS_OPEN";
export const LOCALFILE_STORE = "LOCALFILE_STORE";
export const LAYOUT = "LAYOUT";
export const FILES_STORE = "FILES_STORE";

export interface RootState {
  localFile: File;
  activeDcmIndex: number;
  layout: number[];
  isOpen: [];
  files: Item[];
}




 
