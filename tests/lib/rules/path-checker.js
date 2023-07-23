/**
 * @fileoverview fsd relative paths
 * @author rustam
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
});
ruleTester.run("path-checker", rule, {
  valid: [
    // {
    //   filename:
    //     "D:\\Work\\react-tests\\react-ts-production\\src\\features\\AuthByUserName\\model\\slice\\loginSlice.ts",
    //   code: "import { LoginReducer } from '../AuthByUserName/model/slice/loginSlice';",
    // },
  ],

  invalid: [
    {
      filename:
        "D:\\Work\\react-tests\\react-ts-production\\src\\features\\AuthByUserName\\model\\slice\\loginSlice.ts",
      code: "import { LoginReducer } from '@/features/AuthByUserName/model/slice/loginSlice';",
      errors: [
        {
          message: "В рамках одного слайса все пути должны быть относительными",
        },
      ],
      options: [{ alias: "@" }],
    },
    // {
    //   filename:
    //     "D:\\Work\\react-tests\\react-ts-production\\src\\features\\AuthByUserName\\model\\slice\\loginSlice.ts",
    //   code: "import { LoginReducer } from 'features/AuthByUserName/model/slice/loginSlice';",
    //   errors: [
    //     {
    //       message: "В рамках одного слайса все пути должны быть относительными",
    //     },
    //   ],
    // },
  ],
});
