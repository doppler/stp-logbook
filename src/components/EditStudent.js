import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import fetchStudent from "../api/fetchStudent";
import fetchStudents from "../api/fetchStudents";
import saveStudents from "../api/saveStudents";

import "./EditStudent.css";

import Header from "./Header";
import Footer from "./Footer";

const EditStudent = props => {
  const { match } = props;
  const [student, setStudent] = useState();

  useEffect(async () => {
    if (!student) {
      const savedStudent = await fetchStudent(match.params.id);
      if (savedStudent) {
        setStudent(savedStudent);
      } else {
        setStudent({
          id: Math.round(Math.random(10) * 100000000).toString(16),
          name: "",
          email: "",
          phone: "",
          jumps: []
        });
      }
    }
  });

  const setStudentAttribute = event => {
    const { id, value } = event.target;
    student[id] = value;
    setStudent(student);
  };

  const saveStudent = async e => {
    e.preventDefault();
    const students = await fetchStudents();
    const savedStudent = students.find(_student => _student.id === student.id);
    const editedStudent = savedStudent ? savedStudent : student;
    saveStudents([
      editedStudent,
      ...students.filter(_student => _student.id !== student.id)
    ]).then(() => props.history.push(`/student/${student.id}`));
  };

  if (!student) return null;
  return (
    <>
      <Header title="New Student" />
      <div className="NewStudent">
        <form>
          <h2>Editing {student.name ? student.name : "New Student"}</h2>
          <div className="id">{student.id}</div>
          <div className="input-group">
            <label htmlFor="name">Name: </label>
            <input
              id="name"
              onChange={setStudentAttribute}
              value={student.name}
              placeholder="Full Name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              onChange={setStudentAttribute}
              value={student.email}
              placeholder="email@domain.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone: </label>
            <input
              id="phone"
              onChange={setStudentAttribute}
              value={student.phone}
              placeholder="Phone"
            />
          </div>
          <button onClick={saveStudent}>Save Student</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default withRouter(EditStudent);
