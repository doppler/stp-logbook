import React from "react";

import "./Header.css";

export default ({ title, buttons = [] }) => {
  return (
    <div className="Header">
      <div className="Nav">{buttons.map((Button, i) => Button)}</div>
      <div className="Title">
        <h1>{title || "Students"}</h1>
      </div>
      <div className="Actions" />
    </div>
  );
};
