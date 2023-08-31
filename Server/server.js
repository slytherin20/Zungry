const dotenv = require("dotenv");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const serverPort = process.env.PORT || 1234;
dotenv.config();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "../dist", "index.html"))
);

app.listen(serverPort, () => {
  console.log("Server running on port", serverPort);
});
