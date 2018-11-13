import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getInstructors from "../../api/getInstructors";

const Instructors = ({ history }) => {
  const { instructors } = store;

  if (instructors.length === 0)
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();

  const addInstructor = () => {
    console.log("addInstructor");
  };

  const onKeyDown = (keyName, e, handle) => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "h", onClick: () => history.push("/"), children: "Home" },
      { id: "a", onClick: addInstructor, children: "Add Instructor" }
    ];

  return (
    <HotKeys keyName="ctrl+h,ctrl+a" onKeyDown={onKeyDown}>
      <div className="Content">
        <table id="instructors">
          <caption>Instructors</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, i) => (
              <tr key={i}>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotKeys>
  );
};

export default collect(Instructors);
