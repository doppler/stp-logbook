import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";

import "./Show.css";

import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "../../db/getStudent";
import getJumps from "../../db/getJumps";
import saveStudent from "../../db/saveStudent";
import saveJump from "../../db/saveJump";
import flash from "../../utils/flash";

const Show = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const [student, setStudent] = useState(null);
  const [jumps, setJumps] = useState(null);
  const [activeRow, setActiveRow] = useState(-1);
  const tableRef = useRef(null);

  useEffect(() => {
    document.title = `STP: ${student ? student.name : "Fetching student doc"}`;
  }, [student]);

  const fetchData = async () => {
    const student = await getStudent(match.params.studentId);
    setStudent(student);
    const jumps = await getJumps(student);
    setJumps(jumps);
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tableRef.current) tableRef.current.focus();
  }, [tableRef]);

  if (!student || !jumps || student._id !== match.params.studentId) {
    return null;
  }

  const rowCount = student.jumps.length;

  const nextJump = () => {
    const lastJump = jumps[jumps.length - 1];
    const { number, diveFlow, instructor, aircraft } = lastJump
      ? { ...lastJump }
      : {
          number: Number(student.previousJumps),
          diveFlow: 0,
          instructor: student.instructor,
          aircraft: "-"
        };
    return {
      _id: `${student._id}-jump-${new Date().toISOString()}`,
      type: "jump",
      studentId: student._id,
      number: number + 1,
      diveFlow: diveFlow + 1,
      date: format(new Date()),
      instructor,
      aircraft,
      exitAltitude: 14000,
      deploymentAltitude: 5000,
      freefallTime: 0,
      phraseCloudSelections: {
        exit: [],
        freefall: [],
        canopy: []
      }
    };
  };

  const addJump = async () => {
    const jump = nextJump();
    const jumpRes = await saveJump(jump);
    if (jumpRes.error) return flash(jumpRes);
    student.jumps.push(jump._id);
    const studentRes = await saveStudent(student);
    if (studentRes.error) return flash(studentRes);
    flash({
      success: `Saved ${student.name} - Jump ${jump.number} DF ${jump.diveFlow}`
    });
    setActiveRow(activeRow + 1);
    history.push(`/students/${student._id}/jump/${jump._id}`);
  };

  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  const keyMap = {
    moveToNextRow: ["down", "j"],
    moveToPrevRow: ["up", "k"],
    selectCurrentRow: ["right", "enter"],
    addJump: ["ctrl+a"],
    editStudent: ["ctrl+e"]
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
      history.push(`/students/${student._id}/jump/${jumps[activeRow]._id}`),
    addJump: () => document.getElementById("a").click(),
    editStudent: () => document.getElementById("e").click()
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="Student">
        <div className="left">
          <h1>{student.name}</h1>
          <p>{student.email}</p>
          <p>{student.phone}</p>
          <p>
            <button
              id="e"
              className="hotkey-button small"
              onClick={() => history.push(`/students/${student._id}/edit`)}
            >
              Edit
            </button>
          </p>
        </div>
        <div className="right">
          <table tabIndex={0}>
            <thead>
              <tr>
                <th>Jump - Dive Flow</th>
                <th>Date</th>
                <th>Instructor</th>
                <th>Video</th>
              </tr>
            </thead>
            <tbody id="tableBody" tabIndex={0} ref={tableRef}>
              {jumps.map((jump, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    history.push(`/students/${student._id}/jump/${jump._id}`)
                  }
                  className={`hoverable ${i === activeRow ? "active" : ""}`}
                >
                  <td>
                    Jump {jump.number} - DF {jump.diveFlow}
                  </td>
                  <td>
                    {format(jump.date, "dddd MMMM Do")} (
                    {distanceInWordsToNow(jump.date)})
                  </td>
                  <td>{jump.instructor}</td>
                  <td>{jump.videoFilename ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button id="a" className="hotkey-button small" onClick={addJump}>
            Add Jump
          </button>
        </div>
      </div>
    </HotKeys>
  );
};

Show.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Show;
