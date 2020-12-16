import React from "react";
import { MonacoProvider, plugins, useMonaco } from "use-monaco";
import type * as monacoApi from "monaco-editor";
import { bw, setup } from "@beamwind/play";
import "./styles";
import { RecoilRoot } from "recoil";
import { useAtom, useUpdateAtom } from "./lib/atom";
import { ide, Persist } from "./lib/ide";
import * as GQL from "./ast/components";

import { EditorPanel, header, panel } from "./lib/components";
import SplitGrid from "react-split-grid";
import { parse, print } from "graphql";

import lightTheme from "./editor/theme";
import * as config from "./editor/graphql.config";
import { ErrorBoundary } from "react-error-boundary";
import * as gql from "./ast/types";

function CurrentDocument() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));

  return <GQL.Document node={document} />;
}

function QueryEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQuery] = useAtom(ide.getTabQueryFile(currentTab));
  const setLastEditedBy = useUpdateAtom(ide.lastEditedBy);

  return (
    <EditorPanel
      path={`/${currentTab}/query.graphql`}
      language="graphql"
      contents={query}
      onChange={(text) => {
        setQuery(text);
        setLastEditedBy("editor");
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Editor</div>
    </EditorPanel>
  );
}

function SchemaEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schema] = useAtom(ide.schemaText);

  return (
    <EditorPanel
      path={`/${currentTab}/schema.graphql`}
      language="graphql"
      contents={schema}
      onChange={(text) => {}}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Schema</div>
    </EditorPanel>
  );
}

function VariablesEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [variablesText, setVariables] = useAtom(
    ide.getTabVariablesFile(currentTab)
  );

  return (
    <EditorPanel
      contents={variablesText}
      onChange={(text) => {
        setVariables(text);
      }}
      path={`/${currentTab}/variables.json`}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Variables</div>
    </EditorPanel>
  );
}

function ResultsEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [results] = useAtom(ide.getTabResults(currentTab));

  return (
    <EditorPanel
      header="Response"
      options={{
        readOnly: true,
      }}
      onChange={() => {}}
      path={`${`/${currentTab}/results.json`}`}
      contents={JSON.stringify(results, null, 2)}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Response</div>
    </EditorPanel>
  );
}

async function loadSchema(monaco: typeof monacoApi, tab) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file(`/${tab}/query.graphql`)
  );
  return await worker.getSchema();
}

function LoadSchema() {
  const currentTab = useAtom(ide.currentTab);
  const [, setSchema] = useAtom(ide.schemaText);

  const { monaco } = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      loadSchema(monaco, currentTab).then((schema) => {
        setSchema(schema);
      });
    }
  }, [monaco]);

  return null;
}

import * as gqlAst from "./ast/atoms";
import { Toolbar } from "./Toolbar";

function Explorer() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQueryText] = useAtom(ide.getTabQueryFile(currentTab));
  const [document, setDocument] = useAtom(gqlAst.getDocument(`${currentTab}`));
  const [lasEditedBy] = useAtom(ide.lastEditedBy);

  React.useEffect(() => {
    try {
      const parsedQuery = parse(query) as gql.DocumentNode;
      setDocument(parsedQuery);
    } catch (e) {
      console.error(e);
    }
  }, [query, setDocument]);

  React.useEffect(() => {
    if (document && lasEditedBy === "explorer") {
      setQueryText(print(document as any));
    }
  }, [document, setQueryText, lasEditedBy]);

  return (
    <div className={bw`${panel} relative`}>
      <div className={bw`${header} absolute top-0 px-4 w-full z-100`}>
        Explorer
      </div>
      <div className={bw`pt-12 pb-3 overflow-scroll w-full h-full`}>
        <div className={bw`px-4`}>
          <ErrorBoundary
            fallbackRender={({ error }) => (
              <pre className={bw`font-mono text-xs text-red-400`}>
                {error.stack}
              </pre>
            )}
          >
            <CurrentDocument />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function replacer(key, value) {
  // Filtering out properties
  if (key === "metadata") {
    return undefined;
  }

  if (value?.metadata?.isSelected === false) {
    return undefined;
  }
  return value;
}

function ASTViewer() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));

  return (
    <EditorPanel
      header="AST"
      options={{
        readOnly: true,
        fontSize: "10",
      }}
      onChange={() => {}}
      path="ast.json"
      contents={JSON.stringify(document, true ? replacer : null, 2)}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>AST</div>
    </EditorPanel>
  );
}

const IDEPanels = {
  editor: <QueryEditor />,
  variables: <VariablesEditor />,
  response: <ResultsEditor />,
  schema: <SchemaEditor />,
  explorer: <Explorer />,
  ast: <ASTViewer />,
};

function VerticalPanels({ index, panels }) {
  const [sizes, setSizes] = useAtom(ide.verticalRatio);
  if (panels.length === 1) {
    const Comp = IDEPanels[panels[0]];
    return Comp;
  }

  return (
    <SplitGrid
      direction="column"
      gridTemplateRows={sizes[index]}
      onDrag={(a, b, s, d) => {
        setSizes((old) => {
          const n = [...old];
          n[index] = s;
          return n;
        });
      }}
      render={({ getGridProps, getGutterProps }) => {
        return (
          <div className={bw`w-full h-full grid`} {...getGridProps()}>
            {panels.map((panel, i) => (
              <React.Fragment key={panel}>
                <div className={bw`h-full w-full overflow-scroll`}>
                  {IDEPanels[panel]}
                </div>
                {i < panels.length - 1 && (
                  <div {...getGutterProps("row", i + 1)} />
                )}
              </React.Fragment>
            ))}
          </div>
        );
      }}
    />
  );
}

function HorizontalPanels() {
  const [sizes, setSizes] = useAtom(ide.horizontalRatio);
  const [settings] = useAtom(ide.settings);

  return (
    <SplitGrid
      direction="row"
      gridTemplateColumns={sizes}
      onDrag={(a, b, s, d) => {
        setSizes(s);
      }}
      render={({ getGridProps, getGutterProps }) => (
        <div className={bw`w-full h-full grid`} {...getGridProps()}>
          {settings.panels.map((panel, i) => (
            <React.Fragment key={JSON.stringify(panel)}>
              <div className={bw`h-full w-full overflow-scroll`}>
                <VerticalPanels panels={panel} index={i} />
              </div>
              {i < settings.panels.length - 1 && (
                <div {...getGutterProps("column", i + i + 1)} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    />
  );
}

function App() {
  const [tabs] = useAtom(ide.tabs);
  return (
    <div
      className={bw`h-screen w-screen pt-3 gap-2 bg-gray-300 w-full flex flex-col`}
    >
      <div className={bw`px-3 flex flex-row gap-2`}>
        {tabs.map((tab) => (
          <div className={bw`px-2 py-2 font-rubik`}>{tab}</div>
        ))}
      </div>

      <div className={bw`px-3`}>
        <Toolbar />
      </div>
      <div
        className={bw`flex-1 w-full px-3 pb-3 bg-gray-300 flex flex-row overflow-hidden`}
      >
        <HorizontalPanels />
      </div>
    </div>
  );
}

export function GraphQLIDE({ schemaConfig }) {
  return (
    <RecoilRoot
      initializeState={(snapshpt) => {
        snapshpt.set(ide.persistedFiles, { "/settings.json": true });
        snapshpt.set(ide.schemaConfig, schemaConfig);
      }}
    >
      <MonacoProvider
        theme={lightTheme}
        plugins={{
          prettier: ["graphql", "json"],
          "magiql-ide": (monaco) => {
            monaco.plugin.install(plugins.prettier(["graphql", "json"]));
            return monaco.languages.register({
              id: "graphql",
              worker: {
                label: "graphql",
                options: {
                  languageConfig: {
                    schemaConfig: schemaConfig,
                  },
                },
                src: monaco.worker.baseWorkerPath + "graphql.monaco.worker.js",
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
        {/* <RecoilizeDebugger root={root} /> */}
        <Persist />
        <LoadSchema />
        <App />
      </MonacoProvider>
    </RecoilRoot>
  );
}

export default GraphQLIDE;
