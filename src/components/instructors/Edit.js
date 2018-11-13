import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getInstructors from "../../api/getInstructors";

const Edit = ({ match, history }) => {
  const { instructors } = store;

  if (instructors.length === 0) {
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();
    return false;
  }

  const instructor = instructors.find(o => (o.id = match.params.id));

  const saveInstructor = async e => {
    console.log("saveInstructor");
  };

  const deleteInstructor = async e => {
    console.log("deleteInstructor");
  };

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
    console.table({ id, value });
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
      { id: "s", onClick: saveInstructor, children: "Save Instructor" },
      { id: "d", onClick: deleteInstructor, children: "Delete Instructor" }
    ];

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
        </form>
      </div>
    </HotKeys>
  );
};

export default collect(Edit);
