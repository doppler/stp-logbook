import React, { useState, useEffect } from "react";
import saveStudent from "../api/saveStudent";
import format from "date-fns/format";
import "./Jump.css";

import Header from "./Header";
import Footer from "./Footer";

import getStudent from "../api/getStudent";

const initialJumpState = {
  number: 0,
  diveFlow: 0,
  date: "",
  instructor: "",
  aircraft: "",
  exitAltitude: 14000,
  deploymentAltitude: 5000,
  freefallTime: ""
};

export default props => {
  const [student, setStudent] = useState();
  const [jump, setJump] = useState(initialJumpState);

  useEffect(
    async () => {
      const { studentId, jumpNumber } = props.match.params;
      const json = await getStudent(studentId);
      setStudent(json);
      setJump(json.jumps.find(jump => jump.number === Number(jumpNumber)));
    },
    [setStudent, setJump]
  );

  const setAttribute = event => {
    const { id, value } = event.target;
    jump[id] = value;
    jump.freefallTime = Math.ceil(
      ((jump.exitAltitude - jump.deploymentAltitude) / 1000) * 5.5
    );
    setJump(jump);
  };

  const saveJump = async event => {
    event.preventDefault();
    const json = await saveStudent(student);
    props.history.push(`/student/${json.id}`);
  };

  if (!student || !jump) return null;
  return (
    <>
      <Header title={student.name} />
      <div className="Jump">
        <form onSubmit={saveJump}>
          <div className="input-group">
            <label htmlFor="number">Dive Flow</label>
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
              onChange={setAttribute}
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
            <input
              id="instructor"
              value={jump.instructor}
              onChange={setAttribute}
            />
          </div>
          <div className="input-group">
            <label htmlFor="aircraft">Aircraft</label>
            <select value={jump.aircraft} id="aircraft" onChange={setAttribute}>
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
            <label htmlFor="deploymentAltitude">Deployment Altitude</label>
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
              value={jump.freefallTime}
              onChange={setAttribute}
              disabled={true}
            />
            <span className="append">Seconds</span>
          </div>
          <button>Save Jump</button>
        </form>
      </div>
      <Footer />
    </>
  );
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
