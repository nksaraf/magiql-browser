import React from "react";
import { render } from "react-dom";
import { MonacoProvider, useMonaco } from "use-monaco";
import * as monacoApi from "monaco-editor";
import themes from "use-monaco/themes";
import { bw, setup } from "@beamwind/play";
import Split from "react-split";
import { RecoilRoot } from "recoil";
import { useAtom } from "./atom";
import { parse, buildASTSchema } from "graphql";

import { createContext } from "create-hook-context";
import { ide } from "./ide";
import { Document } from "./ast/Document";
import { EditorPanel, header, panel } from "./components";

setup({
  init(insert, theme) {
    insert(`body{margin:0}`);
  },
  extends: {},
});

const [IDE, useIDE] = createContext(({}: {}) => {
  const queryEditorRef = React.useRef<monacoApi.editor.IStandaloneCodeEditor>();
  const resultsEditorRef = React.useRef<monacoApi.editor.IStandaloneCodeEditor>();
  const variablesEditorRef = React.useRef<monacoApi.editor.IStandaloneCodeEditor>();
  return { editors: { queryEditorRef, resultsEditorRef, variablesEditorRef } };
});

function QueryEditor() {
  const { editors } = useIDE();
  const [query, setQuery] = useAtom(ide.query);

  React.useEffect(() => {
    localStorage.setItem("use-monaco:query.graphql", query);
  }, [query]);

  return (
    <EditorPanel
      path="query.graphql"
      language="graphql"
      editorDidMount={(editor) => {
        editors.queryEditorRef.current = editor;
      }}
      contents={query}
      onChange={(text) => {
        setQuery(text);
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Editor</div>
    </EditorPanel>
  );
}

function VariablesEditor() {
  const { editors } = useIDE();
  const [variables, setVariables] = useAtom(ide.variables);

  React.useEffect(() => {
    localStorage.setItem("use-monaco:variables.json", variables);
  }, [variables]);

  return (
    <EditorPanel
      contents={variables}
      onChange={(text) => {
        setVariables(text);
      }}
      path="variables.json"
      editorDidMount={(editor) => {
        editors.variablesEditorRef.current = editor;
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Variables</div>
    </EditorPanel>
  );
}

function ResultsEditor() {
  const { editors } = useIDE();
  const [results] = useAtom(ide.results);

  return (
    <EditorPanel
      header="Response"
      options={{
        readOnly: true,
      }}
      path="results.json"
      contents={JSON.stringify(results, null, 2)}
      editorDidMount={(editor) => {
        editors.resultsEditorRef.current = editor;
      }}
    >
      <div className={bw`${header} px-6 absolute top-0 w-full`}>Response</div>
    </EditorPanel>
  );
}

function QueryVariablesPanel() {
  const { editors } = useIDE();
  return (
    <Split
      direction="vertical"
      sizes={[75, 25]}
      className={bw`flex flex-col flex-1`}
      onDrag={() => {
        editors.queryEditorRef.current?.layout();
        editors.variablesEditorRef.current?.layout();
      }}
    >
      <QueryEditor />
      <VariablesEditor />
    </Split>
  );
}

async function loadSchema(monaco: typeof monacoApi) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file("/query.graphql")
  );
  return buildASTSchema(parse(await worker.getSchema()));
}

function LoadSchema() {
  const [schema, setSchema] = useAtom(ide.schema);

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

export function Explorer() {
  const [query] = useAtom(ide.parsedQuery);
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
            {query && schema && <Document document={query} />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { editors } = useIDE();
  return (
    <div
      className={bw`h-screen w-screen pt-3 gap-1 bg-gray-300 w-full flex flex-col`}
    >
      <div>Hello</div>
      <div
        className={bw`flex-1 w-full px-3 pb-3 bg-gray-300 flex flex-row overflow-hidden`}
      >
        {/* <div className={bw``}>Hello world</div> */}
        {/* <div className={bw`flex flex-row flex-1`}> */}
        <Split
          direction="horizontal"
          sizes={[40, 40, 20]}
          className={bw`flex flex-row flex-1 h-full w-full`}
          onDrag={() => {
            editors.queryEditorRef.current?.layout();
            editors.variablesEditorRef.current?.layout();
            editors.resultsEditorRef.current?.layout();
          }}
        >
          <Explorer />
          <QueryVariablesPanel />
          <ResultsEditor />
        </Split>
        {/* </div> */}
      </div>
    </div>
  );
}

import lightTheme from "./theme";
import * as config from "./graphql.config";
import { ErrorBoundary } from "react-error-boundary";

const rootElement = document.getElementById("root");
render(
  <MonacoProvider
    theme={lightTheme}
    plugins={{
      "magiql-ide": (monaco) => {
        const lang = monaco.languages
          .getLanguages()
          .find((l) => l.id === "graphql");
        lang.loader = async () => config;

        return monaco.languages.register({
          id: "graphql",
          worker: {
            label: "graphql",
            options: {
              languageConfig: {
                schemaConfig: {
                  uri:
                    "https://swapi-graphql.netlify.app/.netlify/functions/index",
                },
              },
            },
            src: () => new Worker("./worker.ts"),
            providers: {
              hover: true,
              documentFormattingEdit: true,
              completionItem: true,
              diagnostics: true,
            },
          },
          extensions: [".graphql", ".gql"],
          aliases: ["graphql"],
          mimetypes: ["application/graphql", "text/graphql"],
          loader: async () => config,
        });
      },
    }}
  >
    <RecoilRoot>
      <IDE>
        <LoadSchema />
        <App />
      </IDE>
    </RecoilRoot>
  </MonacoProvider>,
  rootElement
);
