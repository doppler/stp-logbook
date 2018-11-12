import React from "react";

const EditStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Edit Student
  </button>
);

export default EditStudentButton;
