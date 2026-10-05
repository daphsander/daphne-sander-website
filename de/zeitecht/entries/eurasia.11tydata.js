const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  auszug_text: fs.readFileSync(
    path.join(__dirname, "eurasia-auszug.txt"),
    "utf8"
  ),
};
