export interface ExplorerDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectSeries: (files: File[], explorerIndex: number) => void;
}
