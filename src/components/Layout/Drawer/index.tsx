import React, { useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerPanelContent,
  DrawerHead,
  SimpleListItem,
  SimpleList,
} from "@patternfly/react-core";
import { DrawerProps } from "./types";

const DrawerComponent: React.FC<DrawerProps> = ({ isExpanded }) => {
  const drawerRef = useRef(null);

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <SimpleList aria-label="Simple List">
          <SimpleListItem key="file-manager">Open</SimpleListItem>
        </SimpleList>
      </DrawerHead>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isExpanded} position="left">
      <DrawerContent panelContent={panelContent}></DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
