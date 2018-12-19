import React from "react";
import PropTypes from "prop-types";
import HotKeys from "react-hot-keys";
import Header from "../Header";
import ManageSection from "./ManageSection";
import DatabaseSettingsSection from "./DatabaseSettingsSection";
import AboutSection from "./AboutSection";
import FakeDataSection from "./FakeDataSection";
import "./Dashboard.css";

const Dashboard = ({ history }) => {
  const onKeyDown = keyName => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  document.title = "STP: Dashboard";

  return (
    <>
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
    </>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired
};

export default Dashboard;
