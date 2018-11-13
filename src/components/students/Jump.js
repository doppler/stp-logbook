import React, { useState } from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";
import format from "date-fns/format";

import getStudent from "../../api/getStudent";
import save from "../../api/saveStudent";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

import Header from "../Header";
import Footer from "../Footer";
import {
  StudentListButton,
  BackButton,
  SaveJumpButton,
  DeleteJumpButton
} from "../nav-buttons";

const Jump = ({ match, history }) => {
  const { student, instructors } = store;
  let jump = null;

  if (!student) {
    (async () => {
      store.student = await getStudent(match.params.studentId);
    })();
  }
  if (student) {
    jump = student.jumps.find(
      obj => obj.number === Number(match.params.jumpNumber)
    );
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

  const saveJump = async e => {
    console.log(e);
    if (e) {
      document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const res = await save(student, jump);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${student.name}` });
    history.push(`/students/${student.id}`);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
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
  const deleteJump = async () => {
    if (deleteConfirmation) return reallyDeleteJump();
    setDeleteConfirmation(true);
  };

  if (!student || !jump) return null;

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    switch (true) {
      case keyName === "ctrl+d":
        const deleteJumpButton = document.getElementById("d");
        deleteJumpButton.focus();
        deleteJumpButton.click();
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  return (
    <HotKeys keyName={"ctrl+l,ctrl+b,ctrl+s,ctrl+d"} onKeyDown={onKeyDown}>
      <Header
        buttons={[
          StudentListButton({
            key: "l",
            onClick: () => history.push("/students")
          }),
          BackButton({ key: "b", onClick: () => history.goBack(1) }),
          SaveJumpButton({ key: "s", onClick: saveJump }),
          DeleteJumpButton({
            key: "d",
            onClick: deleteJump,
            deleteConfirmation: deleteConfirmation
          })
        ]}
      />
      <div className="Content">
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
                      <option value="Caravan">Caravan</option>
                      <option value="Otter">Otter</option>
                      <option value="King Air">King Air</option>
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
                    <label htmlFor="deploymentAltitude">
                      Deployment Altitude
                    </label>
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
                <label htmlFor="exit">Exit</label>
                <textarea
                  id="exit"
                  value={jump.exit}
                  onChange={setAttribute}
                  className="formField"
                />
              </div>
              <div className="input-group">
                <label htmlFor="freefall">Freefall</label>
                <textarea
                  id="freefall"
                  value={jump.freefall}
                  onChange={setAttribute}
                  className="formField"
                />
              </div>
              <div className="input-group">
                <label htmlFor="canopy">Canopy</label>
                <textarea
                  id="canopy"
                  value={jump.canopy}
                  onChange={setAttribute}
                  className="formField"
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
      <Footer />
    </HotKeys>
  );
};

export default collect(Jump);

const InstructorOptions = ({ instructors, instructor }) => {
  if (instructors.list.indexOf(instructor) < 0)
    instructors.list.push(instructor);
  return instructors.list.map((instructor, i) => (
    <option key={i} value={instructor}>
      {instructor}
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
