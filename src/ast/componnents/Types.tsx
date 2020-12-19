import React from "react";
import * as gql from "../types";
import { createAstComponent } from "./components";
import { Type } from "./Type";

export const Types = createAstComponent<gql.TypeNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Type key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});
Types.displayName = "Types";
