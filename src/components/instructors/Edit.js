import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getInstructors from "../../api/getInstructors";
import getInstructor from "../../api/getInstructor";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import save from "../../api/saveInstructor";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  id: Math.round(Math.random() * 2 ** 32).toString(16),
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
    (!instructor || instructor.id !== match.params.id)
  ) {
    (async () => (store.instructor = await getInstructor(match.params.id)))();
  }

  if (!instructor) return false;

  const saveInstructor = async e => {
    if (e) {
      document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const res = await save(instructor);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${instructor.name}` });
    document.location.pathname = "/instructors";
  };

  const reallyDeleteInstructor = async () => {
    const instructors = await getInstructors();
    const newInstructors = instructors.filter(o => o.id !== instructor.id);
    localStorage.setItem(
      "stp-logbook:instructors",
      JSON.stringify(newInstructors)
    );
    flash({ success: `Deleted ${instructor.name}` });
    history.push("/instructors");
  };

  const deleteInstructor = () => {
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

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "b", onClick: () => history.goBack(1), children: "Back" },
      { id: "s", onClick: saveInstructor, children: "Save Instructor" }
    ];
  if (match.params.id && !store.headerButtons.find(o => o.id === "d")) {
    store.headerButtons.push({
      id: "d",
      onClick: deleteInstructor,
      children: "Delete Instructor"
    });
  }
  return (
    <HotKeys keyName="ctrl+b,ctrl+s,ctrl+d" onKeyDown={onKeyDown}>
      <div className="Content">
        <form onSubmit={saveInstructor}>
          <fieldset>
            <legend>
              Editing{" "}
              {instructor.name
                ? instructor.name
                : `New Instructor (id:${instructor.id})`}
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
          </fieldset>
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
    </HotKeys>
  );
};

export default collect(Edit);
