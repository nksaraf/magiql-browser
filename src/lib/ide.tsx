import { atom, useAtom } from "./atom";
import { GraphQLSchema, buildASTSchema, parse } from "graphql";
import React from "react";
import type { SchemaConfig } from "monaco-graphql";

function localStorageAtom({
  key,
  defaultValue,
  parse = (s) => s,
  serialize = (s) => s,
}) {
  const val =
    typeof window === "undefined"
      ? defaultValue
      : parse(localStorage.getItem(key)) ?? defaultValue;

  const atomic = atom(val);

  function Store() {
    const [val, setQuery] = useAtom(atomic);

    React.useEffect(() => {
      localStorage.setItem(key, serialize(val));
    }, [val]);
    return null;
  }
  return [atomic, Store] as const;
}

function jsonLocalStorageAtom({ key, defaultValue }) {
  return localStorageAtom({
    key,
    defaultValue,
    parse: (val) => {
      if (val === undefined) {
        return defaultValue;
      }
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultValue;
      }
    },
    serialize: (val) => {
      return JSON.stringify(val, null, 2);
    },
  });
}

const schemaConfig = atom<SchemaConfig | null>(null);

const [queryText, SaveQuery] = localStorageAtom({
  key: "use-monaco:query.graphql",
  defaultValue: "",
});

// const [schemaText, SaveSchemaText] = localStorageAtom({
//   key: "use-moanco:schema.graphql",
//   defaultValue: null,
// });

const schemaText = atom<string | null>(null);

const [variablesText, SaveVariables] = localStorageAtom({
  key: "use-monaco:variables.json",
  defaultValue: "",
});

const [panels, SavePanels] = jsonLocalStorageAtom({
  key: "magiql-ide:panels",
  defaultValue: [["explorer"], ["editor", "variables"], ["response"]],
});

const [horizontalRatio, SaveHorizontalRatio] = jsonLocalStorageAtom({
  key: "magiql-ide:horizontal_ratio",
  defaultValue: `35fr 10px 30fr 10px 35fr`,
});

const [verticalRatio, SaveVerticalRatio] = jsonLocalStorageAtom({
  key: "magiql-ide:vertical_ratio",
  defaultValue: [`35fr 10px 30fr 10px 35fr`, `75fr 10px 25fr`, ``],
});

export function Persist() {
  return (
    <>
      <SaveVerticalRatio />
      <SaveHorizontalRatio />
      <SaveQuery />
      {/* <SaveSchemaText /> */}
      <SaveVariables />
      <SavePanels />
    </>
  );
}

export const ide = {
  queryText,
  variablesText,
  schemaText,
  horizontalRatio,
  verticalRatio,
  Persist,
  schemaConfig,
  panels,
  results: atom({}),
  schema: atom<GraphQLSchema | null>((get) => {
    const text = get(schemaText);
    if (text) {
      try {
        return buildASTSchema(parse(text));
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }),
};
