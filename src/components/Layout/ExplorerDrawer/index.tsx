import React from "react";
import { ExplorerDrawerProps } from "./types";
import {
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Button,
} from "@patternfly/react-core";

const ExplorerDrawer: React.FC<ExplorerDrawerProps> = ({ open, onClose }) => {
  return <Drawer isExpanded={open} onExpand={onClose}></Drawer>;
};

export default ExplorerDrawer;
