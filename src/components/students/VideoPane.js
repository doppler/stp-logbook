import React from "react";
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
    xhr.onload = () => console.log(xhr.status, xhr.responseText);
    xhr.onerror = err => console.error(err);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(percent);
      }
    };
    xhr.send(data);
  };

  return (
    <Dropzone onDrop={handleDrop} accept="video/*">
      Drag Video Here
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
