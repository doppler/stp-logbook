import React from "react";

const AddStudentButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Add Student
  </button>
);

export default AddStudentButton;
