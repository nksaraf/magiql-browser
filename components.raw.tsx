import React from "react";
import * as gql from "../ast-types";
import { atom, atomFamily } from "../lib/atom";
import { bw } from "@beamwind/play";

function createAstComponent<T>(
  Component: React.FC<{ node: T; [key: string]: any }>
) {
  return Component;
}

export const Name = createAstComponent<gql.NameNode>(({ node }) => {
  return (
    <div className={bw``}>
      <div>{JSON.stringify(node.value)}</div>
    </div>
  );
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
    return (
      <div className={bw``}>
        <div>{JSON.stringify(node.operation)}</div>
        <Name node={node.name} />
        <VariableDefinitions node={node.variableDefinitions} />
        <Directives node={node.directives} />
        <SelectionSet node={node.selectionSet} />
      </div>
    );
  }
);

OperationDefinition.displayName = "OperationDefinition";

export const VariableDefinition = createAstComponent<gql.VariableDefinitionNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Variable node={node.variable} />
        <Type node={node.type} />
        <Value node={node.defaultValue} />
        <Directives node={node.directives} />
      </div>
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
    <div className={bw``}>
      <Name node={node.name} />
    </div>
  );
});

Variable.displayName = "Variable";

export const SelectionSet = createAstComponent<gql.SelectionSetNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Selections node={node.selections} />
      </div>
    );
  }
);

SelectionSet.displayName = "SelectionSet";

export const Field = createAstComponent<gql.FieldNode>(({ node }) => {
  return (
    <div className={bw``}>
      <Name node={node.alias} />
      <Name node={node.name} />
      <Arguments node={node.arguments} />
      <Directives node={node.directives} />
      <SelectionSet node={node.selectionSet} />
    </div>
  );
});

Field.displayName = "Field";

export const Fields = createAstComponent<gql.FieldNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Field key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});

Fields.displayName = "Fields";

export const Argument = createAstComponent<gql.ArgumentNode>(({ node }) => {
  return (
    <div className={bw``}>
      <Name node={node.name} />
      <Value node={node.value} />
    </div>
  );
});

Argument.displayName = "Argument";

export const Arguments = createAstComponent<gql.ArgumentNode[]>(({ node }) => {
  return (
    <div>
      {node.map((childNode) => (
        <Argument key={childNode.metadata.path} node={childNode} />
      ))}
    </div>
  );
});

Arguments.displayName = "Arguments";

export const FragmentSpread = createAstComponent<gql.FragmentSpreadNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Name node={node.name} />
        <Directives node={node.directives} />
      </div>
    );
  }
);

FragmentSpread.displayName = "FragmentSpread";

export const InlineFragment = createAstComponent<gql.InlineFragmentNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <NamedType node={node.typeCondition} />
        <Directives node={node.directives} />
        <SelectionSet node={node.selectionSet} />
      </div>
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
    <div className={bw``}>
      <div>{JSON.stringify(node.value)}</div>
    </div>
  );
});

IntValue.displayName = "IntValue";

export const FloatValue = createAstComponent<gql.FloatValueNode>(({ node }) => {
  return (
    <div className={bw``}>
      <div>{JSON.stringify(node.value)}</div>
    </div>
  );
});

FloatValue.displayName = "FloatValue";

export const StringValue = createAstComponent<gql.StringValueNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <div>{JSON.stringify(node.value)}</div>
      </div>
    );
  }
);

StringValue.displayName = "StringValue";

export const BooleanValue = createAstComponent<gql.BooleanValueNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <div>{JSON.stringify(node.value)}</div>
      </div>
    );
  }
);

BooleanValue.displayName = "BooleanValue";

export const NullValue = createAstComponent<gql.NullValueNode>(({ node }) => {
  return <div className={bw``}></div>;
});

NullValue.displayName = "NullValue";

export const EnumValue = createAstComponent<gql.EnumValueNode>(({ node }) => {
  return (
    <div className={bw``}>
      <div>{JSON.stringify(node.value)}</div>
    </div>
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
  return (
    <div className={bw``}>
      <Name node={node.name} />
    </div>
  );
});

NamedType.displayName = "NamedType";

export const ListType = createAstComponent<gql.ListTypeNode>(({ node }) => {
  return (
    <div className={bw``}>
      <Type node={node.type} />
    </div>
  );
});

ListType.displayName = "ListType";

export const NonNullType = createAstComponent<gql.NonNullTypeNode>(
  ({ node }) => {
    return (
      <div className={bw``}>
        <Abstract node={node.type} />
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
      <div>
        {node.map((childNode) => (
          <Definition key={childNode.metadata.path} node={childNode} />
        ))}
      </div>
    );
  }
);

Definitions.displayName = "Definitions";

export const Selection = createAstComponent<gql.SelectionNode>(({ node }) => {
  switch (node.kind) {
    case "Field": {
      return <Field node={node} />;
    }
    case "FragmentSpread": {
      return <FragmentSpread node={node} />;
    }
    case "InlineFragment": {
      return <InlineFragment node={node} />;
    }
  }
});

Selection.displayName = "Selection";

export const Selections = createAstComponent<gql.SelectionNode[]>(
  ({ node }) => {
    return (
      <div>
        {node.map((childNode) => (
          <Selection key={childNode.metadata.path} node={childNode} />
        ))}
      </div>
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
