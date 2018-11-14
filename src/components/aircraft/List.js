import React, { useState } from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import getAircraft from "./api/getAircraft";

const List = ({ history }) => {
  const { aircraft } = store;

  if (aircraft.length === 0)
    (async () => {
      const aircraft = await getAircraft();
      store.aircraft = aircraft;
    })();

  const handleRowClick = aircraft => {
    history.push(`/aircraft/${aircraft.id}`);
  };

  const addAircraft = () => {
    history.push("/aircraft/new");
  };

  const [activeRow, setActiveRow] = useState(0);
  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        setActiveRow(activeRow + 1);
        break;
      case ["up", "k"].includes(keyName):
        setActiveRow(activeRow - 1);
        break;
      case ["enter", "right"].includes(keyName):
        history.push(`/aircraft/${aircraft[activeRow].id}`);
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  const rowCount = aircraft.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

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
                className={i === activeRow ? "active" : ""}
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
