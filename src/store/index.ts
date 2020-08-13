import { createStore } from "redux";
import storeReducer from "./reducers";

let initialState = {
  localFile: null,
  files: [],
  isOpen: new Array(16).fill(false),
  activeDcmIndex: 0,
  layout: [1, 1], // first element represents the rows, second the columns
};

const store = createStore(storeReducer, initialState);

export default store;
