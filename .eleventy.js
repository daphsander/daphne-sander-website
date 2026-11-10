const markdownIt = require("markdown-it");
const fs = require("node:fs");
const path = require("node:path");
const md = markdownIt({ html: false, breaks: true, linkify: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_redirects");

  eleventyConfig.addFilter("filterPublished", function (items) {
    return (items || []).filter((item) => item.published !== false);
  });

  eleventyConfig.addFilter("sortByOrderDescending", function (items) {
    return (items || [])
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const orderA = Number(a.item.data.order);
        const orderB = Number(b.item.data.order);
        const valueA = Number.isFinite(orderA) ? orderA : 0;
        const valueB = Number.isFinite(orderB) ? orderB : 0;
        return valueB - valueA || a.index - b.index;
      })
      .map(({ item }) => item);
  });

  eleventyConfig.addFilter("galleryImages", (items) =>
    (items || []).map((item) => {
      const image = item.image;
      return {
        src: image && typeof image === "object" ? image.src : image,
        orientation: item.orientation || "portrait",
        caption: item.caption || item.credit || "",
      };
    })
  );

  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(content || "");
  });

  eleventyConfig.addFilter("zeitechtExcerpt", (inputPath) => {
    const entryPath = path.resolve(inputPath);
    const excerptPath = path.join(
      path.dirname(entryPath),
      `${path.parse(entryPath).name}-auszug.txt`
    );
    if (!fs.existsSync(excerptPath)) return null;

    const text = fs.readFileSync(excerptPath, "utf8");
    const html = text
      .split(/(\r?\n)/)
      .map((line) => {
        if (line === "\n" || line === "\r\n") return line;
        const centered = line.startsWith("[[center]]");
        const content = centered ? line.slice("[[center]]".length) : line;
        const escaped = content.replace(/[&<>]/g, (character) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
        })[character]);
        return centered ? `<span class="auszug-center">${escaped}</span>` : escaped;
      })
      .join("");

    return { text, html };
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
