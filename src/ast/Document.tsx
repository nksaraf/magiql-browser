import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import React from "react";
import {
  OperationDefinitionNode,
  GraphQLObjectType,
  print,
  VariableDefinitionNode,
} from "graphql";
import * as gql from "graphql-ast-types";
import { Arrow, Variable } from "./tokens";
import { ast, useSchema, getOperationNode, getFragmentNode } from "./state";
import "./theme";
import {
  Lines,
  Tokens,
  Punctuation,
  Indented,
  Keyword,
  Type,
  Name,
} from "./tokens";
import "@reach/listbox/styles.css";
import { SelectionSet } from "./SelectionSet";

function VariableDefinition({ variable }) {
  return (
    <Tokens>
      <Variable key={(variable as VariableDefinitionNode).variable.name.value}>
        {(variable as VariableDefinitionNode).variable.name.value}:
      </Variable>
      <Type key={print((variable as VariableDefinitionNode).type)}>
        {print((variable as VariableDefinitionNode).type)}
      </Type>
    </Tokens>
  );
}

function VariableDefinitions({ vars }) {
  return (
    <Lines>
      {vars?.map((variable) => {
        // const type = typeFromAST(
        //   schema,
        //   (variable as VariableDefinitionNode).type as any
        // );
        return (
          <VariableDefinition
            key={(variable as VariableDefinitionNode).variable.name.value}
            variable={variable}
          />
        );
      })}
    </Lines>
  );
}

function OperationDefinition({ operationName }: { operationName: string }) {
  const schema = useSchema();
  const [operation] = useAtom(getOperationNode(operationName));

  const getOperationType = (operation: OperationDefinitionNode) => {
    if (operation.operation === "query") {
      return schema.getQueryType();
    } else if (operation.operation === "mutation") {
      return schema.getMutationType();
    } else if (operation.operation === "subscription") {
      return schema.getSubscriptionType();
    }
  };

  if (!operation) {
    return null;
  }

  let isSelected = true;

  const hasVars = !!operation.variableDefinitions?.length;

  const type = getOperationType(operation);

  if (!type) {
    return null;
  }

  const name = isSelected ? (
    hasVars ? (
      <Tokens gap={0.75}>
        <Name>{operation.name?.value}</Name>
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>
        <Name>{operation.name?.value}</Name>
        <Punctuation>{"{"}</Punctuation>
      </>
    )
  ) : (
    <Name>{operation.name?.value}</Name>
  );

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-opname`} isOpen={isSelected} />
        <Keyword>{operation.operation}</Keyword>
        {name}
      </Tokens>
      {hasVars && isSelected && (
        <Indented>
          <VariableDefinitions vars={operation.variableDefinitions} />
        </Indented>
      )}
      {hasVars && isSelected && (
        <Tokens>
          <Punctuation>
            <span className={bw`pl-1`}>{") {"}</span>
          </Punctuation>
        </Tokens>
      )}
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={operationName} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function FragmentDefinition({ fragmentName }: { fragmentName: string }) {
  const schema = useSchema();
  const [fragment] = useAtom(getFragmentNode(fragmentName));

  if (!fragment) {
    return null;
  }

  const type = schema.getType(
    fragment.typeCondition.name.value
  ) as GraphQLObjectType;

  let isSelected = true;

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        <Keyword>fragment</Keyword>
        <Name>{fragmentName}</Name>
        <Keyword>on</Keyword>
        <Type>{fragment.typeCondition.name.value}</Type>
        {isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={fragment.name.value} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

export function Document() {
  const [document] = useAtom(ast.documentNode);

  if (!document) {
    return null;
  }

  return (
    <div className={bw`flex flex-col gap-6`}>
      {document.definitions.map((def, i) => {
        if (gql.isOperationDefinition(def)) {
          return (
            <OperationDefinition
              operationName={def.name?.value ?? `Operation${i}`}
              key={def.name?.value ?? `Operation${i}`}
            />
          );
        } else if (gql.isFragmentDefinition(def)) {
          return (
            <FragmentDefinition
              fragmentName={def.name.value}
              key={def.name.value}
            />
          );
        }
      })}
    </div>
  );
}
