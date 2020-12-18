import React from "react";
import { MonacoProvider } from "use-monaco";
import { bw } from "@beamwind/play";
import "./lib/styles";
import { MutableSnapshot, RecoilRoot } from "recoil";
import * as ide from "./lib/ide";

import { Toolbar } from "./components/Toolbar";
import { SchemaConfig } from "use-monaco/dist/types/src/plugins/graphql/typings";
import lightTheme from "./components/editor/theme";
import * as config from "./components/editor/graphql.config";
import { ASTViewer } from "./panels/ASTViewer";
import { Explorer } from "./panels/Explorer";
import { ResultsEditor } from "./panels/ResultsEditor";
import { SchemaEditor } from "./panels/SchemaEditor";
import { VariablesEditor } from "./panels/VariablesEditor";
import { HeadersEditor } from "./panels/HeadersEditor";
import { QueryEditor } from "./panels/QueryEditor";
import { PanelConfigProvider, Panels } from "./components/Panels";

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
  schemaConfig,
  children,
}) {
  return (
    <RecoilRoot
      initializeState={(snapshot) => {
        snapshot.set(ide.persistedFiles, { "/browser.json": true });
        if (schemaConfig) {
          snapshot.set(
            ide.getTabSchemaConfig(
              snapshot.getLoadable(ide.currentTab).contents as string
            ),
            schemaConfig
          );
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
                      schemaConfig: schemaConfig,
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
                loader: async () => config as any,
              });
            },
          }}
        >
          <ide.Persist />
          {children}
        </MonacoProvider>
      </PanelConfigProvider>
    </RecoilRoot>
  );
}

export function GraphQLIDE({
  initializeState,
  schemaConfig,
}: {
  schemaConfig: SchemaConfig;
  initializeState?: (snapshot: MutableSnapshot, atoms: typeof ide) => void;
}) {
  return (
    <IDEProvider
      initializeState={initializeState}
      schemaConfig={schemaConfig}
      panels={DEFAULT_PANELS}
    >
      <div
        className={bw`h-screen w-screen pt-3 gap-2 bg-blueGray-300 w-full flex flex-col`}
      >
        <div className={bw`px-3`}>
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
