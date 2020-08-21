import React, { PureComponent } from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { AppProps, AppState } from "./types";
import Navigation from "../../components/Layout/NavigationBar";
import SideNavigation from "../../components/Layout/SideNavigation";
import OpenMultipleFilesDlg from "../../components/OpenMultipleFilesDlg";
import ExplorerDrawer from "../../components/Layout/ExplorerDrawer";
import { getSettingsFsView } from "../../functions";
import { localFileStore, setLayout } from "../../store/actions";
import { RootState } from "../../store/types";
import DicomViewer from "../../components/DicomViewer";
import "./App.css";
import { groupBy } from "../../functions";
import { Item } from "../../components/OpenMultipleFilesDlg/types";

interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

interface Timer {
  hasRef(): boolean;
  ref(): this;
  refresh(): this;
  unref(): this;
}

export type DicomViewerRef = typeof DicomViewer;
export type Patient = {
  list: Map<any, any>;
  keys: any;
};
export type Explorer = {
  patient?: Patient;
};

class App extends PureComponent<AppProps, AppState> {
  files: File[];
  file: File | null; //url: string;
  folder: null;
  dicomViewersActive: never[];
  dicomViewersSameStudy: never[];
  dicomViewersActiveSamePlane: never[];
  dicomViewersRefs: any[];
  dicomViewers: any[];
  fileOpen: React.RefObject<HTMLInputElement>;
  isMultipleFiles: boolean;
  runTool: (toolName: string, opt?: any) => void;
  isSliceChange: boolean;
  timerScrolling: Timer | null;
  explorer: Explorer;

  constructor(props: AppProps) {
    super(props);
    this.files = [];
    this.folder = null;
    this.file = null;
    this.dicomViewersActive = [];
    this.dicomViewersSameStudy = [];
    this.dicomViewersActiveSamePlane = [];
    this.dicomViewersRefs = [];
    this.dicomViewers = [];
    this.isMultipleFiles = false;
    this.isSliceChange = false;
    this.timerScrolling = null;
    this.runTool = () => {};
    this.explorer = {};

    for (let i = 0; i < 16; i++) {
      this.dicomViewers.push(this.setDcmViewer(i));
    }

    this.fileOpen = React.createRef();
    this.state = {
      isExpanded: false,
      visibleMainMenu: false,
      visibleFileManager: false,
      openMenu: false,
      openTools: false,
      visibleOpenMultipleFilesDlg: false,
      visibleZippedFileDlg: false,
      sliceIndex: 0,
      sliceMax: 1,
      openImageEdit: false,
      visibleMprOrthogonal: false,
      visibleMprSagittal: false,
      visibleMprAxial: false,
      visibleCoronal: false,
      visibleExplorer: false,
      listOpenFilesScrolling: false,
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
        //onRenderedImage={this.onRenderedImage}
        //listOpenFilesPreviousFrame={this.listOpenFilesPreviousFrame}
        //listOpenFilesNextFrame={this.listOpenFilesNextFrame}
      />
    );
  };

  //----------------------------------------------
  // #regiion FILES/SLICE MANIPULATION

  mprPlanePosition = (force = false, index = this.props.activeDcmIndex) => {};

  handleOpenImage = (index: number) => {
    this.runTool("openImage", index);
  };

  listOpenFilesFirstFrame = () => {
    const index = 0;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  listOpenFilesPreviousFrame = () => {
    let index = this.state.sliceIndex;
    index = index === 0 ? this.state.sliceMax - 1 : index - 1;
    this.setState(
      {
        sliceIndex: index,
      },
      () => {
        this.isSliceChange = true;
        this.handleOpenImage(index);
      }
    );
  };

  listOpenFilesNextFrame = () => {
    let index = this.state.sliceIndex;
    index = index === this.state.sliceMax - 1 ? 0 : index + 1;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  listOpenFilesLastFrame = () => {
    const index = this.state.sliceMax - 1;
    this.setState({ sliceIndex: index }, () => {
      this.isSliceChange = true;
      this.handleOpenImage(index);
    });
  };

  listOpenFilesScrolling = () => {
    const scrolling = this.state.listOpenFilesScrolling;
    this.setState(
      {
        listOpenFilesScrolling: !scrolling,
      },
      () => {
        if (scrolling) {
          if (this.timerScrolling) clearInterval(this.timerScrolling);
        } else {
          this.timerScrolling = setInterval(() => {
            this.listOpenFilesNextFrame();
          }, 500);
        }
      }
    );
  };

  onRenderedImage = () => {};

  toggleImageEdit = () => {
    this.setState({
      openImageEdit: !this.state.openImageEdit,
    });
  };
  toggleOpenMenu = () => {
    this.setState({
      openMenu: !this.state.openMenu,
    });
  };

  toggleTools = () => {
    this.setState({
      openTools: !this.state.openTools,
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

  toggleExplorer = () => {
    const visible = !this.state.visibleExplorer;
    this.setState({
      visibleExplorer: visible,
    });
  };

  showFileOpen = () => {
    if (this.fileOpen.current) this.fileOpen.current.click();
  };

  changeLayout = (row: number, col: number) => {
    this.props.setLayoutStore(row, col);
  };

  handleOpenLocalFs = (filesSelected: FileList | null) => {
    if (filesSelected && filesSelected.length > 1) {
      this.files = Array.from(filesSelected).map((file: File) => file);
      this.changeLayout(1, 1);
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
          this.runTool("clear");
          this.runTool("openLocalFs", file);
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
            this.props.layout[0] === 1 && this.props.layout[1] === 1
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
          }%)`,
          gridTemplateColumns: `repeat(${this.props.layout[1]},${
            100 / this.props.layout[1]
          }%)`,
          height: "100%",
          width: "100%",
        }}
      >
        {dicomViewers}
      </div>
    );
  };

  toolExecute = (tool: string) => {
    console.log("Tool", tool);
    this.setState({});

    this.runTool(tool);
  };

  hideOpenMultipleFilesDlg = () => {
    this.setState({
      visibleOpenMultipleFilesDlg: false,
    });
    this.openMultipleFilesCompleted();
  };

  openMultipleFilesCompleted = () => {
    if (this.props.files !== null) {
      this.changeLayout(1, 1);
      this.runTool("openImage", 0);
      const sliceMax = this.props.files.length;
      this.setState({
        sliceMax: sliceMax,
      });
      /*

      const patientList = groupBy(
        this.props.files,
        (a: Item) => a.patient.patientName
      );
      const patientKeys = [...patientList.keys()];
      const patient = {
        list: patientList,
        keys: patientKeys,
      };
      this.explorer = {
        patient: patient,
      };
      if (sliceMax > 1) {
        this.setState({
          visibleExplorer: true,
        });
      }
    }
    */
    }
  };

  explorerOnSelectSeries = (files: File[], explorerIndex: number) => {
    let index = this.props.activeDcmIndex;
    this.files = files;
    this.runTool("setFiles", this.files);
    const sliceIndex = 0;
    const sliceMax = 1;
    this.setState(
      {
        sliceMax,
        sliceIndex,
      },
      () => {
        this.handleOpenImage(index);
      }
    );
  };

  render() {
    const {
      visibleMainMenu,
      openMenu,
      visibleOpenMultipleFilesDlg,
      openImageEdit,
      openTools,
      visibleExplorer,
    } = this.state;

    if (this.files.length > 1) {
      this.isMultipleFiles = true;
    }
    console.log("VisibleExplorer", visibleExplorer);

    return (
      <>
        <Navigation toggleMenu={this.toggleMainMenu} />
        {visibleOpenMultipleFilesDlg ? (
          <OpenMultipleFilesDlg
            isModalOpen={visibleOpenMultipleFilesDlg}
            onClose={this.hideOpenMultipleFilesDlg}
            files={this.files}
            origin="local"
          />
        ) : null}
        <div className="page-container">
          <SideNavigation
            isExpanded={visibleMainMenu}
            toggleMenu={this.toggleOpenMenu}
            openMenu={openMenu}
            toggleOpenMenu={this.toggleOpenMenu}
            openImageEdit={openImageEdit}
            toggleImageEdit={this.toggleImageEdit}
            openTools={openTools}
            toggleTools={this.toggleTools}
            showFileOpen={this.showFileOpen}
            toolExecute={this.toolExecute}
            isMultipleFiles={this.isMultipleFiles}
            listOpenFilesFirstFrame={this.listOpenFilesFirstFrame}
            listOpenFilesPreviousFrame={this.listOpenFilesPreviousFrame}
            listOpenFilesNextFrame={this.listOpenFilesNextFrame}
            listOpenFilesLastFrame={this.listOpenFilesLastFrame}
            listOpenFilesScrolling={this.listOpenFilesScrolling}
            listStateOpenFilesScrolling={this.state.listOpenFilesScrolling}
          />
          <div style={{ height: "calc(100vh - 48px)", width: "100%" }}>
            {this.buildLayoutGrid()}
          </div>
        </div>
        {visibleExplorer && (
          <ExplorerDrawer
            open={visibleExplorer}
            onClose={this.toggleExplorer}
            onSelectSeries={this.explorerOnSelectSeries}
          />
        )}

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
    files: state.files,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLocalFileStore: (file: File) => dispatch(localFileStore(file)),
    setLayoutStore: (row: number, col: number) => dispatch(setLayout(row, col)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
