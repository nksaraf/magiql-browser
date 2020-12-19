import React from "react";
import * as gql from "../types";
import { createAstComponent } from "./components";
import { NamedType, ListType, NonNullType } from "./NamedType";

export const Type = createAstComponent<gql.TypeNode>(({ node }) => {
  switch (node.kind) {
    case "NamedType": {
      return <NamedType node={node} />;
    }
    case "ListType": {
      return <ListType node={node} />;
    }
    case "NonNullType": {
      return <NonNullType node={node} />;
    }
  }
});
Type.displayName = "Type";
