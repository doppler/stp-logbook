import React from "react";
import HotKeys from "react-hot-keys";

import "./Jump.css";

import PhraseCloud from "./PhraseCloud";

import { store, collect } from "react-recollect";
import format from "date-fns/format";

import getInstructors from "../instructors/api/getInstructors";
import getAircraft from "../aircraft/api/getAircraft";
import getStudent from "./api/getStudent";
import save from "./api/saveStudent";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

store.phraseCloudKey = "exit";
store.phraseCloudSelections = { exit: [], freefall: [], canopy: [] };

const Jump = ({ match, history }) => {
  const { student, instructors, aircraft } = store;
  let jump;

  if (!student) {
    (async () => {
      store.student = await getStudent(match.params.studentId);
    })();
    return null;
  } else {
    jump = student.jumps.find(
      obj => obj.number === Number(match.params.jumpNumber)
    );
  }
  if (!jump) return null;

  if (instructors.length === 0) {
    (async () => {
      store.instructors = await getInstructors();
    })();
    return null;
  }

  if (aircraft.length === 0) {
    (async () => {
      store.aircraft = await getAircraft();
    })();
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
    jump[id] = value;
    jump.freefallTime = Math.ceil(
      ((jump.exitAltitude - jump.deploymentAltitude) / 1000) * 5.5
    );
  };

  const handleLabelClick = e => {
    if (e.key && e.key.toLowerCase() !== "enter") return true;
    const labelFor = e.target.attributes.for.value.replace(/-hidden$/, "");
    store.phraseCloudKey = labelFor;
    document.querySelector("#PhraseCloud").classList.toggle("hidden");
    return true;
  };

  const saveJump = async e => {
    if (e) {
      document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const otherJumps = student.jumps.filter(o => o.number !== jump.number);
    const jumps = [jump, ...otherJumps].sort(
      (a, b) => (a.number > b.number ? 1 : -1)
    );
    student.jumps = jumps;
    const res = await save(student, jump);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    store.student = res;
    flash({ success: `Saved ${student.name}` });
  };

  const reallyDeleteJump = async () => {
    student.jumps = student.jumps.filter(obj => obj.number !== jump.number);
    (async () => {
      const res = await save(student);
      if (res.error) {
        flash({ error: "Please check form for errors." });
        return handleFormError(res.error);
      }
      flash({ success: `Saved ${student.name}` });
      history.push(`/students/${student.id}`);
    })();
  };
  const deleteJump = () => {
    if (store.deleteConfirmation) return reallyDeleteJump();
    store.deleteConfirmation = true;
  };

  const onKeyUp = (keyName, e, handle) => {
    e.stopPropagation();
    // if (e.srcElement.type === "submit" && keyName === "enter") {
    //   return e.srcElement.children[0].click();
    // }
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

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      {
        id: "b",
        onClick: () => history.push(`/students/${student.id}`),
        children: "Back"
      },
      { id: "s", onClick: saveJump, children: "Save Jump" },
      {
        id: "d",
        onClick: deleteJump,
        deleteConfirmation: store.deleteConfirmation,
        children: "Delete Jump"
      }
    ];
  return (
    <React.Fragment>
      <HotKeys keyName={"ctrl+l,ctrl+b,ctrl+s,ctrl+d,esc"} onKeyUp={onKeyUp}>
        <div id="Jump" className="Content">
          <form onSubmit={saveJump}>
            <fieldset>
              <legend>{`${student.name} Dive Flow ${jump.diveFlow}`}</legend>
              <fieldset className="inner">
                <legend>Jump Details</legend>
                <div className="jump-details">
                  <div>
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
                    <div className="input-group">
                      <label htmlFor="number">Jump Number</label>
                      <input
                        type="number"
                        id="number"
                        value={jump.number}
                        className="formField required"
                        required
                        disabled
                      />
                    </div>
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
                      <label htmlFor="exitAltitude">Exit Altitude</label>
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
                      <label htmlFor="deploymentAltitude">Pull Altitude</label>
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
                    <div className="input-group">
                      <label htmlFor="freefallTime">Freefall Time</label>
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
              </fieldset>
              <fieldset className="inner">
                <legend>Freefall / Canopy</legend>
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
              </fieldset>
              <input type="submit" style={{ display: "none" }} tabIndex={-1} />
            </fieldset>
          </form>
        </div>
      </HotKeys>
      <PhraseCloud setAttribute={setAttribute} store={store} />
    </React.Fragment>
  );
};

export default collect(Jump);

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
