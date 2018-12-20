import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";

import parse from "date-fns/parse";
import format from "date-fns/format";
import differenceInDays from "date-fns/difference_in_days";

import getStudents from "../../db/getStudents";

const currencyColor = daysSinceLastJump => {
  if (daysSinceLastJump > 30) {
    return `hsl(0, 100%, 50%)`;
  }
  return `hsl(${120 - daysSinceLastJump * 3}, 100%, 50%)`;
};

const List = ({ history }) => {
  const [store, setStore] = useState({ students: [], filteredStudents: [] });
  const { filteredStudents } = store;

  const sortStudentsByLastJump = students => {
    students.sort((a, b) => {
      let lastJumpA = [...a.jumps].pop() || { date: new Date(1971, 9, 25) };
      let lastJumpB = [...b.jumps].pop() || { date: new Date(1971, 9, 25) };
      return parse(lastJumpB.date) - parse(lastJumpA.date);
    });
    return students;
  };

  const fetchStudents = async () => {
    const students = await getStudents();
    sortStudentsByLastJump(students);
    setStore({ students: students, filteredStudents: students });
  };

  useEffect(() => fetchStudents(), []);

  const handleStudentRowClick = student => {
    history.push(`/students/${student._id}`);
  };

  const [filter, setFilter] = useState("");
  const handleFilterChange = e => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    store.filteredStudents = store.students.filter(obj =>
      obj.name.toLowerCase().match(value)
    );
  };

  const [activeRow, setActiveRow] = useState(0);

  const rowCount = filteredStudents.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  useEffect(() => {
    document.title = "STP: Students";
  }, []);

  const keyMap = {
    moveToNextRow: ["down", "j"],
    moveToPrevRow: ["up", "k"],
    selectCurrentRow: ["right", "enter"],
    addStudent: ["ctrl+a"]
  };

  const handlers = {
    moveToNextRow: event => {
      event.preventDefault();
      setActiveRow(activeRow + 1);
    },
    moveToPrevRow: event => {
      event.preventDefault();
      setActiveRow(activeRow - 1);
    },
    selectCurrentRow: () =>
      history.push(`/students/${filteredStudents[activeRow]._id}`),
    addStudent: () => document.getElementById("a").click()
  };

  useEffect(() => document.getElementById("tableBody").focus());

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="List">
        <table id="students">
          <thead>
            <tr>
              <th colSpan="3">
                {" "}
                <input
                  onChange={handleFilterChange}
                  value={filter}
                  placeholder="Filter by name"
                />
                <button
                  className="hotkey-button small"
                  id="a"
                  onClick={() => history.push("/students/new")}
                >
                  Add Student
                </button>
              </th>
            </tr>
          </thead>
          <tbody id="tableBody" tabIndex={0}>
            {filteredStudents.map((student, i) => {
              const lastJump = student.jumps[student.jumps.length - 1];
              const daysSinceLastJump = lastJump
                ? differenceInDays(new Date(), lastJump.date)
                : 9999;
              const lastJumpStr = lastJump
                ? `${format(lastJump.date, "ddd MMM Do")}`
                : null;
              const lastDfStr = lastJump
                ? `DF ${lastJump.diveFlow} - ${[
                    ...lastJump.instructor.match(/(\w+)( ([A-Z]))?/)[0]
                  ].join("")}.`
                : null;
              return (
                <tr
                  key={i}
                  onClick={() => handleStudentRowClick(student)}
                  className={`hoverable ${i === activeRow ? "active" : ""}`}
                >
                  <td>{student.name}</td>
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
    </HotKeys>
  );
};

List.propTypes = {
  history: PropTypes.object.isRequired
};

export default List;
