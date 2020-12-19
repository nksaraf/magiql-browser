import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { Tokens } from "../tokens";
import { Type } from "./Type";
import { createAstComponent } from "./components";

export const NamedType = createAstComponent<gql.NamedTypeNode>(({ node }) => {
  return <div className={bw`text-graphql-typename`}>{node.name.value}</div>;
});
NamedType.displayName = "NamedType";

export const ListType = createAstComponent<gql.ListTypeNode>(({ node }) => {
  return (
    <Tokens className={bw`text-graphql-punctuation gap-0`}>
      [<Type node={node.type} />]
    </Tokens>
  );
});
ListType.displayName = "ListType";

export const NonNullType = createAstComponent<gql.NonNullTypeNode>(
  ({ node }) => {
    return (
      <Tokens className={bw`text-graphql-punctuation gap-0`}>
        <Abstract node={node.type} />!
      </Tokens>
    );
  }
);
NonNullType.displayName = "NonNullType";

export const Abstract = createAstComponent<gql.AbstractNode>(({ node }) => {
  switch (node.kind) {
    case "NamedType": {
      return <NamedType node={node} />;
    }
    case "ListType": {
      return <ListType node={node} />;
    }
  }
});
