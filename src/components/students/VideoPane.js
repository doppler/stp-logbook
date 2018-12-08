import React, { useState } from "react";
import format from "date-fns/format";
import Dropzone from "react-dropzone";
import saveJump from "../../db/saveJump";
import flash from "../../utils/flash";

const VideoPane = ({ student, jump }) => {
  const videoUrl = jump.videoFilename
    ? `/api/videos/${student._id}/${jump.videoFilename}`
    : null;
  return (
    <div className="VideoPane">
      {videoUrl ? (
        <Displayer videoUrl={videoUrl} jump={jump} />
      ) : (
        <Uploader student={student} jump={jump} />
      )}
    </div>
  );
};

export default VideoPane;

const Uploader = ({ student, jump }) => {
  const [progress, setProgress] = useState(null);

  const handleDrop = async acceptedFiles => {
    console.log(acceptedFiles);

    const videoFilename =
      [
        "Jump",
        jump.number,
        "DF",
        jump.diveFlow,
        format(jump.date, "YYYY-MM-DD"),
        Number(acceptedFiles[0].size).toString(16) // cache buster
      ].join(" ") + ".mp4";

    const data = new FormData();
    data.append("file", acceptedFiles[0]);
    data.append("video_filename", videoFilename);

    console.log(acceptedFiles);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/videos/${student._id}`);
    xhr.onload = async () => {
      const xres = JSON.parse(xhr.responseText);
      jump.videoFilename = videoFilename;
      const res = await saveJump(jump);
      if (res.error) flash({ error: res.error });
      else {
        flash({ success: `Saved ${jump.videoFilename}` });
      }
    };
    xhr.onerror = err => console.error(err);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };
    xhr.send(data);
  };

  if (progress) return <ProgressBar progress={progress} />;
  return (
    <Dropzone onDrop={handleDrop} accept="video/*">
      Drag Video File Here
    </Dropzone>
  );
};

const Displayer = ({ videoUrl, jump }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleDeleteClick = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return null;
    }
    const vres = await fetch(videoUrl, { method: "DELETE" });
    const json = await vres.json();
    if (json.error) {
      console.error(json.error);
      flash({ error: json.error });
      return false;
    } else {
      delete jump.videoFilename;
      const res = await saveJump(jump);
      if (res.error) flash({ error: res.error });
      else {
        flash({ success: `Removed ${videoUrl}` });
      }
    }
  };
  return (
    <div className="Displayer">
      <video controls>
        <source src={encodeURI(videoUrl)} type="video/mp4" />
      </video>
      <div className="delete">
        <button
          onClick={handleDeleteClick}
          className={deleteConfirmation ? "warning" : "null"}
        >
          Delete Video
        </button>
      </div>
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <div className="ProgressText">Uploading: {progress}%</div>
    <div className="Progress" style={{ width: `${progress}%` }} />
  </div>
);
