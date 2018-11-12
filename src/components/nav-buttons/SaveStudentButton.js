import React from "react";

const SaveStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Save Student
  </button>
);

export default SaveStudentButton;
