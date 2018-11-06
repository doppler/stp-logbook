import React from "react";
import "./Students.css";

import Header from "./Header";
import Footer from "./Footer";

export default props => {
  const { students } = props;
  const handleStudentRowClick = student => {
    props.history.push(`/student/${student.id}`);
  };

  return (
    <>
      <Header title="Students" location={props.location} />
      <div className="Students">
        <table>
          <thead>
            <tr>
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
