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
import { Item, Image } from "../OpenMultipleFilesDlg/types";
import { isMobile } from "react-device-detect";
import { isFileImage } from "../../functions";

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
  fileName: string;
  image: any;
  isDicom: boolean;
  numberOfFrames: number;
  sopInstanceUid: string;
  layoutIndex: number;
  files: Item[] | null;
  sliceIndex: number;
  sliceMax: number;

  constructor(props: DicomProps) {
    super(props);
    this.dicomImage = null;
    this.localFile = null;
    this.mprPlane = "";
    this.PatientsName = "";
    this.fileName = "";
    this.image = null;
    this.isDicom = false;
    this.numberOfFrames = 1;
    this.sopInstanceUid = "";
    this.layoutIndex = 0;
    this.files = null;
    this.sliceIndex = 0;
    this.sliceMax = 1;

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
    cornerstone.events.addEventListener(
      "cornerstoneimageLoaded",
      this.onImageLoaded
    );
    dcmRef(this);
    this.layoutIndex = this.props.index;
    const element = document.getElementById(`viewer-${this.props.index}`);
    if (element) {
      element.addEventListener("wheel", this.handlerMouseScroll);
    }
  }

  handlerMouseScroll = (e: Event) => {};

  componentWillUnmount() {
    this.props.runTool(undefined);
    const { dcmRef } = this.props;
    dcmRef(undefined);
  }

  componentDidUpdate(previousProps: DicomProps) {
    const isOpen = this.props.isOpen[this.props.index];
    if (this.props.layout !== previousProps.layout && isOpen) {
      cornerstone.resize(this.dicomImage);
    }
  }

  dicomImageRef = (e1: HTMLDivElement) => {
    this.dicomImage = e1;
  };

  onImageLoaded = (e: any) => {};

  enableTool = () => {
    const WwwcTool = cornerstoneTools.WwwcTool;
    const PanTool = cornerstoneTools.PanTool;
    const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
    const ZoomTool = cornerstoneTools.ZoomTool;
    const MagnifyTool = cornerstoneTools.MagnifyTool;

    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(ZoomTouchPinchTool);
    cornerstoneTools.addTool(ZoomTool);
  };

  displayImageFromFiles = (index: number) => {
    const files: Item[] | Image[] =
      this.files === null ? this.props.files : this.files;
    console.log("Files", files);
    const element = this.dicomImage;
    element?.addEventListener("cornerstoneimagerendered", this.onImageRendered);
    cornerstone.enable(element);

    let stack: {
      currentImageIdIndex: number;
      imageIds: string[];
    } = { currentImageIdIndex: 0, imageIds: [] };

    const imageId = files[index].imageId;
    if (imageId.includes("dicomfile")) {
      const image = (files[index] as Item).image;

      this.fileName = (files[index] as Item).name;
      this.sliceIndex = index;

      this.image = image;
      this.isDicom = true;

      this.PatientsName = image.data.string("x00100010");
      this.numberOfFrames = image.data.intString("x00280008");
      this.sopInstanceUid = this.getSopInstanceUID();

      let imageIds = [];
      for (var i = 0; i < this.numberOfFrames; i++) {
        imageIds.push(imageId + "?frame" + i);
      }
      stack.imageIds = imageIds;

      cornerstone.displayImage(element, image);
      this.enableTool();
      cornerstoneTools.addStackStateManager(element, ["stack", "playClip"]);
      cornerstoneTools.addToolState(element, "stack", stack);
      this.setState({ frame: 1 });
    } else {
      const image = files[index];
      this.isDicom = false;
      cornerstone.displayImage(element, image);
      this.enableTool();
      this.setState({ frame: 1 });
    }

    // Load the possible measurements from DB and save in the store.
  };

  runTool = (toolName: string, opt: any) => {
    switch (toolName) {
      case "openLocalFs": {
        cornerstone.disable(this.dicomImage);
        this.loadImage(opt);
        break;
      }
      case "openImage": {
        cornerstone.disable(this.dicomImage);
        this.displayImageFromFiles(opt);
        break;
      }
      case "Wwwc": {
        cornerstoneTools.setToolActive("Wwwc", {
          mouseButtonMask: 1,
        });
        break;
      }
      case "Pan": {
        cornerstoneTools.setToolActive("Pan", {
          mouseButtonMask: 1,
        });
        break;
      }
      case "Zoom": {
        cornerstoneTools.setToolActive(isMobile ? "ZoomTouchPinch" : "Zoom", {
          mouseButtonMask: 1,
        });
        break;
      }

      case "Magnify": {
        cornerstoneTools.setToolActive("Magnify", {
          mouseButtonMask: 1,
        });
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

    if (localFile !== undefined && isFileImage(localFile)) {
      imageId = cornerstoneFileImageLoader.fileManager.add(localFile);
      cornerstone.loadImage(imageId).then((image: any) => {
        this.image = image;
        this.isDicom = false;
        this.PatientsName = "";
        cornerstone.displayImage(element, image);
        this.enableTool();
      });
    } else {
      imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(localFile);
      cornerstone.loadAndCacheImage(imageId).then((image: any) => {
        //this.hideOpenUrlDlg();
        this.image = image;
        this.isDicom = true;
        this.PatientsName = image.data.string("x00100010");

        cornerstone.displayImage(element, image);
        this.enableTool();
      });
    }
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
          className="cornerstone-enabled-image"
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
            id={`mrleftcenter-${this.props.index}`}
            style={{
              position: "absolute",
              top: "50%",
              width: "30px",
              left: 3,
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
    files: state.files,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DicomViewer);
