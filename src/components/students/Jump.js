import React, { useState, useEffect } from "react";
import HotKeys from "react-hot-keys";

import "./Jump.css";

import PhraseCloud from "./PhraseCloud";
import VideoPane from "./VideoPane";

import format from "date-fns/format";

import getInstructors from "../../db/getInstructors";
import getAircraft from "../../db/getAircraft";
import getStudent from "../../db/getStudent";
import getJumps from "../../db/getJumps";
import saveStudent from "../../db/saveStudent";
import saveJump from "../../db/saveJump";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const Jump = ({ match, history }) => {
  const [student, setStudent] = useState(null);
  const [jump, setJump] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [phraseCloudKey, setPhraseCloudKey] = useState("exit");

  const fetchData = async () => {
    const student = await getStudent(match.params.studentId);
    setStudent(student);
    const jumps = await getJumps(student);
    setJump(jumps.find(jump => jump._id === match.params.jumpId));
    const instructors = await getInstructors();
    setInstructors(instructors);
    const aircraft = await getAircraft();
    setAircraft(aircraft);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!student || !jump) {
    return null;
  }

  const setAttribute = event => {
    let { id, value } = event.target;
    const numericValues = [
      "diveFlow",
      "jumpNumber",
      "exitAltitude",
      "deploymentAltitude",
      "freefallTime"
    ];
    if (numericValues.includes(id)) {
      value = Number(value);
    }
    const modifiedJump = { ...jump };
    modifiedJump[id] = value;
    modifiedJump.freefallTime = Math.ceil(
      ((modifiedJump.exitAltitude - modifiedJump.deploymentAltitude) / 1000) *
        5.5
    );
    setJump(modifiedJump);
  };

  const handleLabelClick = e => {
    if (e.key && e.key.toLowerCase() !== "enter") return true;
    const labelFor = e.target.attributes.for.value.replace(/-hidden$/, "");
    setPhraseCloudKey(labelFor);
    document.querySelector("#PhraseCloud").classList.toggle("hidden");
    return true;
  };

  const _save = async e => {
    if (e) {
      // document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const res = await saveJump(jump);
    if (res.error) {
      flash({ error: res.error });
      return handleFormError(res.error);
    }
    flash({
      success: `${jump._deleted ? "Deleted" : "Saved"} ${student.name} - Jump ${
        jump.number
      } DF ${jump.diveFlow}`
    });
    return res;
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const deleteJump = async e => {
    e.preventDefault();
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return false;
    }
    student.jumps.splice(student.jumps.indexOf(jump._id), 1);
    const res = await saveStudent(student);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Deleted jump ${jump._id}` });
    history.goBack(1);
    jump._deleted = true;
    _save();
  };

  const onKeyUp = (keyName, e, handle) => {
    e.stopPropagation();
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    switch (true) {
      case keyName === "ctrl+d":
        const deleteJumpButton = document.getElementById("d");
        deleteJumpButton.focus();
        deleteJumpButton.click();
        break;
      case keyName === "esc":
        document.querySelector("#PhraseCloud").classList.add("hidden");
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
    return false;
  };

  document.title = `STP: ${student.name} DF-${jump.diveFlow}`;

  return (
    <React.Fragment>
      <HotKeys keyName={"ctrl+s,ctrl+d,esc"} onKeyUp={onKeyUp}>
        <div className="Jump">
          <form onSubmit={_save}>
            <fieldset>
              <legend>{`${student.name} - Jump ${jump.number} Dive Flow ${
                jump.diveFlow
              }`}</legend>
              <div className="jump-details">
                <div>
                  <div className="input-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={format(jump.date, "YYYY-MM-DD")}
                      onChange={setAttribute}
                      className="formField required"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="instructor">Instructor</label>
                    <select
                      id="instructor"
                      value={jump.instructor}
                      onChange={setAttribute}
                      className="formField required"
                      required
                    >
                      <InstructorOptions
                        instructors={instructors}
                        instructor={jump.instructor}
                      />
                    </select>
                  </div>
                </div>
                <div>
                  <div className="input-group">
                    <label htmlFor="number">Jump #</label>
                    <input
                      type="number"
                      id="number"
                      value={jump.number}
                      onChange={setAttribute}
                      className="formField required"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="diveFlow">Dive Flow</label>
                    <input
                      type="number"
                      id="diveFlow"
                      value={jump.diveFlow}
                      onChange={setAttribute}
                      className="formField required"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="input-group">
                    <label htmlFor="exitAltitude">Exit</label>
                    <select
                      value={jump.exitAltitude}
                      id="exitAltitude"
                      onChange={setAttribute}
                      className="formField required"
                      required
                    >
                      <ExitAltitudeOptions />
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="deploymentAltitude">Pull</label>
                    <select
                      value={jump.deploymentAltitude}
                      id="deploymentAltitude"
                      onChange={setAttribute}
                      className="formField required"
                      required
                    >
                      <DeploymentAltitudeOptions />
                    </select>
                  </div>
                </div>
                <div>
                  <div className="input-group">
                    <label htmlFor="aircraft">Aircraft</label>
                    <select
                      value={jump.aircraft}
                      id="aircraft"
                      onChange={setAttribute}
                      className="formField required"
                      required
                    >
                      <option value="" />
                      <AircraftOptions
                        aircraft={aircraft}
                        selectedAircraft={jump.aircraft}
                      />
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="freefallTime">FF Time</label>
                    <input
                      id="freefallTime"
                      value={`${jump.freefallTime} seconds`}
                      onChange={setAttribute}
                      className="formField required"
                      required
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label
                  onClick={handleLabelClick}
                  onKeyDown={handleLabelClick}
                  tabIndex={0}
                  htmlFor="exit"
                >
                  Exit
                </label>
                <textarea
                  id="exit"
                  value={jump.exit}
                  onChange={setAttribute}
                  className="formField required"
                  required
                />
              </div>
              <div className="input-group">
                <label
                  onClick={handleLabelClick}
                  onKeyDown={handleLabelClick}
                  tabIndex={0}
                  htmlFor="freefall"
                >
                  Freefall
                </label>
                <textarea
                  id="freefall"
                  value={jump.freefall}
                  onChange={setAttribute}
                  className="formField required"
                  required
                />
              </div>
              <div className="input-group">
                <label
                  onClick={handleLabelClick}
                  onKeyDown={handleLabelClick}
                  tabIndex={0}
                  htmlFor="canopy"
                >
                  Canopy
                </label>
                <textarea
                  id="canopy"
                  value={jump.canopy}
                  onChange={setAttribute}
                  className="formField required"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={jump.notes}
                  onChange={setAttribute}
                  className="formField"
                />
              </div>
              <input type="submit" style={{ display: "none" }} tabIndex={-1} />
              <button id="s" className="hotkey-button" onClick={_save}>
                Save Jump
              </button>
              <button
                id="d"
                className={`hotkey-button ${
                  deleteConfirmation ? "warning" : null
                }`}
                onClick={deleteJump}
              >
                Delete Jump
              </button>
            </fieldset>
          </form>
        </div>
      </HotKeys>
      <VideoPane studentId={student._id} _jump={{ ...jump }} />
      <PhraseCloud
        setAttribute={setAttribute}
        phraseCloudKey={phraseCloudKey}
        jump={jump}
      />
    </React.Fragment>
  );
};

export default Jump;

const InstructorOptions = ({ instructors, instructor }) => {
  if (instructors.map(i => i.name).indexOf(instructor) < 0)
    instructors.push({ name: instructor });
  return instructors.map((instructor, i) => (
    <option key={i} value={instructor.name}>
      {instructor.name}
    </option>
  ));
};

const AircraftOptions = ({ aircraft, selectedAircraft }) => {
  if (aircraft.map(a => a.name).indexOf(selectedAircraft) < 0)
    aircraft.push({ name: selectedAircraft });
  return aircraft.map((aircraft, i) => (
    <option key={i} value={aircraft.name}>
      {aircraft.name}
    </option>
  ));
};
const ExitAltitudeOptions = () => {
  const altitudes = [];
  for (let x = 5000; x <= 17000; x += 500) {
    altitudes.push(x);
  }
  return altitudes.reverse().map(x => (
    <option key={x} value={x}>
      {x.toString().replace(/(\d{3}$)/, ",$1")}
    </option>
  ));
};

const DeploymentAltitudeOptions = () => {
  const altitudes = [];
  for (let x = 3000; x <= 17000; x += 500) {
    altitudes.push(x);
  }
  return altitudes.reverse().map(x => (
    <option key={x} value={x}>
      {x.toString().replace(/(\d{3}$)/, ",$1")}
    </option>
  ));
};
