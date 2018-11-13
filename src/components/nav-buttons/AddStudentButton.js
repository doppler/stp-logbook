import React from "react";

const AddStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">A</span>
    dd Student
  </button>
);

export default AddStudentButton;
