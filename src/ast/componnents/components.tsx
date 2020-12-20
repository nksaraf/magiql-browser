import React from "react";
import * as gql from "../types";
import { atom, atomFamily, useUpdateAtom } from "../../lib/atom";
import "../../lib/theme";
import { bw } from "@beamwind/play";
import {
  ArgumentName,
  Arrow,
  Checkbox,
  Indented,
  Lines,
  Punctuation,
  Tokens,
} from "../tokens";
import {
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLSchema,
  GraphQLUnionType,
  isWrappingType,
} from "graphql";
import * as ast from "../atoms";
import { createContext } from "create-hook-context";

export const [SchemaProvider, useSchema] = createContext(
  ({ schema }: { schema: GraphQLSchema | null }) => {
    return schema;
  }
);

export const [ASTProvider, useAST] = createContext(
  (options?: { onChange?: () => void }) => {
    return options;
  }
);

export function createAstComponent<
  T extends gql.ASTNode | gql.ASTNode[],
  P extends { [key: string]: any } = {}
>(Component: React.FC<{ node: T; [key: string]: any } & P>) {
  return Component;
}

function useUpdateNode({ node }) {
  const options = useAST();

  const updateNode = useUpdateAtom(
    (ast as any)[`get${node.kind}`](node.metadata.path)
  );

  return React.useCallback(
    (document) => {
      updateNode(document);
      options.onChange?.();
    },
    [options.onChange, updateNode]
  );
}

export const Document = createAstComponent<gql.DocumentNode>(({ node }) => {
  const updateDocument = useUpdateNode({ node });
  React.useEffect(() => {
    if (node.definitions.length === 0) {
      updateDocument((old) => ({
        ...old,
        definitions: [
          {
            kind: "OperationDefinition",
            metadata: {} as any,
            selectionSet: {
              metadata: {} as any,
              selections: [],
              kind: "SelectionSet",
            },
            name: {
              kind: "Name",
              metadata: {} as any,
              value: "MyQuery",
            },
            operation: "query",
          },
        ],
      }));
    }
  }, [node.definitions.length, updateDocument]);

  return (
    <div className={bw`flex flex-col gap-6`}>
      <>
        {node.definitions.map((childNode) => (
          <Definition key={childNode.metadata.path} node={childNode} />
        ))}
      </>
    </div>
  );
});

Document.displayName = "Document";

import Tooltip from "@reach/tooltip";
import { Name } from "./Name";
import { Variable } from "./Variable";
import { Arguments } from "./Arguments";
import { Value } from "./Value";
import { Definition } from "./Definition";

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

export const tooltip = `bg-gray-700 text-white border-none rounded-md shadow-lg font-graphql`;

export const withTooltip = (description, children) =>
  description ? (
    <Tooltip className={bw`${tooltip} text-xs ml-5`} label={description}>
      <div>{children}</div>
    </Tooltip>
  ) : (
    children
  );

export function KeyWithObjectValue({
  name,
  value,
  isSelected,
  onToggle = () => {},
  isLast,
}) {
  const update = useUpdateCollection({ node: value, key: "fields" });
  return (
    <Lines>
      <Tokens onClick={onToggle} className={bw`text-graphql-argname group`}>
        <Arrow isOpen={isSelected} />
        <div>{name.value}: </div>
        <Punctuation>{"{"}</Punctuation>
      </Tokens>
      <Indented>
        <ObjectFields
          onAdd={update.addItem}
          onRemove={update.removeItem}
          node={(value as gql.ObjectValueNode).fields}
        />
      </Indented>
      <Tokens>
        <Punctuation>
          {"}"}
          {isLast ? null : ","}
        </Punctuation>
      </Tokens>
    </Lines>
  );
}

export function KeyWithListValue({
  name,
  value,
  isSelected,
  onToggle = () => {},
  isLast,
}) {
  const update = useUpdateCollection({ node: value, key: "values" });
  return (
    <Lines>
      <Tokens onClick={onToggle} className={bw`text-graphql-argname group`}>
        <Arrow isOpen={isSelected} />
        <div>{name.value}: </div>
        <Punctuation>{"["}</Punctuation>
      </Tokens>
      <Indented>
        <ListItems
          onAdd={update.addItem}
          onRemove={update.removeItem}
          node={(value as gql.ListValueNode).values}
        />
      </Indented>
      <Tokens>
        <Punctuation>
          {"]"}
          {isLast ? null : ","}
        </Punctuation>
      </Tokens>
    </Lines>
  );
}

export function KeyValue({
  name,
  value,
  isSelected,
  onToggle = () => {},
  isLast,
}) {
  const kind = value.kind;

  if (kind === "ListValue") {
    return (
      <KeyWithListValue
        name={name}
        onToggle={onToggle}
        value={value}
        isSelected={isSelected}
        isLast={isLast}
      />
    );
  } else if (kind === "ObjectValue") {
    return (
      <KeyWithObjectValue
        name={name}
        onToggle={onToggle}
        value={value}
        isSelected={isSelected}
        isLast={isLast}
      />
    );
  } else {
    return (
      <Tokens>
        <Tokens onClick={onToggle} className={bw`group`}>
          <Checkbox checked={isSelected} />
          <div className={bw`text-graphql-argname`}>{name.value}: </div>
        </Tokens>
        <Value node={value} />
      </Tokens>
    );
  }
}

export function unwrapInputType(inputType: GraphQLInputType): any {
  let unwrappedType = inputType;
  while (isWrappingType(unwrappedType)) {
    unwrappedType = unwrappedType.ofType;
  }
  return unwrappedType;
}

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

function ListItemList({ node: childNode, onToggle, isLast }) {
  const updateList = useUpdateCollection({ node: childNode, key: "values" });
  return (
    <Lines>
      <Tokens className={bw`group`}>
        <Arrow isOpen={childNode.metadata.isSelected} onClick={onToggle} />
        {childNode.metadata.isSelected && <Punctuation>[</Punctuation>}
      </Tokens>
      {childNode.metadata.isSelected && (
        <Indented>
          <ListItems
            node={childNode.values}
            onRemove={updateList.removeItem}
            onAdd={updateList.addItem}
          />
        </Indented>
      )}
      {childNode.metadata.isSelected && (
        <Tokens>
          <Punctuation>]</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function ListItemObject({ node: childNode, onToggle, isLast }) {
  const updateList = useUpdateCollection({ node: childNode, key: "fields" });
  return (
    <Lines>
      <Tokens className={bw`group`}>
        <Arrow isOpen={childNode.metadata.isSelected} onClick={onToggle} />
        <Punctuation>{"{"}</Punctuation>
      </Tokens>
      <Indented>
        <ObjectFields
          node={childNode.fields}
          onRemove={updateList.removeItem}
          onAdd={updateList.addItem}
        />
      </Indented>
      <Tokens>
        <Punctuation>{"}"}</Punctuation>
      </Tokens>
    </Lines>
  );
}

function ListItem({ node: childNode, onToggle, isLast }) {
  if (childNode.kind === "ListValue") {
    return (
      <ListItemList node={childNode} onToggle={onToggle} isLast={isLast} />
    );
  } else if (childNode.kind === "ObjectValue") {
    return (
      <ListItemObject node={childNode} onToggle={onToggle} isLast={isLast} />
    );
  }

  return (
    <Tokens
      onClick={onToggle}
      className={bw`group`}
      key={childNode.metadata.path}
    >
      <Checkbox checked={childNode.metadata.isSelected} />
      <Tokens className={bw`gap-0`}>
        <Value node={childNode} />
        {isLast ? "," : ""}
      </Tokens>
    </Tokens>
  );
}

export const ListItems = createAstComponent<gql.ValueNode[]>(
  ({ node, onAdd, onRemove }) => {
    if (!node) {
      return null;
    }

    return (
      <Lines>
        {node.map((childNode, index) => {
          return (
            <ListItem
              isLast={index < node.length - 1}
              node={childNode}
              onToggle={() => onRemove(childNode)}
            />
          );
        })}
      </Lines>
    );
  }
);
