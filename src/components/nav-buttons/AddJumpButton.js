import React from "react";

const AddJumpButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Add Jump
  </button>
);

export default AddJumpButton;
