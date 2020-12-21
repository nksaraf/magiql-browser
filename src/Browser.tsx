import React from "react";
import { bw } from "@beamwind/play";
import "./lib/global.styles";
import "./lib/styles";
import { MutableSnapshot, RecoilRoot } from "recoil";
import * as browser from "./lib/browser";
import * as fs from "./lib/fs";

import { Toolbar } from "./components/Toolbar";
import type { SchemaConfig } from "use-monaco/dist/types/src/plugins/graphql/typings";
import { ASTViewer } from "./panels/ASTViewer";
import { Explorer } from "./panels/Explorer";
import { ResponseEditor } from "./panels/ResponseEditor";
import { SchemaEditor } from "./panels/SchemaEditor";
import { VariablesEditor } from "./panels/VariablesEditor";
import { HeadersEditor } from "./panels/HeadersEditor";
import { QueryEditor } from "./panels/QueryEditor";
import { PanelConfigProvider, Panels } from "./components/Panels";
import { Tabs } from "./components/Tabs";
import { styled } from "./lib/styles";
import { GraphQLMonacoProvider } from "./GraphQLMonacoProvider";
import * as icons from "./components/Icons";
export const DEFAULT_PANELS = {
  query: {
    render: QueryEditor,
    icon: icons.Code,
    title: "Query",
  },
  variables: {
    render: VariablesEditor,
    icon: icons.InputIcon,
    title: "Variables",
  },
  response: {
    render: ResponseEditor,
    icon: icons.Response,
    title: "Response",
  },
  schema: {
    render: SchemaEditor,
    icon: icons.Graphql,
    title: "Schema",
  },
  explorer: {
    render: Explorer,
    icon: icons.ExplorerIcon,
    title: "Explorer",
  },
  ast: {
    render: ASTViewer,
    icon: icons.Tree,
    title: "AST",
  },
  headers: {
    render: HeadersEditor,
    icon: icons.Helmet,
    title: "Header",
  },
};

export function BrowserProvider({
  panels,
  initializeState,
  schemaConfig,
  initialSchemaConfig,
  children,
}) {
  return (
    <GraphQLMonacoProvider initialSchemaConfig={initialSchemaConfig}>
      <RecoilRoot
        initializeState={(snapshot) => {
          snapshot.set(fs.persistedFiles, { "/browser.json": true });
          const currentTab = snapshot.getLoadable(browser.currentTab)
            .contents as string;

          const oldConfig = snapshot.getLoadable(
            browser.getTabSchemaConfig(currentTab)
          ).contents;

          if (schemaConfig) {
            snapshot.set(browser.getTabSchemaConfig(currentTab), schemaConfig);
          } else if (
            initialSchemaConfig &&
            !(oldConfig as SchemaConfig)?.uri?.length
          ) {
            snapshot.set(
              browser.getTabSchemaConfig(currentTab),
              initialSchemaConfig
            );
          }

          initializeState?.(snapshot, browser);
        }}
      >
        <PanelConfigProvider panels={panels}>
          <fs.Persist />
          {children}
        </PanelConfigProvider>
      </RecoilRoot>
    </GraphQLMonacoProvider>
  );
}

export const tabBreakpoints = [3, 5, 7, 9];

const Background = styled.div`h-screen w-screen pt-1 gap-2 bg-blueGray-300 w-full flex flex-col`;
const PanelWindow = styled.div`flex-1 w-full px-2 pb-3 flex flex-row overflow-hidden`;

export function Browser({
  initializeState,
  initialSchemaConfig,
  schemaConfig,
}: {
  initialSchemaConfig: SchemaConfig;
  schemaConfig?: SchemaConfig;
  initializeState?: (snapshot: MutableSnapshot, atoms: typeof browser) => void;
}) {
  return (
    <BrowserProvider
      initializeState={initializeState}
      schemaConfig={schemaConfig}
      initialSchemaConfig={initialSchemaConfig}
      panels={DEFAULT_PANELS}
    >
      <Background>
        <div className={bw`px-2 relative`}>
          <Tabs />
          <Toolbar />
        </div>
        <PanelWindow>
          <Panels />
        </PanelWindow>
      </Background>
    </BrowserProvider>
  );
}

export default Browser;
