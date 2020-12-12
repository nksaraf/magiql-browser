import React from "react";
import { render } from "react-dom";
import { MonacoProvider } from "use-monaco";
import themes from "use-monaco/themes";
import { bw } from 'beamwind';
import { Editor } from './Editor';

function App() {
  return (
    <MonacoProvider theme={themes["ayu-dark"] as any}>
      <div className={bw`h-screen w-screen`}>
        <Editor path="index.ts" defaultContents="const a = 1" height='50%' width='200px' />
        <Editor path="package.json" defaultContents={`{ "a": 1 }`} />
      </div>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </MonacoProvider>
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
render(<App />, rootElement);