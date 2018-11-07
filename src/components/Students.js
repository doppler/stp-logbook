import React, { useState, useEffect } from "react";
import getStudents from "../api/getStudents";
import format from "date-fns/format";
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
                  <td>{lastJumpStr}</td>
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
