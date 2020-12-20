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
import { Type } from "./Type";
import { SelectionSet } from "./SelectionSet";
import { createAstComponent, useSchema } from "./components";
import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";

export const InlineFragment = createAstComponent<
  gql.InlineFragmentNode,
  { parentType: GraphQLInterfaceType | GraphQLUnionType | GraphQLObjectType }
>(({ node, parentType, onToggle }) => {
  const schema = useSchema();

  const fragmentType = schema
    ? schema.getType(node.typeCondition.name.value)
    : null;

  const hasSelectionSet =
    isInterfaceType(parentType) ||
    isObjectType(fragmentType) ||
    isUnionType(fragmentType);

  return (
    <Lines>
      <Tokens
        onClick={() => onToggle(node)}
        className={bw`${{ "opacity-50": !node.metadata.isSelected }} group`}
      >
        <Arrow
          className={bw`text-graphql-typename`}
          isOpen={node.metadata.isSelected}
        />
        {node.metadata.isSelected && (
          <>
            <Punctuation>...</Punctuation>
            <Keyword>on</Keyword>
          </>
        )}
        <Type node={node.typeCondition} />
        {node.metadata.isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {node.metadata.isSelected && hasSelectionSet && (
        <Indented>
          <SelectionSet
            node={node.selectionSet}
            parentType={fragmentType as GraphQLInterfaceType}
          />
        </Indented>
      )}
      {node.metadata.isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
});
InlineFragment.displayName = "InlineFragment";
