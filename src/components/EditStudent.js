import React from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import getStudent from "../api/getStudent";
import save from "../api/saveStudent";
import flash from "../utils/flash.js";

import Header from "./Header";
import Footer from "./Footer";

const initialState = {
  id: Math.round(Math.random() * 2 ** 32).toString(16),
  name: "",
  email: "",
  phone: "",
  instructor: "",
  previousJumps: 2,
  jumps: []
};

const HomeButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Home
  </button>
);

const SaveStudentButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Save Student
  </button>
);

const EditStudent = props => {
  const { match } = props;

  const { student, instructors } = store;

  if (!student && match.path === "/student/new") store.student = initialState;

  const fetchStudent = async id => {
    const json = await getStudent(id);
    store.student = json;
  };

  if (
    match.path === "/student/:studentId/edit" &&
    (!student || student.id !== props.match.params.studentId)
  )
    fetchStudent(props.match.params.studentId);

  const setAttribute = event => {
    const { id, value } = event.target;
    student[id] = value;
  };

  const saveStudent = async e => {
    if (e) e.preventDefault();
    const res = await save(student);
    if (res.error) return flash(res);
    flash({ success: `Saved ${res.name}` });
    props.history.push(`/student/${student.id}`);
  };

  if (!student || !instructors) return null;

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case keyName === "h":
        props.history.push("/");
        break;
      case keyName === "s":
        saveStudent();
        break;
      default:
        break;
    }
  };

  return (
    <HotKeys keyName="h,s" onKeyDown={onKeyDown}>
      <Header
        match={props.match}
        buttons={[
          HomeButton({ key: "h", onClick: () => props.history.push("/") }),
          SaveStudentButton({ key: "s", onClick: saveStudent })
        ]}
      />
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
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
      <Footer />
    </HotKeys>
  );
};

export default collect(EditStudent);

// const FooterButtons = ({ saveStudent }) => (
//   <button onClick={saveStudent}>Save Student</button>
// );

const InstructorOptions = ({ instructors }) => {
  return instructors.list.map((instructor, i) => (
    <option key={i} value={instructor}>
      {instructor}
    </option>
  ));
};
