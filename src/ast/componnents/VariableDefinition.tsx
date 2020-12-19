import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import {
  Arrow,
  Checkbox,
  Indented,
  Lines,
  Punctuation,
  Tokens,
} from "../tokens";
import { Type } from "./Type";
import { createAstComponent, ObjectFields, ListItems } from "./components";
import { Value } from "./Value";
import { Variable } from "./Variable";

export const VariableDefinition = createAstComponent<gql.VariableDefinitionNode>(
  ({ node, onToggle }) => {
    if (!node.defaultValue) {
      return (
        <Tokens>
          <Tokens
            onClick={onToggle}
            className={bw`text-graphql-variable`}
            gap={0.25}
          >
            <Variable node={node.variable} />
            <Punctuation>:</Punctuation>
          </Tokens>
          <Type node={node.type} />
        </Tokens>
      );
    } else if (node.defaultValue.kind === "ObjectValue") {
      return (
        <Lines>
          <Tokens>
            <Tokens className={bw`group`}>
              <Arrow
                onClick={onToggle}
                className={bw`text-graphql-variable`}
                isOpen={true}
              />
              <Tokens className={bw`text-graphql-variable`} gap={0.25}>
                <Variable node={node.variable} />
                <Punctuation>:</Punctuation>
              </Tokens>
            </Tokens>
            <Type node={node.type} />
            <Tokens>
              <Punctuation>=</Punctuation>
              <Punctuation>{"{"}</Punctuation>
            </Tokens>
          </Tokens>
          <Indented>
            <ObjectFields node={node.defaultValue.fields} />
          </Indented>
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        </Lines>
      );
    } else if (node.defaultValue.kind === "ListValue") {
      return (
        <Lines>
          <Tokens>
            <Tokens className={bw`group`}>
              <Arrow
                onClick={onToggle}
                className={bw`text-graphql-variable`}
                isOpen={true}
              />
              <Tokens className={bw`text-graphql-variable`} gap={0.25}>
                <Variable node={node.variable} />
                <Punctuation>:</Punctuation>
              </Tokens>
            </Tokens>
            <Type node={node.type} />
            <Tokens>
              <Punctuation>=</Punctuation>
              <Punctuation>{"["}</Punctuation>
            </Tokens>
          </Tokens>
          <Indented>
            <ListItems node={node.defaultValue.values} />
          </Indented>
          <Tokens>
            <Punctuation>{"]"}</Punctuation>
          </Tokens>
        </Lines>
      );
    } else {
      return (
        <Tokens>
          <Tokens className={bw`group`}>
            <Checkbox onClick={onToggle} checked={true} />
            <Tokens className={bw`text-graphql-variable`} gap={0.25}>
              <Variable node={node.variable} />
              <Punctuation>:</Punctuation>
            </Tokens>
          </Tokens>
          <Type node={node.type} />
          <Punctuation>=</Punctuation>
          <Value node={node.defaultValue} />
        </Tokens>
      );
    }
  }
);
VariableDefinition.displayName = "VariableDefinition";
