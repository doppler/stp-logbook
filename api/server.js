const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use(express.static(path.join(__dirname, "..", "build")));

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
