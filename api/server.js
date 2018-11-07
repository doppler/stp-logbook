const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const studentsDb = path.join(__dirname, "db", "students.json");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());

app.get("/api", (req, res) => res.json({ hello: "dook" }));

app.get("/api/students", (req, res) => {
  res.sendFile(studentsDb, {
    headers: { "Content-Type": "application/json" }
  });
});

app.post("/api/students", (req, res) => {
  console.log("req", JSON.stringify(req.body));
  const db = fs.createWriteStream(studentsDb);
  db.write(JSON.stringify(req.body, undefined, 2));
  db.end();
  res.send(req.body);
});

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
