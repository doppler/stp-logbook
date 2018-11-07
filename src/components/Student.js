import React, { useState, useEffect } from "react";
import getStudent from "../api/getStudent";
import saveStudent from "../api/saveStudent";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

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
      const json = await getStudent(props.match.params.id);
      setStudent(json);
    },
    [setStudent]
  );

  const addJump = async () => {
    const jump = nextJump(student);
    student.jumps.push(jump);
    const json = await saveStudent(student);
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
                <td>
                  {format(jump.date, "MM/DD/YY")} (
                  {distanceInWordsToNow(jump.date)})
                </td>
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
