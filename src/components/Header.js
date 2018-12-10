import React from "react";
import { store, collect } from "react-recollect";

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

const Header = () => {
  const { type, message } = store.flash;
  return (
    <div className="Header">
      <Flash type={type} message={message} />
    </div>
  );
};

export default collect(Header);
