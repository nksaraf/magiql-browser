import { atom, atomFamily, useAtom } from "./atom";
import { GraphQLSchema, buildASTSchema, parse } from "graphql";
import React from "react";
import type { SchemaConfig } from "monaco-graphql";
import { RecoilState } from "recoil";

function SaveAtom({ atom, path, serialize }) {
  const [val, setQuery] = useAtom(atom);

  React.useEffect(() => {
    localStorage.setItem(prefix + path, serialize(val));
  }, [val]);
  return null;
}

const prefix = "magiql:/";

function localStorageAtom(key, { defaultValue }) {
  const val =
    typeof window === "undefined"
      ? null
      : localStorage.getItem(prefix + key) ?? defaultValue;

  const atomic = atom(val);
  return atomic;
}

type Op = (a: string, b?: any) => any;

function memoize<T extends Op>(func: T): T {
  const cache = {};
  const f = (path: string, props) => {
    if (!cache[path]) {
      cache[path] = func(path, props);
    }
    return cache[path];
  };
  f.cache = cache;
  return (f as unknown) as T;
}

export const persistedFiles = atom<{ [key: string]: boolean }>({});

export function Persist() {
  const [files] = useAtom(persistedFiles);

  return (
    <>
      {Object.keys(files).map((file) =>
        files[file] ? (
          <SaveAtom
            path={file}
            atom={getRawFile(file)}
            serialize={(s) => s}
            key={file}
          />
        ) : null
      )}
    </>
  );
}

const getRawFile = memoize(
  (path: string, { persist = false, defaultValue = "" }: any = {}) => {
    return persist
      ? localStorageAtom(path, { defaultValue })
      : atom(defaultValue);
  }
);

const getFile = memoize(function <T = string>(
  path: string,
  {
    persist = true,
    parse = (s) => s,
    serialize = (s) => s,
    defaultValue = ("" as unknown) as T,
  } = {}
): RecoilState<T> {
  console.log("[storage] creating file", path);
  const baseAtom = getRawFile(path, {
    persist,
    defaultValue: serialize(defaultValue),
  });

  return atom(
    (get) => {
      return parse(get(baseAtom));
    },
    (get, set, contents) => {
      persist &&
        set(persistedFiles, (old) =>
          old[path] ? old : { ...old, [path]: true }
        );
      set(baseAtom, serialize(contents));
    }
  );
});

const getJSONFile = function <T>(
  path,
  {
    persist = true,
    defaultValue = ({} as unknown) as T,
  }: { defaultValue: T; persist: boolean }
): RecoilState<T> {
  return getFile<T>(path, {
    persist,
    defaultValue: defaultValue,
    parse: (val) => {
      if (val === undefined) {
        return defaultValue;
      }

      try {
        return JSON.parse(val as any);
      } catch (e) {
        return defaultValue;
      }
    },
    serialize: (val) => {
      return JSON.stringify(val, null, 2);
    },
  });
};

const getTabVariablesFile = (tab: string) =>
  getFile("/" + tab + "/variables.json", {
    persist: true,
    defaultValue: "",
  });

const getTabHeadersFile = (tab: string) =>
  getFile("/" + tab + "/headers.json", {
    persist: true,
    defaultValue: "{}",
  });

const getTabResults = atomFamily((path) => ({}));

const getTabQueryFile = (tab: string) =>
  getFile("/" + tab + "/query.graphql", {
    persist: true,
    defaultValue: "",
  });

const tabs = atom(["query1"]);

const currentTab = atom("query1");

const settings = getJSONFile("/settings.json", {
  persist: true,
  defaultValue: {
    panels: [["explorer"], ["editor", "variables"], ["response"]],
    horizontalRatio: `35fr 8px 30fr 8px 35fr`,
    verticalRatio: [`100fr`, `75fr 8px 25fr`, `100fr`],
  },
});

const panels = atom(
  (get) => get(settings).panels,
  (get, set, val) => {
    set(settings, (old) => ({ ...old, panels: val }));
  }
);

const schemaConfig = atom<SchemaConfig | null>(null);

const schemaText = atom<string | null>(null);

export const ide = {
  getTabVariablesFile,
  getTabQueryFile,
  currentTab,
  persistedFiles,
  getTabResults,
  getJSONFile,
  queryStatus: atom("idle"),
  getFile,
  focused: atom<string | null>(null),
  getTabHeadersFile,
  tabs,
  schemaText,
  horizontalRatio: atom(
    (get) => get(settings).horizontalRatio,
    (get, set, val) => {
      set(settings, (old) => ({ ...old, horizontalRatio: val }));
    }
  ),
  verticalRatio: atom(
    (get) => get(settings).verticalRatio,
    (get, set, val) => {
      set(settings, (old) => ({ ...old, verticalRatio: val }));
    }
  ),
  Persist,
  schemaConfig,
  settings,
  lastEditedBy: atom<string | null>(null),
  panels,
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
