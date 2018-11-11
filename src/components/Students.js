import React, { useState } from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import getStudents from "../api/getStudents";
import parse from "date-fns/parse";
import format from "date-fns/format";
import differenceInDays from "date-fns/difference_in_days";

import Header from "./Header";
import Footer from "./Footer";

const AddStudentButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Add Student
  </button>
);

export default collect(props => {
  const { students, filteredStudents, filter } = store;
  store.student = null;

  if (students.length === 0) {
    (async () => {
      const json = await getStudents();
      json.sort((a, b) => {
        let lastJumpA = [...a.jumps].pop() || {
          date: new Date(1971, 9, 25)
        };
        let lastJumpB = [...b.jumps].pop() || {
          date: new Date(1971, 9, 25)
        };
        return parse(lastJumpB.date) - parse(lastJumpA.date);
      });
      store.students = json;
      store.filteredStudents = json;
    })();
  }

  const handleStudentRowClick = student => {
    props.history.push(`/student/${student.id}`);
  };

  const handleFilterChange = e => {
    const filter = e.target.value.toLowerCase();
    store.filteredStudents = store.students.filter(obj =>
      obj.name.toLowerCase().match(filter)
    );
    store.filter = e.target.value;
  };

  const currencyColor = daysSinceLastJump => {
    if (daysSinceLastJump > 30) {
      return `rgb(255, 0, 0)`;
    }
    if (daysSinceLastJump > 21) {
      return `rgb(255, ${192 -
        Math.floor((64 / 7) * (daysSinceLastJump - 21))}, 0)`;
    }
    if (daysSinceLastJump > 14) {
      return `rgb(255, ${255 -
        Math.floor((64 / 7) * (daysSinceLastJump - 14))}, 0)`;
    }
    return `rgb(${Math.floor((255 / 14) * daysSinceLastJump)}, 255, 0)`;
  };

  const [activeRow, setActiveRow] = useState(0);
  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
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
        props.history.push(`/student/${filteredStudents[activeRow].id}`);
        break;
      case keyName === "ctrl+a":
        props.history.push("/student/new");
        break;
      default:
        break;
    }
  };

  const rowCount = filteredStudents.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  return (
    <HotKeys keyName="down,j,up,k,enter,right,ctrl+a" onKeyDown={onKeyDown}>
      <Header
        buttons={[
          AddStudentButton({
            key: "a",
            onClick: () => props.history.push("/student/new")
          })
        ]}
      />
      <div className="Content">
        <table id="students">
          <caption>Students</caption>
          <thead>
            <tr>
              <th>
                {" "}
                <input
                  onChange={handleFilterChange}
                  value={filter}
                  placeholder="Filter by name"
                />
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Last Jump</th>
              <th>Last DiveFlow</th>
            </tr>
          </thead>
          <tbody tabIndex={0}>
            {filteredStudents.map((student, i) => {
              const lastJump = student.jumps[student.jumps.length - 1];
              const daysSinceLastJump = lastJump
                ? differenceInDays(new Date(), lastJump.date)
                : 9999;
              const lastJumpStr = lastJump
                ? `${format(lastJump.date, "ddd MMM Do")}`
                : null;
              const lastDfStr = lastJump
                ? `DF ${lastJump.diveFlow} ${[
                    ...lastJump.instructor.match(/[A-Z]/g)
                  ].join("")}`
                : null;
              return (
                <tr
                  key={i}
                  onClick={() => handleStudentRowClick(student)}
                  className={i === activeRow ? "active" : ""}
                >
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    {lastJumpStr}
                    <span
                      className="currency-color"
                      style={{
                        backgroundColor: `${currencyColor(daysSinceLastJump)}`
                      }}
                    />
                  </td>
                  <td>{lastDfStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer match={props.match} />
    </HotKeys>
  );
});
