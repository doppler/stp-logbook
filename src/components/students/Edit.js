import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { HotKeys } from "react-hotkeys";

import getStudent from "../../db/getStudent";
import save from "../../db/saveStudent";
import getInstructors from "../../db/getInstructors";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  _id: `student-${Math.round(Math.random() * 2 ** 32).toString(16)}`,
  type: "student",
  name: "",
  email: "",
  phone: "",
  instructor: "",
  previousJumps: 2,
  jumps: []
};

const Edit = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const nameRef = useRef(null);
  const [student, setStudent] = useState(null);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (match.path === "/students/new") setStudent(initialState);
      else {
        const student = await getStudent(match.params.studentId);
        setStudent(student);
      }
      const instructors = await getInstructors();
      setInstructors(instructors);
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    document.title =
      student && student.name
        ? `STP: EDIT ${student.name}`
        : "STP: Loading student";
  }, [student]);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, [nameRef]);

  if (!student && match.path === "/students/new") setStudent(initialState);

  const setAttribute = event => {
    const { id, value } = event.target;
    const updatedStudent = { ...student };
    switch (id) {
      case "phone":
        updatedStudent[id] = formatPhoneNumber(value);
        break;
      default:
        updatedStudent[id] = value;
        break;
    }
    setStudent(updatedStudent);
  };

  const saveStudent = async e => {
    if (e) {
      // document.querySelector("input[type='submit']").click();
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

  const handlers = {
    "ctrl+s": () => saveStudent()
  };

  return (
    <HotKeys handlers={handlers}>
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
                ref={nameRef}
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

export default Edit;

const InstructorOptions = ({ instructors }) => {
  return instructors.map((instructor, i) => (
    <option key={i} value={instructor.name}>
      {instructor.name}
    </option>
  ));
};
