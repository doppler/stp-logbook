import React from "react";

const BackButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Back
  </button>
);

export default BackButton;
