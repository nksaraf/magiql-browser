import React from "react";
import { MonacoProvider, plugins, useMonaco } from "use-monaco";
import type * as monacoApi from "monaco-editor";
import { bw, setup } from "@beamwind/play";
import "./styles";
import { RecoilRoot } from "recoil";
import { useAtom, useUpdateAtom } from "./lib/atom";
import { Graphql, PlayButton } from "./lib/Icons";
import { ide, Persist } from "./lib/ide";
import { EditorPanel, header, panel } from "./lib/components";
import SplitGrid from "react-split-grid";
import * as comps from "./ast/components";
import * as icons from "@modulz/radix-icons";

function Doc() {
  const [doc] = useAtom(gqlAst.getDocument(""));

  return <comps.Document node={doc} />;
}

import lightTheme from "./editor/theme";
import * as config from "./editor/graphql.config";
import { ErrorBoundary } from "react-error-boundary";
import { ast, useSchema } from "./ast/state";
import * as gql from "./ast-types";

function QueryEditor() {
  const [query, setQuery] = useAtom(ide.queryText);

  return (
    <EditorPanel
      path="query.graphql"
      language="graphql"
      contents={query}
      onChange={(text) => {
        setQuery(text);
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Editor</div>
    </EditorPanel>
  );
}

function SchemaEditor() {
  const [schema] = useAtom(ide.schemaText);

  return (
    <EditorPanel
      path="schema.graphql"
      language="graphql"
      contents={schema}
      onChange={(text) => {
        // setQuery(text);
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Schema</div>
    </EditorPanel>
  );
}

function VariablesEditor() {
  const [variablesText, setVariables] = useAtom(ide.variablesText);

  return (
    <EditorPanel
      contents={variablesText}
      onChange={(text) => {
        setVariables(text);
      }}
      path="variables.json"
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Variables</div>
    </EditorPanel>
  );
}

function ResultsEditor() {
  const [results] = useAtom(ide.results);

  return (
    <EditorPanel
      header="Response"
      options={{
        readOnly: true,
      }}
      onChange={() => {}}
      path="results.json"
      contents={JSON.stringify(results, null, 2)}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Response</div>
    </EditorPanel>
  );
}

async function loadSchema(monaco: typeof monacoApi) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file("/query.graphql")
  );
  return await worker.getSchema();
}

function LoadSchema() {
  const [, setSchema] = useAtom(ide.schemaText);

  const { monaco } = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      loadSchema(monaco).then((schema) => {
        setSchema(schema);
      });
    }
  }, [monaco]);

  return null;
}

import * as gqlAst from "../atoms.raw";

function Explorer() {
  const [query, setQueryText] = useAtom(ide.queryText);
  const [document, setDocument] = useAtom(ast.currentDocument);
  const [doc, setDoc] = useAtom(gqlAst.getDocument(""));

  console.log(doc);
  React.useEffect(() => {
    try {
      console.log(query, parse(query));

      const parsedQuery = parse(query) as gql.DocumentNode;
      setDoc(parsedQuery);
    } catch (e) {
      console.error(e);
    }
    // setDocument(query);
  }, [query, setDoc]);

  React.useEffect(() => {
    console.log(document);
    if (document) {
      setQueryText(document);
    }
  }, [document, setQueryText]);

  const [schema] = useAtom(ide.schema);
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
            {schema && <Doc />}
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
  return value;
}

function ASTViewer() {
  const doc = useAtom(gqlAst.getDocument(""));

  return (
    <EditorPanel
      header="AST"
      options={{
        readOnly: true,
        fontSize: "10",
      }}
      onChange={() => {}}
      path="ast.json"
      contents={JSON.stringify(doc, replacer, 2)}
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

function Header() {
  const [result, setResults] = useAtom(ide.results);
  const [query] = useAtom(ide.queryText);
  const [panels, setPanels] = useAtom(ide.panels);
  const [config] = useAtom(ide.schemaConfig);
  const schema = useSchema();
  return (
    <div
      className={bw`w-full flex flex-row items-center gap-4 rounded-md bg-gray-100 h-10 py-1.5 px-3`}
    >
      <div className={bw``}>
        <Graphql
          className={bw`h-5.5 w-5.5 text-#e10098 hover:(mb-0.5) cursor-pointer transition-all mb-0`}
          onClick={() => {
            setPanels((props) =>
              props[2].includes("schema")
                ? props
                : [props[0], props[1], ["schema"]]
            );
          }}
        />
      </div>
      <div
        className={bw`px-4 flex-1 text-gray-800 flex gap-3 flex-row col-span-4 bg-gray-200 h-full items-center rounded-md text-center font-mono text-xs`}
      >
        <div
          className={bw`rounded-full ${
            schema ? `bg-green-500` : `bg-gray-400`
          } w-2 h-2`}
        ></div>
        <div>{config?.uri}</div>
      </div>
      <div className={bw`py-1 w-10 flex flex-row items-center rounded-md`}>
        <PlayButton
          onClick={async () => {
            setPanels((props) =>
              props[2].includes("response")
                ? props
                : [props[0], props[1], ["response"]]
            );
            fetch(config?.uri, {
              method: "POST",
              body: JSON.stringify({
                query: query,
              }),
              headers: {
                ["Content-type"]: "application/json",
              },
            })
              .then((res) => res.json())
              .then(({ data, ...others }) => setResults({ data, ...others }));
          }}
          className={bw`h-5.5 w-5.5 hover:(mb-0.5) cursor-pointer transition-all mb-0 text-blue-600`}
        />
        <icons.Share1Icon
          onClick={async () => {
            setPanels((props) =>
              props[2].includes("ast") ? props : [props[0], props[1], ["ast"]]
            );
          }}
          className={bw`h-5.5 w-5.5 hover:(mb-0.5) cursor-pointer transition-all mb-0 text-blue-600`}
        />
      </div>
    </div>
  );
}

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
  const [panels] = useAtom(ide.panels);

  return (
    <SplitGrid
      direction="row"
      gridTemplateColumns={sizes}
      onDrag={(a, b, s, d) => {
        setSizes(s);
      }}
      render={({ getGridProps, getGutterProps }) => (
        <div className={bw`w-full h-full grid`} {...getGridProps()}>
          {panels.map((panel, i) => (
            <React.Fragment key={JSON.stringify(panel)}>
              <div className={bw`h-full w-full overflow-scroll`}>
                <VerticalPanels panels={panel} index={i} />
              </div>
              {i < panels.length - 1 && (
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
  return (
    <div
      className={bw`h-screen w-screen pt-3 gap-2 bg-gray-300 w-full flex flex-col`}
    >
      <div className={bw`px-3`}>
        <Header />
      </div>
      <div
        className={bw`flex-1 w-full px-3 pb-3 bg-gray-300 flex flex-row overflow-hidden`}
      >
        <HorizontalPanels />
      </div>
    </div>
  );
}
import RecoilizeDebugger from "./debug";
import { parse } from "graphql";

const root = document.getElementById("root");
export function GraphQLIDE({ schemaConfig }) {
  return (
    <RecoilRoot
      initializeState={(snapshpt) => {
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
