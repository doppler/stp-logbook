require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());

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

app.get("/api/videos/:student_name/:video_filename", (req, res) => {
  const { student_name, video_filename } = req.params;
  res.sendFile(
    path.join(process.env.STP_VIDEO_STORAGE_PATH, student_name, video_filename)
  );
});

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use(express.static(path.join(__dirname, "..", "build")));

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
