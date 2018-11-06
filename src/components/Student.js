import React from "react";

const Student = ({ student }) => {
  return (
    <div className="Student">
      <h1>{student.name}</h1>
    </div>
  );
};

export default Student;
