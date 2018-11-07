import React, { useState, useEffect } from "react";

import "./Student.css";

import Header from "./Header";
import Footer from "./Footer";

import fetchStudent from "../api/fetchStudent";

export default props => {
  const [student, setStudent] = useState();

  useEffect(async () => {
    if (!student) {
      const student = await fetchStudent(props.match.params.id);
      setStudent(student);
    }
  });

  if (!student) return null;
  return (
    <>
      <Header title={student.name} />
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
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};
