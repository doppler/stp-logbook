import React from "react";

const BackButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">B</span>
    ack
  </button>
);

export default BackButton;
