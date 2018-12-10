import React, { useState, useEffect } from "react";
import HotKeys from "react-hot-keys";

import getInstructor from "../../db/getInstructor";
import saveInstructor from "../../db//saveInstructor";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  _id: Math.round(Math.random() * 2 ** 32).toString(16),
  type: "instructor",
  name: "",
  email: "",
  phone: ""
};

const Edit = ({ match, history }) => {
  const [instructor, setInstructor] = useState(null);

  const fetchData = async () => {
    if (match.path === "/instructors/new") setInstructor(initialState);
    else {
      const instructor = await getInstructor(match.params.id);
      setInstructor(instructor);
    }
  };

  useEffect(() => fetchData(), []);

  if (!instructor) return false;

  const save = async e => {
    e.preventDefault();
    removeErrorClass();
    const res = await saveInstructor(instructor);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${instructor.name}` });
    history.goBack(1);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const deleteInstructor = async e => {
    e.preventDefault();
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return false;
    }
    instructor._deleted = true;
    const res = await saveInstructor(instructor);
    if (res.error) return flash(res);
    flash({ success: `Deleted ${instructor.name}` });
    history.goBack(1);
  };

  const setAttribute = event => {
    const { id, value } = event.target;
    const updatedInstructor = { ...instructor };
    switch (id) {
      case "phone":
        updatedInstructor[id] = formatPhoneNumber(value);
        break;
      default:
        updatedInstructor[id] = value;
        break;
    }
    setInstructor(updatedInstructor);
  };

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

  document.title = `STP: Instructors EDIT ${instructor.name}`;

  return (
    <HotKeys keyName="ctrl+s,ctrl+d" onKeyDown={onKeyDown}>
      <div className="Content">
        <form onSubmit={save}>
          <fieldset>
            <legend>
              Editing{" "}
              {instructor.name
                ? instructor.name
                : `New Instructor (id:${instructor._id})`}
            </legend>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                onChange={setAttribute}
                value={instructor.name}
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
                value={instructor.email}
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
                value={instructor.phone}
                type="tel"
                placeholder="123-456-7890"
                pattern="\d{3}-\d{3}-\d{4}"
                className="formField required"
                required
              />
            </div>
            <button id="s" onClick={save} className="hotkey-button">
              Save Instructor
            </button>
            {match.params.id ? (
              <button
                id="d"
                onClick={deleteInstructor}
                className={`hotkey-button ${
                  deleteConfirmation ? "warning" : null
                }`}
              >
                Delete Instructor
              </button>
            ) : null}
          </fieldset>
        </form>
      </div>
    </HotKeys>
  );
};

export default Edit;
