const express = require("express");
const path = require("path");

const app = express();

const PORT = 4000;

app.get("/api", (req, res) => res.json({ hello: "dook" }));

app.get("/api/students", (req, res) => {
  res.sendFile(path.join(__dirname, "db", "students.json"), {
    headers: { "Content-Type": "application/json" }
  });
});

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
