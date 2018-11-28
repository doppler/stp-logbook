import React from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import getInstructors from "../instructors/api/getInstructors";
import getStudent from "./api/getStudent";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import save from "./api/saveStudent";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  _id: Math.round(Math.random() * 2 ** 32).toString(16),
  type: "student",
  name: "",
  email: "",
  phone: "",
  instructor: "",
  previousJumps: 2,
  jumps: []
};

const Edit = ({ match, history }) => {
  const { student, instructors } = store;

  if (!student && match.path === "/students/new") store.student = initialState;

  if (
    match.path === "/students/:studentId/edit" &&
    (!student || student._id !== match.params.studentId)
  )
    (async () => (store.student = await getStudent(match.params.studentId)))();

  if (instructors.length === 0)
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();

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
    history.goBack(1);
  };

  if (!student || instructors.length === 0) return null;

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

  document.title = `STP: EDIT ${student.name}`;

  return (
    <HotKeys keyName="ctrl+s" onKeyDown={onKeyDown}>
      <div className="Edit">
        <form onSubmit={saveStudent}>
          <fieldset>
            <legend>
              Editing{" "}
              {student.name ? student.name : `New Student (id:${student._id})`}
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
                <option value="">Select Instructor</option>
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
            <button id="s" onClick={saveStudent} className="hotkey-button">
              Save Student
            </button>
          </fieldset>
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
    </HotKeys>
  );
};

export default collect(Edit);

const InstructorOptions = ({ instructors }) => {
  return instructors.map((instructor, i) => (
    <option key={i} value={instructor.name}>
      {instructor.name}
    </option>
  ));
};
