import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

const Home = ({ history }) => {
  const onKeyDown = (keyName, e, handle) => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      {
        id: "l",
        onClick: () => history.push("/students"),
        children: "Log Book"
      },
      {
        id: "i",
        onClick: () => history.push("/instructors"),
        children: "Instructors"
      },
      {
        id: "a",
        onClick: () => history.push("/aircraft"),
        children: "Aircraft"
      }
    ];

  return (
    <HotKeys keyName="ctrl+l,ctrl+i,ctrl+a" onKeyDown={onKeyDown}>
      <div className="Content">
        <h1>Home</h1>
      </div>
    </HotKeys>
  );
};

export default collect(Home);
