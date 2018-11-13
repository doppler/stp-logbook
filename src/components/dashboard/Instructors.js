import React from "react";
import { store, collect } from "react-recollect";

import getInstructors from "../../api/getInstructors";

const Instructors = ({ history }) => {
  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "h", onClick: () => history.push("/"), children: "Home" }
    ];

  const { instructors } = store;

  if (instructors.length === 0)
    (async () => {
      const instructors = await getInstructors();
      store.instructors = instructors;
    })();

  return (
    <div className="Content">
      <table id="instructors">
        <caption>Instructors</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor, i) => (
            <tr key={i}>
              <td>{instructor.name}</td>
              <td>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default collect(Instructors);
