import React, { useState } from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "../../api/getStudent";
import save from "../../api/saveStudent";
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

const Show = ({ match, history }) => {
  const { student } = store;

  if (!student || student.id !== match.params.studentId)
    (async () => (store.student = await getStudent(match.params.studentId)))();

  if (!student) return null;

  const rowCount = student.jumps.length;
  const [activeRow, setActiveRow] = useState(rowCount - 1);

  const addJump = async () => {
    const jump = nextJump(student);
    student.jumps.push(jump);
    setActiveRow(activeRow + 1);
    (async () => {
      const res = await save(student);
      if (res.error) return flash(res);
      flash({ success: `Saved ${student.name}` });
      history.push(`/students/${student.id}/jump/${jump.number}`);
    })();
  };

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
        history.push(
          `/students/${student.id}/jump/${student.jumps[activeRow].number}`
        );
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      {
        id: "l",
        onClick: () => history.push("/students"),
        children: "List Students"
      },
      { id: "b", onClick: () => history.goBack(1), children: "Back" },
      { id: "a", onClick: addJump, children: "Add Jump" },
      {
        id: "e",
        onClick: () => history.push(`/students/${student.id}/edit`),
        children: "Edit Student"
      }
    ];
  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,ctrl+l,ctrl+b,ctrl+a,ctrl+e"
      onKeyDown={onKeyDown}
    >
      <div className="Content">
        <table tabIndex={0}>
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
                  history.push(`/students/${student.id}/jump/${jump.number}`)
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
    </HotKeys>
  );
};

export default collect(Show);
