import React from "react";
import { store, collect } from "react-recollect";
import { Link } from "react-router-dom";

import "./Header.css";

const handleFilterChange = e => {
  const filter = e.target.value.toLowerCase();
  store.filteredStudents = store.students.filter(obj =>
    obj.name.toLowerCase().match(filter)
  );
  store.filter = e.target.value;
};

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
          <button style={{ display: "block" }}>
            <Link to="/">Home</Link>
          </button>
        ) : match.path === "/" ? (
          <input
            onChange={handleFilterChange}
            value={filter}
            placeholder="Filter by name"
          />
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
