import React, { useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerPanelContent,
  DrawerHead,
  SimpleListItem,
  SimpleList,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { DrawerProps } from "./types";
import {
  FolderOpenIcon,
  FolderIcon,
  FolderCloseIcon,
  AngleDownIcon,
  AngleRightIcon,
  FileIcon,
} from "@patternfly/react-icons";
import "./Drawer.css";

const DrawerComponent: React.FC<DrawerProps> = ({
  isExpanded,
  toggleOpenMenu,
  openMenu,
  showFileOpen,
}) => {
  const drawerRef = useRef(null);

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <SimpleList aria-label="Simple List">
          <SimpleListItem onClick={toggleOpenMenu} key="upload_file">
            <div className="drawer-panel__list">
              {openMenu ? (
                <FolderOpenIcon size="md" />
              ) : (
                <FolderCloseIcon size="md" />
              )}
              <TextContent>
                <Text>Open</Text>
              </TextContent>
              {openMenu ? (
                <AngleDownIcon size="md" />
              ) : (
                <AngleRightIcon size="md" />
              )}
            </div>
          </SimpleListItem>

          {openMenu && (
            <>
              <SimpleListItem key="folder-manager">
                <div className="drawer-panel__file-manager">
                  <FolderIcon size="md" />
                  <TextContent>
                    <Text>Folder</Text>
                  </TextContent>
                </div>
              </SimpleListItem>
              <SimpleListItem onClick={showFileOpen} key="file-manager">
                <div className="drawer-panel__file-manager">
                  <FileIcon size="md" />
                  <TextContent>
                    <Text>File</Text>
                  </TextContent>
                </div>
              </SimpleListItem>
            </>
          )}
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
