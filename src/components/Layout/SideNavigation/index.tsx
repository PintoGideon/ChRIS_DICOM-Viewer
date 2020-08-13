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
}

class SideNavigation extends React.Component<NavProps> {
  constructor(props: NavProps) {
    super(props);
  }

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
  };
  render() {
    const { openImageEdit, openMenu, showFileOpen, toolExecute } = this.props;
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
        </NavList>
      </Nav>
    );
  }
}

export default SideNavigation;
