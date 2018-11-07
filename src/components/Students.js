import React, { useState, useEffect } from "react";
import getStudents from "../api/getStudents";
import parse from "date-fns/parse";
import format from "date-fns/format";
import differenceInDays from "date-fns/difference_in_days";
import "./Students.css";

import Header from "./Header";
import Footer from "./Footer";

export default props => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(
    async () => {
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
      setStudents(json);
      setFilteredStudents(json);
    },
    [setStudents]
  );

  const handleStudentRowClick = student => {
    props.history.push(`/student/${student.id}`);
  };

  const handleFilterChange = e => {
    const filter = e.target.value.toLowerCase();
    const filteredStudents = students.filter(obj =>
      obj.name.toLowerCase().match(filter)
    );
    setFilteredStudents(filteredStudents);
    setFilter(e.target.value);
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
    <>
      <Header
        title="Students"
        location={props.location}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <div className="Students">
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
      <Footer />
    </>
  );
};
