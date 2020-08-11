export interface ModalProps {
  isModalOpen: boolean;
  files: File[];
  onClose: () => void;
  origin: string;
}

export type Item = {
  columns: number;
  rows: number;
  image: File;
  imageId: string;
  name: string;
  patient: {
    [key: string]: string;
  };
  series: {
    [key: string]: string | number | undefined;
  };
  study: {
    [key: string]: string | undefined;
  };
  sliceDistance: number;
  sliceLocation: number | undefined;
  instanceNumber: string;
};
