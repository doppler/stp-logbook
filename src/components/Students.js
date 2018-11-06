import React from "react";

import "./Students.css";

const Students = ({ students, handleStudentClick }) => {
  if (!students) {
    return "Waiting...";
  }

  return (
    <div className="Students">
      <table>
        <thead>
          <tr className="Header">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, i) => {
            return (
              <tr key={i} onClick={() => handleStudentClick(student)}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
