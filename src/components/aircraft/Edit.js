import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getAircraft from "./api/getAircraft";
import getSingleAircraft from "./api/getSingleAircraft";
import save from "./api/saveAircraft";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  id: Math.round(Math.random() * 2 ** 32).toString(16),
  name: "",
  tailNumber: ""
};

store.currentAircraft = null;

const Edit = ({ match, history }) => {
  const { currentAircraft } = store;

  if (!currentAircraft && match.path === "/aircraft/new")
    store.currentAircraft = initialState;

  if (
    match.path === "/aircraft/:id" &&
    (!currentAircraft || currentAircraft.id !== match.params.id)
  ) {
    (async () =>
      (store.currentAircraft = await getSingleAircraft(match.params.id)))();
  }

  if (!currentAircraft) return false;

  const saveAircraft = async e => {
    if (e) {
      document.querySelector("input[type='submit']").click();
      e.preventDefault();
    }
    removeErrorClass();
    const res = await save(currentAircraft);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${currentAircraft.name}` });
    document.location.pathname = "/aircraft";
  };

  const reallyDeleteAircraft = async () => {
    const aircraft = await getAircraft();
    const newAircraft = aircraft.filter(o => o.id !== currentAircraft.id);
    localStorage.setItem("stp-logbook:aircraft", JSON.stringify(newAircraft));
    flash({ success: `Deleted ${currentAircraft.name}` });
    history.push("/aircraft");
  };

  const deleteAircraft = () => {
    if (store.deleteConfirmation) return reallyDeleteAircraft();
    document.getElementById("d").focus();
    store.deleteConfirmation = true;
  };

  const setAttribute = event => {
    const { id, value } = event.target;
    switch (id) {
      default:
        currentAircraft[id] = value;
        break;
    }
  };

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      { id: "b", onClick: () => history.goBack(1), children: "Back" },
      { id: "s", onClick: saveAircraft, children: "Save Aircraft" }
    ];
  if (match.params.id && !store.headerButtons.find(o => o.id === "d")) {
    store.headerButtons.push({
      id: "d",
      onClick: deleteAircraft,
      children: "Delete Aircraft"
    });
  }
  return (
    <HotKeys keyName="ctrl+b,ctrl+s,ctrl+d" onKeyDown={onKeyDown}>
      <div className="Content">
        <form onSubmit={saveAircraft}>
          <fieldset>
            <legend>
              Editing{" "}
              {currentAircraft.name
                ? currentAircraft.name
                : `New Aircraft (id:${currentAircraft.id})`}
            </legend>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                onChange={setAttribute}
                value={currentAircraft.name}
                placeholder="Full Name"
                className="formField required"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Tail Number</label>
              <input
                id="tailNumber"
                onChange={setAttribute}
                value={currentAircraft.tailNumber}
                placeholder="N 1234Z"
                className="formField required"
                required
              />
            </div>
          </fieldset>
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
    </HotKeys>
  );
};

export default collect(Edit);
