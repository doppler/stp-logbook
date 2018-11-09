import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

export default props => {
  const { match, buttons } = props;
  return (
    <div className="Footer">
      <div className="Nav">
        {match.path === "/" ? (
          <button>
            <Link to="/student/new">Add Student</Link>
          </button>
        ) : match.path === "/student/:studentId" ? (
          <button>
            <Link to={`/student/${match.params.studentId}/edit`}>
              Edit Student
            </Link>
          </button>
        ) : null}
        {buttons}
      </div>
    </div>
  );
};
