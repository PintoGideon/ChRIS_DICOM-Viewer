import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { DicomProps, DicomState } from "./types";
import { RootState } from "../../store/types";
import { Dispatch } from "redux";
import Hammer from "hammerjs";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { capitalize } from "@patternfly/react-core";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneFileImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.init({
  globalToolSyncEnabled: true,
});

class DicomViewer extends React.Component<DicomProps, DicomState> {
  dicomImage: HTMLDivElement | null;
  localFile: File | null;
  mprPlane: string;
  PatientsName: string;
  filename: string;
  image: any;
  isDicom: boolean;
  numberOfFrames: number;
  sopInstanceUid: string;

  constructor(props: DicomProps) {
    super(props);
    this.dicomImage = null;
    this.localFile = null;
    this.mprPlane = "";
    this.PatientsName = "";
    this.filename = "";
    this.image = null;
    this.isDicom = false;
    this.numberOfFrames = 1;
    this.sopInstanceUid = "";
    this.state = {
      visibleOpenUrlDlg: false,
      progress: null,
      visibleCinePlayer: false,
      frame: 1,
      inPlay: false,
    };
  }

  componentDidMount() {
    this.props.runTool(this);
    const { dcmRef } = this.props;
    console.log("Dicom componentDidMount", dcmRef);
    dcmRef(this);
  }
  dicomImageRef = (e1: HTMLDivElement) => {
    this.dicomImage = e1;
  };

  runTool = (toolName: string, opt: any) => {
    console.log("Run Tool called", toolName, opt);
    switch (toolName) {
      case "openLocalFs": {
        cornerstone.disable(this.dicomImage);
        this.loadImage(opt);
        break;
      }
    }
  };

  mprIsOrthogonalView = () => {
    //console.log('mprIsOrthogonalView: ', this.mprPlane)
    return (
      this.mprPlane !== "" &&
      this.props.layout[0] === 1 &&
      this.props.layout[1] === 3
    );
  };

  getSopInstanceUID = () => {
    const value = this.image.data.string("x00080018");
    return value;
  };

  onImageRendered = (e: Event) => {
    const viewport = cornerstone.getViewport(e.target);

    const mrTopLeft = document.getElementById(`mrtopLeft-${this.props.index}`);
    if (mrTopLeft) {
      mrTopLeft.textContent = this.mprIsOrthogonalView()
        ? `${capitalize(this.mprPlane)}`
        : `${this.PatientsName}`;
    }

    const mrTopRight = document.getElementById(
      `mrtopright-${this.props.index}`
    );
    if (mrTopRight) {
      mrTopRight.textContent = `${viewport.displayedArea.brhc.x}x${viewport.displayedArea.brhc.y}`;
    }

    const mrBottomLeft = document.getElementById(
      `mrbottomleft-${this.props.index}`
    );

    if (mrBottomLeft) {
      mrBottomLeft.textContent = `WW/WC: ${Math.round(
        viewport.voi.windowWidth
      )}/${Math.round(viewport.voi.windowCenter)}`;
    }

    const mrBottomRight = document.getElementById(
      `mrbottomright-${this.props.index}`
    );

    if (mrBottomRight) {
      mrBottomRight.textContent = `Zoom: ${Math.round(
        viewport.scale.toFixed(2) * 100
      )}%`;
    }

    const mrTopCenter = document.getElementById(
      `mrtopcenter-${this.props.index}`
    );
    if (mrTopCenter) {
      mrTopCenter.textContent = ``;
    }

    const mrBottomCenter = document.getElementById(
      `mrbottomcenter-${this.props.index}`
    );
    if (mrBottomCenter) {
      mrBottomCenter.textContent = ``;
    }

    const mrLeftCenter = document.getElementById(
      `mrleftcenter-${this.props.index}`
    );
    if (mrLeftCenter) {
      mrLeftCenter.textContent = ``;
    }

    const mrRightCenter = document.getElementById(
      `mrrightcenter-${this.props.index}`
    );
    if (mrRightCenter) {
      mrRightCenter.textContent = ``;
    }
  };

  loadImage = (localFile: File, url = undefined, fsItem = undefined) => {
    if (localFile === undefined) return;

    if (fsItem !== undefined) {
      //this.fsItem = fsItem;
    } else if (localFile !== undefined) {
      this.localFile = localFile;
    } else {
      //this.localurl = url;
    }
    const element = this.dicomImage;
    if (element) {
      element.addEventListener(
        "cornerstoneimageRendered",
        this.onImageRendered
      );
    }
    let imageId = undefined;
    cornerstone.enable(element);
    let size = 0;

    if (localFile !== undefined) {
      imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(localFile);
      this.filename = localFile.name;
      size = localFile.size;
    }
    cornerstone.loadAndCacheImage(imageId).then((image: any) => {
      //this.hideOpenUrlDlg();
      console.log("On track", image);
      this.image = image;
      this.isDicom = true;
      this.PatientsName = image.data.string("x00100010");
      this.sopInstanceUid = this.getSopInstanceUID();
      let stack = { currentImageIdIndex: 0, imageIds: "" };
      this.numberOfFrames = image.data.intString("x00280008");
      cornerstone.displayImage(element, image);
    });
  };

  render() {
    const { overlay, isOpen } = this.props;
    const visible = this.props.visible ? "visible" : "hidden";
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
    isOpen: state.isOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DicomViewer);
