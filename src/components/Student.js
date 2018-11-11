import React, { useState } from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import getStudent from "../api/getStudent";
import save from "../api/saveStudent";
import flash from "../utils/flash";

import Header from "./Header";
import Footer from "./Footer";

const HomeButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Home
  </button>
);

const AddJumpButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Add Jump
  </button>
);

const EditStudentButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Edit Student
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

  if (!student || student.id !== props.match.params.studentId)
    (async () =>
      (store.student = await getStudent(props.match.params.studentId)))();

  const addJump = async () => {
    console.log("addJump");
    const jump = nextJump(student);
    student.jumps.push(jump);
    (async () => {
      const res = await save(student);
      if (res.error) return flash(res);
      flash({ success: `Saved ${res.name}` });
      props.history.push(`/student/${student.id}/${jump.number}`);
    })();
  };

  if (!student) return null;

  const rowCount = student.jumps.length;
  const [activeRow, setActiveRow] = useState(rowCount - 1);
  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.click();
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
      case keyName === "ctrl+h":
        props.history.push("/");
        break;
      case keyName === "ctrl+a":
        addJump();
        break;
      case keyName === "ctrl+e":
        props.history.push(`/student/${student.id}/edit`);
        break;
      default:
        break;
    }
  };
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,ctrl+h,ctrl+a,ctrl+e"
      onKeyDown={onKeyDown}
    >
      <Header
        buttons={[
          HomeButton({ key: "h", onClick: () => props.history.push("/") }),
          AddJumpButton({ key: "a", onClick: addJump }),
          EditStudentButton({
            key: "e",
            onClick: () => props.history.push(`/student/${student.id}/edit`)
          })
        ]}
      />
      <div className="Content">
        <table>
          <caption>{student.name}</caption>
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
          </tbody>
        </table>
      </div>
      <Footer match={props.match} />
    </HotKeys>
  );
});
