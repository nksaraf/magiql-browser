import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { Arrow, Checkbox, Punctuation, Tokens } from "../tokens";
import {
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
} from "graphql";
import { createAstComponent } from "./components";
import { KeyValue, unwrapInputType } from "./KeyValue";

export function defaultValue(
  argType:
    | GraphQLEnumType
    | GraphQLScalarType
    | GraphQLList<any>
    | GraphQLInputObjectType
    | GraphQLNonNull<any>
): gql.ValueNode {
  if (isEnumType(argType)) {
    return {
      metadata: {} as any,
      kind: "EnumValue",
      value: argType.getValues()[0].name,
    };
  } else if (isListType(argType)) {
    return {
      metadata: {} as any,
      kind: "ListValue",
      values: [],
    };
  } else if (isNonNullType(argType)) {
    return defaultValue(argType.ofType);
  } else if (isInputObjectType(argType)) {
    return {
      metadata: {} as any,
      kind: "ObjectValue",
      fields: [],
    };
  }
  {
    switch (argType.name) {
      case "String":
        return { metadata: {} as any, kind: "StringValue", value: "" };
      case "Float":
        return { metadata: {} as any, kind: "FloatValue", value: "1.5" };
      case "Int":
        return { metadata: {} as any, kind: "IntValue", value: "10" };
      case "Boolean":
        return { metadata: {} as any, kind: "BooleanValue", value: false };
      default:
        return { metadata: {} as any, kind: "StringValue", value: "" };
    }
  }
}

export const Argument = createAstComponent<
  gql.ArgumentNode,
  { argument?: GraphQLArgument; isLast?: boolean }
>(({ node, isLast, onToggle, argument }) => {
  if (node.metadata.isSelected) {
    return (
      <KeyValue
        valueType={argument?.type}
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
