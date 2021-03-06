import { PropsFromRedux } from "./index";
import { DataSet } from "cornerstone-wado-image-loader";

export type ModalProps = PropsFromRedux & {
  isModalOpen: boolean;
  files: File[];
  onClose: () => void;
  origin: string;
};

export type Item = {
  columns: number;
  rows: number;
  image: Image;
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

export type Image = {
  /** The imageId associated with this image object */
  imageId: string;

  /** the minimum stored pixel value in the image */
  minPixelValue: number;

  /** the maximum stored pixel value in the image */
  maxPixelValue: number;

  /** the rescale slope to convert stored pixel values to modality pixel values or 1 if not specified */
  slope: number;

  /** the rescale intercept used to convert stored pixel values to modality values or 0 if not specified */
  intercept: number;

  /** the default windowCenter to apply to the image */
  windowCenter: number;

  /** the default windowWidth to apply to the image */
  windowWidth: number;

  /** a function that returns the underlying pixel data. An array of integers for grayscale and an array of RGBA for color */
  getPixelData: () => Uint8Array;

  /** a function that returns a canvas imageData object for the image. This is only needed for color images */
  getImageData: () => ImageData;

  /** a function that returns a canvas element with the image loaded into it. This is only needed for color images. */
  getCanvas: () => HTMLCanvasElement;

  /** a function that returns a JavaScript Image object with the image data. This is optional and typically used for images encoded in standard web JPEG and PNG formats */
  getImage: () => HTMLImageElement;

  /** number of rows in the image. This is the same as height but duplicated for convenience */
  rows: number;

  /** number of columns in the image. This is the same as width but duplicated for convenience */
  columns: number;

  /** The Lookup Table */
  lut: LUT;

  /** Is the color pixel data stored in RGBA? */
  rgba: boolean;

  /** horizontal distance between the middle of each pixel (or width of each pixel) in mm or undefined if not known */
  columnPixelSpacing: number;

  /** vertical distance between the middle of each pixel (or height of each pixel) in mm or undefined if not known */
  rowPixelSpacing: number;

  /** true if the the image should initially be displayed be inverted, false if not. This is here mainly to support DICOM images with a photometric interpretation of MONOCHROME1 */
  invert: boolean;

  /** the number of bytes used to store the pixels for this image. */
  sizeInBytes: number;

  /** Whether or not the image has undergone false color mapping */
  falseColor?: boolean;

  /** Original pixel data for an image after it has undergone false color mapping */
  origPixelData?: number[];

  /** Statistics for the last redraw of the image */
  stats?: ImageStats;

  /** Cached Lookup Table for this image. */
  cachedLut: LUT;

  /** true if pixel data is RGB, false if grayscale */
  color: boolean;

  /** @deprecated Use viewport.colormap instead. an optional colormap ID or colormap object (from colors/colormap.js). This will be applied during rendering to convert the image to pseudocolor */
  colormap?: string | object;

  /** whether or not to render this image as a label map (i.e. skip modality and VOI LUT pipelines and use only a color lookup table) */
  labelmap?: boolean;

  /** ? */
  voiLUT?: LUT;

  /** the width of the image. This is the same as columns but duplicated for convenience */
  width: number;

  /** the height of the image. This is the same as rows but duplicated for convenience */
  height: number;

  data: typeof DataSet;
};

interface LUT {
  id: string;
  firstValueMapped: number;
  numBitsPerEntry: number;
  lut: number[];
}

interface ImageStats {
  /** The time in ms taken to retrieve stored pixels required to draw the image */
  lastGetPixelDataTime?: number;

  /** The time in ms taken to map from stored pixel array to canvas pixel array */
  lastStoredPixelDataToCanvasImageDataTime?: number;

  /** The time in ms taken for putImageData to put the canvas pixel data into the canvas context */
  lastPutImageDataTime?: number;

  /** The total time in ms taken for the entire rendering function to run */
  lastRenderTime?: number;

  /** The time in ms taken to generate the lookup table for the image */
  lastLutGenerateTime?: number;
}
