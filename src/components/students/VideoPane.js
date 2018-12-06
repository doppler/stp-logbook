import React, { useState } from "react";
import format from "date-fns/format";
import Dropzone from "react-dropzone";

const VideoPane = ({ student, jump }) => {
  const videoUrl = jump.videoFilename
    ? `/api/videos/${student._id}/${jump.videoFilename}`
    : null;
  return (
    <div className="VideoPane">
      {videoUrl ? (
        <Displayer videoUrl />
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
    const videoFilename = `Jump ${jump.number} DF ${jump.diveFlow} ${format(
      jump.date,
      "YYYY-MM-DD"
    )}.mp4`;

    const data = new FormData();
    data.append("file", acceptedFiles[0]);
    data.append("video_filename", videoFilename);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/videos/${student._id}`);
    xhr.onload = () => console.log(xhr.status, JSON.parse(xhr.responseText));
    xhr.onerror = err => console.error(err);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
        console.log(percent);
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

const Displayer = ({ videoUrl }) => {
  return (
    <div className="Displayer">
      <video src={videoUrl} controls />
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <div className="ProgressText">Uploading: {progress}%</div>
    <div className="Progress" style={{ width: `${progress}%` }} />
  </div>
);
