"use strict";
const path = require("path");
const isPathRelative = require("../helpers").isPathRelative;
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "fsd relative paths",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
        },
      },
    ],
  },

  create(context) {
    const alias = context.options[0].alias || "";
    return {
      ImportDeclaration(node) {
        // app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, "") : value;

        // full path to file C:\Users\user\Documents\GitHub\fsd_study\app\entities\Article.js
        const fromFilename = context.getFilename();

        if (shoudBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            message:
              "В рамках одного слайса все пути должны быть относительными",
            fix: (fixer) => {
              const normalizedPath = path
                .toNamespacedPath(fromFilename)
                .split("/")
                .slice(0, -1)
                .join("/");

              let relativePath = path
                .relative(normalizedPath, `${importTo}`)
                .split("\\")
                .join("/");
              if (!relativePath.startsWith(".")) {
                relativePath = `./${relativePath}`;
              }
              return fixer.replaceText(node.source, `'${relativePath}'`);
            },
          });
        }
      },
    };
  },
};

const layers = {
  entities: "entities",
  features: "feaures",
  widgets: "widgets",
  shared: "shared",
  pages: "pages",
};

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split("src")[1];
  return projectFrom.split("\\").slice(1).join("/");
}

// function isPathRelative(path) {
//   return path === "." || path.startsWith("./") || path.startsWith("../");
// }

function shoudBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }
  // entities/Article
  const toArray = to.split("/");
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split("\\");

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;

  // full path to file C:\Users\user\Documents\GitHub\fsd_study\app\entities\Article.js
}

// console.log(
//   shoudBeRelative(
//     "C:\\Users\\user\\Documents\\GitHub\\fsd_study\\app\\entities\\Article.js"
//   )
// );
