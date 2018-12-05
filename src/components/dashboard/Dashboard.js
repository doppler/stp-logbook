import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import Header from "../Header";
import ManageSection from "./ManageSection";
import DatabaseSettingsSection from "./DatabaseSettingsSection";
import AboutSection from "./AboutSection";
import FakeDataSection from "./FakeDataSection";
import "./Dashboard.css";

store.deleteConfirmation = false;

const Dashboard = ({ history }) => {
  const onKeyDown = (keyName, e, handle) => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  document.title = "STP: Dashboard";

  return (
    <React.Fragment>
      <Header />
      <HotKeys keyName="ctrl+s" onKeyDown={onKeyDown}>
        <div className="Dashboard Content">
          <nav>
            <button
              className="hotkey-button"
              id="s"
              onClick={() => history.push("/students")}
            >
              Students
            </button>
          </nav>
          <DatabaseSettingsSection />
          <ManageSection history={history} />
          <AboutSection />
          <FakeDataSection history={history} />
        </div>
      </HotKeys>
    </React.Fragment>
  );
};

export default collect(Dashboard);
