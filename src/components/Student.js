import React, { useState, useEffect } from "react";

import "./Student.css";

import Header from "./Header";
import Footer from "./Footer";

export default props => {
  const [student, setStudent] = useState({});

  useEffect(
    async () => {
      const res = await fetch("/api/students");
      const json = await res.json();
      const student = json.find(obj => obj.id === props.match.params.id);
      setStudent(student);
    },
    [setStudent]
  );

  if (!student.id) return null;
  return (
    <>
      <Header student={student} />
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
              <tr
                key={i}
                onClick={() =>
                  props.history.push(
                    `/student/${student.id}/jump/${jump.number}`
                  )
                }
              >
                <td>{jump.number}</td>
                <td>{jump.diveFlow}</td>
                <td>{jump.date}</td>
                <td>{jump.instructor}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>Add New Jump</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};
