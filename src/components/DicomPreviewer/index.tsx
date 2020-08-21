import React from "react";
import { DicomViewerProps, DicomViewerState } from "./types";

const style = {
  width: "200px",
  padding: "8px 8px 8px 8px",
  marginTop: "40px",
};

const styleScrollbar = {
  height: "calc(100vh - 48px)",
};

const styleDicomViewerStack = {
  width: "182px",
  marginTop: "10px",
  marginLeft: "7px",
};

const styleDicomViewer = {
  padding: "4px 4px 4px 4px",
};

class DicomPreviewer extends React.Component<
  DicomViewerProps,
  DicomViewerState
> {
  constructor(props: DicomViewerProps) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
}

export default DicomPreviewer;
