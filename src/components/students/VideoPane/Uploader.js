import React from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { ProgressBar } from "./ProgressBar";
export const Uploader = ({ handleDrop, progress }) => {
  if (progress) return <ProgressBar progress={progress} />;
  return (
    <Dropzone onDrop={handleDrop} accept="video/*">
      Drag Video File Here
    </Dropzone>
  );
};
Uploader.propTypes = {
  handleDrop: PropTypes.func.isRequired,
  progress: PropTypes.number
};
