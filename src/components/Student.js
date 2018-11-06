import React from "react";

import "./Student.css";

const Student = ({ student }) => {
  return (
    <div className="Student">
      <table>
        <thead>
          <tr>
            <th>Jump #</th>
            <th>Dive Flow</th>
            <th>Date</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          {student.jumps.map((jump, i) => (
            <tr key={i}>
              <td>{jump.number}</td>
              <td>{jump.diveFlow}</td>
              <td>{jump.date}</td>
              <td>{jump.instructor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Student;
