import { createStore } from "redux";
import storeReducer from "./reducers";

let initialState = {
  localFile: null,
  fsFile: null,
  files: null,
  series: null,
  isOpen: new Array(16).fill(false),
  tool: null,
  activeDcmIndex: 0,
  activeDcm: null,
  explorer: null,
  explorerActivePatientIndex: 0,
  explorerActiveStudyIndex: 0,
  explorerActiveSeriesIndex: 0,
  measurements: [],
  layout: [1, 1], // first element represents the rows, second the columns
  dicomdir: null,
  fsCurrentDir: "",
  fsCurrentList: [],
  fsZippedFile: null,
  fsRefresh: false,
  volume: null,
  dcmEnableTool: false,
};

const store = createStore(storeReducer, initialState);

export default store;
