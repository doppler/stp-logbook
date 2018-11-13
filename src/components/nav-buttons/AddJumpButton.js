import React from "react";

const AddJumpButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">A</span>
    dd Jump
  </button>
);

export default AddJumpButton;
