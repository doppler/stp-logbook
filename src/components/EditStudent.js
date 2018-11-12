import React from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import getStudent from "../api/getStudent";
import save from "../api/saveStudent";
import flash from "../utils/flash";
import handleFormError from "../utils/handleFormError";
import removeErrorClass from "../utils/removeErrorClass";

import Header from "./Header";
import Footer from "./Footer";
import { HomeButton, BackButton, SaveStudentButton } from "./nav-buttons";

const initialState = {
  id: Math.round(Math.random() * 2 ** 32).toString(16),
  name: "",
  email: "",
  phone: "",
  instructor: "",
  previousJumps: 2,
  jumps: []
};

const EditStudent = ({ match, history }) => {
  const { student, instructors } = store;

  if (!student && match.path === "/student/new") store.student = initialState;

  if (
    match.path === "/student/:studentId/edit" &&
    (!student || student.id !== match.params.studentId)
  )
    (async () => (store.student = await getStudent(match.params.studentId)))();

  const formatPhoneNumber = value => {
    let newValue;
    switch (true) {
      case /^\d{4}/.test(value):
        newValue = value.replace(/^(\d{3})(\d{1})/, "$1-$2");
        break;
      case /^\d{3}-\d{4}/.test(value):
        newValue = value.replace(/^(\d{3}-\d{3})(\d{1})/, "$1-$2");
        break;
      default:
        newValue = value;
        break;
    }
    return newValue;
  };

  const setAttribute = event => {
    const { id, value } = event.target;
    switch (id) {
      case "phone":
        student[id] = formatPhoneNumber(value);
        break;
      default:
        student[id] = value;
        break;
    }
  };

  const saveStudent = async e => {
    document.forms[0].checkValidity();
    if (e) {
      document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const res = await save(student);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${student.name}` });
    history.push(`/student/${student.id}`);
  };

  if (!student || !instructors) return null;

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  return (
    <HotKeys keyName="ctrl+h,ctrl+b,ctrl+s" onKeyDown={onKeyDown}>
      <Header
        buttons={[
          HomeButton({ key: "h", onClick: () => history.push("/") }),
          BackButton({ key: "b", onClick: () => history.goBack(1) }),
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
                className="formField required"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                onChange={setAttribute}
                value={student.email}
                type="email"
                placeholder="email@domain.com"
                className="formField required"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                onChange={setAttribute}
                value={student.phone}
                type="tel"
                placeholder="123-456-7890"
                pattern="\d{3}-\d{3}-\d{4}"
                className="formField required"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="instructor">Instructor</label>
              <select
                id="instructor"
                value={student.instructor}
                onChange={setAttribute}
                className="formField required"
                required
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
                  className="formField required"
                  required
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

const InstructorOptions = ({ instructors }) => {
  return instructors.list.map((instructor, i) => (
    <option key={i} value={instructor}>
      {instructor}
    </option>
  ));
};
