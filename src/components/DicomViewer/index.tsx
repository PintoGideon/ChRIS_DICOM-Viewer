import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { DicomProps, DicomState } from "./types";
import { RootState } from "../../store/types";
import { Dispatch } from "redux";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";


class DicomViewer extends React.Component<DicomProps, DicomState> {
  constructor(props: DicomProps) {
    super(props);
    this.state = {
      visibleOpenUrlDlg: false,
      progress: null,
      visibleCinePlayer: false,
      frame: 1,
      inPlay: false,
    };
  }

  componentDidMount() {}
  render() {
    const styleContainer = {
      width: "100%",
      height: "100%",
      border:
        this.props.activeDcmIndex === this.props.index &&
        (this.props.layout[0] > 1 || this.props.layout[1] > 1)
          ? "solid 1px #AAAAAA"
          : null,
      position: "relative",
    } as CSSProperties;
    const styleDicomImage = {
      width: "100%",
      height: "100%",
      position: "relative",
    } as CSSProperties;

    return (
      <div className="container" style={styleContainer}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            color: "#FFFFFF",
            fontSize: "1.00em",
            textShadow: "1px 1px #000000",
            visibility: visible,
          }}
        >
          <div
            id={`viewer-${this.props.index}`}
            ref={this.dicomImageRef}
            style={styleDicomImage}
          ></div>
          <div
            id={`mrtopleft-${this.props.index}`}
            style={{
              position: "absolute",
              top: 0,
              left: 3,
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>
          <div
            id={`mrtopright-${this.props.index}`}
            style={{
              position: "absolute",
              top: 0,
              right: 3,
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>
          <div
            id={`mrbottomright-${this.props.index}`}
            style={{
              position: "absolute",
              bottom: 0,
              right: 3,
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>
          <div
            id={`mrbottomleft-${this.props.index}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: 3,
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>
          <div
            id={`mrtopcenter-${this.props.index}`}
            style={{
              position: "absolute",
              top: 0,
              width: "60px",
              left: "50%",
              marginLeft: "0px",
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>

          <div
            id={`mrrightcenter-${this.props.index}`}
            style={{
              position: "absolute",
              top: "50%",
              width: "30px",
              right: 3,
              marginRight: "-20px",
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>

          <div
            id={`mrbottomcenter-${this.props.index}`}
            style={{
              position: "absolute",
              bottom: 0,
              width: "60px",
              left: "50%",
              marginLeft: "0px",
              display: isOpen && overlay ? "" : "none",
            }}
          ></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    layout: state.layout,
    activeDcmIndex: state.activeDcmIndex,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DicomViewer);
