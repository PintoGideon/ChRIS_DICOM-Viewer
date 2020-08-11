import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { Modal } from "@patternfly/react-core";
import { ModalProps, Item } from "./types";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import {
  getDicomPatientName,
  getDicomStudyId,
  getDicomStudyDate,
  getDicomStudyTime,
  getDicomStudyDescription,
  getDicomSeriesDate,
  getDicomSeriesTime,
  getDicomSeriesDescription,
  getDicomSeriesNumber,
  getDicomInstanceNumber,
  getDicomSliceLocation,
  getDicomSliceDistance,
  getDicomRows,
  getDicomColumns,
  getDicomEchoNumber,
  getFileNameCorrect,
  dicomDateTimeToLocale,
} from "../../functions";
import { filesStore } from "../../store/actions";

const OpenMultipleFilesDlg: React.FC<ModalProps> = ({
  isModalOpen,
  files,
  origin,
  onClose,
}) => {
  const [modalState, setModalState] = React.useState({
    progress: 0,
    cancel: false,
  });

  let items: Item[] = [];
  let count = 0;
  let step = 0;

  React.useEffect(() => {
    let imageIds: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (origin === "local") {
        imageIds.push(cornerstoneWADOImageLoader.wadouri.fileManager.add(file));
      } else {
        imageIds.push(
          cornerstoneWADOImageLoader.wadouri.fileManager.addBuffer(file)
        );
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (modalState.cancel) {
        filesStore(null);
        close();
        return;
      }
      console.log("Image Ids", imageIds[i]);
      cornerstone.loadImage(imageIds[i]).then((image: any) => {
        const patientName = getDicomPatientName(image);

        const studyId = getDicomStudyId(image);
        const studyDate = getDicomStudyDate(image);
        const studyTime = getDicomStudyTime(image);
        const studyDescription = getDicomStudyDescription(image);

        const seriesDate = getDicomSeriesDate(image);
        const seriesTime = getDicomSeriesTime(image);
        const seriesDescription = getDicomSeriesDescription(image);
        const seriesNumber = getDicomSeriesNumber(image);

        const instanceNumber = getDicomInstanceNumber(image);
        const sliceDistance = getDicomSliceDistance(image);
        const echoNumber = getDicomEchoNumber(image);
        const sliceLocation = getDicomSliceLocation(image);
        const columns = getDicomColumns(image);
        const rows = getDicomRows(image);

        const studyDateTime =
          studyDate === undefined
            ? undefined
            : dicomDateTimeToLocale(`${studyDate}.${studyTime}`);

        let item = null;

        if (origin === "local") {
          item = {
            imageId: imageIds[i],
            instanceNumber: instanceNumber,
            name: getFileNameCorrect(file.name),
            image: image,
            rows: rows,
            columns: columns,
            sliceDistance: sliceDistance,
            sliceLocation: sliceLocation,
            patient: {
              patientName: patientName,
            },
            study: {
              studyId: studyId,
              studyDate: studyDate,
              studyTime: studyTime,
              studyDateTime: studyDateTime,
              studyDescription: studyDescription,
            },
            series: {
              seriesDate: seriesDate,
              seriesTime: seriesTime,
              seriesDescription: seriesDescription,
              seriesNumber: seriesNumber,
              echoNumber: echoNumber,
            },
          };
        } else {
          item = {
            imageId: imageIds[i],
            instanceNumber: instanceNumber,
            name: file.name,
            image: image,
            rows: rows,
            columns: columns,
            sliceDistance: sliceDistance,
            sliceLocation: sliceLocation,
            patient: {
              patientName: patientName,
            },
            study: {
              studyId: studyId,
              studyDate: studyDate,
              studyTime: studyTime,
              studyDateTime: studyDateTime,
              studyDescription: studyDescription,
            },
            series: {
              seriesDate: seriesDate,
              seriesTime: seriesTime,
              seriesDescription: seriesDescription,
              seriesNumber: seriesNumber,
              echoNumber: echoNumber,
            },
          };
        }
        items.push(item);
      });
      filesStore(items);
      // close();
    }
  }, []);

  const close = () => {
    onClose();
  };

  return (
    <Modal width={"50%"} title="Multiple Files Dialog box" isOpen={isModalOpen}>
      Opening Multiple Files.....
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    filesStore: (files: Item[] | null) => dispatch(filesStore(files)),
  };
};

const connector = connect(null, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(OpenMultipleFilesDlg);
