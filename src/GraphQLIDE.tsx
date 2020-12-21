import React from "react";
import { MonacoProvider } from "use-monaco";
import { bw } from "@beamwind/play";
import "./lib/global.styles";
import { MutableSnapshot, RecoilRoot } from "recoil";
import * as ide from "./lib/ide";
import * as SaveAtom from "./lib/fs";

import { Toolbar, tooltip } from "./components/Toolbar";
import type { SchemaConfig } from "use-monaco/dist/types/src/plugins/graphql/typings";
import lightTheme from "./lib/monaco.theme";
import * as graphqlLanguageConfig from "./lib/graphql.config";
import { ASTViewer } from "./panels/ASTViewer";
import { Explorer } from "./panels/Explorer";
import { ResultsEditor } from "./panels/ResultsEditor";
import { SchemaEditor } from "./panels/SchemaEditor";
import { VariablesEditor } from "./panels/VariablesEditor";
import { HeadersEditor } from "./panels/HeadersEditor";
import { QueryEditor } from "./panels/QueryEditor";
import { PanelConfigProvider, Panels } from "./components/Panels";
import { useAtom } from "./lib/ide";
import Tooltip from "@reach/tooltip";
import { Close, Logo } from "./components/Icons";

export const DEFAULT_PANELS = {
  editor: QueryEditor,
  variables: VariablesEditor,
  response: ResultsEditor,
  schema: SchemaEditor,
  explorer: Explorer,
  ast: ASTViewer,
  headers: HeadersEditor,
};

export function IDEProvider({
  panels,
  initializeState,
  initialSchemaConfig,
  children,
}) {
  return (
    <RecoilRoot
      initializeState={(snapshot) => {
        snapshot.set(SaveAtom.persistedFiles, { "/browser.json": true });
        const currentTab = snapshot.getLoadable(ide.currentTab)
          .contents as string;

        const oldConfig = snapshot.getLoadable(
          ide.getTabSchemaConfig(currentTab)
        ).contents;

        if (initialSchemaConfig && !(oldConfig as SchemaConfig).uri?.length) {
          snapshot.set(ide.getTabSchemaConfig(currentTab), initialSchemaConfig);
        }

        initializeState?.(snapshot, ide);
      }}
    >
      <PanelConfigProvider panels={panels}>
        <MonacoProvider
          theme={lightTheme}
          plugins={{
            prettier: ["graphql", "json"],
            "magiql-ide": (monaco) => {
              return monaco.languages.register({
                id: "graphql",
                worker: {
                  label: "graphql",
                  options: {
                    languageConfig: {
                      schemaConfig: initialSchemaConfig,
                    },
                  },
                  src:
                    monaco.worker.baseWorkerPath + "graphql.monaco.worker.js",
                  providers: {
                    hover: true,
                    completionItem: true,
                    diagnostics: true,
                  },
                },
                extensions: [".graphql", ".gql"],
                aliases: ["graphql"],
                mimetypes: ["application/graphql", "text/graphql"],
                loader: async () => graphqlLanguageConfig as any,
              });
            },
          }}
        >
          <SaveAtom.Persist />
          {children}
        </MonacoProvider>
      </PanelConfigProvider>
    </RecoilRoot>
  );
}

const Tabs = () => {
  const [tabs, setTabs] = useAtom(ide.tabs);
  const [currentTab, setCurrentTab] = useAtom(ide.currentTab);

  return (
    <div className={bw`flex flex-row gap-2 pl-3 z-9`}>
      <Tooltip className={bw`${tooltip}`} label="MagiQL IDE">
        <div className={bw`self-center`}>
          <Logo
            className={bw`${`text-graphql-pink`} hover:(mb-0.5 scale-110) h-5.5 w-5.5 group-hover:(mb-0.5 scale-110) cursor-pointer transition-all mb-0`}
          />
        </div>
      </Tooltip>
      <div
        className={bw`grid ${`grid-cols-${Math.max(
          tabs.length,
          8
        )}`} gap-2 ml-2 flex-1`}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => {
              setCurrentTab(tab);
            }}
            className={bw`flex-1 group cursor-pointer justify-between pr-2 font-graphql flex flex-row items-center relative text-sm ${{
              "bg-blueGray-50 text-blueGray-700 max-w-36 z-10":
                currentTab === tab,
              "bg-blueGray-200  text-blueGray-500 max-w-36 z-9 hover:(bg-blueGray-100)":
                currentTab !== tab,
            }} pl-4 py-1.5 rounded-t-lg`}
          >
            <div
              className={bw`absolute left-0 z-8 top-0 w-3 -translate-x-1 translate-y-2 rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200 group-hover:(bg-blueGray-100)":
                  currentTab !== tab,
              }}`}
            ></div>
            <div className={bw`flex-1 truncate select-none`}>{tab}</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setTabs((old) => old.filter((t) => t !== tab));
              }}
              className={bw`px-1 py-1 hover:(bg-blueGray-200) rounded-full relative z-20`}
            >
              <Close
                className={bw`h-3.5 w-3.5 ${{
                  "text-blueGray-700": currentTab === tab,
                  "text-blueGray-400 group-hover:(bg-transparent)":
                    currentTab !== tab,
                }}`}
              />
            </div>
            <div
              className={bw`absolute right-0 z-8 top-0 w-3 translate-x-1 translate-y-2 -rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200  group-hover:(bg-blueGray-100)":
                  currentTab !== tab,
              }}`}
            ></div>
          </div>
        ))}
        {tabs.length < 8 && (
          <div className={bw`flex flex-row px-1 py-1`}>
            <div
              onClick={() => {
                setTabs((old) => {
                  for (var i = 1; i < 100; i++) {
                    if (!old.includes(`query${i}`)) {
                      return [...old, `query${i}`];
                    }
                  }
                });
              }}
              className={bw`px-2 rounded-full text-blueGray-500 text-xl cursor-pointer transition-all hover:(bg-blueGray-200)`}
            >
              +
            </div>
          </div>
        )}
      </div>
      <div className={bw`px-1 py-1`}>
        <div
          onClick={() => {
            setTabs((old) => {
              for (var i = 1; i < 100; i++) {
                if (!old.includes(`query${i}`)) {
                  return [...old, `query${i}`];
                }
              }
            });
          }}
          className={bw`px-2 rounded-full ${{
            "text-blueGray-500": tabs.length >= 8,
            "text-blueGray-300": tabs.length < 8,
          }} text-xl cursor-pointer transition-all hover:(bg-blueGray-200)`}
        >
          +
        </div>
      </div>
    </div>
  );
};

export function GraphQLIDE({
  initializeState,
  initialSchemaConfig,
}: {
  initialSchemaConfig: SchemaConfig;
  initializeState?: (snapshot: MutableSnapshot, atoms: typeof ide) => void;
}) {
  return (
    <IDEProvider
      initializeState={initializeState}
      initialSchemaConfig={initialSchemaConfig}
      panels={DEFAULT_PANELS}
    >
      <div
        className={bw`h-screen w-screen pt-1 gap-2 bg-blueGray-300 w-full flex flex-col`}
      >
        <div className={bw`px-3 relative`}>
          <Tabs />
          <Toolbar />
        </div>
        <div
          className={bw`flex-1 w-full px-3 pb-3 flex flex-row overflow-hidden`}
        >
          <Panels />
        </div>
      </div>
    </IDEProvider>
  );
}

export default GraphQLIDE;
