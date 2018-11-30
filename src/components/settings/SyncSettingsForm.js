import React, { useState, useEffect } from "react";
import flash from "../../utils/flash";

const SyncSettingsForm = () => {
  const [couchDbUrlValue, changeCouchDbUrlValue] = useState("");
  const [changingCouchDbUrlValue, setChangingCouchDbUrlValue] = useState(false);

  useEffect(() => {
    if (!changingCouchDbUrlValue) {
      const dbUrl = localStorage.getItem("stp-logbook:couchDbUrl");
      if (dbUrl) {
        changeCouchDbUrlValue(dbUrl);
      }
    }
  }, []);

  const enableChangeCouchDbUrlValue = e => {
    setChangingCouchDbUrlValue(true);
    const field = document.querySelector("#couchDbUrlValue");
    field.focus();
    field.select();
  };

  const handleChangeCouchDbUrlValue = e => {
    changeCouchDbUrlValue(e.target.value);
  };

  const validCouchDb = async couchDbUrlValue => {
    const res = await fetch(couchDbUrlValue);
    const json = await res.json();
    if (json.db_name) return json.db_name;
    return false;
  };

  const handleSaveCouchDbUrl = async e => {
    e.preventDefault();
    const validDb = await validCouchDb(couchDbUrlValue);
    if (validDb) {
      localStorage.setItem("stp-logbook:couchDbUrl", couchDbUrlValue);
      setChangingCouchDbUrlValue(false);
      flash({ success: `Saved sync to "${validDb}" at ${couchDbUrlValue}` });
    } else {
      flash({ error: `Did not find a CouchDB at ${couchDbUrlValue}` });
    }
  };

  return (
    <div className="SyncSettingsForm">
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <fieldset>
          <legend>Sync to remote CouchDB</legend>
          <input
            id="couchDbUrlValue"
            size={30}
            type="text"
            value={couchDbUrlValue}
            onChange={handleChangeCouchDbUrlValue}
            placeholder="https://example.com:5984/stp-logbook"
            disabled={!changingCouchDbUrlValue}
          />
          {changingCouchDbUrlValue ? (
            <button onClick={handleSaveCouchDbUrl}>Save</button>
          ) : (
            <button onClick={enableChangeCouchDbUrlValue}>Change</button>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default SyncSettingsForm;
