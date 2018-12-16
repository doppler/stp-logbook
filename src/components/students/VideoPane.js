import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
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
  faVolumeUp,
  faClock
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

VideoPane.propTypes = {
  studentId: PropTypes.string.isRequired,
  _jump: PropTypes.object.isRequired
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

Uploader.propTypes = {
  handleDrop: PropTypes.func.isRequired,
  progress: PropTypes.number
};

const currentTimeToMinutesAndSeconds = currentTime => {
  let minutes = parseInt((currentTime / 60) % 60, 10);
  let seconds = parseInt(currentTime % 60, 10);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
};

const Displayer = ({ videoUrl, handleDeleteClick, deleteConfirmation }) => {
  const videoEl = useRef(document.createElement("video"));
  const displayerEl = useRef(document.createElement("div"));
  // window.displayerEl = displayerEl; //TODO remove
  const vid = videoEl.current;
  // window.vid = vid; //TODO remove
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
    vid.currentTime -= 1;
  };

  const seekBackward = () => {
    vid.currentTime -= 1 / 30;
  };

  const togglePlayback = () => {
    return playback === "paused" ? playVideo() : pauseVideo();
  };

  const seekForward = () => {
    vid.currentTime += 1 / 30;
  };

  const fastForward = () => {
    vid.currentTime += 1;
  };

  const handleScrubberChange = event => {
    vid.currentTime = event.target.value;
    setCurrentSeekTime(event.target.value);
  };

  const [audioMuted, setAudioMuted] = useState(true);
  const toggleAudioMuted = () => {
    vid.muted = !audioMuted;
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
    return displayerEl.current.classList.contains("fullscreen")
      ? document.exitFullscreen()
      : displayerEl.current.requestFullscreen();
  };
  displayerEl.current.onfullscreenchange = () => {
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
    toggleFullscreen: "ctrl+f",
    toggleAudioMuted: "ctrl+m"
  };

  const handlers = {
    fastBackward: () => fastBackward(),
    seekBackward: () => seekBackward(),
    togglePlayback: event => {
      event.preventDefault();
      togglePlayback();
    },
    seekForward: () => seekForward(),
    fastForward: () => fastForward(),
    decreasePlaybackRate: event => {
      event.preventDefault();
      decreasePlaybackRate();
    },
    increasePlaybackRate: event => {
      event.preventDefault();
      increasePlaybackRate();
    },
    toggleFullscreen: () => toggleFullscreen(),
    toggleAudioMuted: () => toggleAudioMuted()
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="Displayer" ref={displayerEl} tabIndex={0}>
        <div className="Video">
          <video id="jumpvid" ref={videoEl} muted>
            <source src={encodeURI(videoUrl)} type="video/mp4" />
          </video>
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
                <FontAwesomeIcon
                  icon={audioMuted ? faVolumeMute : faVolumeUp}
                  onClick={toggleAudioMuted}
                  title="Toggle Audio Mute [ctrl-m]"
                />
                <input
                  type="range"
                  onChange={changeVolume}
                  min={0}
                  max={1}
                  step={0.01}
                  value={audioMuted ? 0 : volume}
                  tooltip={
                    audioMuted
                      ? "Audio Muted"
                      : `Volume: ${Math.round(volume * 100)}%`
                  }
                />
              </div>
              <div className="rate">
                <FontAwesomeIcon
                  icon={faClock}
                  title="Playback Speed [up/down]"
                />
                <input
                  type="range"
                  onChange={changePlaybackRate}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  value={playbackRate}
                  tooltip={`Speed: ${Math.round(playbackRate * 100)}%`}
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
            <div className="section scrubber">
              {`${currentTimeToMinutesAndSeconds(currentSeekTime)}`}
              <input
                type="range"
                min={0}
                max={vid.duration || 1}
                step={0.001}
                value={currentSeekTime}
                onChange={handleScrubberChange}
              />
            </div>
            <div className="delete">
              <button
                onClick={handleDeleteClick}
                className={`small ${deleteConfirmation ? "warning" : ""}`}
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </HotKeys>
  );
};

Displayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  deleteConfirmation: PropTypes.bool.isRequired
};

const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <div className="ProgressText">Uploading: {progress}%</div>
    <div className="Progress" style={{ width: `${progress}%` }} />
  </div>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};
