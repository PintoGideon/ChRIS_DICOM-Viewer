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
  isMultipleFiles: boolean;
  listOpenFilesFirstFrame: () => void;
  listOpenFilesPreviousFrame: () => void;
  listOpenFilesNextFrame: () => void;
  listOpenFilesLastFrame: () => void;
  listOpenFilesScrolling: () => void;
  listStateOpenFilesScrolling: boolean;
}
