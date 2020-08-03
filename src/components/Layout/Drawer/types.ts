export interface DrawerProps {
  isExpanded: boolean;
  openMenu: boolean;
  toggleMenu: () => void;
  toggleOpenMenu: () => void;
  showFileOpen: () => void;
}
