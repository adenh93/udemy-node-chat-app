require("dotenv").config();
const path = require("path");
const express = require("express");

const publicDir = path.join(__dirname, "../public");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicDir));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
