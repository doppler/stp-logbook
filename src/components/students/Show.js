import React from "react";
import HotKeys from "react-hot-keys";

import "./Show.css";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "./api/getStudent";
import save from "./api/saveStudent";
import flash from "../../utils/flash";

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
    _id: Math.round(Math.random() * 1000000000).toString(16),
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

store.activeJumpRow = -1;

const Show = ({ match, history }) => {
  const { student } = store;

  if (!student || student._id !== match.params.studentId)
    (async () => (store.student = await getStudent(match.params.studentId)))();

  if (!student) return null;

  const rowCount = student.jumps.length;

  const addJump = async () => {
    const jump = nextJump(student);
    student.jumps.push(jump);
    store.activeJumpRow++;
    (async () => {
      const res = await save(student);
      if (res.error) return flash(res);
      flash({ success: `Saved ${student.name}` });
      history.push(`/students/${student._id}/jump/${jump._id}`);
    })();
  };

  const onKeyUp = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.click();
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        store.activeJumpRow++;
        break;
      case ["up", "k"].includes(keyName):
        store.activeJumpRow--;
        break;
      case ["enter", "right"].includes(keyName):
        history.push(
          `/students/${student._id}/jump/${
            student.jumps[store.activeJumpRow]._id
          }`
        );
        break;
      case keyName === "left":
        history.push("/students");
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };
  if (rowCount > 0 && store.activeJumpRow === rowCount) store.activeJumpRow = 0;
  if (rowCount > 0 && store.activeJumpRow === -1)
    store.activeJumpRow = rowCount - 1;

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      // {
      //   id: "l",
      //   onClick: () => history.push("/students"),
      //   children: "List Students"
      // },
      { id: "b", onClick: () => history.push("/students"), children: "Back" },
      { id: "a", onClick: addJump, children: "Add Jump" },
      {
        id: "e",
        onClick: () => history.push(`/students/${student._id}/edit`),
        children: "Edit Student"
      }
    ];
  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,left,ctrl+l,ctrl+b,ctrl+a,ctrl+e"
      onKeyUp={onKeyUp}
    >
      <div className="Content">
        <div className="show student">
          <div>{student.name}</div>
          <div>{student.email}</div>
          <div>{student.phone}</div>
        </div>
        <table tabIndex={0}>
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
                  history.push(`/students/${student._id}/jump/${jump._id}`)
                }
                className={i === store.activeJumpRow ? "active" : ""}
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
    </HotKeys>
  );
};

export default collect(Show);
