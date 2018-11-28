import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getInstructor from "./api/getInstructor";
import saveInstructor from "./api/saveInstructor";
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

store.instructor = null;

const Edit = ({ match, history }) => {
  const { instructor } = store;

  if (!instructor && match.path === "/instructors/new")
    store.instructor = initialState;

  if (
    match.path === "/instructors/:id" &&
    (!instructor || instructor._id !== match.params.id)
  ) {
    (async () => (store.instructor = await getInstructor(match.params.id)))();
  }

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
    delete store.instructors;
    history.push("/instructors");
  };

  const reallyDeleteInstructor = async () => {
    instructor._deleted = true;
    const res = await saveInstructor(instructor);
    if (res.error) return flash(res);
    delete store.instructors;
    flash({ success: `Deleted ${instructor.name}` });
    history.push("/instructors");
  };

  const deleteInstructor = e => {
    e.preventDefault();
    if (store.deleteConfirmation) return reallyDeleteInstructor();
    document.getElementById("d").focus();
    store.deleteConfirmation = true;
  };

  const setAttribute = event => {
    const { id, value } = event.target;
    switch (id) {
      case "phone":
        instructor[id] = formatPhoneNumber(value);
        break;
      default:
        instructor[id] = value;
        break;
    }
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
                  store.deleteConfirmation ? "warning" : null
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

export default collect(Edit);
