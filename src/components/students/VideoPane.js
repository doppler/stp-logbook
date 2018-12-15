import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HotKeys } from "react-hotkeys";
import {
  faPlay,
  faPause,
  faStepForward,
  faFastForward,
  faStepBackward,
  faFastBackward,
  faExpand,
  faCompress,
  faVolumeMute,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import Dropzone from "react-dropzone";
import saveJump from "../../db/saveJump";
import flash from "../../utils/flash";
import useDeleteConfirmation from "../../utils/useDeleteConfirmation";
import "./VideoPane.css";

const VideoPane = ({ studentId, _jump }) => {
  const [jump, setJump] = useState(_jump);
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
    xhr.onerror = err => console.error(err);
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
      console.error(json.error);
      flash({ error: json.error });
      return false;
    } else {
      const updatedJump = { ...jump };
      delete updatedJump.videoFilename;
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
        <Displayer
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

export default VideoPane;

const Uploader = ({ handleDrop, progress }) => {
  if (progress) return <ProgressBar progress={progress} />;
  return (
    <Dropzone onDrop={handleDrop} accept="video/*">
      Drag Video File Here
    </Dropzone>
  );
};

const Displayer = ({ videoUrl, handleDeleteClick, deleteConfirmation }) => {
  const videoEl = useRef(document.createElement("video"));
  const displayerEl = useRef(document.createElement("div"));
  window.displayerEl = displayerEl; //TODO remove
  const vid = videoEl.current;
  window.vid = vid; //TODO remove
  const currentTime = vid.currentTime;

  const [currentSeekTime, setCurrentSeekTime] = useState(currentTime);

  vid.onseeking = () => setCurrentSeekTime(currentTime);
  vid.ontimeupdate = () => setCurrentSeekTime(currentTime);

  const [playback, setPlayback] = useState("paused");

  vid.onplay = () => setPlayback("playing");
  vid.onpause = () => setPlayback("paused");

  const playVideo = () => vid.play();
  const pauseVideo = () => vid.pause();

  const [playbackRate, setPlaybackRate] = useState(1.0);
  vid.playbackRate = Number(playbackRate).toFixed(1);

  const changePlaybackRate = event => {
    setPlaybackRate(event.target.value);
  };

  const decreasePlaybackRate = () => {
    const newPlaybackRate = (vid.playbackRate - 0.1).toFixed(1);
    if (newPlaybackRate < 0.1) return false;
    setPlaybackRate(newPlaybackRate);
  };

  const increasePlaybackRate = () => {
    const newPlaybackRate = (vid.playbackRate + 0.1).toFixed(1);
    if (newPlaybackRate > 2.0) return false;
    setPlaybackRate(newPlaybackRate);
  };

  const fastBackward = () => {
    vid.currentTime = vid.currentTime - 1;
  };

  const seekBackward = () => {
    vid.currentTime = vid.currentTime - 1 / 30;
  };

  const togglePlayback = () => {
    return playback === "paused" ? playVideo() : pauseVideo();
  };

  const seekForward = () => {
    vid.currentTime = vid.currentTime + 1 / 30;
  };

  const fastForward = () => {
    vid.currentTime = vid.currentTime + 1;
  };

  const [audioMuted, setAudioMuted] = useState(true);
  const toggleAudioMuted = () => {
    vid.muted = !audioMuted;
    // vid.volume = vid.muted ? 0 : volume;
    setAudioMuted(vid.muted);
  };
  const [volume, setVolume] = useState(0);
  const changeVolume = event => {
    vid.volume = event.target.value;
    setVolume(vid.volume);
  };
  vid.onvolumechange = () => setVolume(vid.volume);

  const [isFullscreen, toggleIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    displayerEl.current.classList.contains("fullscreen")
      ? document.exitFullscreen()
      : displayerEl.current.requestFullscreen();
  };
  displayerEl.current.onfullscreenchange = event => {
    displayerEl.current.classList.toggle("fullscreen");
    toggleIsFullscreen(!isFullscreen);
  };
  const keyMap = {
    fastBackward: "shift+left",
    seekBackward: "left",
    togglePlayback: "space",
    seekForward: "right",
    fastForward: "shift+right",
    decreasePlaybackRate: "down",
    increasePlaybackRate: "up",
    toggleFullscreen: "ctrl+f"
  };

  const handlers = {
    fastBackward: event => fastBackward(),
    seekBackward: event => seekBackward(),
    togglePlayback: event => {
      event.preventDefault();
      togglePlayback();
    },
    seekForward: event => seekForward(),
    fastForward: event => fastForward(),
    decreasePlaybackRate: event => {
      event.preventDefault();
      decreasePlaybackRate();
    },
    increasePlaybackRate: event => {
      event.preventDefault();
      increasePlaybackRate();
    },
    toggleFullscreen: event => toggleFullscreen()
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="Displayer" ref={displayerEl} tabIndex={0}>
        <div className="VideoController">
          <div className="controls section">
            <div className="playback">
              <FontAwesomeIcon
                icon={faFastBackward}
                onClick={fastBackward}
                title="Seek Backward 1 sec [shift+left]"
              />
              <FontAwesomeIcon
                icon={faStepBackward}
                onClick={seekBackward}
                title="Seek Backward 1/30 sec [left]"
              />
              {playback === "paused" ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  onClick={playVideo}
                  title="Play/Pause [space]"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPause}
                  onClick={pauseVideo}
                  title="Play/Pause [space]"
                />
              )}

              <FontAwesomeIcon
                icon={faStepForward}
                onClick={seekForward}
                title="Seek Forward 1/30 sec [right]"
              />
              <FontAwesomeIcon
                icon={faFastForward}
                onClick={fastForward}
                title="Seek Forward 1 sec [shift+right]"
              />
            </div>
            <div className="volume">
              <input
                type="range"
                onChange={changeVolume}
                min={0}
                max={1}
                step={0.1}
                value={volume}
              />
              <FontAwesomeIcon
                icon={audioMuted ? faVolumeMute : faVolumeUp}
                onClick={toggleAudioMuted}
                title="Toggle Audio Mute [ctrl-m]"
              />
            </div>
            <div className="fullscreen">
              <FontAwesomeIcon
                icon={isFullscreen ? faCompress : faExpand}
                onClick={toggleFullscreen}
                title="Toggle Fullscreen [ctrl+f]"
              />
            </div>
          </div>
          <div className="playbackRate section">
            <label>Playback Rate {`${Math.round(playbackRate * 100)}%`}</label>
            <div className="control">
              <input
                type="range"
                onChange={changePlaybackRate}
                min={0.1}
                max={2.0}
                step={0.1}
                value={playbackRate}
                list="tickmarks"
              />
              <datalist id="tickmarks">
                {Array.from(Array(20)).map((_, i) => (
                  <option key={i} value={(i + 1) / 10} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="section">Playback Position: {currentSeekTime}</div>
          <div className="delete">
            <button
              onClick={handleDeleteClick}
              className={`small ${deleteConfirmation ? "warning" : ""}`}
            >
              Delete Video
            </button>
          </div>
        </div>
        <div className="">
          <video id="jumpvid" ref={videoEl} controls muted>
            <source src={encodeURI(videoUrl)} type="video/mp4" />
          </video>
        </div>
        <div />
      </div>
    </HotKeys>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <div className="ProgressText">Uploading: {progress}%</div>
    <div className="Progress" style={{ width: `${progress}%` }} />
  </div>
);
