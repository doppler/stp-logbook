import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";
import Header from "../Header";
import ManageSection from "./ManageSection";
import DatabaseSettingsSection from "./DatabaseSettingsSection";
import AboutSection from "./AboutSection";
import FakeDataSection from "./FakeDataSection";
import "./Dashboard.css";

const Dashboard = ({ history }) => {
  useEffect(() => {
    document.title = "STP: Dashboard";
  }, {});

  useEffect(() => document.getElementById("s").focus(), []);

  const handlers = {
    "ctrl+s": () => document.getElementById("s").click()
  };

  return (
    <>
      <Header />
      <div className="Dashboard Content">
        <HotKeys handlers={handlers}>
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
        </HotKeys>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired
};

export default Dashboard;
