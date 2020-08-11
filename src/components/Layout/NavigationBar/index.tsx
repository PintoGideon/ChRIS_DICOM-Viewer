import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavList,
  PageHeader,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import "./Nav.css";
import { BarsIcon } from "@patternfly/react-icons";
import { NavProps } from "./types";

const Navigation: React.FC<NavProps> = ({ toggleMenu }) => {
  const nav = (
    <Nav className="nav-bar" variant="horizontal">
      <NavList>
        <NavItem>
          <BarsIcon
            size="md"
            className="nav-bar__icon"
            aria-label="menu"
            onClick={toggleMenu}
          />
          <TextContent>
            <Text component={TextVariants.h4} className="nav-bar__text">
              ChRIS
            </Text>
          </TextContent>
        </NavItem>
      </NavList>
    </Nav>
  );

  return <PageHeader topNav={nav} />;
};

export default Navigation;
