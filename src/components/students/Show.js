import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import HotKeys from "react-hot-keys";

import "./Show.css";

import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import getStudent from "../../db/getStudent";
import getJumps from "../../db/getJumps";
import saveStudent from "../../db/saveStudent";
import saveJump from "../../db/saveJump";
import flash from "../../utils/flash";

const Show = ({ match, history }) => {
  const [student, setStudent] = useState(null);
  const [jumps, setJumps] = useState(null);

  const fetchData = async () => {
    const student = await getStudent(match.params.studentId);
    setStudent(student);
    const jumps = await getJumps(student);
    setJumps(jumps);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      _id: Math.round(Math.random() * 1000000000).toString(16),
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

  const [activeJumpRow, setActiveJumpRow] = useState(-1);

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
    setActiveJumpRow(activeJumpRow + 1);
    history.push(`/students/${student._id}/jump/${jump._id}`);
  };

  const onKeyUp = (keyName, e) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.click();
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        setActiveJumpRow(activeJumpRow + 1);
        break;
      case ["up", "k"].includes(keyName):
        setActiveJumpRow(activeJumpRow - 1);
        break;
      case ["enter", "right"].includes(keyName):
        history.push(
          `/students/${student._id}/jump/${jumps[activeJumpRow]._id}`
        );
        break;
      case keyName === "left":
        history.push("/students");
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };
  if (rowCount > 0 && activeJumpRow === rowCount) setActiveJumpRow(0);
  if (rowCount > 0 && activeJumpRow === -1) setActiveJumpRow(rowCount - 1);

  document.title = `STP: ${student.name}`;

  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,left,ctrl+l,ctrl+a,ctrl+e"
      onKeyUp={onKeyUp}
    >
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
            <tbody>
              {jumps.map((jump, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    history.push(`/students/${student._id}/jump/${jump._id}`)
                  }
                  className={`hoverable ${i === activeJumpRow ? "active" : ""}`}
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
