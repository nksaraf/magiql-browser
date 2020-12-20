import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import {
  Arrow,
  Indented,
  Keyword,
  Lines,
  Punctuation,
  Tokens,
} from "../tokens";
import { GraphQLObjectType } from "graphql";
import { Name } from "./Name";
import { SelectionSet } from "./SelectionSet";
import { createAstComponent, useSchema } from "./components";
import { NamedType } from "./NamedType";

export const FragmentDefinition = createAstComponent<gql.FragmentDefinitionNode>(
  ({ node }) => {
    const schema = useSchema();

    let type = null;
    if (schema) {
      type = schema.getType(node.typeCondition.name.value) as GraphQLObjectType;
    }

    return (
      <Lines>
        <Tokens>
          <Arrow
            className={bw`text-graphql-field`}
            isOpen={node.metadata.isSelected}
          />
          <Keyword>fragment</Keyword>
          <Name node={node.name} />
          <Keyword>on</Keyword>
          <NamedType node={node.typeCondition} />
          {node.metadata.isSelected && <Punctuation>{"{"}</Punctuation>}
        </Tokens>
        <Indented>
          <SelectionSet node={node.selectionSet} parentType={type} />
        </Indented>
        {node.metadata.isSelected && (
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        )}
      </Lines>
    );
  }
);
FragmentDefinition.displayName = "FragmentDefinition";
