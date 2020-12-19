import React from "react";
import * as gql from "../types";
import { Lines } from "../tokens";
import { VariableDefinition } from "./VariableDefinition";
import { createAstComponent } from "./components";

export const VariableDefinitions = createAstComponent<
  gql.VariableDefinitionNode[]
>(({ node, onRemove }) => {
  return (
    <Lines>
      {node.map((childNode) => (
        <VariableDefinition
          key={childNode.metadata.path}
          node={childNode}
          onToggle={() => {
            onRemove(childNode);
          }}
        />
      ))}
    </Lines>
  );
});
VariableDefinitions.displayName = "VariableDefinitions";
