/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
export var conf = {
  comments: {
    lineComment: "#",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"""', close: '"""', notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string", "comment"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"""', close: '"""' },
    { open: '"', close: '"' },
  ],
  folding: {
    offSide: true,
  },
};
export var language = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",
  tokenPostfix: ".gql",
  keywords: [
    "query",
    "mutation",
    "subscription",
    "fragment",

    "extend",
    "schema",
    "directive",
    "scalar",
    "interface",
    "union",
    "enum",
    "input",
    "implements",
    "on",
    "null",
  ],
  booleans: ["true", "false"],
  typeKeywords: ["Int", "Float", "String", "Boolean", "ID"],
  directiveLocations: [
    "SCHEMA",
    "SCALAR",
    "OBJECT",
    "FIELD_DEFINITION",
    "ARGUMENT_DEFINITION",
    "INTERFACE",
    "UNION",
    "ENUM",
    "ENUM_VALUE",
    "INPUT_OBJECT",
    "INPUT_FIELD_DEFINITION",
    "QUERY",
    "MUTATION",
    "SUBSCRIPTION",
    "FIELD",
    "FRAGMENT_DEFINITION",
    "FRAGMENT_SPREAD",
    "INLINE_FRAGMENT",
    "VARIABLE_DEFINITION",
  ],
  operators: ["=", "!", "?", ":", "&", "|"],
  // we include these common regular expressions
  symbols: /[=!?:&|]+/,
  // https://facebook.github.io/graphql/draft/#sec-String-Value
  escapes: /\\(?:["\\\/bfnrt]|u[0-9A-Fa-f]{4})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identify typed input variables
      //   [/query|fragment|mutation/]
      [
        /[$][\w$]*:/,
        // [{
        //     cases: {
        //         '@keywords': 'keyword',
        //         '@default': 'argument.identifier',
        //     },
        // },
        "variable.parameter",
      ],
      [
        /(query|fragment|subscription|mutation)(\s*[\w\$]*)/,
        ["keyword", "entity"],
      ],
      [/(?:\.\.\.)\s*[\w\$]*/, "entity"],
      [
        /(type|union|enum|input|interface|scalar)(\s*[A-Z][\w\$]*)/,
        ["keyword", "type.identifier"],
      ],
      [/[$][\w$]*/, "variable"],
      [/[a-z_][\w$]*:/, "attribute.name"],
      // fields and argument names
      [
        /[a-z_][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@booleans": "constant.language",
            "@default": "key.identifier",
          },
        },
      ],

      // to show class names nicely
      //   [/[A-Z][\w\$]*/, 'keyword.type'],
      //   [/[A-Z\_]+/, 'constant.enum'],
      [/[A-Z][\w\$]*/, "type.identifier"],

      // whitespace
      { include: "@whitespace" },
      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [
        /@\s*[a-zA-Z_\$][\w\$]*/,
        { token: "annotation", log: "annotation token: $0" },
      ],
      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],
      [/"""/, { token: "string", next: "@mlstring", nextEmbedded: "markdown" }],
      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
    ],
    mlstring: [
      [/[^"]+/, "string"],
      ['"""', { token: "string", next: "@pop", nextEmbedded: "@pop" }],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/#.*$/, "comment"],
    ],
  },
};
