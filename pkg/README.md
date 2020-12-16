<p align="center">
   <img src="./public/logo.svg" width=72 />
<h1  align="center"><code margin="0">@magiql/ide</code></h1><p align="center"><i>Web-based IDE for GraphQL, based on <code><a href="https://github.com/FormidableLabs/monaco-editor">monaco-editor</a></code></i></p>
</p>


<div>
  
Check out the demo at: https://magiql-ide.vercel.app

**Important: Very active development so anything could change**

## Install

```bash

npm install @magiql/ide

// or 
yarn add @magiql/ide
```

## Usage for GraphQL server

```typescript

import {
  getGraphQLParameters,
  processRequest,
  shouldRenderGraphiQL,
} from "graphql-helix";

import { renderPlayground } from "@magiql/ide/render";

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
      renderPlayground({
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

import GraphQLIDE from "@magiql/ide";
export default function App() {
  return (
    <GraphQLIDE
      schemaConfig={{
        // whichever GraphQL endpoint you want to connect to,
        // to access Next JS API Routes, we need the full url
        uri: window.location.origin + "/api/graphql",
      }}
    />
  )
}
```

## Usage in server-rendered React App 

As the tool is web-based, in case your app is server-rendered, use the following to skip rendering the IDE on the server

```tsx

import GraphQLIDE from "@magiql/ide";
export default function App() {
  return typeof window !== "undefined" ? (
    <GraphQLIDE
      schemaConfig={{
        uri: window.location.origin + "/api/graphql",
      }}
    />
  ) : (
    <></>
  );
}
```
