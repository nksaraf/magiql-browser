import React from "react";
import { MonacoProvider } from "use-monaco";
import lightTheme from "./lib/monaco.theme";
import * as graphqlLanguageConfig from "./lib/graphql.config";


export function GraphQLMonacoProvider({ initialSchemaConfig, children }) {
  return (
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
            loader: async () => graphqlLanguageConfig as any,
          });
        },
      }}
    >
      {children}
    </MonacoProvider>
  );
}
