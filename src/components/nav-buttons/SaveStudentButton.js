import React from "react";

const SaveStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">S</span>
    ave Student
  </button>
);

export default SaveStudentButton;
