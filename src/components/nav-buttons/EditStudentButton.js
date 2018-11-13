import React from "react";

const EditStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    <span className="hotkey">E</span>
    dit Student
  </button>
);

export default EditStudentButton;
