require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/api/videos", (req, res) => {
  fs.readdir(process.env.STP_VIDEO_STORAGE_PATH, (err, items) => {
    if (err) {
      res.send({ error: err });
      return false;
    }
    const output = items.map(item => item);
    res.send(output);
  });
});

app.get("/api/videos/:student_name", (req, res) => {
  const { student_name } = req.params;
  fs.readdir(
    path.join(process.env.STP_VIDEO_STORAGE_PATH, student_name),
    (err, items) => {
      if (err) {
        res.send({ error: err });
        return false;
      }
      const output = items.map(item => item);
      res.send(output);
    }
  );
});

app.get("/api/videos/:student_id/:video_filename", (req, res) => {
  const { student_id, video_filename } = req.params;
  const options = {}; // { acceptRanges: false }
  res.sendFile(
    path.join(process.env.STP_VIDEO_STORAGE_PATH, student_id, video_filename),
    options,
    err => {
      if (err) console.error(err.code);
    }
  );
});

const getStudentVideoDir = student_id =>
  path.join(process.env.STP_VIDEO_STORAGE_PATH, student_id);

app.post("/api/videos/:student_id", (req, res) => {
  const { student_id } = req.params;
  const { video_filename } = req.body;
  const studentVideoDir = getStudentVideoDir(student_id);

  if (!fs.existsSync(studentVideoDir)) {
    fs.mkdirSync(studentVideoDir);
  }
  const studentVideoPath = path.join(studentVideoDir, video_filename);
  req.files.file.mv(studentVideoPath);
  res.send({
    ok: true,
    url: `/api/videos/${student_id}/${video_filename}`
  });
});

app.delete("/api/videos/:student_id/:video_filename", (req, res) => {
  const { student_id, video_filename } = req.params;
  const videoPath = path.join(getStudentVideoDir(student_id), video_filename);
  console.debug(`removing ${videoPath}`);
  fs.unlink(videoPath, err => {
    if (err) {
      console.error(err);
      res.json({ error: `Couuld not delete ${err.path}. (${err.code})` });
      return false;
    }
    res.json({ success: `Deleted ${videoPath}` });
    return true;
  });
});

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
