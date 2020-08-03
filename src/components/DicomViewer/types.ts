import { PropsFromRedux } from "./index";

export type DicomProps = PropsFromRedux & {
  index: number;
  dcmRef: (ref: React.RefObject<HTMLInputElement>) => void;
  dicomViewersRefs: React.RefObject<HTMLInputElement>[];
  runTool: (ref: React.RefObject<HTMLInputElement>) => void;
};

export interface DicomState {
  visibleOpenUrlDlg: boolean;
  visibleCinePlayer: boolean;
  frame: number;
  progress: null;
  inPlay: boolean;
}
