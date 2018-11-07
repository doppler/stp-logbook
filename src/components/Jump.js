import React, { useState, useEffect } from "react";
import "./Jump.css";

import Header from "./Header";
import Footer from "./Footer";

import getStudent from "../api/getStudent";

export default props => {
  const [student, setStudent] = useState();
  const [jump, setJump] = useState();

  useEffect(
    async () => {
      const { studentId, jumpNumber } = props.match.params;
      const json = await getStudent(studentId);
      setStudent(json);
      setJump(json.jumps.find(jump => (jump.number = Number(jumpNumber))));
    },
    [setStudent, setJump]
  );

  if (!student || !jump) return null;
  return (
    <>
      <Header title={student.name} />
      <div className="Jump">
        <h1>Jump {jump.number}</h1>
      </div>
      <Footer />
    </>
  );
};
