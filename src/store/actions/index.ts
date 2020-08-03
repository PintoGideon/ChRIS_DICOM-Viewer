import { DCM_IS_OPEN, LOCALFILE_STORE } from "../types";

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
