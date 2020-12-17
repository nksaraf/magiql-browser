import { atom, atomFamily, useAtom } from "./atom";
import { GraphQLSchema, buildASTSchema, parse } from "graphql";
import React from "react";
import type { SchemaConfig } from "monaco-graphql";
import { RecoilState } from "recoil";

function SaveAtom({ atom, path, serialize }) {
  const [val] = useAtom(atom);

  React.useEffect(() => {
    localStorage.setItem(prefix + path, serialize(val));
  }, [val]);
  return null;
}

export const prefix = "magiql:/";

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

export const getRawFile = memoize(
  (path: string, { persist = false, defaultValue = "" }: any = {}) => {
    return persist
      ? localStorageAtom(path, { defaultValue })
      : atom(defaultValue);
  }
);

export const getFile = memoize(function <T = string>(
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

export const getJSONFile = function <T>(
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

export const getTabVariablesFile = (tab: string) =>
  getFile("/" + tab + "/variables.json", {
    persist: true,
    defaultValue: "",
  });

export const getTabHeadersFile = (tab: string) =>
  getFile("/" + tab + "/headers.json", {
    persist: true,
    defaultValue: "{}",
  });

export const getTabResults = atomFamily((path) => ({}));

export const getTabQueryFile = (tab: string) =>
  getFile("/" + tab + "/query.graphql", {
    persist: true,
    defaultValue: "",
  });

export const browser = getJSONFile(`/browser.json`, {
  persist: true,
  defaultValue: {
    currentTab: "query1",
    tabs: ["query1"],
  },
});

export const tabs = atom(
  (get) => get(browser).tabs,
  (get, set, val) => {
    set(browser, (old) => ({ ...old, tabs: val }));
  }
);

export const currentTab = atom(
  (get) => get(browser).currentTab,
  (get, set, val) => {
    set(browser, (old) => ({ ...old, currentTab: val }));
  }
);

export const getTabSettings = (tab: string) =>
  getJSONFile(`/${tab}/settings.json`, {
    persist: true,
    defaultValue: {
      panels: [["explorer"], ["editor", "variables"], ["response"]],
      horizontalRatio: `35fr 8px 30fr 8px 35fr`,
      verticalRatio: [`100fr`, `75fr 8px 25fr`, `100fr`],
    },
  });

export const getTabPanels = atomFamily(
  (tab: string) => (get) => get(getTabSettings(tab)).panels,
  (tab: string) => (get, set, val) => {
    set(getTabSettings(tab), (old) => ({ ...old, panels: val }));
  }
);

export const getTabHorizontalRatio = atomFamily(
  (tab: string) => (get) => get(getTabSettings(tab)).horizontalRatio,
  (tab: string) => (get, set, val) => {
    set(getTabSettings(tab), (old) => ({ ...old, horizontalRatio: val }));
  }
);
export const getTabVerticalRatio = atomFamily(
  (tab: string) => (get) => get(getTabSettings(tab)).verticalRatio,
  (tab: string) => (get, set, val) => {
    set(getTabSettings(tab), (old) => ({ ...old, verticalRatio: val }));
  }
);

export const getTabSchemaConfig = (tab: string) =>
  getJSONFile(`/${tab}/schema.config.json`, {
    persist: true,
    defaultValue: {} as SchemaConfig,
  });

export const schemaText = atom<string | null>(null);

export const focused = atom<string | null>(null);
export const queryStatus = atom("idle");

export const lastEditedBy = atom<string | null>(null);
