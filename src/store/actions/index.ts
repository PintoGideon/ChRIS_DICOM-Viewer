import { DCM_IS_OPEN, LOCALFILE_STORE, LAYOUT, FILES_STORE } from "../types";
import { Item, Image } from "../../components/OpenMultipleFilesDlg/types";

export const dcmIsOpen = (value: boolean) => {
  return {
    type: DCM_IS_OPEN,
    value: value,
  };
};

export const localFileStore = (file: File) => {
  return {
    type: LOCALFILE_STORE,
    localFile: file,
  };
};

export const setLayout = (row: number, col: number) => {
  return {
    type: LAYOUT,
    layout: [row, col],
  };
};

export const filesStore = (files: Item[] | Image[] | null) => {
  return {
    type: FILES_STORE,
    files: files,
  };
};
