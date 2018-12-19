import React from "react";
import PropTypes from "prop-types";
export const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <div className="ProgressText">Uploading: {progress}%</div>
    <div className="Progress" style={{ width: `${progress}%` }} />
  </div>
);
ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};
