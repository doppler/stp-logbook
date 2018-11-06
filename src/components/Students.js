import React from "react";
import { Link } from "react-router-dom";
import "./Students.css";

import Header from "./Header";
import Footer from "./Footer";

export default props => {
  const { students, location, history } = props;
  const handleStudentRowClick = student => {
    history.push(`/student/${student.id}`);
  };

  return (
    <>
      <Header title="Students" location={location} />
      <div className="Students">
        <table>
          <thead>
            <tr className="Header">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
              return (
                <tr key={i} onClick={() => handleStudentRowClick(student)}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
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
