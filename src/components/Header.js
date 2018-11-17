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

const Button = props => (
  <button
    id={props.id}
    onClick={props.onClick}
    className={
      props.id === "d" && store.deleteConfirmation
        ? "header-button warning"
        : "header-button"
    }
  >
    {props.children}
  </button>
);

const Header = ({ buttons }) => {
  const { type, message } = store.flash;

  return (
    <div className="Header">
      <div className="Nav">
        {buttons.map((button, i) => {
          const { children } = button;
          return (
            <Button key={i} {...button}>
              {children}
            </Button>
          );
        })}
      </div>
      <div className="Actions" style={{ overflow: "scroll" }}>
        <Flash type={type} message={message} />
      </div>
    </div>
  );
};

export default Header;
