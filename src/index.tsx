import React from "react";
import { render } from "react-dom";
import { MonacoProvider, useLocalStorage, useMonaco } from "use-monaco";
import * as monacoApi from "monaco-editor";
import themes from "use-monaco/themes";
import { bw, setup } from "@beamwind/play";
import { Editor } from "./Editor";
// @ts-ignore
import Split from "react-split";
import { RecoilRoot } from "recoil";
import { useAtom } from "./atom";
import { parse, buildASTSchema } from "graphql";

import { createContext } from "create-hook-context";
import { ide } from "./ide";
import { Header, SchemaExplorer } from "./SchemaExplorer";

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
    <div className={bw`rounded-xl shadow-xl pb-2  pt-12 relative bg-white`}>
      <Header className={`px-6 absolute top-0 w-full`}>Editor</Header>
      {/* <div className={bw`pt-2 h-9/10`}> */}
      <Editor
        options={{
          scrollbar: { vertical: "hidden" },
          minimap: { enabled: false },
          renderValidationDecorations: "off" as const,
          renderIndentGuides: false,
          lineNumbers: "off",
        }}
        path="query.graphql"
        language="graphql"
        editorDidMount={(editor) => {
          editors.queryEditorRef.current = editor;
        }}
        contents={query}
        onChange={(text) => {
          setQuery(text);
        }}
      />
      {/* </div> */}
    </div>
  );
}

function VariablesEditor() {
  const { editors } = useIDE();
  const [variables, setVariables] = useAtom(ide.variables);

  return (
    <div className={bw`rounded-xl shadow-xl pb-2  pt-12 relative bg-white`}>
      <Header className={`px-6 absolute top-0 w-full`}>Variables</Header>
      <Editor
        options={{
          scrollbar: { vertical: "hidden" },
          minimap: { enabled: false },
          renderValidationDecorations: "off" as const,
          renderIndentGuides: false,
          lineNumbers: "off",
          selectionHighlight: false,
        }}
        contents={variables}
        onChange={(text) => {
          setVariables(text);
        }}
        path="variables.json"
        editorDidMount={(editor) => {
          editors.variablesEditorRef.current = editor;
        }}
      />
    </div>
  );
}

function ResultsEditor() {
  const { editors } = useIDE();
  const [results] = useAtom(ide.results);

  return (
    <div className={bw`rounded-xl shadow-xl pb-2  pt-12 relative bg-white`}>
      <Header className={`px-6 absolute top-0 w-full`}>Response</Header>
      <Editor
        options={{
          scrollbar: { vertical: "hidden" },
          minimap: { enabled: false },
          renderValidationDecorations: "off" as const,
          renderIndentGuides: false,
          lineNumbers: "off",
          readOnly: true,
        }}
        path="results.json"
        contents={JSON.stringify(results, null, 2)}
        editorDidMount={(editor) => {
          editors.resultsEditorRef.current = editor;
        }}
      />
    </div>
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

function Explorer() {
  return (
    <div>
      <SchemaExplorer />
    </div>
  );
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

function App() {
  const { editors } = useIDE();

  // const [queryEditor] = useAtom(ide.queryEditor);
  // const [variablesEditor] = useAtom(ide.variablesEditor);
  // const [resultsEditor] = useAtom(ide.resultsEditor);
  return (
    <div
      className={bw`h-screen w-screen bg-gray-300 flex flex-row px-3 py-3 overflow-hidden`}
    >
      <Split
        direction="horizontal"
        sizes={[30, 40, 30]}
        className={bw`flex flex-row flex-1`}
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
    </div>
  );
}

// const { containerRef } = useMonacoEditor({
//     themes: themes,
//     path: "model.graphql",
//     plugins: {
//         graphql: {
//             uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index'
//         }
//     },
//     options: {
//         minimap: {
//             enabled: false
//         }
//     },
//     defaultContents: `

// query { allFilms { edges { node { id }}} }`,
//     theme: "github"
// });
// return (
//     <>
//         <div ref={containerRef} style={{ width: 500, height: 500 }} />
//     </>
// );

const rootElement = document.getElementById("root");
render(
  <MonacoProvider
    theme={themes["ayu-light"] as any}
    plugins={{
      "magiql-ide": (monaco) => {
        return monaco.worker.register({
          label: "graphql",
          languageId: "graphql",
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