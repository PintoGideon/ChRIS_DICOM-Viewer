import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { AppProps, AppState } from "./types";
import Navigation from "../../components/Layout/NavigationBar";
import Drawer from "../../components/Layout/Drawer";
import { getSettingsFsView } from "../../functions";

class App extends PureComponent<AppProps, AppState> {
  files: never[];
  file: null;
  folder: null;
  dicomViewersActive: never[];
  dicomViewersSameStudy: never[];
  dicomViewersActiveSamePlane: never[];
  dicomViewersRefs: never[];
  dicomViewers: never[];
  dicomeViewers: any;

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
    this.state = {
      isExpanded: false,
      visibleMainMenu: false,
      visibleFileManager: false,
    };
  }

  onClick = () => {
    const isExpanded = !this.state.isExpanded;
    this.setState({
      isExpanded,
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

  render() {
    const { visibleMainMenu } = this.state;
    return (
      <>
        <Navigation toggleMenu={this.toggleMainMenu} />
        <Drawer isExpanded={visibleMainMenu} />
      </>
    );
  }
}

export default connect()(App);
