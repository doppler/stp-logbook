import React from "react";
import { Link } from "react-router-dom";
import "./Students.css";

import Header from "./Header";
import Footer from "./Footer";

export default ({ students }) => {
  return (
    <>
      <Header title="Students" />
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
                <tr key={i}>
                  <td>
                    <Link to={`/student/${student.id}`}>{student.name}</Link>
                  </td>
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
