import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";

import getSingleAircraft from "./api/getSingleAircraft";
import saveAircraft from "./api/saveAircraft";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";

const initialState = {
  _id: Math.round(Math.random() * 2 ** 32).toString(16),
  type: "aircraft",
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
    (!currentAircraft || currentAircraft._id !== match.params.id)
  ) {
    (async () =>
      (store.currentAircraft = await getSingleAircraft(match.params.id)))();
  }

  if (!currentAircraft) return false;

  const save = async e => {
    // if (e) {
    //   document.querySelector("input[type='submit']").click();
    //   e.preventDefault();
    // }
    e.preventDefault();
    removeErrorClass();
    const res = await saveAircraft(currentAircraft);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    delete store.aircraft;
    flash({ success: `Saved ${currentAircraft.name}` });
    history.push("/aircraft");
  };

  const reallyDeleteAircraft = async () => {
    currentAircraft._deleted = true;
    const res = await saveAircraft(currentAircraft);
    if (res.error) return flash(res);
    delete store.aircraft;
    flash({ success: `Deleted ${currentAircraft.name}` });
    history.push("/aircraft");
  };

  const deleteAircraft = e => {
    e.preventDefault();
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

  return (
    <HotKeys keyName="ctrl+s,ctrl+d" onKeyDown={onKeyDown}>
      <div className="Content">
        <form onSubmit={save}>
          <fieldset>
            <legend>
              Editing{" "}
              {currentAircraft.name
                ? currentAircraft.name
                : `New Aircraft (id:${currentAircraft._id})`}
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
            <button id="s" onClick={save} className="hotkey-button">
              Save Aircraft
            </button>
            <button
              id="d"
              onClick={deleteAircraft}
              className={`hotkey-button ${
                store.deleteConfirmation ? "warning" : null
              }`}
            >
              Delete Aircraft
            </button>
          </fieldset>
        </form>
      </div>
    </HotKeys>
  );
};

export default collect(Edit);
