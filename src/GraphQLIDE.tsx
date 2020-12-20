import React from "react";
import { MonacoProvider } from "use-monaco";
import { bw } from "@beamwind/play";
import "./lib/global.styles";
import { MutableSnapshot, RecoilRoot } from "recoil";
import * as ide from "./lib/ide";
import * as SaveAtom from "./lib/fs";

import { Toolbar } from "./components/Toolbar";
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
