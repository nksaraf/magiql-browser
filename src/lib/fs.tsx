import { atom, useAtom } from "./atom";
import React from "react";
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
