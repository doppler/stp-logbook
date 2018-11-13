import React from "react";

const SaveJumpButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">S</span>
    ave Jump
  </button>
);

export default SaveJumpButton;
