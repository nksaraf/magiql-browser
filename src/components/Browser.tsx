import React from "react";
import {
  asDisposable,
  MonacoProvider,
  plugins,
  useMonaco,
  useMonacoContext,
} from "use-monaco";
import type * as monacoApi from "monaco-editor";
import { bw, setup } from "@beamwind/play";
import "../styles";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { useAtom, useUpdateAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import * as GQL from "./ast/components";

import { header, panel } from "../lib/components";
import { EditorPanel } from "./EditorPanel";
import SplitGrid from "react-split-grid";
import { buildASTSchema, parse, print } from "graphql";
import * as gqlAst from "./ast/atoms";
import { Toolbar } from "./Toolbar";
import { SchemaConfig } from "use-monaco/dist/types/src/plugins/graphql/typings";
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
  Response,
  Tree,
} from "./Icons";

export function CurrentDocument() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));
  const [schemaText] = useAtom(ide.schemaText);
  const [schema, setSchema] = React.useState(null);
  const setLastEditedBy = useUpdateAtom(ide.lastEditedBy);
  React.useEffect(() => {
    if (schemaText) {
      try {
        setSchema(buildASTSchema(parse(schemaText)));
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }, [schemaText]);

  return (
    <GQL.ASTProvider
      onChange={() => {
        setLastEditedBy("explorer");
      }}
    >
      <GQL.SchemaProvider schema={schema}>
        <GQL.Document node={document} />
      </GQL.SchemaProvider>
    </GQL.ASTProvider>
  );
}

export function QueryEditor() {
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
        className={bw`${editorPanelHeader(focused === "editor")} gap-1`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Code className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Query Editor</div>
      </div>
    </EditorPanel>
  );
}

export function SchemaEditor() {
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
        className={bw`${editorPanelHeader(focused === "schema")} gap-1.5`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-1`}>
          <Graphql className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Schema</div>
      </div>
    </EditorPanel>
  );
}

export function VariablesEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [variablesText, setVariables] = useAtom(
    ide.getTabVariablesFile(currentTab)
  );
  const [focused, setFocused] = useAtom(ide.focused);
  const { monaco } = useMonacoContext();
  // const [document] = useAtom(gqlAst.getDocument(currentTab));

  React.useEffect(() => {
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //   validate: true,
    //   schemas: [
    //     {
    //       uri: "variables",
    //       fileMatch: ["/**/variables.json"],
    //       schema: {
    //         type: "object",
    //         properties: {
    //           profieId: { description: "variable", type: "number" },
    //         },
    //       },
    //     },
    //   ],
    // });
  });

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
        className={bw`${editorPanelHeader(focused === "variables")} gap-1.5`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-0`}>
          <InputIcon className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Variables</div>
      </div>
    </EditorPanel>
  );
}

export function HeadersEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [headersText, setHeaders] = useAtom(ide.getTabHeadersFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);

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
        className={bw`${editorPanelHeader(focused === "headers")} gap-1`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Helmet className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Headers</div>
      </div>
    </EditorPanel>
  );
}

export function ResultsEditor() {
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
        onClick={() => {
          setFocused("response");
        }}
        className={bw`${editorPanelHeader(
          focused === "response"
        )} justify-between`}
      >
        <div className={bw`flex flex-row gap-1.5 items-center`}>
          <div className={bw`h-4.0 w-4.0`}>
            <Response className={bw`h-4.0 w-4.0`} />
          </div>
          <div>Response</div>
        </div>
        {queryStatus === "loading" && (
          <div
            className={bw`text-xs flex flex-row items-center gap-1 ${
              focused ? "text-blueGray-200" : "text-blueGray-600"
            }`}
          >
            <Loading className={bw`animate-spin h-4 w-4`} />
          </div>
        )}
      </div>
    </EditorPanel>
  );
}

export async function loadSchema(monaco: typeof monacoApi, tab) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file(`/${tab}/query.graphql`)
  );
  return await worker.getSchema();
}

export function LoadSchema() {
  const [currentTab] = useAtom(ide.currentTab);
  const [config, setConfig] = useAtom(ide.getTabSchemaConfig(currentTab));
  const [, setSchema] = useAtom(ide.schemaText);

  const { monaco } = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.worker.updateOptions("graphql", {
        languageConfig: {
          schemaConfig: config,
        },
      });
      loadSchema(monaco, currentTab)
        .then((schema) => {
          setSchema(schema);
        })
        .catch((e) => {
          console.error(e);
          setSchema(null);
        });
    }
  }, [config, monaco]);

  return null;
}

export function Explorer() {
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

  console.log(editorPanelHeader(focused === "editor"));

  return (
    <div
      onClick={() => {
        setFocused("explorer");
      }}
      className={bw`${panel} relative`}
    >
      <div className={bw`${editorPanelHeader(focused === "explorer")} gap-1`}>
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

const editorPanelHeader = (focused) => `
${header} ${
  focused ? "text-blueGray-200 bg-blueGray-600" : ""
} px-3 flex flex-row items-center absolute top-0 w-full`;

export function ASTViewer() {
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
      contents={JSON.stringify(document, false ? replacer : null, 2)}
    >
      <div
        onClick={() => {
          setFocused("ast");
        }}
        className={bw`${editorPanelHeader(focused === "ast")} gap-1`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-1`}>
          <Tree className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Syntax Tree</div>
      </div>
    </EditorPanel>
  );
}

export const IDEPanels = {
  editor: <QueryEditor />,
  variables: <VariablesEditor />,
  response: <ResultsEditor />,
  schema: <SchemaEditor />,
  explorer: <Explorer />,
  ast: <ASTViewer />,
  headers: <HeadersEditor />,
};

export function VerticalPanels({ index, panels }) {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes, setSizes] = useAtom(ide.getTabVerticalRatio(currentTab));

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

export function Panels({ panels, horizontalRatio, verticalRatio }) {}

export function HorizontalPanels() {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes, setSizes] = useAtom(ide.getTabHorizontalRatio(currentTab));
  const [settings] = useAtom(ide.getTabSettings(currentTab));

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

export function App() {
  const [tabs] = useAtom(ide.tabs);
  return (
    <div
      className={bw`h-screen w-screen pt-3 gap-2 bg-blueGray-300 w-full flex flex-col`}
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
        className={bw`flex-1 w-full px-3 pb-3 flex flex-row overflow-hidden`}
      >
        <HorizontalPanels />
      </div>
    </div>
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
      <MonacoProvider
        theme={lightTheme}
        plugins={{
          prettier: ["graphql", "json"],
          "magiql-ide": (monaco) => {
            monaco.plugin.install(plugins.prettier(["graphql", "json"]));

            // {
            //   "type": "object",
            //   "properties": {
            //     "first_name": { "type": "string" },
            //     "last_name": { "type": "string" },
            //     "birthday": { "type": "string", "format": "date" },
            //     "address": {
            //       "type": "object",
            //       "properties": {
            //         "street_address": { "type": "string" },
            //         "city": { "type": "string" },
            //         "state": { "type": "string" },
            //         "country": { "type" : "string" }
            //       }
            //     }
            //   }
            // }
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
        <ide.Persist />
        <LoadSchema />
        <App />
      </MonacoProvider>
    </RecoilRoot>
  );
}

export default GraphQLIDE;
