import React from "react";
import Header from "./Header";
import Footer from "./Footer";

import { store, collect } from "react-recollect";
import getStudent from "../api/getStudent";
import getStudents from "../api/getStudents";
import saveStudents from "../api/saveStudents";

import "./EditStudent.css";

const initialState = {
  id: Math.round(Math.random() * 2 ** 32).toString(16),
  name: "",
  email: "",
  phone: "",
  instructor: "",
  previousJumps: 2,
  jumps: []
};

const EditStudent = props => {
  const { match } = props;

  const { student, instructors } = store;

  if (!student && match.path === "/student/new") store.student = initialState;

  const fetchStudent = async id => {
    const json = await getStudent(id);
    store.student = json;
  };

  if (
    !match.path === "/student/:studentId" &&
    (!student || student.id !== props.match.params.studentId)
  )
    fetchStudent(props.match.params.studentId);

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
              Editing{" "}
              {student.name ? student.name : `New Student (id:${student.id})`}
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
                  value={student.previousJumps}
                />
              </div>
            ) : null}
          </fieldset>
          <input type="submit" style={{ display: "none" }} tabIndex={-1} />
        </form>
      </div>
      <Footer
        match={props.match}
        buttons={<FooterButtons saveStudent={saveStudent} />}
      />
    </React.Fragment>
  );
};

export default collect(EditStudent);

const FooterButtons = ({ saveStudent }) => (
  <button onClick={saveStudent}>Save Student</button>
);

const InstructorOptions = ({ instructors }) => {
  return instructors.list.map((instructor, i) => (
    <option key={i} value={instructor}>
      {instructor}
    </option>
  ));
};
