import React from "react";

const SaveJumpButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Save Jump
  </button>
);

export default SaveJumpButton;
