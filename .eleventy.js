const markdownIt = require("markdown-it");
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

  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(content || "");
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
