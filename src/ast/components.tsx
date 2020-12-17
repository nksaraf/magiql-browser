import React from "react";
import * as gql from "./types";
import { atom, atomFamily, useAtom, useUpdateAtom } from "../lib/atom";
import "../theme";
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

function createAstComponent<T extends gql.ASTNode | gql.ASTNode[]>(
  Component: React.FC<{ node: T; [key: string]: any }>
) {
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
            <VariableDefinitions node={node.variableDefinitions} />
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
    return (
      <Tokens>
        <Variable node={node.variable} />
        <Type node={node.type} />
        <Value node={node.defaultValue} />
        <Directives node={node.directives} />
      </Tokens>
    );
  }
);

VariableDefinition.displayName = "VariableDefinition";

export const VariableDefinitions = createAstComponent<
  gql.VariableDefinitionNode[]
>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <VariableDefinition key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
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

Variable.displayName = "Variable";

// function UnselectedFields({
//   parentPath,
//   type,
// }: {
//   type: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;
//   parentPath: string;
// }) {
//   const [selectionSet] = useAtom(ast.getSelectionSet(parentPath));
//   const schema = useSchema();

//   let unselectedFields = removeSelections(
//     getFields({ type, schema }),
//     selectionSet?.selections ?? [],
//     (item) => `${parentPath}.${item.name}`
//   );

//   return (
//     <>
//       {unselectedFields.map((field) => (
//         <Field
//           key={`${parentPath}.${field.name}`}
//           field={field}
//           path={`${parentPath}.${field.name}`}
//         />
//       ))}
//     </>
//   );
// }

// export const removeSelections = (list, selections, getPath) => {
//   let unselected = [...list];
//   selections?.forEach((selection) => {
//     const selectedField = unselected.find((item) =>
//       selection.startsWith(getPath(item))
//     );

//     if (selectedField) {
//       unselected = unselected.filter(
//         (type) => type.name !== selectedField.name
//       );
//     }
//   });
//   return unselected;
// };

// function UnselectedTypes({
//   node,
//   type,
// }: {
//   type: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;
//   node: gql.SelectionSetNode;
// }) {
//   const schema = useSchema();

//   let unselectedTypes = removeSelections(
//     [...getTypes({ type, schema })],
//     selectionSet?.selections ?? [],
//     (item) => `${parentPath}.${item.name}`
//   );

//   return (
//     <>
//       {unselectedTypes.map((type) => (
//         <InlineFragment
//           key={`${parentPath}.${type.name}`}
//           type={type}
//           path={`${parentPath}.${type.name}`}
//         />
//       ))}
//     </>
//   );
// }

function UnselectedField({ type, path, fieldtype, onToggle }) {
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
      onToggle={onToggle}
      type={type}
    />
  );
}

function UnselectedType({ type, path, onToggle }) {
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
      onToggle={onToggle}
      type={type}
    />
  );
}

export const SelectionSet = createAstComponent<gql.SelectionSetNode>(
  ({ node, type }) => {
    const schema = useSchema();
    const types = schema ? [...getTypes({ type, schema })] : [];
    const fields = schema ? [...getFields({ type, schema })] : [];
    const setSelectionSet = useUpdateNode({ node });
    const unselectedTypes = types.filter(
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
            onToggle={(field) => {
              setSelectionSet((old) => ({
                ...old,
                selections: (old.selections ?? []).filter(
                  (sel) => !(sel.metadata.path === field.metadata.path)
                ),
              }));
            }}
          />
        )}
        {unselectedTypes.map((sel, index) => (
          <UnselectedType
            type={sel}
            onToggle={(field) => {
              setSelectionSet((old) => ({
                ...old,
                selections: [...old.selections, field],
              }));
            }}
            key={node.metadata.path + "." + (node.selections.length + index)}
            path={node.metadata.path + "." + (node.selections.length + index)}
          />
        ))}
        {unselectedFields.map((sel, index) => (
          <UnselectedField
            type={type}
            onToggle={(field) => {
              setSelectionSet((old) => ({
                ...old,
                selections: [...old.selections, field],
              }));
            }}
            fieldtype={sel}
            key={
              node.metadata.path +
              "." +
              (node.selections.length + unselectedTypes.length + index)
            }
            path={
              node.metadata.path +
              "." +
              (node.selections.length + unselectedTypes.length + index)
            }
          />
        ))}
      </Lines>
    );
  }
);

SelectionSet.displayName = "SelectionSet";

const ExpandableField = createAstComponent<gql.FieldNode>(
  ({ node, field = null, onToggle }) => {
    const hasArgs = node.arguments && node.arguments.length > 0;

    const aliasedField = node?.alias?.value ? (
      <>
        <FieldName>{node.alias?.value}: </FieldName>
        <Qualifier>{node.name.value}</Qualifier>
      </>
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
          className={bw`${{ "opacity-40": !node.metadata.isSelected }}`}
        >
          <Arrow
            className={bw`text-graphql-field`}
            isOpen={node.metadata.isSelected}
          />
          {header}
        </Tokens>
        {hasArgs && node.metadata.isSelected && (
          <Indented>
            <Arguments node={node.arguments} />
          </Indented>
        )}
        {hasArgs && node.metadata.isSelected && (
          <Tokens className={bw`pl-1`}>
            <Punctuation>{") {"}</Punctuation>
          </Tokens>
        )}
        {node.metadata.isSelected && (
          <Indented>
            <SelectionSet
              node={node.selectionSet}
              type={field ? getNamedType(field.type) : undefined}
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
  }
);

ExpandableField.displayName = "ExpandableField";

export const Field = createAstComponent<gql.FieldNode>(
  ({ node, type, onToggle }) => {
    if (type) {
      const field = type.getFields()[node.name.value];
      if (!field?.type) {
        return null;
      }

      const fieldType = getNamedType(field.type);

      if (
        [
          "InterfaceTypeDefinition",
          "UnionTypeDefinition",
          "ObjectTypeDefinition",
        ].includes((fieldType as GraphQLNamedType).astNode?.kind)
      ) {
        return (
          <ExpandableField node={node} field={field} onToggle={onToggle} />
        );
      }
    } else if ((node.selectionSet?.selections ?? []).length > 0) {
      return <ExpandableField node={node} />;
    }

    const hasArgs = node.arguments && node.arguments.length > 0;

    const aliasedField = node?.alias?.value ? (
      <>
        <FieldName>{node.alias?.value}: </FieldName>
        <Qualifier>{node.name.value}</Qualifier>
      </>
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
        <Tokens
          onClick={() => onToggle(node)}
          className={bw`${{ "opacity-40": !node.metadata.isSelected }}`}
        >
          <Checkbox
            className={bw`text-graphql-field`}
            checked={node.metadata.isSelected}
          />
          {header}
        </Tokens>
        {node.metadata.isSelected && hasArgs && (
          <>
            <Indented>
              <Arguments node={node.arguments} />
            </Indented>
            <Tokens>
              <Punctuation>)</Punctuation>
            </Tokens>
          </>
        )}
      </Lines>
    );

    // return (
    //   <div className={bw``}>
    //     <Name node={node.alias} />
    //     <Name node={node.name} />
    //     <Arguments node={node.arguments} />
    //     <Directives node={node.directives} />
    //     <SelectionSet node={node.selectionSet} />
    //   </div>
    // );
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

export const Argument = createAstComponent<gql.ArgumentNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-argname`}>{node.name.value}: </div>
      <Value node={node.value} />
    </Tokens>
  );
});

Argument.displayName = "Argument";

export const Arguments = createAstComponent<gql.ArgumentNode[]>(({ node }) => {
  return (
    <Lines>
      {node.map((childNode) => (
        <Argument key={childNode.metadata.path} node={childNode} />
      ))}
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

    const fragmentType =
      schema ?? schema.getType(node.typeCondition.name.value);

    return (
      <Lines>
        <Tokens
          onClick={() => (!node.metadata.isSelected ? onToggle(node) : {})}
          className={bw`${{ "opacity-40": !node.metadata.isSelected }}`}
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
    <div className={bw``}>
      <Values node={node.values} />
    </div>
  );
});

ListValue.displayName = "ListValue";

export const ObjectValue = createAstComponent<gql.ObjectValueNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <ObjectFields node={node.fields} />
      </div>
    );
  }
);

ObjectValue.displayName = "ObjectValue";

export const ObjectField = createAstComponent<gql.ObjectFieldNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Name node={node.name} />
        <Value node={node.value} />
      </div>
    );
  }
);

ObjectField.displayName = "ObjectField";

export const ObjectFields = createAstComponent<gql.ObjectFieldNode[]>(
  ({ node }) => {
    return (
      <div>
        {node.map((childNode) => (
          <ObjectField key={childNode.metadata.path} node={childNode} />
        ))}
      </div>
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
    <div className={bw`text-graphql-punctuation`}>
      [<Type node={node.type} />]
    </div>
  );
});

ListType.displayName = "ListType";

export const NonNullType = createAstComponent<gql.NonNullTypeNode>(
  ({ node }) => {
    return (
      <div className={bw`text-graphql-punctuation`}>
        <Abstract node={node.type} />!
      </div>
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
  ({ node, type, onToggle }) => {
    return (
      <>
        {node.map((childNode) => (
          <Selection
            key={childNode.metadata.path}
            node={childNode}
            type={type}
            onToggle={onToggle}
          />
        ))}
      </>
    );
  }
);

Selections.displayName = "Selections";

export const Value = createAstComponent<gql.ValueNode>(({ node }) => {
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

export const Values = createAstComponent<gql.ValueNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Value key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});

Values.displayName = "Values";

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
