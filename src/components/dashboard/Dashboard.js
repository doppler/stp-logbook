import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";
import Header from "../Header";
import ManageSection from "./ManageSection";
import DatabaseSettingsSection from "./DatabaseSettingsSection";
import AboutSection from "./AboutSection";
import FakeDataSection from "./FakeDataSection";
import "./Dashboard.css";

const Dashboard = () => {
  const history = useHistory();
  useEffect(() => {
    document.title = "STP: Dashboard";
  }, []);

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
