import React from "react";
import { store } from "react-recollect";

import "./Header.css";

const Flash = ({ type, message }) => (
  <div className={`flash ${type}`}>{message}</div>
);

export default ({ title, buttons = [] }) => {
  const { type, message } = store.flash;

  return (
    <div className="Header">
      <div className="Nav">{buttons.map((Button, i) => Button)}</div>
      <div className="Title">
        <h1>{title || "Students"}</h1>
      </div>
      <div className="Actions">
        <Flash type={type} message={message} />
      </div>
    </div>
  );
};
