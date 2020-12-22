import React from "react";
import * as gql from "../types";
import { atom, atomFamily, useCallback, useUpdateAtom } from "../../lib/atom";
import "../../lib/theme";
import { bw } from "@beamwind/play";
import { ArgumentName, Lines } from "../tokens";
import { GraphQLInterfaceType, GraphQLSchema, GraphQLUnionType } from "graphql";
import * as ast from "../atoms";
import { createContext } from "create-hook-context";

const [SchemaProvider, useSchema] = createContext(
  ({ schema }: { schema: GraphQLSchema | null }) => {
    return schema;
  },
  null,
  "GraphQLSchema"
);

const [ASTProvider, useAST] = createContext(
  (options?: { onChange?: () => void }) => {
    return options;
  },
  null,
  "AST"
);

export { SchemaProvider, useSchema, ASTProvider, useAST };

export function createAstComponent<
  T extends gql.ASTNode | gql.ASTNode[],
  P extends { [key: string]: any } = {}
>(Component: React.FC<{ node: T; [key: string]: any } & P>) {
  return Component;
}

export function useUpdateNode({ node }) {
  const options = useAST();

  return useCallback(
    ({ set }) => (document) => {
      set(
        (ast as any)[`get${node?.kind ?? "AST"}`](node.metadata.path),
        document
      );
      options.onChange?.();
    },
    [options.onChange]
  );
}

import Tooltip from "@reach/tooltip";
import { Name } from "./Name";
import { Variable } from "./Variable";
import { Arguments } from "./Arguments";
import { KeyValue } from "./KeyValue";

export function useUpdateCollection({ node, key }) {
  const setNode = useUpdateNode({ node });

  return {
    removeItem: (item) =>
      setNode((old) => ({
        ...old,
        [key]: (old[key] ?? []).filter(
          (sel) => !(sel.metadata.path === item.metadata.path)
        ),
      })),
    addItem: (item) =>
      setNode((old) => ({
        ...old,
        [key]: [...(old[key] ?? []), item],
      })),
  };
}

Variable.displayName = "Variable";

export const tooltip = `bg-gray-700 text-blueGray-50 border-none rounded-md shadow-lg font-graphql`;

export const withTooltip = (description, children) =>
  description ? (
    <Tooltip className={bw`${tooltip} text-xs ml-5`} label={description}>
      <div>{children}</div>
    </Tooltip>
  ) : (
    children
  );

// export const ObjectField = createAstComponent<gql.ObjectFieldNode>(
//   ({ node, isLast }) => {
//     // kind = node.value.kind;
//     // if (kind === "ListValue") {
//     //   return (
//     //     <Lines>
//     //       <Tokens className={bw`text-graphql-argname`}>
//     //         <Arrow isOpen={node.metadata.isSelected} />
//     //         <div>{node.name.value}: </div>
//     //         <Punctuation>{"["}</Punctuation>
//     //       </Tokens>
//     //       <Indented>
//     //         <Values node={(node.value as gql.ListValueNode).values} />
//     //       </Indented>
//     //       <Tokens>
//     //         <Punctuation>
//     //           {"]"}
//     //           {isLast ? null : ","}
//     //         </Punctuation>
//     //       </Tokens>
//     //     </Lines>
//     //   );
//     // } else if (kind === "ObjectValue") {
//     //   return (
//     //     <Lines>
//     //       <Tokens className={bw`text-graphql-argname`}>
//     //         <Arrow isOpen={node.metadata.isSelected} />
//     //         <div>{node.name.value}: </div>
//     //         <Punctuation>{"{"}</Punctuation>
//     //       </Tokens>
//     //       <Indented>
//     //         <ObjectFields node={(node.value as gql.ObjectValueNode).fields} />
//     //       </Indented>
//     //       <Tokens>
//     //         <Punctuation>
//     //           {"}"}
//     //           {isLast ? null : ","}
//     //         </Punctuation>
//     //       </Tokens>
//     //     </Lines>
//     //   );
//     // } else {
//     return (
//       <Tokens>
//         <Checkbox checked={node.metadata.isSelected} />
//         <div className={bw`text-graphql-argname`}>{node.name.value}: </div>
//         <Value node={node.value} />
//       </Tokens>
//     );
//     // }

//     // if (node.value.kind === "ObjectValue") {
//     // }
//     // return (
//     //   <Tokens>
//     //     <Tokens className={bw`text-graphql-argname gap-0`}>
//     //       <div>{node.name.value}</div>
//     //       <Punctuation>: </Punctuation>
//     //     </Tokens>
//     //     <Value node={node.value} />
//     //   </Tokens>
//     // );
//   }
// );

// ObjectField.displayName = "ObjectField";

export const ObjectFields = createAstComponent<gql.ObjectFieldNode[]>(
  ({ node, onAdd, onRemove }) => {
    return (
      <Lines>
        {node.map((childNode, index) => {
          return (
            <KeyValue
              onToggle={() => {
                onRemove(childNode);
              }}
              name={childNode.name}
              value={childNode.value}
              isSelected={childNode.metadata.isSelected}
              isLast={index}
            />
          );
        })}
      </Lines>
    );
  }
);

ObjectFields.displayName = "ObjectFields";

export const Directive = createAstComponent<gql.DirectiveNode>(({ node }) => {
  return (
    <div className={bw``}>
      <Name node={node.name} />
      <Arguments node={node.arguments} />
    </div>
  );
});

Directive.displayName = "Directive";
