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
import { Name } from "./Name";
import {
  createAstComponent,
  useSchema,
  useUpdateCollection,
} from "./components";
import { SelectionSet } from "./SelectionSet";
import { VariableDefinitions } from "./VariableDefinitions";

export const OperationDefinition = createAstComponent<gql.OperationDefinitionNode>(
  ({ node }) => {
    const schema = useSchema();

    const updateVariables = useUpdateCollection({
      node,
      key: "variableDefinitions",
    });

    const getOperationType = (operation: gql.OperationDefinitionNode) => {
      if (operation.operation === "query") {
        return schema.getQueryType();
      } else if (operation.operation === "mutation") {
        return schema.getMutationType();
      } else if (operation.operation === "subscription") {
        return schema.getSubscriptionType();
      }
    };

    const hasVars = !!node.variableDefinitions?.length;

    const type = schema ? getOperationType(node) : null;

    const name = node.metadata.isSelected ? (
      hasVars ? (
        <Tokens gap={0.75}>
          <Name node={node.name} />
          <Punctuation>{"("}</Punctuation>
        </Tokens>
      ) : (
        <>
          <Name node={node.name} />
          <Punctuation>{"{"}</Punctuation>
        </>
      )
    ) : (
      <Name node={node.name} />
    );

    return (
      <Lines>
        <Tokens>
          <Arrow
            className={bw`text-graphql-opname`}
            isOpen={node.metadata.isSelected}
          />
          <Keyword>{node.operation}</Keyword>
          {name}
        </Tokens>
        {hasVars && (
          <Indented>
            <VariableDefinitions
              node={node.variableDefinitions}
              onAdd={updateVariables.addItem}
              onRemove={updateVariables.removeItem}
            />
          </Indented>
        )}
        {hasVars && (
          <Tokens>
            <Punctuation>
              <span className={bw`pl-1`}>{") {"}</span>
            </Punctuation>
          </Tokens>
        )}
        <Indented>
          <SelectionSet parentType={type} node={node.selectionSet} />
        </Indented>
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      </Lines>
    );
  }
);
OperationDefinition.displayName = "OperationDefinition";
