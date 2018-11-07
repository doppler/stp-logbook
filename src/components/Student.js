import React, { useState, useEffect } from "react";

import "./Student.css";

import Header from "./Header";
import Footer from "./Footer";
import format from "date-fns/format";

const nextJump = student => {
  const lastJump = student.jumps[student.jumps.length - 1];
  const { number, diveFlow, instructor } = lastJump
    ? { ...lastJump }
    : { number: 2, diveFlow: 0, instructor: student.instructor };
  return {
    number: number + 1,
    diveFlow: diveFlow + 1,
    date: format(new Date()),
    instructor
  };
};

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

  const addJump = async () => {
    const jump = nextJump(student);
    student.jumps.push(jump);
    const res = await fetch("/api/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
    const json = await res.json();
    setStudent(json);
    props.history.push(`/student/${student.id}/jump/${jump.number}`);
  };

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
            <tr onClick={addJump}>
              <td colSpan={4}>Add New Jump</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};
