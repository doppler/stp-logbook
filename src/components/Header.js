import React from "react";
import { store, collect } from "react-recollect";
import { Link } from "react-router-dom";

import "./Header.css";

const Header = props => {
  const { match, title } = props;
  const { filter } = store;
  return (
    <div className="Header">
      <div className="Nav">
        {match.path === "/student/:studentId/jump/:jumpNumber" ? (
          <button>
            <Link to={`/student/${match.params.studentId}`}>Jumps</Link>
          </button>
        ) : match.path !== "/" ? (
          <button>
            <Link to="/">Home</Link>
          </button>
        ) : null}
      </div>
      <div className="Title">
        <h1>{title || "Students"}</h1>
      </div>
      <div className="Actions" />
    </div>
  );
};

export default collect(Header);
