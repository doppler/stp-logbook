import React from "react";
import Header from "./Header";
import Footer from "./Footer";

import { store, collect } from "react-recollect";
import getStudent from "../api/getStudent";
import getStudents from "../api/getStudents";
import saveStudents from "../api/saveStudents";

import "./EditStudent.css";

// const initialState = {
//   id: Math.round(Math.random(10) * 100000000).toString(16),
//   name: "",
//   email: "",
//   phone: "",
//   instructor: "",
//   jumps: []
// };

const EditStudent = props => {
  const { params } = props.match;
  const { student, instructors } = store;

  const setAttribute = event => {
    const { id, value } = event.target;
    student[id] = value;
  };

  const saveStudent = async e => {
    e.preventDefault();
    const json = await getStudents();
    saveStudents([student, ...json.filter(obj => obj.id !== student.id)]).then(
      () => props.history.push(`/student/${student.id}`)
    );
  };

  if (!student || !instructors) return null;
  return (
    <React.Fragment>
      <Header match={props.match} />
      <div className="Content">
        <form onSubmit={saveStudent}>
          <fieldset>
            <legend>
              Editing {student.name ? student.name : "New Student"}
            </legend>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                onChange={setAttribute}
                value={student.name}
                placeholder="Full Name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                onChange={setAttribute}
                value={student.email}
                placeholder="email@domain.com"
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                onChange={setAttribute}
                value={student.phone}
                placeholder="Phone"
              />
            </div>
            <div className="input-group">
              <label htmlFor="instructor">Instructor</label>
              <select
                id="instructor"
                value={student.instructor}
                onChange={setAttribute}
              >
                <InstructorOptions instructors={instructors} />
              </select>
            </div>
            {student.jumps.length === 0 ? (
              <div className="input-group">
                <label htmlFor="previousJumps">Previous Jumps</label>
                <input
                  type="number"
                  id="previousJumps"
                  onChange={setAttribute}
                  value={student.previousJumps || 2}
                />
              </div>
            ) : null}
          </fieldset>
          <button>Save Student</button>
        </form>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default collect(EditStudent);

const InstructorOptions = ({ instructors }) => {
  return instructors.list.map((instructor, i) => (
    <option key={i} value={instructor}>
      {instructor}
    </option>
  ));
};
