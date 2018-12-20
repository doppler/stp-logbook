import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";
import getInstructors from "../../db//getInstructors";

const List = ({ history }) => {
  const [instructors, setInstructors] = useState([]);
  const [activeRow, setActiveRow] = useState(0);

  const fetchData = async () => {
    const instructors = await getInstructors();
    setInstructors(instructors);
  };

  useEffect(() => fetchData(), []);

  const handleRowClick = instructor => {
    history.push(`/instructors/${instructor._id}`);
  };

  const addInstructor = () => {
    history.push("/instructors/new");
  };

  const rowCount = instructors.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  useEffect(() => {
    document.title = "STP: Instructors";
  }, []);

  const keyMap = {
    moveToNextRow: ["down", "j"],
    moveToPrevRow: ["up", "k"],
    selectCurrentRow: ["right", "enter"],
    addInstructor: ["ctrl+a"]
  };

  const handlers = {
    moveToNextRow: event => {
      event.preventDefault();
      setActiveRow(activeRow + 1);
    },
    moveToPrevRow: event => {
      event.preventDefault();
      setActiveRow(activeRow - 1);
    },
    selectCurrentRow: () =>
      history.push(`/instructors/${instructors[activeRow]._id}`),
    addInstructor: () => document.getElementById("a").click()
  };

  useEffect(() => document.getElementById("tableBody").focus());

  return (
    <div className="Content">
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <table id="instructors">
          <caption>Instructors</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody id="tableBody" tabIndex={0}>
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
        <button id="a" onClick={addInstructor} className="hotkey-button small">
          Add Instructor
        </button>
      </HotKeys>
    </div>
  );
};

List.propTypes = {
  history: PropTypes.object.isRequired
};

export default List;
