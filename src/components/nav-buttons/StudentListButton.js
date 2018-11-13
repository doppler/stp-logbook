import React from "react";

const StudentListButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Student <span className="hotkey">L</span>
    ist
  </button>
);

export default StudentListButton;
