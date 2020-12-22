import { atom, atomFamily } from "./atom";
import { GraphQLSchema, buildASTSchema, parse } from "graphql";
import type { SchemaConfig } from "monaco-graphql";
import * as fs from "./fs";

export * from "./fs";
export * from "./atom";

export const getTabVariablesFile = (tab: string) =>
  fs.getFile("/" + tab + "/variables.json", {
    persist: true,
    defaultValue: "",
  });

export const getTabHeadersFile = (tab: string) =>
  fs.getFile("/" + tab + "/headers.json", {
    persist: true,
    defaultValue: "{}",
  });

export const getTabResults = atomFamily((path) => ({}));

export const getTabQueryFile = (tab: string) =>
  fs.getFile("/" + tab + "/query.graphql", {
    persist: true,
    defaultValue: "",
  });

export const browser = fs.getJSONFile(`/browser.json`, {
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

const GUTTER_WIDTH = 4;

export const getTabSettings = (tab: string) =>
  fs.getJSONFile(`/${tab}/settings.json`, {
    persist: true,
    defaultValue: {
      panels: [["explorer"], ["query", "variables"], ["response"]],
      horizontalRatio: `35fr ${GUTTER_WIDTH}px 30fr ${GUTTER_WIDTH}px 35fr`,
      verticalRatio: [
        `100fr ${GUTTER_WIDTH}px 0fr`,
        `75fr ${GUTTER_WIDTH}px 25fr`,
        `100fr ${GUTTER_WIDTH}px 0fr`,
      ],
      schema: {} as SchemaConfig | null,
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

export const getTabSchemaConfig = atomFamily(
  (tab: string) => (get) => get(getTabSettings(tab)).schema,
  (tab: string) => (get, set, val) => {
    set(getTabSettings(tab), (old) => ({ ...old, schema: val }));
  }
);

export const getTabSchema = (tab: string) =>
  fs.getFile("/" + tab + "/schema.graphql", {
    persist: true,
    defaultValue: "",
  });

export const focusedPanel = atom<string | null>(null);
export const queryStatus = atom("idle");
export const schemaStatus = atom(
  "unavailable" as "unavailable" | "loading" | "error" | "success" | "stale"
);

export const lastEditedBy = atom<string | null>(null);
