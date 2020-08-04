import React, { PureComponent } from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { AppProps, AppState } from "./types";
import Navigation from "../../components/Layout/NavigationBar";
import Drawer from "../../components/Layout/Drawer";
import { getSettingsFsView } from "../../functions";
import { localFileStore } from "../../store/actions";
import { RootState } from "../../store/types";

import DicomViewer from "../../components/DicomViewer";

interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

class App extends PureComponent<AppProps, AppState> {
  files: File[];
  file: File | null;
  //url: string;
  folder: null;
  dicomViewersActive: never[];
  dicomViewersSameStudy: never[];
  dicomViewersActiveSamePlane: never[];
  dicomViewersRefs: any[];
  dicomViewers: any[];
  fileOpen: React.RefObject<HTMLInputElement>;
  runTool: (toolName: string, opt?: any) => void;

  constructor(props: AppProps) {
    super(props);
    this.files = [];
    this.folder = null;
    //this.url = null;
    this.file = null;
    this.dicomViewersActive = [];
    this.dicomViewersSameStudy = [];
    this.dicomViewersActiveSamePlane = [];
    this.dicomViewersRefs = [];
    this.dicomViewers = [];
    this.runTool = () => {};

    for (let i = 0; i < 16; i++) {
      this.dicomViewers.push(this.setDcmViewer(i));
    }

    this.fileOpen = React.createRef();
    this.state = {
      isExpanded: false,
      visibleMainMenu: false,
      visibleFileManager: false,
      openMenu: false,
      visibleOpenMultipleFilesDlg: false,
      visibleZippedFileDlg: false,
      sliceIndex: 0,
      sliceMax: 1,
    };
  }

  setDcmViewer = (index: number) => {
    return (
      <DicomViewer
        index={index}
        runTool={(ref: any) => {
          return (this.runTool = ref.runTool);
        }}
        dcmRef={(ref: any) => {
          this.dicomViewersRefs[index] = ref;
        }}
        dicomViewersRefs={this.dicomViewersRefs}
        overlay={true}
        visible={true}
        //onLoadedImage={this.onLoadedImage}
        //onRenderedImage={this.onRenderedImage}
        //listOpenFilesPreviousFrame={this.listOpenFilesPreviousFrame}
        //listOpenFilesNextFrame={this.listOpenFilesNextFrame}
      />
    );
  };

  onClick = () => {
    const isExpanded = !this.state.isExpanded;
    this.setState({
      isExpanded,
    });
  };

  toggleOpenMenu = () => {
    this.setState({
      openMenu: !this.state.openMenu,
    });
  };

  toggleMainMenu = () => {
    const { visibleMainMenu } = this.state;

    if (getSettingsFsView() === "left") {
      this.setState({
        visibleMainMenu: !visibleMainMenu,
        visibleFileManager: false,
      });
    } else {
      this.setState({
        visibleMainMenu: !visibleMainMenu,
      });
    }
  };

  showFileOpen = () => {
    if (this.fileOpen.current) this.fileOpen.current.click();
  };

  handleOpenLocalFs = (filesSelected: FileList | null) => {
    if (filesSelected && filesSelected.length > 1) {
      this.files = Array.from(filesSelected).map((file: File) => file);
      this.setState(
        {
          sliceIndex: 0,
        },
        () => {
          this.setState({ visibleOpenMultipleFilesDlg: true });
        }
      );
    } else {
      if (filesSelected) {
        const file = filesSelected[0];
        if (
          file.type === "application/x-zip-compressed" ||
          file.type === "application/zip"
        ) {
          this.file = file;
          //this.url = null;
          this.setState({ visibleZippedFileDlg: true });
        } else {
          this.setState({ sliceIndex: 0, sliceMax: 1 });
          this.props.setLocalFileStore(file);
          console.log(
            "Dicom Viewer Ref",
            this.dicomViewers[this.props.activeDcmIndex],
            this.props.activeDcmIndex
          );
          this.runTool("clear");
          this.runTool("openLocalFs", file);

          //this.dicomViewers[0].runTool("clear");
          //this.dicomViewers[0].runTool("openLocalFs", file);
        }
      }
    }
  };

  getDcmViewer = (index: number) => {
    return this.dicomViewers[index];
  };

  buildLayoutGrid = () => {
    let dicomViewers = [];
    for (let i = 0; i < this.props.layout[0]; i++) {
      for (let j = 0; j < this.props.layout[1]; j++) {
        const styleLayoutGrid = {
          border:
            this.props.layout[0] === 1 && this.props.layout[1] == 1
              ? "solid 1px #000000"
              : "solid 1px #444444",
        };
        const index = i * 4 + j;
        dicomViewers.push(
          <div key={index} style={styleLayoutGrid}>
            {this.getDcmViewer(index)}
          </div>
        );
      }
    }
    return (
      <div
        id="dicomviewer-grid"
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${this.props.layout[0]},${
            100 / this.props.layout[0]
          })`,
          gridTemplateColumns: `repeat(${this.props.layout[1]},${
            100 / this.props.layout[1]
          })`,
          height: "100%",
          width: "100%",
        }}
      >
        {dicomViewers}
      </div>
    );
  };

  render() {
    const { visibleMainMenu, openMenu } = this.state;
    console.log("App-variables", this);

    return (
      <>
        <Navigation toggleMenu={this.toggleMainMenu} />
        <Drawer
          isExpanded={visibleMainMenu}
          toggleMenu={this.toggleOpenMenu}
          openMenu={openMenu}
          toggleOpenMenu={this.toggleOpenMenu}
          showFileOpen={this.showFileOpen}
        />
        <div style={{ height: "calc(100vh-48px" }}>
          {this.buildLayoutGrid()}
        </div>
        <div>
          <input
            type="file"
            id="file_open"
            style={{ display: "none" }}
            ref={this.fileOpen}
            onChange={(e) => this.handleOpenLocalFs(e.target.files)}
            multiple
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    localFile: state.localFile,
    activeDcmIndex: state.activeDcmIndex,
    layout: state.layout,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLocalFileStore: (file: File) => dispatch(localFileStore(file)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
