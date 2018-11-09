import React, { useState } from "react";
import { Link } from "react-router-dom";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import getStudent from "../api/getStudent";
import saveStudent from "../api/saveStudent";

import Header from "./Header";
import Footer from "./Footer";

const HomeButton = ({ key }) => (
  <button key={key}>
    <Link to="/">Home</Link>
  </button>
);
const EditStudentButton = ({ key, match }) => (
  <button key={key}>
    <Link to={`/student/${match.params.studentId}/edit`}>Edit Student</Link>
  </button>
);

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

  const rowCount = student.jumps.length;
  const [activeRow, setActiveRow] = useState(rowCount - 1);
  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        setActiveRow(activeRow + 1);
        break;
      case ["up", "k"].includes(keyName):
        setActiveRow(activeRow - 1);
        break;
      case ["enter", "right"].includes(keyName):
        props.history.push(
          `/student/${student.id}/jump/${student.jumps[activeRow].number}`
        );
        break;
      default:
        break;
    }
  };
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  return (
    <HotKeys keyName="down,j,up,k,enter,right" onKeyDown={onKeyDown}>
      <Header
        match={props.match}
        title={student.name}
        buttons={[
          HomeButton({ key: "homeButton" }),
          EditStudentButton({ key: "editStudentButton", match: props.match })
        ]}
      />
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
                className={i === activeRow ? "active" : ""}
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
    </HotKeys>
  );
});
