import React, { useState } from "react";
import PropTypes from "prop-types";
import VideoPlayer from "./VideoPlayer";
import format from "date-fns/format";
import saveJump from "../../../db/saveJump";
import flash from "../../../utils/flash";
import useDeleteConfirmation from "../../../utils/useDeleteConfirmation";
import "./VideoPane.css";
import { Uploader } from "./Uploader";

const VideoPane = ({ studentId, _jump }) => {
  const [jump, setJump] = useState(_jump);
  const [progress, setProgress] = useState(null);

  const handleDrop = async acceptedFiles => {
    const videoFilename =
      [
        "Jump",
        jump.number,
        "DF",
        jump.diveFlow,
        format(jump.date, "YYYY-MM-DD"),
        Number(acceptedFiles[0].size).toString(16)
      ].join(" ") + ".mp4";

    const data = new FormData();
    data.append("file", acceptedFiles[0]);
    data.append("video_filename", videoFilename);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/videos/${studentId}`);
    xhr.onload = async () => {
      const updatedJump = { ...jump, videoFilename: videoFilename };
      const res = await saveJump(updatedJump);
      setJump(updatedJump);
      if (res.error) flash({ error: res.error });
      else {
        flash({ success: `Saved ${updatedJump.videoFilename}` });
      }
    };
    xhr.onerror = err => console.error(err); // eslint-disable-line
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };
    xhr.send(data);
  };

  const videoUrl = jump.videoFilename
    ? `/api/videos/${studentId}/${jump.videoFilename}`
    : null;

  const [deleteConfirmation, setDeleteConfirmation] = useDeleteConfirmation();

  const handleDeleteClick = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return null;
    }
    const vres = await fetch(videoUrl, { method: "DELETE" });
    const json = await vres.json();
    if (json.error) {
      console.error(json.error); // eslint-disable-line
      flash({ error: json.error });
      return false;
    } else {
      const updatedJump = { ...jump };
      Reflect.deleteProperty(updatedJump, "videoFilename");
      const res = await saveJump(updatedJump);
      setJump(updatedJump);
      setProgress(null);
      if (res.error) flash({ error: res.error });
      else {
        flash({ success: `Removed ${videoUrl}` });
      }
    }
  };

  return (
    <div className="VideoPane">
      {videoUrl ? (
        <VideoPlayer
          videoUrl={videoUrl}
          handleDeleteClick={handleDeleteClick}
          deleteConfirmation={deleteConfirmation}
        />
      ) : (
        <Uploader handleDrop={handleDrop} progress={progress} />
      )}
    </div>
  );
};

VideoPane.propTypes = {
  studentId: PropTypes.string.isRequired,
  _jump: PropTypes.object.isRequired
};

export default VideoPane;
