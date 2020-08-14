import React from "react";
import {
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  NavItemSeparator,
} from "@patternfly/react-core";

export interface NavProps {
  isExpanded: boolean;
  openMenu: boolean;
  toggleMenu: () => void;
  toggleOpenMenu: () => void;
  showFileOpen: () => void;
  openImageEdit: boolean;
  toggleImageEdit: () => void;
  toolExecute: (tool: string) => void;
  openTools: boolean;
  toggleTools: () => void;
}

class SideNavigation extends React.Component<NavProps> {
  onSelect = (result: {
    groupId: React.ReactText;
    itemId: React.ReactText;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) => {
    if (result.itemId === "nav-1_item-1") {
      this.props.toggleOpenMenu();
    }
    if (result.itemId === "nav-2_item_2") {
      this.props.toggleImageEdit();
    }
    if (result.groupId === "nav-3") {
      this.props.toggleTools();
    }
  };
  render() {
    const {
      openImageEdit,
      openMenu,
      showFileOpen,
      toolExecute,
      openTools,
    } = this.props;
    return (
      <Nav
        style={{
          backgroundColor: "grey",
          width: "10%",
        }}
        onSelect={this.onSelect}
      >
        <NavList>
          <NavExpandable title="Open" groupId="nav-1" isActive={openMenu}>
            <NavItem
              onClick={showFileOpen}
              preventDefault
              groupId="nav-1"
              itemId="nav-1_item-1"
            >
              File
            </NavItem>
            <NavItemSeparator />
            <NavItem preventDefault groupId="nav-1" itemId="nav-1_item-2">
              Folder
            </NavItem>
          </NavExpandable>
          <NavExpandable title="Edit" groupId="nav-2" isActive={openImageEdit}>
            <NavItem
              onClick={() => toolExecute("Invert")}
              preventDefault
              groupId="nav-2"
              itemId="nav-2_item-2"
            >
              Invert
            </NavItem>
          </NavExpandable>
          <NavExpandable title="Tools" groupId="nav-3" isActive={openTools}>
            <NavItem
              onClick={() => toolExecute("notool")}
              preventDefault
              groupId="nav-3"
              itemId="nav-1_item-3"
            >
              No Tool
            </NavItem>
            <NavItem
              preventDefault
              groupId="nav-3"
              onClick={() => toolExecute("Wwwc")}
              itemId="nav-1_item-4"
            >
              WW/WC
            </NavItem>
            <NavItem
              preventDefault
              onClick={() => toolExecute("Pan")}
              itemId="nav-1__item-5"
            >
              Pan
            </NavItem>
            <NavItem
              preventDefault
              onClick={() => toolExecute("Zoom")}
              itemId="nav-1__item-6"
            >
              Zoom
            </NavItem>

            <NavItem
              preventDefault
              onClick={() => toolExecute("Magnify")}
              itemId="nav-1__item-6"
            >
              Magnify
            </NavItem>
          </NavExpandable>
        </NavList>
      </Nav>
    );
  }
}

export default SideNavigation;
