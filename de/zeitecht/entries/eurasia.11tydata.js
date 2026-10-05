const fs = require("node:fs");
const path = require("node:path");

const auszug_text = fs.readFileSync(
  path.join(__dirname, "eurasia-auszug.txt"),
  "utf8"
);
const htmlEscape = (text) =>
  text.replace(/[&<>]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  })[character]);
const auszug_html = auszug_text
  .split(/(\r?\n)/)
  .map((line) => {
    if (line === "\n" || line === "\r\n") return line;
    const centered = line.startsWith("[[center]]");
    const text = htmlEscape(centered ? line.slice("[[center]]".length) : line);
    return centered ? `<span class="auszug-center">${text}</span>` : text;
  })
  .join("");

module.exports = {
  auszug_text,
  auszug_html,
};
