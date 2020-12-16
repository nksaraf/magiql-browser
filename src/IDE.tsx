import React from "react";
import { asDisposable, MonacoProvider, plugins, useMonaco } from "use-monaco";
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
import {
  Code,
  ExplorerIcon,
  Graphql,
  Helmet,
  InputIcon,
  Loading,
  Tree,
} from "./lib/Icons";

function CurrentDocument() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));

  return <GQL.Document node={document} />;
}

function QueryEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQuery] = useAtom(ide.getTabQueryFile(currentTab));
  const [edited, setLastEditedBy] = useAtom(ide.lastEditedBy);
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      path={`/${currentTab}/query.graphql`}
      language="graphql"
      contents={query}
      onFocus={() => {
        setFocused("editor");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      onChange={(text) => {
        setQuery(text);
        setLastEditedBy("editor");
      }}
    >
      <div
        onClick={() => {
          setFocused("editor");
        }}
        className={bw`${header} ${{
          "text-gray-800": focused === "editor",
        }} px-3 flex flex-row items-center gap-1 absolute top-0 w-full`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Code className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Query Editor</div>
      </div>
    </EditorPanel>
  );
}

function SchemaEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schema] = useAtom(ide.schemaText);
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      path={`/${currentTab}/schema.graphql`}
      language="graphql"
      contents={schema}
      onChange={(text) => {}}
      onFocus={() => {
        setFocused("schema");
      }}
      onBlur={() => {
        setFocused(null);
      }}
    >
      <div
        onClick={() => {
          setFocused("schema");
        }}
        className={bw`${header} ${{
          "text-gray-800": focused === "schema",
        }} px-3  flex flex-row items-center gap-1.5 absolute top-0 w-full`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-1`}>
          <Graphql className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Schema</div>
      </div>
    </EditorPanel>
  );
}

function VariablesEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [variablesText, setVariables] = useAtom(
    ide.getTabVariablesFile(currentTab)
  );
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      contents={variablesText}
      onChange={(text) => {
        setVariables(text);
      }}
      onFocus={() => {
        setFocused("variables");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      path={`/${currentTab}/variables.json`}
    >
      <div
        onClick={() => {
          setFocused("variables");
        }}
        className={bw`${header} ${{
          "text-gray-800": focused === "variables",
        }} px-3  flex flex-row items-center gap-1.5 absolute top-0 w-full`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-0`}>
          <InputIcon className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Variables</div>
      </div>
    </EditorPanel>
  );
}

function HeadersEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [headersText, setHeaders] = useAtom(ide.getTabHeadersFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);

  console.log(headersText);

  return (
    <EditorPanel
      contents={headersText}
      onChange={(text) => {
        setHeaders(text);
      }}
      onFocus={() => {
        setFocused("headers");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      path={`/${currentTab}/headers.json`}
    >
      <div
        onClick={() => {
          setFocused("headers");
        }}
        className={bw`${header} ${{
          "text-gray-800": focused === "headers",
        }} flex flex-row items-center gap-1 px-3 absolute top-0 w-full`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Helmet className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Headers</div>
      </div>
    </EditorPanel>
  );
}

function ResultsEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [results] = useAtom(ide.getTabResults(currentTab));
  const [queryStatus] = useAtom(ide.queryStatus);
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      header="Response"
      options={{
        readOnly: true,
      }}
      onFocus={() => {
        setFocused("response");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      onChange={() => {}}
      path={`${`/${currentTab}/response.json`}`}
      contents={
        queryStatus === "loading" ? "" : JSON.stringify(results, null, 2)
      }
    >
      <div
        className={bw`${header} ${{
          "text-gray-800": focused === "response",
        }} px-3 flex flex-row items-center justify-between gap-1 absolute top-0 w-full`}
      >
        <div
          onClick={() => {
            setFocused("results");
          }}
          className={bw`flex flex-row items-center gap-1`}
        >
          <div className={bw`h-4.5 w-4.5 -mt-1`}>
            <Helmet className={bw`h-4.5 w-4.5`} />
          </div>
          <div>Response</div>
        </div>
        {queryStatus === "loading" && (
          <div
            className={bw`text-xs flex flex-row items-center gap-1 text-gray-800`}
          >
            <Loading className={bw`animate-spin h-4 w-4`} />
          </div>
        )}
      </div>
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
  const [focused, setFocused] = useAtom(ide.focused);
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

  React.useEffect(() => {
    if (lasEditedBy === "explorer") {
      setFocused("explorer");
    }
  }, [lasEditedBy]);

  return (
    <div
      onClick={() => {
        setFocused("explorer");
      }}
      className={bw`${panel} relative`}
    >
      <div
        className={bw`${header} ${{
          "text-gray-800": focused === "explorer",
        }} px-3  flex flex-row items-center gap-1 absolute top-0 w-full`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <ExplorerIcon className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Explorer</div>
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
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      header="AST"
      options={{
        readOnly: true,
        fontSize: "10",
      }}
      onFocus={() => {
        setFocused("ast");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      onChange={() => {}}
      path={`/${currentTab}/ast.json`}
      contents={JSON.stringify(document, true ? replacer : null, 2)}
    >
      <div
        onClick={() => {
          setFocused("ast");
        }}
        className={bw`${header} ${{
          "text-gray-800": focused === "ast",
        }} px-3 flex flex-row items-center gap-1 absolute top-0 w-full`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-1`}>
          <Tree className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Syntax Tree</div>
      </div>
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
  headers: <HeadersEditor />,
};

function VerticalPanels({ index, panels }) {
  const [sizes, setSizes] = useAtom(ide.verticalRatio);
  if (panels.length === 1) {
    const Panel = IDEPanels[panels[0]];
    return Panel;
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
      {/* <div className="tab-container"> */}
      {/* <div className={bw`px-3 flex flex-row gap-2`}>
          {tabs.map((tab) => (
            <div
              style={{ minWidth: 140 }}
              className={bw`relative px-2 flex rounded-t-md py-2 font-graphql text-sm items-center justify-center bg-gray-100`}
              key={tab}
            >
              <div
                className={bw`w-8 bg-white h-full rotate-45 absolute left-0`}
              ></div>
              <div>{tab}</div>
            </div>
          ))}
        </div> */}
      <div className={bw`px-3`}>
        <Toolbar />
      </div>
      {/* </div> */}
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
