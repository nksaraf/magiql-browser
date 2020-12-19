import React from "react";
import * as gql from "../types";
import { useAtom } from "../../lib/atom";
import { Lines } from "../tokens";
import { GraphQLField } from "graphql";
import * as ast from "../atoms";
import { Argument } from "./Argument";
import { createAstComponent } from "./components";

export const Arguments = createAstComponent<
  gql.ArgumentNode[],
  {
    field?: GraphQLField<any, any>;
    onAdd?: any;
    onRemove?: any;
    parentPath?: string;
  }
>(({ node, field, onAdd, onRemove, parentPath }) => {
  const unusedArguments =
    field?.args.filter((arg) => !node.find((n) => arg.name === n.name.value)) ??
    [];

  return (
    <Lines>
      {node.map((childNode, index) => (
        <Argument
          onToggle={() => {
            onRemove(childNode);
          }}
          key={childNode.metadata.path}
          node={childNode}
          isLast={
            unusedArguments.length === 0 ? index === node.length - 1 : false
          }
        />
      ))}
      {unusedArguments.map((arg, index) => {
        return (
          <UnusedArgument
            key={parentPath + ".argument:" + arg.name}
            argument={arg}
            onAdd={onAdd}
            path={parentPath + ".argument:" + arg.name}
            isLast={index === unusedArguments.length - 1}
          />
        );
      })}
    </Lines>
  );
});
Arguments.displayName = "Arguments";
function UnusedArgument({ argument, path, onAdd, isLast }) {
  let [node] = useAtom(ast.getArgument(path));

  let namedNode = {
    ...node,
    value: {
      kind: "IntValue",
      metadata: {},
      value: 0,
    },
    name: {
      ...node.name,
      value: argument.name,
    },
  };

  return (
    <Argument
      argument={argument}
      onToggle={() => {
        onAdd(namedNode);
      }}
      node={namedNode as any}
      isLast={isLast}
    />
  );
}
