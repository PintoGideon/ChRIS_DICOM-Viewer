import { DCM_IS_OPEN, LOCALFILE_STORE } from "../types";

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
  }

  return state;
}
