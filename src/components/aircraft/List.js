import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import getAircraft from "./api/getAircraft";

store.activeAircraftRow = 0;

const List = ({ history }) => {
  const { aircraft } = store;
  delete store.currentAircraft;

  if (!aircraft || aircraft.length === 0) {
    (async () => {
      const aircraft = await getAircraft();
      store.aircraft = aircraft;
    })();
    return null;
  }

  const handleRowClick = aircraft => {
    history.push(`/aircraft/${aircraft._id}`);
  };

  const addAircraft = () => {
    history.push("/aircraft/new");
  };

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        store.activeAircraftRow++;
        break;
      case ["up", "k"].includes(keyName):
        store.activeAircraftRow--;
        break;
      case ["enter", "right"].includes(keyName):
        history.push(`/aircraft/${aircraft[store.activeAircraftRow].id}`);
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  const rowCount = aircraft.length;
  if (rowCount > 0 && store.activeAircraftRow === rowCount)
    store.activeAircraftRow = 0;
  if (rowCount > 0 && store.activeAircraftRow === -1)
    store.activeAircraftRow = rowCount - 1;

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "h", onClick: () => history.push("/"), children: "Home" },
      { id: "n", onClick: addAircraft, children: "New aircraft" }
    ];

  return (
    <HotKeys
      keyName="down,j,up,k,enter,right,ctrl+h,ctrl+n"
      onKeyDown={onKeyDown}
    >
      <div className="Content">
        <table id="aircraft">
          <caption>Aircraft</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Tail #</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((aircraft, i) => (
              <tr
                key={i}
                className={i === store.activeAircraftRow ? "active" : ""}
                onClick={() => handleRowClick(aircraft)}
              >
                <td>{aircraft.name}</td>
                <td>{aircraft.tailNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HotKeys>
  );
};

export default collect(List);
