import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import getInstructors from "./api/getInstructors";

store.filter = "";
store.activeRow = 0;

const List = ({ history }) => {
  const { instructors } = store;

  if (!instructors || instructors.length === 0) {
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();
    return null;
  }

  const handleRowClick = instructor => {
    history.push(`/instructors/${instructor._id}`);
  };

  const addInstructor = () => {
    history.push("/instructors/new");
  };

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        store.activeRow++;
        break;
      case ["up", "k"].includes(keyName):
        store.activeRow--;
        break;
      case ["enter", "right"].includes(keyName):
        history.push(`/instructors/${instructors[store.activeRow]._id}`);
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  const rowCount = instructors.length;
  if (rowCount > 0 && store.activeRow === rowCount) store.activeRow = 0;
  if (rowCount > 0 && store.activeRow === -1) store.activeRow = rowCount - 1;

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
                className={i === store.activeRow ? "active" : ""}
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
