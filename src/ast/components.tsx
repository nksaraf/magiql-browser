import React from "react";
import * as gql from "../ast-types";
import { atom, atomFamily } from "../lib/atom";
import "./theme";
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
import { useSchema } from "./state";
import {
  getNamedType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLUnionType,
} from "graphql";
import { getTypes } from "./utils";

function createAstComponent<T>(
  Component: React.FC<{ node: T; [key: string]: any }>
) {
  return Component;
}

export const Name = createAstComponent<gql.NameNode>(({ node }) => {
  return <div className={bw`text-graphql-opname`}>{node.value}</div>;
});

Name.displayName = "Name";

export const Document = createAstComponent<gql.DocumentNode>(({ node }) => {
  return (
    <div className={bw``}>
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

    const type = getOperationType(node);

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
        {hasVars && node.metadata.isSelected && (
          <Indented>
            <VariableDefinitions node={node.variableDefinitions} />
          </Indented>
        )}
        {hasVars && node.metadata.isSelected && (
          <Tokens>
            <Punctuation>
              <span className={bw`pl-1`}>{") {"}</span>
            </Punctuation>
          </Tokens>
        )}
        {node.metadata.isSelected && (
          <Indented>
            <SelectionSet type={type} node={node.selectionSet} />
          </Indented>
        )}
        {node.metadata.isSelected && (
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        )}
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

export const SelectionSet = createAstComponent<gql.SelectionSetNode>(
  ({ node, type }) => {
    return (
      <Lines>
        <Selections node={node.selections} type={type} />
        {/* <UnselectedFields parentPath={parentPath} type={type} /> */}
        {/* <UnselectedTypes parentPath={parentPath} type={type} /> */}
      </Lines>
    );
  }
);

SelectionSet.displayName = "SelectionSet";

const ExpandableField = createAstComponent<gql.FieldNode>(
  ({ node, field = null }) => {
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
        <Tokens>
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

export const Field = createAstComponent<gql.FieldNode>(({ node, type }) => {
  if (type) {
    const field = type.getFields()[node.name.value];

    const fieldType = getNamedType(field.type);

    if (
      [
        "InterfaceTypeDefinition",
        "UnionTypeDefinition",
        "ObjectTypeDefinition",
      ].includes((fieldType as GraphQLNamedType).astNode?.kind)
    ) {
      return <ExpandableField node={node} field={field} />;
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
      <Tokens>
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
});

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
  ({ node }) => {
    const schema = useSchema();

    const type = schema.getType(node.typeCondition.name.value);

    return (
      <Lines>
        <Tokens>
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

InlineFragment.displayName = "InlineFragment";

export const FragmentDefinition = createAstComponent<gql.FragmentDefinitionNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Name node={node.name} />
        <VariableDefinitions node={node.variableDefinitions} />
        <NamedType node={node.typeCondition} />
        <Directives node={node.directives} />
        <SelectionSet node={node.selectionSet} />
      </div>
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
      <Tokens>
        <div className={bw`text-graphql-boolean`}>
          {JSON.stringify(node.value)}
        </div>
      </Tokens>
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
      <div className={bw`flex flex-col gap-6`}>
        {node.map((childNode) => (
          <Definition key={childNode.metadata.path} node={childNode} />
        ))}
      </div>
    );
  }
);

Definitions.displayName = "Definitions";

export const Selection = createAstComponent<gql.SelectionNode>(
  ({ node, type }) => {
    switch (node.kind) {
      case "Field": {
        return <Field node={node} type={type} />;
      }
      case "FragmentSpread": {
        return <FragmentSpread node={node} />;
      }
      case "InlineFragment": {
        return <InlineFragment node={node} />;
      }
    }
  }
);

Selection.displayName = "Selection";

export const Selections = createAstComponent<gql.SelectionNode[]>(
  ({ node, type }) => {
    return (
      <>
        {node.map((childNode) => (
          <Selection
            key={childNode.metadata.path}
            node={childNode}
            type={type}
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
