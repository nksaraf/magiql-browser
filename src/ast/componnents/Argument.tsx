import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { Arrow, Checkbox, Punctuation, Tokens } from "../tokens";
import {
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLScalarType,
} from "graphql";
import { createAstComponent, KeyValue, unwrapInputType } from "./components";

export const Argument = createAstComponent<
  gql.ArgumentNode,
  { argument?: GraphQLArgument }
>(({ node, isLast, onToggle, argument }) => {
  if (node.metadata.isSelected) {
    return (
      <KeyValue
        name={node.name}
        value={node.value}
        onToggle={onToggle}
        isSelected={node.metadata.isSelected}
        isLast={isLast}
      />
    );
  } else if (argument) {
    // if (node.value.kind === "ObjectValue") {
    // } else {
    const type = unwrapInputType(argument.type);

    if (type instanceof GraphQLScalarType) {
      return (
        <Tokens
          onClick={onToggle}
          className={bw`text-graphql-argname opacity-50 group`}
        >
          <Checkbox checked={false} />
          <Tokens gap={0.25}>
            {node.name.value}
            <Punctuation>:</Punctuation>
          </Tokens>
        </Tokens>
      );
    } else if (type instanceof GraphQLInputObjectType) {
      return (
        <Tokens
          onClick={onToggle}
          className={bw`text-graphql-argname opacity-50 group`}
        >
          <Arrow isOpen={false} />
          <Tokens gap={0.25}>
            {node.name.value}
            <Punctuation>:</Punctuation>
          </Tokens>
        </Tokens>
      );
    } else if (type instanceof GraphQLEnumType) {
      return (
        <Tokens
          onClick={onToggle}
          className={bw`text-graphql-argname opacity-50 group`}
        >
          <Checkbox checked={false} />
          <Tokens gap={0.25}>
            {node.name.value}
            <Punctuation>:</Punctuation>
          </Tokens>
        </Tokens>
      );
    }
  }
});

Argument.displayName = "Argument";
