import React from "react";
import * as gql from "../types";
import { OperationDefinition } from "./OperationDefinition";
import { FragmentDefinition } from "./FragmentDefinition";
import { createAstComponent } from "./components";

export const Definition = createAstComponent<gql.DefinitionNode>(({ node }) => {
  switch (node.kind) {
    case "OperationDefinition": {
      return <OperationDefinition node={node} />;
    }
    case "FragmentDefinition": {
      return <FragmentDefinition node={node} />;
    }
  }
});
Definition.displayName = "Definition";
