import React, { useState } from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import getInstructors from "./api/getInstructors";

const List = ({ history }) => {
  const { instructors } = store;

  if (instructors.length === 0)
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();

  const handleRowClick = instructor => {
    history.push(`/instructors/${instructor.id}`);
  };

  const addInstructor = () => {
    history.push("/instructors/new");
  };

  const [activeRow, setActiveRow] = useState(0);
  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        setActiveRow(activeRow + 1);
        break;
      case ["up", "k"].includes(keyName):
        setActiveRow(activeRow - 1);
        break;
      case ["enter", "right"].includes(keyName):
        history.push(`/instructors/${instructors[activeRow].id}`);
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  const rowCount = instructors.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "h", onClick: () => history.push("/"), children: "Home" },
      { id: "n", onClick: addInstructor, children: "New Instructor" }
    ];

  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,ctrl+h,ctrl+n"
      onKeyDown={onKeyDown}
    >
      <div className="Content">
        <div>
          <strong>Note: </strong> This feature will require authorization in an
          upcoming release.
        </div>
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
              <tr
                key={i}
                className={i === activeRow ? "active" : ""}
                onClick={() => handleRowClick(instructor)}
              >
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

export default collect(List);
