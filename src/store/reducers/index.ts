import { DCM_IS_OPEN, LOCALFILE_STORE, LAYOUT, FILES_STORE } from "../types";

export default function storeReducer(state = {}, action: any) {
  switch (action.type) {
    case DCM_IS_OPEN:
      return {
        ...state,
      };

    case LOCALFILE_STORE:
      return {
        ...state,
        localFile: action.localFile,
      };

    case LAYOUT:
      return {
        ...state,
        layout: action.layout,
      };

    case FILES_STORE:
      console.log("Files", action.files);
      return {
        ...state,
        files: action.files,
      };
  }

  return state;
}
