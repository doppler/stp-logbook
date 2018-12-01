import React, { useState, useEffect } from "react";
import flash from "../../utils/flash";

const VideoStorageSettings = () => {
  const [videoStoragePathValue, changeVideoStoragePathValue] = useState("");
  const [changingStoragePathValue, setChangingStoragePathValue] = useState(
    false
  );

  useEffect(() => {
    if (!changingStoragePathValue) {
      const videoStoragePath = localStorage.getItem(
        "stp-logbook:videoStoragePath"
      );
      if (videoStoragePath) {
        changeVideoStoragePathValue(videoStoragePath);
      }
    }
  }, []);

  const enableChangeVideoPathValue = e => {
    setChangingStoragePathValue(true);
  };

  const handleChangeVideoPathValue = e => {
    changeVideoStoragePathValue(e.target.value);
  };

  const validVideoStoragePathValue = async videoStoragePathValue => {
    return true;
  };

  const handleSaveVideoPathValue = async e => {
    e.preventDefault();
    const validVideoStoragePath = await validVideoStoragePathValue(
      videoStoragePathValue
    );
    if (validVideoStoragePath) {
      localStorage.setItem(
        "stp-logbook:videoStoragePath",
        videoStoragePathValue
      );
      setChangingStoragePathValue(false);
      flash({ success: `Saved video storage path ${videoStoragePathValue}` });
    } else {
      flash({ error: `Invalid video storage path ${videoStoragePathValue}` });
    }
  };
  return (
    <section>
      <details open>
        <summary>Video Storage</summary>
        <div className="Form">
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <fieldset>
              <legend>Video Storage Path</legend>
              <input
                id="videoSettingsPath"
                value={videoStoragePathValue}
                onChange={handleChangeVideoPathValue}
                placeholder={"C:\\Path\\To\\Video\\Folder"}
                disabled={!changingStoragePathValue}
              />
              {changingStoragePathValue ? (
                <button onClick={handleSaveVideoPathValue}>Save</button>
              ) : (
                <button onClick={enableChangeVideoPathValue}>Change</button>
              )}
            </fieldset>
          </form>
        </div>
      </details>
    </section>
  );
};

export default VideoStorageSettings;
