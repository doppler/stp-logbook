import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import getStudent from "../api/getStudent";
import getStudents from "../api/getStudents";
import saveStudents from "../api/saveStudents";

import "./EditStudent.css";

import Header from "./Header";
import Footer from "./Footer";

const initialState = {
  id: Math.round(Math.random(10) * 100000000).toString(16),
  name: "",
  email: "",
  phone: "",
  instructor: "",
  jumps: []
};

const EditStudent = props => {
  const { params } = props.match;
  const [student, setStudent] = useState(initialState);

  useEffect(
    async () => {
      if (!params.id) return null;
      const json = await getStudent(params.id);
      setStudent(json);
    },
    [setStudent]
  );

  const setStudentAttribute = event => {
    const { id, value } = event.target;
    student[id] = value;
    setStudent(student);
  };

  const saveStudent = async e => {
    e.preventDefault();
    const json = await getStudents();
    saveStudents([student, ...json.filter(obj => obj.id !== student.id)]).then(
      () => props.history.push(`/student/${student.id}`)
    );
  };

  return (
    <>
      <Header title={student.name !== "" ? student.name : "New Student"} />
      <div className="NewStudent">
        <form onSubmit={saveStudent}>
          <h2>Editing {student.name ? student.name : "New Student"}</h2>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={setStudentAttribute}
              value={student.name}
              placeholder="Full Name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              onChange={setStudentAttribute}
              value={student.email}
              placeholder="email@domain.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              onChange={setStudentAttribute}
              value={student.phone}
              placeholder="Phone"
            />
          </div>
          <div className="input-group">
            <label htmlFor="instructor">Instructor</label>
            <input
              id="instructor"
              onChange={setStudentAttribute}
              value={student.instructor}
              placeholder="instructor"
            />
          </div>
          <div className="input-group">
            <label htmlFor="previousJumps">Previous Jumps</label>
            <input
              type="number"
              id="previousJumps"
              onChange={setStudentAttribute}
              value={student.previousJumps || 2}
            />
          </div>
          <button>Save Student</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default withRouter(EditStudent);
