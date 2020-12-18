import React from "react";
import * as gql from "./types";
import { atom, atomFamily, useAtom, useUpdateAtom } from "../../lib/atom";
import "../../lib/theme";
import { bw } from "@beamwind/play";
import {
  ArgumentName,
  Arrow,
  Checkbox,
  FieldName,
  Indented,
  Keyword,
  Lines,
  Punctuation,
  Qualifier,
  Tokens,
} from "./tokens";
import {
  getNamedType,
  GraphQLArgument,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType,
} from "graphql";
import { getFields, getTypes } from "./utils";
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import * as ast from "./atoms";
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

function createAstComponent<
  T extends gql.ASTNode | gql.ASTNode[],
  P extends { [key: string]: any } = {}
>(Component: React.FC<{ node: T; [key: string]: any } & P>) {
  return Component;
}

export const Name = createAstComponent<gql.NameNode>(({ node }) => {
  return <div className={bw`text-graphql-opname`}>{node.value}</div>;
});

Name.displayName = "Name";

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
      <Definitions node={node.definitions} />
    </div>
  );
});

Document.displayName = "Document";

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
          <SelectionSet type={type} node={node.selectionSet} />
        </Indented>
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
        {/* <Directives node={node.directives} /> */}
      </Lines>
    );
  }
);

OperationDefinition.displayName = "OperationDefinition";

export const VariableDefinition = createAstComponent<gql.VariableDefinitionNode>(
  ({ node }) => {
    if (!node.defaultValue) {
      return (
        <Tokens>
          <Tokens className={bw`text-graphql-variable`} gap={0.25}>
            <Variable node={node.variable} />
            <Punctuation>:</Punctuation>
          </Tokens>
          <Type node={node.type} />
          <Directives node={node.directives} />
        </Tokens>
      );
    } else if (node.defaultValue.kind === "ObjectValue") {
      return (
        <Lines>
          <Tokens>
            <Tokens className={bw`group`}>
              <Arrow className={bw`text-graphql-variable`} isOpen={true} />
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
          <Directives node={node.directives} />
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
              <Arrow className={bw`text-graphql-variable`} isOpen={true} />
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
          <Directives node={node.directives} />
          <Tokens>
            <Punctuation>{"]"}</Punctuation>
          </Tokens>
        </Lines>
      );
    } else {
      return (
        <Tokens>
          <Tokens className={bw`group`}>
            <Checkbox checked={true} />
            <Tokens className={bw`text-graphql-variable`} gap={0.25}>
              <Variable node={node.variable} />
              <Punctuation>:</Punctuation>
            </Tokens>
          </Tokens>
          <Type node={node.type} />
          <Punctuation>=</Punctuation>
          <Value node={node.defaultValue} />
          <Directives node={node.directives} />
        </Tokens>
      );
    }
  }
);

VariableDefinition.displayName = "VariableDefinition";

export const VariableDefinitions = createAstComponent<
  gql.VariableDefinitionNode[]
>(({ node }) => {
  return (
    <Lines>
      {node.map((childNode) => (
        <VariableDefinition key={childNode.metadata.path} node={childNode} />
      ))}
    </Lines>
  );
});

VariableDefinitions.displayName = "VariableDefinitions";

export const Variable = createAstComponent<gql.VariableNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-variable`}>${node.name.value}</div>
    </Tokens>
  );
});

import Tooltip from "@reach/tooltip";

Variable.displayName = "Variable";

function UnselectedField({ type, path, fieldtype, onAdd }) {
  const [field] = useAtom(ast.getField(path));

  return (
    <Field
      node={{
        ...(field as any),
        name: {
          kind: "Name",
          metadata: {} as any,
          value: fieldtype.name,
        },
      }}
      onToggle={onAdd}
      type={type}
    />
  );
}

function UnselectedType({ type, path, onAdd }) {
  const [fragment] = useAtom(ast.getInlineFragment(path));

  return (
    <InlineFragment
      node={{
        ...(fragment as any),
        typeCondition: {
          kind: "NamedType",
          metadata: {} as any,
          name: { kind: "Name", value: type.name, metadata: {} as any },
        },
      }}
      onToggle={onAdd}
      type={type}
    />
  );
}

function useUpdateCollection({ node, key }) {
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

export const SelectionSet = createAstComponent<gql.SelectionSetNode>(
  ({ node, type }) => {
    const schema = useSchema();
    const supportedTypes = schema ? [...getTypes({ type, schema })] : [];
    const fields = schema ? [...getFields({ type, schema })] : [];
    const { addItem, removeItem } = useUpdateCollection({
      node,
      key: "selections",
    });
    const unselectedTypes = supportedTypes.filter(
      (type) =>
        !node.selections.find((sel) =>
          sel.kind === "InlineFragment"
            ? sel.typeCondition.name.value === type.name
            : false
        )
    );
    const unselectedFields = fields.filter(
      (type) =>
        !node.selections.find((sel) =>
          sel.kind === "Field" ? sel.name.value === type.name : false
        )
    );
    return (
      <Lines>
        {node.metadata.isSelected && (
          <Selections
            node={node.selections}
            type={type}
            onRemove={removeItem}
          />
        )}
        {unselectedTypes.map((sel, index) => (
          <UnselectedType
            type={sel}
            onAdd={addItem}
            key={node.metadata.path + ".type:" + sel.name}
            path={node.metadata.path + ".type:" + sel.name}
          />
        ))}
        {unselectedFields.map((sel, index) => (
          <UnselectedField
            type={type}
            onAdd={addItem}
            fieldtype={sel}
            key={node.metadata.path + ".field:" + sel.name}
            path={node.metadata.path + ".field:" + sel.name}
          />
        ))}
      </Lines>
    );
  }
);

export const tooltip = `bg-gray-700 text-white border-none rounded-md shadow-lg font-graphql`;

SelectionSet.displayName = "SelectionSet";

export const withTooltip = (description, children) =>
  description ? (
    <Tooltip className={bw`${tooltip} text-xs ml-5`} label={description}>
      <div>{children}</div>
    </Tooltip>
  ) : (
    children
  );

export const ExpandableField = createAstComponent<gql.FieldNode>(
  ({ node, field = null, onToggle }) => {
    const type = field?.type ? getNamedType(field?.type) : null;
    const hasArgs =
      (node.arguments && node.arguments.length > 0) || field?.args?.length
        ? true
        : false;
    const updateArguments = useUpdateCollection({ node, key: "arguments" });
    const aliasedField = node?.alias?.value ? (
      <Tokens>
        <FieldName>{node.alias?.value}: </FieldName>
        <Qualifier>{node.name.value}</Qualifier>
      </Tokens>
    ) : (
      <>
        <FieldName>{node.name.value}</FieldName>
      </>
    );

    const header = node.metadata.isSelected ? (
      hasArgs ? (
        <Tokens gap={0.75}>
          {aliasedField}
          <Punctuation>{"("}</Punctuation>
        </Tokens>
      ) : (
        <>
          {aliasedField}
          <Punctuation>{"{"}</Punctuation>
        </>
      )
    ) : (
      aliasedField
    );

    return (
      <Lines>
        {withTooltip(
          field?.description,
          <Tokens
            onClick={() =>
              onToggle({
                ...node,
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [],
                  metadata: {} as any,
                },
              })
            }
            className={bw`${{ "opacity-50": !node.metadata.isSelected }} group`}
          >
            <Arrow
              className={bw`text-graphql-field`}
              isOpen={node.metadata.isSelected}
            />
            {header}
          </Tokens>
        )}
        {hasArgs && node.metadata.isSelected && (
          <Indented>
            <Arguments
              onAdd={updateArguments.addItem}
              onRemove={updateArguments.removeItem}
              node={node.arguments}
              parentPath={node.metadata.path}
              field={field}
            />
          </Indented>
        )}
        {hasArgs && node.metadata.isSelected && (
          <Tokens className={bw`pl-1`}>
            <Punctuation>{") {"}</Punctuation>
          </Tokens>
        )}
        {node.metadata.isSelected && (
          <Indented>
            <SelectionSet node={node.selectionSet} type={type} />
          </Indented>
        )}
        {node.metadata.isSelected && (
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        )}
      </Lines>
    );
  }
);

ExpandableField.displayName = "ExpandableField";

export const Field = createAstComponent<gql.FieldNode>(
  ({ node, type, onToggle }) => {
    let field;
    const updateArguments = useUpdateCollection({ node, key: "arguments" });

    if (type) {
      field = type.getFields()[node.name.value];
      if (!field?.type) {
        return null;
      }
    }

    const fieldType = field ? getNamedType(field.type) : null;

    if (
      [
        "InterfaceTypeDefinition",
        "UnionTypeDefinition",
        "ObjectTypeDefinition",
      ].includes((fieldType as GraphQLNamedType)?.astNode?.kind)
    ) {
      return <ExpandableField node={node} field={field} onToggle={onToggle} />;
    }

    if ((node.selectionSet?.selections ?? []).length > 0) {
      return <ExpandableField node={node} />;
    }

    const hasArgs =
      (node.arguments && node.arguments.length > 0) || field?.args?.length
        ? true
        : false;

    const aliasedField = node?.alias?.value ? (
      <Tokens>
        <FieldName>{node.alias?.value}: </FieldName>
        <Qualifier>{node.name.value}</Qualifier>
      </Tokens>
    ) : (
      <>
        <FieldName>{node.name.value}</FieldName>
      </>
    );

    const header = node.metadata.isSelected ? (
      hasArgs ? (
        <Tokens gap={0.75}>
          {aliasedField}
          <Punctuation>{"("}</Punctuation>
        </Tokens>
      ) : (
        <>{aliasedField}</>
      )
    ) : (
      aliasedField
    );
    return (
      <Lines>
        {withTooltip(
          type?.description,
          <div>
            <Tokens
              onClick={() => onToggle(node)}
              className={bw`${{
                "opacity-50": !node.metadata.isSelected,
              }} group`}
            >
              <Checkbox
                className={bw`text-graphql-field`}
                checked={node.metadata.isSelected}
              />
              {header}
            </Tokens>
          </div>
        )}
        {node.metadata.isSelected && hasArgs && (
          <>
            <Indented>
              <Arguments
                onAdd={updateArguments.addItem}
                onRemove={updateArguments.removeItem}
                parentPath={node.metadata.path}
                node={node.arguments}
                field={field}
              />
            </Indented>
            <Tokens>
              <Punctuation>)</Punctuation>
            </Tokens>
          </>
        )}
      </Lines>
    );
  }
);

Field.displayName = "Field";

export const Fields = createAstComponent<gql.FieldNode[]>(({ node, type }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Field key={childNode.metadata.path} node={childNode} type={type} />
      ))}
    </div>
  );
});

Fields.displayName = "Fields";

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

export const Argument = createAstComponent<
  gql.ArgumentNode,
  { argument?: GraphQLArgument }
>(({ node, isLast, onToggle, argument }) => {
  const schema = useSchema();
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

    if (argument.astNode.type.kind === "NamedType") {
      console.log("inspect", schema.getType(argument.type.inspect()));
    }
    return (
      <Tokens
        onClick={onToggle}
        className={bw`text-graphql-argname opacity-50`}
      >
        <Checkbox checked={false} />
        {node.name.value}
      </Tokens>
    );
    // }
  }
});

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

Argument.displayName = "Argument";

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

export const FragmentSpread = createAstComponent<gql.FragmentSpreadNode>(
  ({ node }) => {
    return (
      <Tokens>
        <div>
          <Checkbox checked={node.metadata.isSelected} />
        </div>
        {node.metadata.isSelected && <Punctuation>...</Punctuation>}
        <Name node={node.name} />
      </Tokens>
    );
  }
);

FragmentSpread.displayName = "FragmentSpread";

export const InlineFragment = createAstComponent<gql.InlineFragmentNode>(
  ({ node, type, onToggle }) => {
    const schema = useSchema();

    const fragmentType = schema
      ? schema.getType(node.typeCondition.name.value)
      : null;

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
        {node.metadata.isSelected && (
          <Indented>
            <SelectionSet node={node.selectionSet} type={fragmentType} />
          </Indented>
        )}
        {node.metadata.isSelected && (
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        )}
      </Lines>
    );
  }
);

InlineFragment.displayName = "InlineFragment";

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
          <SelectionSet node={node.selectionSet} type={type} />
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

export const IntValue = createAstComponent<gql.IntValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-number`}>{node.value}</div>
    </Tokens>
  );
});

IntValue.displayName = "IntValue";

export const FloatValue = createAstComponent<gql.FloatValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-number`}>{node.value}</div>
    </Tokens>
  );
});

FloatValue.displayName = "FloatValue";

export const StringValue = createAstComponent<gql.StringValueNode>(
  ({ node }) => {
    return (
      <Tokens>
        <div className={bw`text-graphql-string`}>
          {JSON.stringify(node.value)}
        </div>
      </Tokens>
    );
  }
);

StringValue.displayName = "StringValue";

export const BooleanValue = createAstComponent<gql.BooleanValueNode>(
  ({ node }) => {
    return (
      <ListboxInput
        className={bw`font-mono  rounded-sm`}
        // aria-labelledby={labelId}
        value={JSON.stringify(node.value)}
      >
        <ListboxButton
          className={bw`text-graphql-boolean px-1`}
          arrow={<span className={bw`pl-2`}>↕</span>}
        />
        <ListboxPopover className={bw`bg-gray-100 rounded-sm shadow-xl z-1000`}>
          <ListboxList className={bw`font-mono text-xs text-graphql-boolean`}>
            <ListboxOption className={bw`px-2 py-1 text-gray-800`} value="true">
              {"true"}
            </ListboxOption>
            <ListboxOption
              className={bw`px-2 py-1 text-gray-800`}
              value="false"
            >
              {"false"}
            </ListboxOption>
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    );
  }
);

BooleanValue.displayName = "BooleanValue";

export const NullValue = createAstComponent<gql.NullValueNode>(({ node }) => {
  return <Tokens className={bw`text-graphql-keyword`}>null</Tokens>;
});

NullValue.displayName = "NullValue";

export const EnumValue = createAstComponent<gql.EnumValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-keyword`}>{node.value}</div>
    </Tokens>
  );
});

EnumValue.displayName = "EnumValue";

export const ListValue = createAstComponent<gql.ListValueNode>(({ node }) => {
  return (
    <Tokens className={bw`text-graphql-punctuation`}>
      [<ListItems node={node.values} />]
    </Tokens>
  );
});

ListValue.displayName = "ListValue";

export const ObjectValue = createAstComponent<gql.ObjectValueNode>(
  ({ node }) => {
    return (
      <Lines>
        <Punctuation>{"{"}</Punctuation>
        <Indented>
          <ObjectFields node={node.fields} />
        </Indented>
        <Punctuation>{"}"}</Punctuation>
      </Lines>
    );
  }
);

ObjectValue.displayName = "ObjectValue";

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

export const Directives = createAstComponent<gql.DirectiveNode[]>(
  ({ node }) => {
    return (
      <div>
        {node.map((childNode) => (
          <Directive key={childNode.metadata.path} node={childNode} />
        ))}
      </div>
    );
  }
);

Directives.displayName = "Directives";

export const NamedType = createAstComponent<gql.NamedTypeNode>(({ node }) => {
  return <div className={bw`text-graphql-typename`}>{node.name.value}</div>;
});

NamedType.displayName = "NamedType";

export const ListType = createAstComponent<gql.ListTypeNode>(({ node }) => {
  return (
    <Tokens className={bw`text-graphql-punctuation gap-0`}>
      [<Type node={node.type} />]
    </Tokens>
  );
});

ListType.displayName = "ListType";

export const NonNullType = createAstComponent<gql.NonNullTypeNode>(
  ({ node }) => {
    return (
      <Tokens className={bw`text-graphql-punctuation gap-0`}>
        <Abstract node={node.type} />!
      </Tokens>
    );
  }
);

NonNullType.displayName = "NonNullType";

export const Abstract = createAstComponent<gql.AbstractNode>(({ node }) => {
  switch (node.kind) {
    case "NamedType": {
      return <NamedType node={node} />;
    }
    case "ListType": {
      return <ListType node={node} />;
    }
  }
});

Abstract.displayName = "Abstract";

export const Abstracts = createAstComponent<gql.AbstractNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Abstract key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});

Abstracts.displayName = "Abstracts";

export const Definition = createAstComponent<gql.DefinitionNode>(({ node }) => {
  switch (node.kind) {
    case "OperationDefinition": {
      return <OperationDefinition node={node} />;
    }
    case "FragmentDefinition": {
      return <FragmentDefinition node={node} />;
    }
  }
});

Definition.displayName = "Definition";

export const Definitions = createAstComponent<gql.DefinitionNode[]>(
  ({ node }) => {
    return (
      <>
        {node.map((childNode) => (
          <Definition key={childNode.metadata.path} node={childNode} />
        ))}
      </>
    );
  }
);

Definitions.displayName = "Definitions";

export const Selection = createAstComponent<gql.SelectionNode>(
  ({ node, type, onToggle }) => {
    switch (node.kind) {
      case "Field": {
        return <Field node={node} type={type} onToggle={onToggle} />;
      }
      case "FragmentSpread": {
        return <FragmentSpread node={node} type={type} onToggle={onToggle} />;
      }
      case "InlineFragment": {
        return <InlineFragment node={node} onToggle={onToggle} />;
      }
    }
  }
);

Selection.displayName = "Selection";

export const Selections = createAstComponent<gql.SelectionNode[]>(
  ({ node, type, onRemove }) => {
    return (
      <>
        {node.map((childNode) => (
          <Selection
            key={childNode.metadata.path}
            node={childNode}
            type={type}
            onToggle={onRemove}
          />
        ))}
      </>
    );
  }
);

Selections.displayName = "Selections";

export const Value = createAstComponent<gql.ValueNode>(({ node }) => {
  if (!node) {
    return null;
  }

  switch (node.kind) {
    case "Variable": {
      return <Variable node={node} />;
    }
    case "IntValue": {
      return <IntValue node={node} />;
    }
    case "FloatValue": {
      return <FloatValue node={node} />;
    }
    case "StringValue": {
      return <StringValue node={node} />;
    }
    case "BooleanValue": {
      return <BooleanValue node={node} />;
    }
    case "NullValue": {
      return <NullValue node={node} />;
    }
    case "EnumValue": {
      return <EnumValue node={node} />;
    }
    case "ListValue": {
      return <ListValue node={node} />;
    }
    case "ObjectValue": {
      return <ObjectValue node={node} />;
    }
  }
});

Value.displayName = "Value";

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

export const Type = createAstComponent<gql.TypeNode>(({ node }) => {
  switch (node.kind) {
    case "NamedType": {
      return <NamedType node={node} />;
    }
    case "ListType": {
      return <ListType node={node} />;
    }
    case "NonNullType": {
      return <NonNullType node={node} />;
    }
  }
});

Type.displayName = "Type";

export const Types = createAstComponent<gql.TypeNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Type key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});

Types.displayName = "Types";
