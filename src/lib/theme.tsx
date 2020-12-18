import { setup, theme } from "@beamwind/play";
import { colors } from "./colors";

const { black, white, ...other } = colors;

let color = {
  black,
  white,
};

Object.keys(other).forEach((k) => {
  Object.keys(other[k]).forEach((v) => {
    color[k + "-" + v] = other[k][v];
  });
});

setup({
  plugins: {
    indent: "ml-4",
  },
  theme: {
    extend: {
      colors: {
        "graphql-field": "#1F61A0",
        "graphql-keyword": "#B11A04",
        "graphql-opname": "#D2054E",
        "graphql-typename": "#CA9800",
        "graphql-argname": "#8B2BB9",
        "graphql-variable": "#397D13",
        "graphql-punctuation": "#6B7280",
        "graphql-number": "#2882F9",
        "graphql-string": "#D64292",
        "graphql-boolean": "#D47509",
        "graphql-enum": "#0B7FC7",
        "graphql-alias": "#1C92A9",
        ...color,
      },
      fontFamily: {
        graphql: "Rubik",
      },
      spacing: {
        "0.25": "1px",
        "0.75": "1.5px",
        "9px": "9px",
      },
    },
  },
});
const defaultColors = {
  keyword: "#B11A04",
  // OperationName, FragmentName
  def: "#D2054E",
  // FieldName
  property: "#1F61A0",
  // FieldAlias
  qualifier: "#1C92A9",
  // ArgumentName and ObjectFieldName
  attribute: "#8B2BB9",
  number: "#2882F9",
  string: "#D64292",
  // Boolean
  builtin: "#D47509",
  // Enum
  string2: "#0B7FC7",
  variable: "#397D13",
  // Type
  atom: "#CA9800",
};
