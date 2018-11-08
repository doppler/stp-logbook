import React from "react";
import { store, collect } from "react-recollect";
import getStudents from "../api/getStudents";
import parse from "date-fns/parse";
import format from "date-fns/format";
import differenceInDays from "date-fns/difference_in_days";
import "./Students.css";

export default collect(props => {
  const { students, filteredStudents } = store.app;

  store.app.match = props.match;

  store.app.header.title = "Students";

  if (students.length === 0) {
    (async () => {
      const json = await getStudents();
      json.sort((a, b) => {
        let lastJumpA = [...a.jumps].reverse().pop() || {
          date: new Date(1971, 9, 25)
        };
        let lastJumpB = [...b.jumps].reverse().pop() || {
          date: new Date(1971, 9, 25)
        };
        return parse(lastJumpB.date) - parse(lastJumpA.date);
      });
      store.app.students = json;
      store.app.filteredStudents = json;
      console.log(store.app);
    })();
  }

  const handleStudentRowClick = student => {
    props.history.push(`/student/${student.id}`);
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

  return (
    <div className="Content">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Last Jump</th>
            <th>Last DiveFlow</th>
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
              ? `DF ${lastJump.diveFlow} ${[
                  ...lastJump.instructor.match(/[A-Z]/g)
                ].join("")}`
              : null;
            return (
              <tr key={i} onClick={() => handleStudentRowClick(student)}>
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
  );
});
