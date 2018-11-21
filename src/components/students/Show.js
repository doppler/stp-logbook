import React from "react";
import HotKeys from "react-hot-keys";

import "./Show.css";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "./api/getStudent";
import getJumps from "./api/getJumps";
import saveStudent from "./api/saveStudent";
import saveJump from "./api/saveJump";
import flash from "../../utils/flash";

store.activeJumpRow = -1;

const Show = ({ match, history }) => {
  delete store.jump;
  const { student, jumps } = store;

  if (!student || student._id !== match.params.studentId)
    (async () => (store.student = await getStudent(match.params.studentId)))();

  if (!student) return null;

  if (!jumps) {
    (async () => (store.jumps = await getJumps(student)))();
    return null;
  }

  const rowCount = student.jumps.length;

  const nextJump = () => {
    const lastJump = jumps[jumps.length - 1];
    const { number, diveFlow, instructor, aircraft } = lastJump
      ? { ...lastJump }
      : {
          number: Number(student.previousJumps),
          diveFlow: 0,
          instructor: student.instructor
        };
    return {
      _id: Math.round(Math.random() * 1000000000).toString(16),
      type: "jump",
      studentId: student._id,
      number: number + 1,
      diveFlow: diveFlow + 1,
      date: format(new Date()),
      instructor,
      aircraft,
      exitAltitude: 14000,
      deploymentAltitude: 5000,
      freefallTime: 0
    };
  };

  const addJump = async () => {
    console.group("addJump");
    const jump = nextJump();
    const jumpRes = await saveJump(jump);
    if (jumpRes.error) return flash(jumpRes);
    student.jumps.push(jump._id);
    const studentRes = await saveStudent(student);
    if (studentRes.error) return flash(studentRes);
    flash({ success: `Saved jump ${jump._id}` });
    store.activeJumpRow++;
    delete store.jumps;
    console.groupEnd("addJump");
    history.push(`/students/${student._id}/jump/${jump._id}`);
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
          `/students/${student._id}/jump/${jumps[store.activeJumpRow]._id}`
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
              <th>Jump - Dive Flow</th>
              <th>Date</th>
              <th>Instructor</th>
            </tr>
          </thead>
          <tbody>
            {jumps.map((jump, i) => (
              <tr
                key={i}
                onClick={() =>
                  history.push(`/students/${student._id}/jump/${jump._id}`)
                }
                className={i === store.activeJumpRow ? "active" : ""}
              >
                <td>
                  Jump {jump.number} - DF {jump.diveFlow}
                </td>
                <td>
                  {format(jump.date, "dddd MMMM Mo")} (
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
