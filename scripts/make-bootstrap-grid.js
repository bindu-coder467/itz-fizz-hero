// Builds src/styles/bootstrap-grid-lite.css: ONLY Bootstrap's grid (container / row / col-* / g-* / align-items-*).
// The stock bootstrap-grid.css also ships !important spacing utilities (.py-5, .px-5 ...) that
// silently override Tailwind's utilities of the same name, so we leave those out.
const fs = require("fs");
const postcss = require("postcss");

const src = fs.readFileSync("node_modules/bootstrap/dist/css/bootstrap-grid.css", "utf8");
const keep = /^\.(container(-fluid|-(sm|md|lg|xl|xxl))?|row(-cols-[\w-]+)?|col(-[\w-]+)?|g[xy]?-[\w-]+|align-items-[\w-]+)$/;

const root = postcss.parse(src);
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && rule.parent.name === "keyframes") return;
  const sels = rule.selectors.filter((raw) => {
    const s = raw.replace(/\s*>\s*/g, ">").trim(); // ".row > *" and ".row>*" are the same rule
    if (s === ".row>*" || s === ".row" || s === ":root" || s === "*") return true;
    return keep.test(s);
  });
  if (!sels.length) rule.remove(); else rule.selectors = sels;
});
root.walkAtRules((r) => { if (r.nodes && !r.nodes.length) r.remove(); });
root.walkComments((c) => c.remove());
fs.writeFileSync("src/styles/bootstrap-grid-lite.css", root.toString());
console.log("bytes:", root.toString().length);
