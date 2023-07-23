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
    fixable: null, // Or `code` or `whitespace`
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
          context.report(
            node,
            "В рамках одного слайса все пути должны быть относительными"
          );
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

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split("src")[1];
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
