import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import Header from "./Header";
import Footer from "./Footer";

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
        id: "s",
        onClick: () => history.push("/students"),
        children: "Students"
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
    <React.Fragment>
      <Header buttons={store.headerButtons} />
      <HotKeys keyName="ctrl+s,ctrl+i,ctrl+a" onKeyDown={onKeyDown}>
        <div className="Content">
          <h1>Home</h1>
        </div>
      </HotKeys>
      <Footer />
    </React.Fragment>
  );
};

export default collect(Home);
