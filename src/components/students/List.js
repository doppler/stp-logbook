import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

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

const List = () => {
  const history = useHistory();
  const [store, setStore] = useState({ students: [], filteredStudents: [] });
  const [filter, setFilter] = useState("");
  const { filteredStudents } = store;

  useEffect(() => {
    document.title = "STP: Students";
  }, []);

  const sortStudentsByLastJump = students => {
    students.sort((a, b) => {
      let lastJumpA = [...a.jumps].pop() || { date: new Date(1971, 9, 25) };
      let lastJumpB = [...b.jumps].pop() || { date: new Date(1971, 9, 25) };
      return parse(lastJumpB.date) - parse(lastJumpA.date);
    });
    return students;
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchStudents = async () => {
      const students = await getStudents();
      sortStudentsByLastJump(students);
      setStore({ students: students, filteredStudents: students });
    };

    fetchStudents();
    return () => abortController.abort();
  }, []);

  const handleStudentRowClick = student => {
    history.push(`/students/${student._id}`);
  };

  const handleFilterChange = e => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    store.filteredStudents = store.students.filter(obj =>
      obj.name.toLowerCase().match(value)
    );
  };

  return (
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
        <tbody>
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
                className={`hoverable`}
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
  );
};

export default List;
