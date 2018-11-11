import React from "react";
import { store } from "react-recollect";

import "./Header.css";

const Flash = ({ type, message }) => {
  let messageList;
  if (typeof message === "object") {
    messageList = (
      <ul>
        {message.map((o, i) => (
          <li key={i}>{o.message}</li>
        ))}
      </ul>
    );
  }
  return <div className={`flash ${type}`}>{messageList || message}</div>;
};

export default ({ title, buttons = [] }) => {
  const { type, message } = store.flash;

  return (
    <div className="Header">
      <div className="Nav">{buttons.map((Button, i) => Button)}</div>
      <div className="Title">
        <h1>{title}</h1>
      </div>
      <div className="Actions" style={{ overflow: "scroll" }}>
        <Flash type={type} message={message} />
      </div>
    </div>
  );
};
