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
  dicomViewersRefs: React.RefObject<HTMLInputElement>[];
  dicomViewers: any[];
  fileOpen: React.RefObject<HTMLInputElement>;
  runTool: React.RefObject<HTMLInputElement> | null;

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
    this.runTool = null;

    for (let i = 0; i < 16; i++) {
      this.dicomViewers.push(this.setDcmViewer(i) as any);
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
        dcmRef={(ref: React.RefObject<HTMLInputElement>) => {
          this.dicomViewersRefs[index] = ref;
        }}
        dicomViewersRefs={this.dicomViewersRefs}
        runTool={(ref: React.RefObject<HTMLInputElement>) =>
          (this.runTool = ref)
        }
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
          //this.dicomViewersRefs[this.props.activeDcmIndex].runTool("clear");
          /*
          this.dicomViewerRefs[this.props.activeDcmIndex].runTool(
            "openLocalFs",
            file
          );
          */
        }
      }
    }
  };

  render() {
    const { visibleMainMenu, openMenu } = this.state;

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
        <div>
          <input
            type="file"
            id="file_open"
            style={{ display: "none" }}
            ref={this.fileOpen}
            onChange={(e) => this.handleOpenLocalFs(e.target.files)}
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
