import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import Header from "./Header";
import Footer from "./Footer";

import createTestData from "../utils/createTestData";

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
          <section>
            <details>
              <summary>Fake Data For Testing</summary>
              <table>
                <caption>Current Data</caption>
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aircraft</td>
                    <td>
                      {
                        JSON.parse(localStorage.getItem("stp-logbook:aircraft"))
                          .length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Instructors</td>
                    <td>
                      {localStorage.getItem("stp-logbook:instructors")
                        ? JSON.parse(
                            localStorage.getItem("stp-logbook:instructors")
                          ).length
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>Students</td>
                    <td>
                      {localStorage.getItem("stp-logbook:students")
                        ? JSON.parse(
                            localStorage.getItem("stp-logbook:students")
                          ).length
                        : 0}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button onClick={createTestData}>Create Test Data</button>
            </details>
          </section>
        </div>
      </HotKeys>
      <Footer />
    </React.Fragment>
  );
};

export default collect(Home);
