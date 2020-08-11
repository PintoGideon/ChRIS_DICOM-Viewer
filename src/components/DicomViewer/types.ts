import DicomViewer, { PropsFromRedux } from "./index";

export type DicomProps = PropsFromRedux & {
  index: number;
  dcmRef: (ref: any) => void;
  runTool: (ref: any) => void;
  dicomViewersRefs: any[];
  overlay: boolean;
  visible: boolean;
};

export interface DicomState {
  visibleOpenUrlDlg: boolean;
  visibleCinePlayer: boolean;
  frame: number;
  progress: null;
  inPlay: boolean;
}
