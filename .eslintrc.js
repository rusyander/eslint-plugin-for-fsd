"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
  ],
  rules: {
    "eslint-plugin/prefer-message-ids": "off",
    "eslint-plugin/require-meta-type": "off",
    "no-unused-vars": "warn",
    "eslint-plugin/no-deprecated-report-api": "off",
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
};
