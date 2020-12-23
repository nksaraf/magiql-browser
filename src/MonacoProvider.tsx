import React from "react";
import { MonacoProvider } from "use-monaco";
import allThemes from "use-monaco/themes";
import { lightTheme, darkTheme } from "./lib/monaco.theme";
import * as graphqlLanguageConfig from "./lib/graphql.config";
import createContext from "create-hook-context";
import { darkBG, colors } from "./lib/colors";
import { setup } from "@beamwind/play";
import sand from "./themes/vscode-theme";
import type * as monacoApi from "monaco-editor";

export const [ThemeProvider, useTheme] = createContext(
  ({ mode = "light" as "light" | "dark" }: { mode: string }) => {
    const [state, setState] = React.useState({ mode });

    // React.useEffect(() => {
    //   if (state.mode === "light") {
    //     setup({
    //       theme: {
    //         extend: {
    //           colors: {
    //             blueGray: colors["blueGray"],
    //           },
    //         },
    //       },
    //     });
    //   } else {
    //     setup({
    //       theme: {
    //         extend: {
    //           colors: {
    //             blueGray: darkBG,
    //           },
    //         },
    //       },
    //     });
    //   }
    // }, [state.mode]);

    return [state, setState] as const;
  }
);

import { loadWASM } from "onigasm"; // peer dependency of 'monaco-textmate'
import { Registry } from "monaco-textmate"; // peer dependency
import { wireTmGrammars } from "./themes";
import graphQLTMLang from "./graphql.tmlanguage.json";
import jsonTMLang from "./json.tmlanguage.json";
import { convertTheme } from "./themes/theme-convertor";

export async function textMatePlugin(monaco: typeof monacoApi) {
  await loadWASM("https://www.unpkg.com/onigasm/lib/onigasm.wasm"); // See https://www.npmjs.com/package/onigasm#light-it-up
  const languageRepo = {
    "source.graphql": {
      format: "json",
      content: JSON.stringify(graphQLTMLang, null, 2),
    },
    "source.json.comments": {
      format: "json",
      content: JSON.stringify(jsonTMLang, null, 2),
    },
  };

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map();

  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      return (
        languageRepo[scopeName] ?? {
          format: "json",
          content: JSON.stringify(jsonTMLang, null, 2),
        }
      );
    },
  });

  grammars.set("graphql", "source.graphql");
  grammars.set("json", "source.json.comments");
  return monaco.editor.onCreatedEditor(async (editor) => {
    try {
      await wireTmGrammars(monaco, registry, grammars, editor);
    } catch (e) {
      console.error(e);
    }
  });
}

const converted = convertTheme(sand as any);

export function GraphQLMonacoProvider({ initialSchemaConfig, children }) {
  const [theme, setTheme] = useTheme();

  return (
    <MonacoProvider
      paths={
        {
          // monaco: "https://unpkg.com/monaco-editor-core/min/vs",
        }
      }
      theme={
        // converted
        lightTheme
        // theme.mode === "light"
        //   ? lightTheme
        //   : ({
        //       ...darkTheme,
        //       colors: {
        //         ...darkTheme["colors"],
        //         "editor.background": darkBG["50"],
        //       },
        //     } as any)
      }
      plugins={{
        // json: (monaco) => {
        //   monaco.languages.register({
        //     id: "json",
        //     extensions: [".json"],
        //   });
        // },
        prettier: ["graphql", "json"],
        textmate: textMatePlugin,
        "magiql-ide": async (monaco) => {
          return monaco.languages.register({
            id: "graphql",
            worker: {
              label: "graphql",
              options: {
                languageConfig: {
                  schemaConfig: initialSchemaConfig,
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
            loader: async () => graphqlLanguageConfig as any,
            mimetypes: ["application/graphql", "text/graphql"],
          });
        },
      }}
    >
      {children}
    </MonacoProvider>
  );
}
