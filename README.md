<p align="center">
   <img src="https://magiql-browser.vercel.app/logo.svg" width=72 />
<h1  align="center"><code margin="0">@magiql/browser</code></h1><p align="center"><i>Web-based IDE and Browser for GraphQL APIs, built on <code><a href=“https://microsoft.github.io/monaco-editor/“>monaco-editor</a></code> and <code><a href=“https://www.github.com/FacebookExperimental/“>recoil</a></code></I></p>
</p>

<div>
  
Check out the demo at: https://magiql-browser.vercel.app

**Important: Very early project and under active development, would love any feedback or help**

**Goal:** 
- Browser-like experience for GraphQL API exploration and consumption + all the developer tools (like 'Inspect') that could make up an amazing GraphQL IDE experience (eg. mocking, code-generation, validation)
- Embeddable and composable in other ways (like using the Explorer in API documentation)
- Extendable (all parts, menus, toolbars, and panels) with plugins 

**Inspirations:**

- CodeSandbox
- VS Code
- Web Browsers (like Google Chrome)
- [`monaco-editor`](https://microsoft.github.io/monaco-editor/)

## Install

```bash

npm install @magiql/browser

// or
yarn add @magiql/browser
```

## Features

- **Language service:** supported using web workers (everything is off the main UI thread)
  - Uses `graphql-language-service`
  - Based on work on `monaco-graphql`
  - Syntax highlighting
  - Schema-aware auto-completions
  - Validations and error highlighting
  - Formatting on Cmd + S (using prettier)
  - Run queries, mutations, and subscriptions (_in development_)
- **Explorer:** point-and-click UI to manipulate the AST with hints from the schema (_in development_):
  - Completely inspired by [`OneGraph/graphiql-explorer`](https://github.com/OneGraph/graphiql-explorer)
  - Goal: represent the entire AST as an explorer with hints from the schema
  - Looks exactly like GraphQL syntax (syntax highlighted), but only the customizable parts should need user input, everything else should be toggles or buttons
  - Would allow very easy exploration of API for non technical users as well, could hide text editor also
  - Implementation: uses codegen to generate a `recoil` based AST data structure using the types in the `graphql` package, the Explorer is also just a renderer of the AST, that can update any part of the AST by updating its atom, and a new AST will be build
  - The AST is exported as collection of recoil atoms: can be modified externally by other plugins
- **User interface:**
  - **Goal:** Browser-like UI for exploring GraphQL APIs
  - Edit the URL in the nav bar to connect to any GraphQL API
  - Support for multiple tabs: each has own schema configuration (url, headers), query, variables, etc.
  - Resizable and configurable panels for everything (query, explorer, variables, headers, settings, etc.): extendable to allow plugins to add panels and switch to them
  - Persists configuration, history, etc to localStorage to get a stateful user experience
- **Embeddable:** Exports components that can be used in any React App,
  - Loads `monaco-editor` and web workers from CDNs to avoid any extra bundling step to include them
  - CSS is added at runtime by `beamwind` so that its not necessary to bundle css
- **Extendable**:
  - IDE state exported as collection of Recoil atoms for plugins to manipulate them and react to them as necessary
  - Plugin API to provide custom panels and functionality,
  - Can run expensive stuff on web workers and [`use-monaco`](https://github.com/nksaraf/use-monaco) gives a really easy API to register and use workers that use text files from `monaco-editor`
  - Ideas for plugins:
    - GraphQL faker: design schema in one panels and explore it in another
    - Hasura: create panel to generate declarative metadata/migrations like tables, etc
    - Response manipulation: Allow user to write custom code in a panel that can be run with the result of the response, (like lodash, etc or persisting)
  - Could create CLI / plugin to read directory and get GraphQL documents and have them available for exploration
- `@magiql/browser/render` can be used by GraphQL servers as an alternative to GraphQL playground (usage shown below)
  - Should be configurable with plugins and initial state of IDE
- **Tech used:**
  - [`react`](https://github.com/facebook/react)
  - [`recoil`](https://github.com/facebookexperimental/Recoil): state management tool
  - [`beamwind`](https://github.com/kenoxa/beamwind): a collection of packages to compile Tailwind CSS like shorthand syntax into CSS at runtime
  - [`use-monaco`](https://github.com/nksaraf/use-monaco): wrapper around `monaco-editor` , handles loading from CDN and managing workers, exposes easier APIs to extend the editor

## Usage for GraphQL server

```typescript
import {
  getGraphQLParameters,
  processRequest,
  shouldRenderGraphiQL,
} from "graphql-helix";

import { renderBrowser } from "@magiql/browser/render";

const allowCors = (fn) => async (req, res) => {
  // ... middleware to allow cors for development
  return await fn(req, res);
};

export default allowCors(async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(
      /*
       * returns HTML that you send from a server
       */
      renderBrowser({
        uri: "/api/graphql",
      })
    );
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    if (result.type === "RESPONSE") {
      result.headers.forEach(({ name, value }) => res.setHeader(name, value));
      res.status(result.status);
      res.json(result.payload);
    }
  }
});
```

## Usage in React App

```tsx
import GraphQLBrowser from "@magiql/browser";
export default function App() {
  return (
    <GraphQLBrowser
      initialSchemaConfig={{
        // whichever GraphQL endpoint you want to connect to,
        // to access Next JS API Routes, we need the full url
        uri: window.location.origin + "/api/graphql",
      }}
    />
  );
}
```

## Usage in server-rendered React App

As the tool is web-based, in case your app is server-rendered, use the following to skip rendering the IDE on the server

```tsx
import GraphQLBrowser from "@magiql/browser";
export default function App() {
  return typeof window !== "undefined" ? (
    <GraphQLBrowser
      initialSchemaConfig={{
        uri: window.location.origin + "/api/graphql",
      }}
    />
  ) : (
    <></>
  );
}
```
