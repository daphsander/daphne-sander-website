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
        credit: item.credit || "",
      };
    })
  );

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
