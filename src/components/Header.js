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
  return (
    <React.Fragment>
      <nav className="Header">
        {buttons.map((button, i) => {
          const { children } = button;
          return (
            <Button key={i} {...button}>
              {children}
            </Button>
          );
        })}
      </nav>
      <Messages />
    </React.Fragment>
  );
};

export default Header;

const Messages = () => {
  const { type, message } = store.flash;
  return (
    <div className="Messages">
      <Flash type={type} message={message} />
    </div>
  );
};
