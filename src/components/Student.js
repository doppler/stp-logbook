import React from "react";
import Header from "./Header";
import Footer from "./Footer";

import "./Student.css";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "../api/getStudent";
import saveStudent from "../api/saveStudent";

const nextJump = student => {
  const lastJump = student.jumps[student.jumps.length - 1];
  const { number, diveFlow, instructor } = lastJump
    ? { ...lastJump }
    : {
        number: Number(student.previousJumps),
        diveFlow: 0,
        instructor: student.instructor
      };
  return {
    number: number + 1,
    diveFlow: diveFlow + 1,
    date: format(new Date()),
    instructor,
    aircraft: "",
    exitAltitude: 14000,
    deploymentAltitude: 5000,
    freefallTime: 0
  };
};

export default collect(props => {
  const { student } = store;

  const fetchStudent = async id => {
    const json = await getStudent(id);
    store.student = json;
  };

  if (!student || student.id !== props.match.params.studentId)
    fetchStudent(props.match.params.studentId);

  const addJump = async () => {
    const jump = nextJump(student);
    student.jumps.push(jump);
    const json = await saveStudent(student);
    store.student = json;
    // setStudent(json);
    props.history.push(`/student/${student.id}/jump/${jump.number}`);
  };

  if (!student) return null;
  return (
    <React.Fragment>
      <Header match={props.match} title={student.name} />
      <div className="Content">
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
            <tr>
              <td colSpan={4}>
                <p>
                  <button onClick={addJump}>Add Jump</button>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer match={props.match} />
    </React.Fragment>
  );
});
