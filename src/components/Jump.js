import React, { useState } from "react";
import { store, collect } from "react-recollect";

import Header from "./Header";
import Footer from "./Footer";
import "./Jump.css";

import format from "date-fns/format";

import saveStudent from "../api/saveStudent";

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

  const saveJump = async event => {
    event.preventDefault();
    const json = await saveStudent(student);
    props.history.push(`/student/${json.id}`);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const reallyDeleteJump = async () => {
    student.jumps = student.jumps.filter(obj => obj.number !== jump.number);
    const json = await saveStudent(student);
    props.history.push(`/student/${json.id}`);
  };
  const deleteJump = async event => {
    event.preventDefault();
    if (deleteConfirmation) return reallyDeleteJump();
    setDeleteConfirmation(true);
  };

  if (!student || !jump) return null;
  return (
    <React.Fragment>
      <Header title={student.name} match={match} />
      <div className="Content">
        <form onSubmit={saveJump}>
          <fieldset>
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
          <fieldset>
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
              <textarea id="notes" value={jump.notes} onChange={setAttribute} />
            </div>
          </fieldset>
          <input type="submit" style={{ display: "hidden" }} />
        </form>
      </div>
      <Footer
        match={match}
        buttons={
          <FooterButtons
            saveJump={saveJump}
            deleteJump={deleteJump}
            deleteConfirmation={deleteConfirmation}
          />
        }
      />
    </React.Fragment>
  );
});

const FooterButtons = ({ saveJump, deleteJump, deleteConfirmation }) => {
  return (
    <React.Fragment>
      <button onClick={saveJump}>Save Jump</button>
      <button
        onClick={deleteJump}
        className={`${deleteConfirmation ? "pending" : null}`}
      >
        Delete Jump
      </button>
    </React.Fragment>
  );
};

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
