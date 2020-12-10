import React from "react";
import { render } from "react-dom";
import { useMonacoEditor, prettier } from "use-monaco";
import themes from "use-monaco/themes";

function App() {
    const { containerRef } = useMonacoEditor({
        themes: themes,
        onLoad: monaco => {
            monaco.worker.register({
                label: "graphql",
                languageId: "graphql",
                options: {
                    languageConfig: {
                        enableSchemaRequest: true,
                        schemaConfig: { uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index' },
                    }
                },
                src: () => new Worker("./worker.ts"),
                providers: {
                    hover: true,
                    documentFormattingEdit: true,
                    completionItem: true,
                    diagnostics: true
                }
            });
        },
        path: "model.graphql",
        // plugins: [prettier(["graphql"])],
        options: {
            minimap: {
                enabled: false
            }
        },
        defaultValue: `
    
    query { allFilms { edges { node { id }}} }`,
        theme: "github"
    });
    return (
        <>
            <div ref={containerRef} style={{ width: 500, height: 500 }} />
        </>
    );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);