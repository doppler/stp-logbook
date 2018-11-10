import React, { useState } from "react";
import HotKeys from "react-hot-keys";

import { store, collect } from "react-recollect";

import Header from "./Header";
import Footer from "./Footer";

import format from "date-fns/format";

import getStudents from "../api/getStudents";
import saveStudents from "../api/saveStudents";

const HomeButton = ({ key, onClick }) => (
  <button id="homeButton" key={key} onClick={onClick}>
    Home
  </button>
);

const SaveJumpButton = ({ key, onClick }) => (
  <button key={key} onClick={onClick}>
    Save Jump
  </button>
);

const DeleteJumpButton = ({ key, onClick, deleteConfirmation }) => (
  <button
    id="deleteJumpButton"
    key={key}
    onClick={onClick}
    className={`${deleteConfirmation ? "pending" : null}`}
  >
    Delete Jump
  </button>
);

export default collect(props => {
  const { match } = props;
  const { student, instructors } = store;
  let jump = null;

  if (!student) {
    (async () => {
      const res = await fetch("/api/students");
      const json = await res.json();
      store.student = json.find(obj => obj.id === match.params.studentId);
    })();
  }
  if (student) {
    jump = student.jumps.find(
      obj => obj.number === Number(match.params.jumpNumber)
    );
  }

  const numericValues = [
    "diveFlow",
    "jumpNumber",
    "exitAltitude",
    "deploymentAltitude",
    "freefallTime"
  ];
  const setAttribute = event => {
    let { id, value } = event.target;
    if (numericValues.includes(id)) {
      value = Number(value);
    }
    jump[id] = value;
    jump.freefallTime = Math.ceil(
      ((jump.exitAltitude - jump.deploymentAltitude) / 1000) * 5.5
    );
  };

  const saveStudent = async e => {
    if (e) e.preventDefault();
    store.students = await getStudents();
    saveStudents([
      student,
      ...store.students.filter(obj => obj.id !== student.id)
    ]).then(() => props.history.push(`/student/${student.id}`));
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const reallyDeleteJump = async () => {
    student.jumps = student.jumps.filter(obj => obj.number !== jump.number);
    store.students = await getStudents();
    saveStudents([
      student,
      ...store.students.filter(obj => obj.id !== student.id)
    ]).then(() => props.history.push(`/student/${student.id}`));
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
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case keyName === "h":
        props.history.push("/");
        break;
      case keyName === "s":
        saveStudent();
        break;
      case keyName === "d":
        const deleteJumpButton = document.getElementById("deleteJumpButton");
        deleteJumpButton.focus();
        deleteJumpButton.click();
        break;
      default:
        break;
    }
  };

  return (
    <HotKeys keyName={"h,s,d"} onKeyDown={onKeyDown}>
      <Header
        buttons={[
          HomeButton({ key: "h", onClick: () => props.history.push("/") }),
          SaveJumpButton({ key: "s", onClick: saveStudent }),
          DeleteJumpButton({
            key: "d",
            onClick: deleteJump,
            deleteConfirmation: deleteConfirmation
          })
        ]}
      />
      <div className="Content">
        <form onSubmit={saveStudent}>
          <fieldset>
            <legend>{`${student.name} Dive Flow ${jump.diveFlow}`}</legend>
            <fieldset class="inner">
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
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="number">Jump Number</label>
                    <input
                      type="number"
                      id="number"
                      value={jump.number}
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
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="instructor">Instructor</label>
                    <select
                      id="instructor"
                      value={jump.instructor}
                      onChange={setAttribute}
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
                    >
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
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="inner">
              <legend>Freefall / Canopy</legend>
              <div className="input-group">
                <label htmlFor="exit">Exit</label>
                <textarea id="exit" value={jump.exit} onChange={setAttribute} />
              </div>
              <div className="input-group">
                <label htmlFor="freefall">Freefall</label>
                <textarea
                  id="freefall"
                  value={jump.freefall}
                  onChange={setAttribute}
                />
              </div>
              <div className="input-group">
                <label htmlFor="canopy">Canopy</label>
                <textarea
                  id="canopy"
                  value={jump.canopy}
                  onChange={setAttribute}
                />
              </div>
              <div className="input-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={jump.notes}
                  onChange={setAttribute}
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
});

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
  return altitudes.map(x => (
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
  return altitudes.map(x => (
    <option key={x} value={x}>
      {x.toString().replace(/(\d{3}$)/, ",$1")}
    </option>
  ));
};
