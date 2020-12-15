import * as gql from "./src/ast-types";
import { atom, atomFamily } from "./src/lib/atom";

export const getString = atomFamily<string | null>((path: string) => null);
export const getBoolean = atomFamily<boolean | null>((path: string) => null);
export const getNumber = atomFamily<number | null>((path: string) => null);

//  NameNode

export const getNameValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getString(`${path}[value]`), node.value);
  }
);

export const getName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return gql.name(get(getNameValue(path)));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    set(getNameValue(path), node.value);
  }
);

export const getNamePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.name(get(getNameValue(path)));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    set(getNameValue(path), node.value);
  }
);

export const getNames = atomFamily<gql.NameNode[] | null>(
  (path: string) => (get) => {
    return get(getNamePaths(path)).map((path) => get(getName(path)));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    set(getName);
  }
);

//  DocumentNode

export const getDocumentDefinitions = atomFamily(
  (path: string) => (get) => {
    return get(getDefinition(`${path}[definitions]`));
  },
  (path: string) => (get, set, node: gql.DocumentNode) => {}
);

export const getDocument = atomFamily<gql.DocumentNode | null>(
  (path: string) => (get) => {
    return gql.document(get(getDocumentDefinitions(path)));
  },
  (path: string) => (get, set, node: gql.DocumentNode) => {
    set(getDocumentDefinitions(path), node.definitions);
  }
);

export const getDocumentPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.document(get(getDocumentDefinitions(path)));
  },
  (path: string) => (get, set, node: gql.DocumentNode) => {
    set(getDocumentDefinitions(path), node.definitions);
  }
);

export const getDocuments = atomFamily<gql.DocumentNode[] | null>(
  (path: string) => (get) => {
    return get(getDocumentPaths(path)).map((path) => get(getDocument(path)));
  },
  (path: string) => (get, set, node: gql.DocumentNode) => {
    set(getDocument);
  }
);

//  OperationDefinitionNode

export const getOperationDefinitionOperation = atomFamily<gql.OperationTypeNode | null>(
  (path: string) => (get) => {
    return get(getOperationType(`${path}[operation]`));
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    return set(getOperationType(`${path}[operation]`), node.operation);
  }
);

export const getOperationDefinitionSelectionSet = atomFamily<gql.SelectionSetNode | null>(
  (path: string) => (get) => {
    return get(getSelectionSet(`${path}[selectionSet]`));
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    return set(getSelectionSet(`${path}[selectionSet]`), node.selectionSet);
  }
);

export const getOperationDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getOperationDefinitionVariableDefinitions = atomFamily(
  (path: string) => (get) => {
    return get(getVariableDefinition(`${path}[variableDefinitions]`));
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {}
);

export const getOperationDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {}
);

export const getOperationDefinition = atomFamily<gql.OperationDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.operationDefinition(
      get(getOperationDefinitionOperation(path)),
      get(getOperationDefinitionSelectionSet(path)),
      get(getOperationDefinitionName(path)),
      get(getOperationDefinitionVariableDefinitions(path)),
      get(getOperationDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    set(getOperationDefinitionOperation(path), node.operation),
      set(getOperationDefinitionSelectionSet(path), node.selectionSet),
      set(getOperationDefinitionName(path), node.name),
      set(
        getOperationDefinitionVariableDefinitions(path),
        node.variableDefinitions
      ),
      set(getOperationDefinitionDirectives(path), node.directives);
  }
);

export const getOperationDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.operationDefinition(
      get(getOperationDefinitionOperation(path)),
      get(getOperationDefinitionSelectionSet(path)),
      get(getOperationDefinitionName(path)),
      get(getOperationDefinitionVariableDefinitions(path)),
      get(getOperationDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    set(getOperationDefinitionOperation(path), node.operation),
      set(getOperationDefinitionSelectionSet(path), node.selectionSet),
      set(getOperationDefinitionName(path), node.name),
      set(
        getOperationDefinitionVariableDefinitions(path),
        node.variableDefinitions
      ),
      set(getOperationDefinitionDirectives(path), node.directives);
  }
);

export const getOperationDefinitions = atomFamily<
  gql.OperationDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getOperationDefinitionPaths(path)).map((path) =>
      get(getOperationDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    set(getOperationDefinition);
  }
);

//  VariableDefinitionNode

export const getVariableDefinitionVariable = atomFamily<gql.VariableNode | null>(
  (path: string) => (get) => {
    return get(getVariable(`${path}[variable]`));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    return set(getVariable(`${path}[variable]`), node.variable);
  }
);

export const getVariableDefinitionType = atomFamily<gql.TypeNode | null>(
  (path: string) => (get) => {
    return get(getType(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    return set(getType(`${path}[type]`), node.type);
  }
);

export const getVariableDefinitionDefaultValue = atomFamily<gql.ValueNode | null>(
  (path: string) => (get) => {
    return get(getValue(`${path}[defaultValue]`));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    return set(getValue(`${path}[defaultValue]`), node.defaultValue);
  }
);

export const getVariableDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {}
);

export const getVariableDefinition = atomFamily<gql.VariableDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.variableDefinition(
      get(getVariableDefinitionVariable(path)),
      get(getVariableDefinitionType(path)),
      get(getVariableDefinitionDefaultValue(path)),
      get(getVariableDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    set(getVariableDefinitionVariable(path), node.variable),
      set(getVariableDefinitionType(path), node.type),
      set(getVariableDefinitionDefaultValue(path), node.defaultValue),
      set(getVariableDefinitionDirectives(path), node.directives);
  }
);

export const getVariableDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.variableDefinition(
      get(getVariableDefinitionVariable(path)),
      get(getVariableDefinitionType(path)),
      get(getVariableDefinitionDefaultValue(path)),
      get(getVariableDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    set(getVariableDefinitionVariable(path), node.variable),
      set(getVariableDefinitionType(path), node.type),
      set(getVariableDefinitionDefaultValue(path), node.defaultValue),
      set(getVariableDefinitionDirectives(path), node.directives);
  }
);

export const getVariableDefinitions = atomFamily<
  gql.VariableDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getVariableDefinitionPaths(path)).map((path) =>
      get(getVariableDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    set(getVariableDefinition);
  }
);

//  VariableNode

export const getVariableName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getVariable = atomFamily<gql.VariableNode | null>(
  (path: string) => (get) => {
    return gql.variable(get(getVariableName(path)));
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    set(getVariableName(path), node.name);
  }
);

export const getVariablePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.variable(get(getVariableName(path)));
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    set(getVariableName(path), node.name);
  }
);

export const getVariables = atomFamily<gql.VariableNode[] | null>(
  (path: string) => (get) => {
    return get(getVariablePaths(path)).map((path) => get(getVariable(path)));
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    set(getVariable);
  }
);

//  SelectionSetNode

export const getSelectionSetSelections = atomFamily(
  (path: string) => (get) => {
    return get(getSelection(`${path}[selections]`));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {}
);

export const getSelectionSet = atomFamily<gql.SelectionSetNode | null>(
  (path: string) => (get) => {
    return gql.selectionSet(get(getSelectionSetSelections(path)));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    set(getSelectionSetSelections(path), node.selections);
  }
);

export const getSelectionSetPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.selectionSet(get(getSelectionSetSelections(path)));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    set(getSelectionSetSelections(path), node.selections);
  }
);

export const getSelectionSets = atomFamily<gql.SelectionSetNode[] | null>(
  (path: string) => (get) => {
    return get(getSelectionSetPaths(path)).map((path) =>
      get(getSelectionSet(path))
    );
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    set(getSelectionSet);
  }
);

//  FieldNode

export const getFieldName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getFieldAlias = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[alias]`));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    return set(getName(`${path}[alias]`), node.alias);
  }
);

export const getFieldArguments = atomFamily(
  (path: string) => (get) => {
    return get(getArgument(`${path}[arguments]`));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {}
);

export const getFieldDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {}
);

export const getFieldSelectionSet = atomFamily<gql.SelectionSetNode | null>(
  (path: string) => (get) => {
    return get(getSelectionSet(`${path}[selectionSet]`));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    return set(getSelectionSet(`${path}[selectionSet]`), node.selectionSet);
  }
);

export const getField = atomFamily<gql.FieldNode | null>(
  (path: string) => (get) => {
    return gql.field(
      get(getFieldName(path)),
      get(getFieldAlias(path)),
      get(getFieldArguments(path)),
      get(getFieldDirectives(path)),
      get(getFieldSelectionSet(path))
    );
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    set(getFieldName(path), node.name),
      set(getFieldAlias(path), node.alias),
      set(getFieldArguments(path), node.arguments),
      set(getFieldDirectives(path), node.directives),
      set(getFieldSelectionSet(path), node.selectionSet);
  }
);

export const getFieldPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.field(
      get(getFieldName(path)),
      get(getFieldAlias(path)),
      get(getFieldArguments(path)),
      get(getFieldDirectives(path)),
      get(getFieldSelectionSet(path))
    );
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    set(getFieldName(path), node.name),
      set(getFieldAlias(path), node.alias),
      set(getFieldArguments(path), node.arguments),
      set(getFieldDirectives(path), node.directives),
      set(getFieldSelectionSet(path), node.selectionSet);
  }
);

export const getFields = atomFamily<gql.FieldNode[] | null>(
  (path: string) => (get) => {
    return get(getFieldPaths(path)).map((path) => get(getField(path)));
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    set(getField);
  }
);

//  ArgumentNode

export const getArgumentName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getArgumentValue = atomFamily<gql.ValueNode | null>(
  (path: string) => (get) => {
    return get(getValue(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    return set(getValue(`${path}[value]`), node.value);
  }
);

export const getArgument = atomFamily<gql.ArgumentNode | null>(
  (path: string) => (get) => {
    return gql.argument(
      get(getArgumentName(path)),
      get(getArgumentValue(path))
    );
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    set(getArgumentName(path), node.name),
      set(getArgumentValue(path), node.value);
  }
);

export const getArgumentPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.argument(
      get(getArgumentName(path)),
      get(getArgumentValue(path))
    );
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    set(getArgumentName(path), node.name),
      set(getArgumentValue(path), node.value);
  }
);

export const getArguments = atomFamily<gql.ArgumentNode[] | null>(
  (path: string) => (get) => {
    return get(getArgumentPaths(path)).map((path) => get(getArgument(path)));
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    set(getArgument);
  }
);

//  FragmentSpreadNode

export const getFragmentSpreadName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getFragmentSpreadDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {}
);

export const getFragmentSpread = atomFamily<gql.FragmentSpreadNode | null>(
  (path: string) => (get) => {
    return gql.fragmentSpread(
      get(getFragmentSpreadName(path)),
      get(getFragmentSpreadDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {
    set(getFragmentSpreadName(path), node.name),
      set(getFragmentSpreadDirectives(path), node.directives);
  }
);

export const getFragmentSpreadPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.fragmentSpread(
      get(getFragmentSpreadName(path)),
      get(getFragmentSpreadDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {
    set(getFragmentSpreadName(path), node.name),
      set(getFragmentSpreadDirectives(path), node.directives);
  }
);

export const getFragmentSpreads = atomFamily<gql.FragmentSpreadNode[] | null>(
  (path: string) => (get) => {
    return get(getFragmentSpreadPaths(path)).map((path) =>
      get(getFragmentSpread(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {
    set(getFragmentSpread);
  }
);

//  InlineFragmentNode

export const getInlineFragmentSelectionSet = atomFamily<gql.SelectionSetNode | null>(
  (path: string) => (get) => {
    return get(getSelectionSet(`${path}[selectionSet]`));
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    return set(getSelectionSet(`${path}[selectionSet]`), node.selectionSet);
  }
);

export const getInlineFragmentTypeCondition = atomFamily<gql.NamedTypeNode | null>(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[typeCondition]`));
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    return set(getNamedType(`${path}[typeCondition]`), node.typeCondition);
  }
);

export const getInlineFragmentDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {}
);

export const getInlineFragment = atomFamily<gql.InlineFragmentNode | null>(
  (path: string) => (get) => {
    return gql.inlineFragment(
      get(getInlineFragmentSelectionSet(path)),
      get(getInlineFragmentTypeCondition(path)),
      get(getInlineFragmentDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    set(getInlineFragmentSelectionSet(path), node.selectionSet),
      set(getInlineFragmentTypeCondition(path), node.typeCondition),
      set(getInlineFragmentDirectives(path), node.directives);
  }
);

export const getInlineFragmentPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.inlineFragment(
      get(getInlineFragmentSelectionSet(path)),
      get(getInlineFragmentTypeCondition(path)),
      get(getInlineFragmentDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    set(getInlineFragmentSelectionSet(path), node.selectionSet),
      set(getInlineFragmentTypeCondition(path), node.typeCondition),
      set(getInlineFragmentDirectives(path), node.directives);
  }
);

export const getInlineFragments = atomFamily<gql.InlineFragmentNode[] | null>(
  (path: string) => (get) => {
    return get(getInlineFragmentPaths(path)).map((path) =>
      get(getInlineFragment(path))
    );
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    set(getInlineFragment);
  }
);

//  FragmentDefinitionNode

export const getFragmentDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getFragmentDefinitionTypeCondition = atomFamily<gql.NamedTypeNode | null>(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[typeCondition]`));
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    return set(getNamedType(`${path}[typeCondition]`), node.typeCondition);
  }
);

export const getFragmentDefinitionSelectionSet = atomFamily<gql.SelectionSetNode | null>(
  (path: string) => (get) => {
    return get(getSelectionSet(`${path}[selectionSet]`));
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    return set(getSelectionSet(`${path}[selectionSet]`), node.selectionSet);
  }
);

export const getFragmentDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {}
);

export const getFragmentDefinition = atomFamily<gql.FragmentDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.fragmentDefinition(
      get(getFragmentDefinitionName(path)),
      get(getFragmentDefinitionTypeCondition(path)),
      get(getFragmentDefinitionSelectionSet(path)),
      get(getFragmentDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    set(getFragmentDefinitionName(path), node.name),
      set(getFragmentDefinitionTypeCondition(path), node.typeCondition),
      set(getFragmentDefinitionSelectionSet(path), node.selectionSet),
      set(getFragmentDefinitionDirectives(path), node.directives);
  }
);

export const getFragmentDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.fragmentDefinition(
      get(getFragmentDefinitionName(path)),
      get(getFragmentDefinitionTypeCondition(path)),
      get(getFragmentDefinitionSelectionSet(path)),
      get(getFragmentDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    set(getFragmentDefinitionName(path), node.name),
      set(getFragmentDefinitionTypeCondition(path), node.typeCondition),
      set(getFragmentDefinitionSelectionSet(path), node.selectionSet),
      set(getFragmentDefinitionDirectives(path), node.directives);
  }
);

export const getFragmentDefinitions = atomFamily<
  gql.FragmentDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getFragmentDefinitionPaths(path)).map((path) =>
      get(getFragmentDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    set(getFragmentDefinition);
  }
);

//  IntValueNode

export const getIntValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.IntValueNode) => {
    return set(getString(`${path}[value]`), node.value);
  }
);

export const getIntValue = atomFamily<gql.IntValueNode | null>(
  (path: string) => (get) => {
    return gql.intValue(get(getIntValueValue(path)));
  },
  (path: string) => (get, set, node: gql.IntValueNode) => {
    set(getIntValueValue(path), node.value);
  }
);

export const getIntValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.intValue(get(getIntValueValue(path)));
  },
  (path: string) => (get, set, node: gql.IntValueNode) => {
    set(getIntValueValue(path), node.value);
  }
);

export const getIntValues = atomFamily<gql.IntValueNode[] | null>(
  (path: string) => (get) => {
    return get(getIntValuePaths(path)).map((path) => get(getIntValue(path)));
  },
  (path: string) => (get, set, node: gql.IntValueNode) => {
    set(getIntValue);
  }
);

//  FloatValueNode

export const getFloatValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.FloatValueNode) => {
    return set(getString(`${path}[value]`), node.value);
  }
);

export const getFloatValue = atomFamily<gql.FloatValueNode | null>(
  (path: string) => (get) => {
    return gql.floatValue(get(getFloatValueValue(path)));
  },
  (path: string) => (get, set, node: gql.FloatValueNode) => {
    set(getFloatValueValue(path), node.value);
  }
);

export const getFloatValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.floatValue(get(getFloatValueValue(path)));
  },
  (path: string) => (get, set, node: gql.FloatValueNode) => {
    set(getFloatValueValue(path), node.value);
  }
);

export const getFloatValues = atomFamily<gql.FloatValueNode[] | null>(
  (path: string) => (get) => {
    return get(getFloatValuePaths(path)).map((path) =>
      get(getFloatValue(path))
    );
  },
  (path: string) => (get, set, node: gql.FloatValueNode) => {
    set(getFloatValue);
  }
);

//  StringValueNode

export const getStringValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.StringValueNode) => {
    return set(getString(`${path}[value]`), node.value);
  }
);

export const getStringValue = atomFamily<gql.StringValueNode | null>(
  (path: string) => (get) => {
    return gql.stringValue(get(getStringValueValue(path)));
  },
  (path: string) => (get, set, node: gql.StringValueNode) => {
    set(getStringValueValue(path), node.value);
  }
);

export const getStringValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.stringValue(get(getStringValueValue(path)));
  },
  (path: string) => (get, set, node: gql.StringValueNode) => {
    set(getStringValueValue(path), node.value);
  }
);

export const getStringValues = atomFamily<gql.StringValueNode[] | null>(
  (path: string) => (get) => {
    return get(getStringValuePaths(path)).map((path) =>
      get(getStringValue(path))
    );
  },
  (path: string) => (get, set, node: gql.StringValueNode) => {
    set(getStringValue);
  }
);

//  BooleanValueNode

export const getBooleanValueValue = atomFamily<boolean>(
  (path: string) => (get) => {
    return get(getBoolean(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.BooleanValueNode) => {
    return set(getBoolean(`${path}[value]`), node.value);
  }
);

export const getBooleanValue = atomFamily<gql.BooleanValueNode | null>(
  (path: string) => (get) => {
    return gql.booleanValue(get(getBooleanValueValue(path)));
  },
  (path: string) => (get, set, node: gql.BooleanValueNode) => {
    set(getBooleanValueValue(path), node.value);
  }
);

export const getBooleanValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.booleanValue(get(getBooleanValueValue(path)));
  },
  (path: string) => (get, set, node: gql.BooleanValueNode) => {
    set(getBooleanValueValue(path), node.value);
  }
);

export const getBooleanValues = atomFamily<gql.BooleanValueNode[] | null>(
  (path: string) => (get) => {
    return get(getBooleanValuePaths(path)).map((path) =>
      get(getBooleanValue(path))
    );
  },
  (path: string) => (get, set, node: gql.BooleanValueNode) => {
    set(getBooleanValue);
  }
);

//  NullValueNode

export const getNullValue = atomFamily<gql.NullValueNode | null>(
  (path: string) => (get) => {
    return gql.nullValue();
  },
  (path: string) => (get, set, node: gql.NullValueNode) => {}
);

export const getNullValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.nullValue();
  },
  (path: string) => (get, set, node: gql.NullValueNode) => {}
);

export const getNullValues = atomFamily<gql.NullValueNode[] | null>(
  (path: string) => (get) => {
    return get(getNullValuePaths(path)).map((path) => get(getNullValue(path)));
  },
  (path: string) => (get, set, node: gql.NullValueNode) => {
    set(getNullValue);
  }
);

//  EnumValueNode

export const getEnumValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.EnumValueNode) => {
    return set(getString(`${path}[value]`), node.value);
  }
);

export const getEnumValue = atomFamily<gql.EnumValueNode | null>(
  (path: string) => (get) => {
    return gql.enumValue(get(getEnumValueValue(path)));
  },
  (path: string) => (get, set, node: gql.EnumValueNode) => {
    set(getEnumValueValue(path), node.value);
  }
);

export const getEnumValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.enumValue(get(getEnumValueValue(path)));
  },
  (path: string) => (get, set, node: gql.EnumValueNode) => {
    set(getEnumValueValue(path), node.value);
  }
);

export const getEnumValues = atomFamily<gql.EnumValueNode[] | null>(
  (path: string) => (get) => {
    return get(getEnumValuePaths(path)).map((path) => get(getEnumValue(path)));
  },
  (path: string) => (get, set, node: gql.EnumValueNode) => {
    set(getEnumValue);
  }
);

//  ListValueNode

export const getListValueValues = atomFamily(
  (path: string) => (get) => {
    return get(getValue(`${path}[values]`));
  },
  (path: string) => (get, set, node: gql.ListValueNode) => {}
);

export const getListValue = atomFamily<gql.ListValueNode | null>(
  (path: string) => (get) => {
    return gql.listValue(get(getListValueValues(path)));
  },
  (path: string) => (get, set, node: gql.ListValueNode) => {
    set(getListValueValues(path), node.values);
  }
);

export const getListValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.listValue(get(getListValueValues(path)));
  },
  (path: string) => (get, set, node: gql.ListValueNode) => {
    set(getListValueValues(path), node.values);
  }
);

export const getListValues = atomFamily<gql.ListValueNode[] | null>(
  (path: string) => (get) => {
    return get(getListValuePaths(path)).map((path) => get(getListValue(path)));
  },
  (path: string) => (get, set, node: gql.ListValueNode) => {
    set(getListValue);
  }
);

//  ObjectValueNode

export const getObjectValueFields = atomFamily(
  (path: string) => (get) => {
    return get(getObjectField(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.ObjectValueNode) => {}
);

export const getObjectValue = atomFamily<gql.ObjectValueNode | null>(
  (path: string) => (get) => {
    return gql.objectValue(get(getObjectValueFields(path)));
  },
  (path: string) => (get, set, node: gql.ObjectValueNode) => {
    set(getObjectValueFields(path), node.fields);
  }
);

export const getObjectValuePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.objectValue(get(getObjectValueFields(path)));
  },
  (path: string) => (get, set, node: gql.ObjectValueNode) => {
    set(getObjectValueFields(path), node.fields);
  }
);

export const getObjectValues = atomFamily<gql.ObjectValueNode[] | null>(
  (path: string) => (get) => {
    return get(getObjectValuePaths(path)).map((path) =>
      get(getObjectValue(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectValueNode) => {
    set(getObjectValue);
  }
);

//  ObjectFieldNode

export const getObjectFieldName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getObjectFieldValue = atomFamily<gql.ValueNode | null>(
  (path: string) => (get) => {
    return get(getValue(`${path}[value]`));
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    return set(getValue(`${path}[value]`), node.value);
  }
);

export const getObjectField = atomFamily<gql.ObjectFieldNode | null>(
  (path: string) => (get) => {
    return gql.objectField(
      get(getObjectFieldName(path)),
      get(getObjectFieldValue(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    set(getObjectFieldName(path), node.name),
      set(getObjectFieldValue(path), node.value);
  }
);

export const getObjectFieldPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.objectField(
      get(getObjectFieldName(path)),
      get(getObjectFieldValue(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    set(getObjectFieldName(path), node.name),
      set(getObjectFieldValue(path), node.value);
  }
);

export const getObjectFields = atomFamily<gql.ObjectFieldNode[] | null>(
  (path: string) => (get) => {
    return get(getObjectFieldPaths(path)).map((path) =>
      get(getObjectField(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    set(getObjectField);
  }
);

//  DirectiveNode

export const getDirectiveName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getDirectiveArguments = atomFamily(
  (path: string) => (get) => {
    return get(getArgument(`${path}[arguments]`));
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {}
);

export const getDirective = atomFamily<gql.DirectiveNode | null>(
  (path: string) => (get) => {
    return gql.directive(
      get(getDirectiveName(path)),
      get(getDirectiveArguments(path))
    );
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {
    set(getDirectiveName(path), node.name),
      set(getDirectiveArguments(path), node.arguments);
  }
);

export const getDirectivePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.directive(
      get(getDirectiveName(path)),
      get(getDirectiveArguments(path))
    );
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {
    set(getDirectiveName(path), node.name),
      set(getDirectiveArguments(path), node.arguments);
  }
);

export const getDirectives = atomFamily<gql.DirectiveNode[] | null>(
  (path: string) => (get) => {
    return get(getDirectivePaths(path)).map((path) => get(getDirective(path)));
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {
    set(getDirective);
  }
);

//  NamedTypeNode

export const getNamedTypeName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getNamedType = atomFamily<gql.NamedTypeNode | null>(
  (path: string) => (get) => {
    return gql.namedType(get(getNamedTypeName(path)));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    set(getNamedTypeName(path), node.name);
  }
);

export const getNamedTypePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.namedType(get(getNamedTypeName(path)));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    set(getNamedTypeName(path), node.name);
  }
);

export const getNamedTypes = atomFamily<gql.NamedTypeNode[] | null>(
  (path: string) => (get) => {
    return get(getNamedTypePaths(path)).map((path) => get(getNamedType(path)));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    set(getNamedType);
  }
);

//  ListTypeNode

export const getListTypeType = atomFamily<gql.TypeNode | null>(
  (path: string) => (get) => {
    return get(getType(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.ListTypeNode) => {
    return set(getType(`${path}[type]`), node.type);
  }
);

export const getListType = atomFamily<gql.ListTypeNode | null>(
  (path: string) => (get) => {
    return gql.listType(get(getListTypeType(path)));
  },
  (path: string) => (get, set, node: gql.ListTypeNode) => {
    set(getListTypeType(path), node.type);
  }
);

export const getListTypePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.listType(get(getListTypeType(path)));
  },
  (path: string) => (get, set, node: gql.ListTypeNode) => {
    set(getListTypeType(path), node.type);
  }
);

export const getListTypes = atomFamily<gql.ListTypeNode[] | null>(
  (path: string) => (get) => {
    return get(getListTypePaths(path)).map((path) => get(getListType(path)));
  },
  (path: string) => (get, set, node: gql.ListTypeNode) => {
    set(getListType);
  }
);

//  NonNullTypeNode

export const getNonNullTypeType = atomFamily<
  gql.NamedTypeNode | ListTypeNode | null
>(
  (path: string) => (get) => {
    return get(getNamedType | ListTypeNode(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.NonNullTypeNode) => {
    return set(getNamedType | ListTypeNode(`${path}[type]`), node.type);
  }
);

export const getNonNullType = atomFamily<gql.NonNullTypeNode | null>(
  (path: string) => (get) => {
    return gql.nonNullType(get(getNonNullTypeType(path)));
  },
  (path: string) => (get, set, node: gql.NonNullTypeNode) => {
    set(getNonNullTypeType(path), node.type);
  }
);

export const getNonNullTypePaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.nonNullType(get(getNonNullTypeType(path)));
  },
  (path: string) => (get, set, node: gql.NonNullTypeNode) => {
    set(getNonNullTypeType(path), node.type);
  }
);

export const getNonNullTypes = atomFamily<gql.NonNullTypeNode[] | null>(
  (path: string) => (get) => {
    return get(getNonNullTypePaths(path)).map((path) =>
      get(getNonNullType(path))
    );
  },
  (path: string) => (get, set, node: gql.NonNullTypeNode) => {
    set(getNonNullType);
  }
);

//  SchemaDefinitionNode

export const getSchemaDefinitionOperationTypes = atomFamily(
  (path: string) => (get) => {
    return get(getOperationTypeDefinition(`${path}[operationTypes]`));
  },
  (path: string) => (get, set, node: gql.SchemaDefinitionNode) => {}
);

export const getSchemaDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.SchemaDefinitionNode) => {}
);

export const getSchemaDefinition = atomFamily<gql.SchemaDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.schemaDefinition(
      get(getSchemaDefinitionOperationTypes(path)),
      get(getSchemaDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaDefinitionNode) => {
    set(getSchemaDefinitionOperationTypes(path), node.operationTypes),
      set(getSchemaDefinitionDirectives(path), node.directives);
  }
);

export const getSchemaDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.schemaDefinition(
      get(getSchemaDefinitionOperationTypes(path)),
      get(getSchemaDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaDefinitionNode) => {
    set(getSchemaDefinitionOperationTypes(path), node.operationTypes),
      set(getSchemaDefinitionDirectives(path), node.directives);
  }
);

export const getSchemaDefinitions = atomFamily<
  gql.SchemaDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getSchemaDefinitionPaths(path)).map((path) =>
      get(getSchemaDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaDefinitionNode) => {
    set(getSchemaDefinition);
  }
);

//  OperationTypeDefinitionNode

export const getOperationTypeDefinitionOperation = atomFamily<gql.OperationTypeNode | null>(
  (path: string) => (get) => {
    return get(getOperationType(`${path}[operation]`));
  },
  (path: string) => (get, set, node: gql.OperationTypeDefinitionNode) => {
    return set(getOperationType(`${path}[operation]`), node.operation);
  }
);

export const getOperationTypeDefinitionType = atomFamily<gql.NamedTypeNode | null>(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.OperationTypeDefinitionNode) => {
    return set(getNamedType(`${path}[type]`), node.type);
  }
);

export const getOperationTypeDefinition = atomFamily<gql.OperationTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.operationTypeDefinition(
      get(getOperationTypeDefinitionOperation(path)),
      get(getOperationTypeDefinitionType(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationTypeDefinitionNode) => {
    set(getOperationTypeDefinitionOperation(path), node.operation),
      set(getOperationTypeDefinitionType(path), node.type);
  }
);

export const getOperationTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.operationTypeDefinition(
      get(getOperationTypeDefinitionOperation(path)),
      get(getOperationTypeDefinitionType(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationTypeDefinitionNode) => {
    set(getOperationTypeDefinitionOperation(path), node.operation),
      set(getOperationTypeDefinitionType(path), node.type);
  }
);

export const getOperationTypeDefinitions = atomFamily<
  gql.OperationTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getOperationTypeDefinitionPaths(path)).map((path) =>
      get(getOperationTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.OperationTypeDefinitionNode) => {
    set(getOperationTypeDefinition);
  }
);

//  ScalarTypeDefinitionNode

export const getScalarTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ScalarTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getScalarTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.ScalarTypeDefinitionNode) => {}
);

export const getScalarTypeDefinition = atomFamily<gql.ScalarTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.scalarTypeDefinition(
      get(getScalarTypeDefinitionName(path)),
      get(getScalarTypeDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeDefinitionNode) => {
    set(getScalarTypeDefinitionName(path), node.name),
      set(getScalarTypeDefinitionDirectives(path), node.directives);
  }
);

export const getScalarTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.scalarTypeDefinition(
      get(getScalarTypeDefinitionName(path)),
      get(getScalarTypeDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeDefinitionNode) => {
    set(getScalarTypeDefinitionName(path), node.name),
      set(getScalarTypeDefinitionDirectives(path), node.directives);
  }
);

export const getScalarTypeDefinitions = atomFamily<
  gql.ScalarTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getScalarTypeDefinitionPaths(path)).map((path) =>
      get(getScalarTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeDefinitionNode) => {
    set(getScalarTypeDefinition);
  }
);

//  ObjectTypeDefinitionNode

export const getObjectTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getObjectTypeDefinitionInterfaces = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[interfaces]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {}
);

export const getObjectTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {}
);

export const getObjectTypeDefinitionFields = atomFamily(
  (path: string) => (get) => {
    return get(getFieldDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {}
);

export const getObjectTypeDefinition = atomFamily<gql.ObjectTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.objectTypeDefinition(
      get(getObjectTypeDefinitionName(path)),
      get(getObjectTypeDefinitionInterfaces(path)),
      get(getObjectTypeDefinitionDirectives(path)),
      get(getObjectTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {
    set(getObjectTypeDefinitionName(path), node.name),
      set(getObjectTypeDefinitionInterfaces(path), node.interfaces),
      set(getObjectTypeDefinitionDirectives(path), node.directives),
      set(getObjectTypeDefinitionFields(path), node.fields);
  }
);

export const getObjectTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.objectTypeDefinition(
      get(getObjectTypeDefinitionName(path)),
      get(getObjectTypeDefinitionInterfaces(path)),
      get(getObjectTypeDefinitionDirectives(path)),
      get(getObjectTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {
    set(getObjectTypeDefinitionName(path), node.name),
      set(getObjectTypeDefinitionInterfaces(path), node.interfaces),
      set(getObjectTypeDefinitionDirectives(path), node.directives),
      set(getObjectTypeDefinitionFields(path), node.fields);
  }
);

export const getObjectTypeDefinitions = atomFamily<
  gql.ObjectTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getObjectTypeDefinitionPaths(path)).map((path) =>
      get(getObjectTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeDefinitionNode) => {
    set(getObjectTypeDefinition);
  }
);

//  FieldDefinitionNode

export const getFieldDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getFieldDefinitionType = atomFamily<gql.TypeNode | null>(
  (path: string) => (get) => {
    return get(getType(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {
    return set(getType(`${path}[type]`), node.type);
  }
);

export const getFieldDefinitionArguments = atomFamily(
  (path: string) => (get) => {
    return get(getInputValueDefinition(`${path}[arguments]`));
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {}
);

export const getFieldDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {}
);

export const getFieldDefinition = atomFamily<gql.FieldDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.fieldDefinition(
      get(getFieldDefinitionName(path)),
      get(getFieldDefinitionType(path)),
      get(getFieldDefinitionArguments(path)),
      get(getFieldDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {
    set(getFieldDefinitionName(path), node.name),
      set(getFieldDefinitionType(path), node.type),
      set(getFieldDefinitionArguments(path), node.arguments),
      set(getFieldDefinitionDirectives(path), node.directives);
  }
);

export const getFieldDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.fieldDefinition(
      get(getFieldDefinitionName(path)),
      get(getFieldDefinitionType(path)),
      get(getFieldDefinitionArguments(path)),
      get(getFieldDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {
    set(getFieldDefinitionName(path), node.name),
      set(getFieldDefinitionType(path), node.type),
      set(getFieldDefinitionArguments(path), node.arguments),
      set(getFieldDefinitionDirectives(path), node.directives);
  }
);

export const getFieldDefinitions = atomFamily<gql.FieldDefinitionNode[] | null>(
  (path: string) => (get) => {
    return get(getFieldDefinitionPaths(path)).map((path) =>
      get(getFieldDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.FieldDefinitionNode) => {
    set(getFieldDefinition);
  }
);

//  InputValueDefinitionNode

export const getInputValueDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getInputValueDefinitionType = atomFamily<gql.TypeNode | null>(
  (path: string) => (get) => {
    return get(getType(`${path}[type]`));
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    return set(getType(`${path}[type]`), node.type);
  }
);

export const getInputValueDefinitionDefaultValue = atomFamily<gql.ValueNode | null>(
  (path: string) => (get) => {
    return get(getValue(`${path}[defaultValue]`));
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    return set(getValue(`${path}[defaultValue]`), node.defaultValue);
  }
);

export const getInputValueDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {}
);

export const getInputValueDefinition = atomFamily<gql.InputValueDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.inputValueDefinition(
      get(getInputValueDefinitionName(path)),
      get(getInputValueDefinitionType(path)),
      get(getInputValueDefinitionDefaultValue(path)),
      get(getInputValueDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    set(getInputValueDefinitionName(path), node.name),
      set(getInputValueDefinitionType(path), node.type),
      set(getInputValueDefinitionDefaultValue(path), node.defaultValue),
      set(getInputValueDefinitionDirectives(path), node.directives);
  }
);

export const getInputValueDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.inputValueDefinition(
      get(getInputValueDefinitionName(path)),
      get(getInputValueDefinitionType(path)),
      get(getInputValueDefinitionDefaultValue(path)),
      get(getInputValueDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    set(getInputValueDefinitionName(path), node.name),
      set(getInputValueDefinitionType(path), node.type),
      set(getInputValueDefinitionDefaultValue(path), node.defaultValue),
      set(getInputValueDefinitionDirectives(path), node.directives);
  }
);

export const getInputValueDefinitions = atomFamily<
  gql.InputValueDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getInputValueDefinitionPaths(path)).map((path) =>
      get(getInputValueDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.InputValueDefinitionNode) => {
    set(getInputValueDefinition);
  }
);

//  InterfaceTypeDefinitionNode

export const getInterfaceTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getInterfaceTypeDefinitionInterfaces = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[interfaces]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {}
);

export const getInterfaceTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {}
);

export const getInterfaceTypeDefinitionFields = atomFamily(
  (path: string) => (get) => {
    return get(getFieldDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {}
);

export const getInterfaceTypeDefinition = atomFamily<gql.InterfaceTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.interfaceTypeDefinition(
      get(getInterfaceTypeDefinitionName(path)),
      get(getInterfaceTypeDefinitionInterfaces(path)),
      get(getInterfaceTypeDefinitionDirectives(path)),
      get(getInterfaceTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {
    set(getInterfaceTypeDefinitionName(path), node.name),
      set(getInterfaceTypeDefinitionInterfaces(path), node.interfaces),
      set(getInterfaceTypeDefinitionDirectives(path), node.directives),
      set(getInterfaceTypeDefinitionFields(path), node.fields);
  }
);

export const getInterfaceTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.interfaceTypeDefinition(
      get(getInterfaceTypeDefinitionName(path)),
      get(getInterfaceTypeDefinitionInterfaces(path)),
      get(getInterfaceTypeDefinitionDirectives(path)),
      get(getInterfaceTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {
    set(getInterfaceTypeDefinitionName(path), node.name),
      set(getInterfaceTypeDefinitionInterfaces(path), node.interfaces),
      set(getInterfaceTypeDefinitionDirectives(path), node.directives),
      set(getInterfaceTypeDefinitionFields(path), node.fields);
  }
);

export const getInterfaceTypeDefinitions = atomFamily<
  gql.InterfaceTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getInterfaceTypeDefinitionPaths(path)).map((path) =>
      get(getInterfaceTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeDefinitionNode) => {
    set(getInterfaceTypeDefinition);
  }
);

//  UnionTypeDefinitionNode

export const getUnionTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getUnionTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {}
);

export const getUnionTypeDefinitionTypes = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[types]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {}
);

export const getUnionTypeDefinition = atomFamily<gql.UnionTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.unionTypeDefinition(
      get(getUnionTypeDefinitionName(path)),
      get(getUnionTypeDefinitionDirectives(path)),
      get(getUnionTypeDefinitionTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {
    set(getUnionTypeDefinitionName(path), node.name),
      set(getUnionTypeDefinitionDirectives(path), node.directives),
      set(getUnionTypeDefinitionTypes(path), node.types);
  }
);

export const getUnionTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.unionTypeDefinition(
      get(getUnionTypeDefinitionName(path)),
      get(getUnionTypeDefinitionDirectives(path)),
      get(getUnionTypeDefinitionTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {
    set(getUnionTypeDefinitionName(path), node.name),
      set(getUnionTypeDefinitionDirectives(path), node.directives),
      set(getUnionTypeDefinitionTypes(path), node.types);
  }
);

export const getUnionTypeDefinitions = atomFamily<
  gql.UnionTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getUnionTypeDefinitionPaths(path)).map((path) =>
      get(getUnionTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeDefinitionNode) => {
    set(getUnionTypeDefinition);
  }
);

//  EnumTypeDefinitionNode

export const getEnumTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getEnumTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {}
);

export const getEnumTypeDefinitionValues = atomFamily(
  (path: string) => (get) => {
    return get(getEnumValueDefinition(`${path}[values]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {}
);

export const getEnumTypeDefinition = atomFamily<gql.EnumTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.enumTypeDefinition(
      get(getEnumTypeDefinitionName(path)),
      get(getEnumTypeDefinitionDirectives(path)),
      get(getEnumTypeDefinitionValues(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {
    set(getEnumTypeDefinitionName(path), node.name),
      set(getEnumTypeDefinitionDirectives(path), node.directives),
      set(getEnumTypeDefinitionValues(path), node.values);
  }
);

export const getEnumTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.enumTypeDefinition(
      get(getEnumTypeDefinitionName(path)),
      get(getEnumTypeDefinitionDirectives(path)),
      get(getEnumTypeDefinitionValues(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {
    set(getEnumTypeDefinitionName(path), node.name),
      set(getEnumTypeDefinitionDirectives(path), node.directives),
      set(getEnumTypeDefinitionValues(path), node.values);
  }
);

export const getEnumTypeDefinitions = atomFamily<
  gql.EnumTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getEnumTypeDefinitionPaths(path)).map((path) =>
      get(getEnumTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeDefinitionNode) => {
    set(getEnumTypeDefinition);
  }
);

//  EnumValueDefinitionNode

export const getEnumValueDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.EnumValueDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getEnumValueDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.EnumValueDefinitionNode) => {}
);

export const getEnumValueDefinition = atomFamily<gql.EnumValueDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.enumValueDefinition(
      get(getEnumValueDefinitionName(path)),
      get(getEnumValueDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumValueDefinitionNode) => {
    set(getEnumValueDefinitionName(path), node.name),
      set(getEnumValueDefinitionDirectives(path), node.directives);
  }
);

export const getEnumValueDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.enumValueDefinition(
      get(getEnumValueDefinitionName(path)),
      get(getEnumValueDefinitionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumValueDefinitionNode) => {
    set(getEnumValueDefinitionName(path), node.name),
      set(getEnumValueDefinitionDirectives(path), node.directives);
  }
);

export const getEnumValueDefinitions = atomFamily<
  gql.EnumValueDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getEnumValueDefinitionPaths(path)).map((path) =>
      get(getEnumValueDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumValueDefinitionNode) => {
    set(getEnumValueDefinition);
  }
);

//  InputObjectTypeDefinitionNode

export const getInputObjectTypeDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getInputObjectTypeDefinitionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {}
);

export const getInputObjectTypeDefinitionFields = atomFamily(
  (path: string) => (get) => {
    return get(getInputValueDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {}
);

export const getInputObjectTypeDefinition = atomFamily<gql.InputObjectTypeDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.inputObjectTypeDefinition(
      get(getInputObjectTypeDefinitionName(path)),
      get(getInputObjectTypeDefinitionDirectives(path)),
      get(getInputObjectTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {
    set(getInputObjectTypeDefinitionName(path), node.name),
      set(getInputObjectTypeDefinitionDirectives(path), node.directives),
      set(getInputObjectTypeDefinitionFields(path), node.fields);
  }
);

export const getInputObjectTypeDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.inputObjectTypeDefinition(
      get(getInputObjectTypeDefinitionName(path)),
      get(getInputObjectTypeDefinitionDirectives(path)),
      get(getInputObjectTypeDefinitionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {
    set(getInputObjectTypeDefinitionName(path), node.name),
      set(getInputObjectTypeDefinitionDirectives(path), node.directives),
      set(getInputObjectTypeDefinitionFields(path), node.fields);
  }
);

export const getInputObjectTypeDefinitions = atomFamily<
  gql.InputObjectTypeDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getInputObjectTypeDefinitionPaths(path)).map((path) =>
      get(getInputObjectTypeDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeDefinitionNode) => {
    set(getInputObjectTypeDefinition);
  }
);

//  DirectiveDefinitionNode

export const getDirectiveDefinitionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getDirectiveDefinitionLocations = atomFamily(
  (path: string) => (get) => {
    return get(getName(`${path}[locations]`));
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {}
);

export const getDirectiveDefinitionArguments = atomFamily(
  (path: string) => (get) => {
    return get(getInputValueDefinition(`${path}[arguments]`));
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {}
);

export const getDirectiveDefinition = atomFamily<gql.DirectiveDefinitionNode | null>(
  (path: string) => (get) => {
    return gql.directiveDefinition(
      get(getDirectiveDefinitionName(path)),
      get(getDirectiveDefinitionLocations(path)),
      get(getDirectiveDefinitionArguments(path))
    );
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {
    set(getDirectiveDefinitionName(path), node.name),
      set(getDirectiveDefinitionLocations(path), node.locations),
      set(getDirectiveDefinitionArguments(path), node.arguments);
  }
);

export const getDirectiveDefinitionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.directiveDefinition(
      get(getDirectiveDefinitionName(path)),
      get(getDirectiveDefinitionLocations(path)),
      get(getDirectiveDefinitionArguments(path))
    );
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {
    set(getDirectiveDefinitionName(path), node.name),
      set(getDirectiveDefinitionLocations(path), node.locations),
      set(getDirectiveDefinitionArguments(path), node.arguments);
  }
);

export const getDirectiveDefinitions = atomFamily<
  gql.DirectiveDefinitionNode[] | null
>(
  (path: string) => (get) => {
    return get(getDirectiveDefinitionPaths(path)).map((path) =>
      get(getDirectiveDefinition(path))
    );
  },
  (path: string) => (get, set, node: gql.DirectiveDefinitionNode) => {
    set(getDirectiveDefinition);
  }
);

//  SchemaExtensionNode

export const getSchemaExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.SchemaExtensionNode) => {}
);

export const getSchemaExtensionOperationTypes = atomFamily(
  (path: string) => (get) => {
    return get(getOperationTypeDefinition(`${path}[operationTypes]`));
  },
  (path: string) => (get, set, node: gql.SchemaExtensionNode) => {}
);

export const getSchemaExtension = atomFamily<gql.SchemaExtensionNode | null>(
  (path: string) => (get) => {
    return gql.schemaExtension(
      get(getSchemaExtensionDirectives(path)),
      get(getSchemaExtensionOperationTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaExtensionNode) => {
    set(getSchemaExtensionDirectives(path), node.directives),
      set(getSchemaExtensionOperationTypes(path), node.operationTypes);
  }
);

export const getSchemaExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.schemaExtension(
      get(getSchemaExtensionDirectives(path)),
      get(getSchemaExtensionOperationTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaExtensionNode) => {
    set(getSchemaExtensionDirectives(path), node.directives),
      set(getSchemaExtensionOperationTypes(path), node.operationTypes);
  }
);

export const getSchemaExtensions = atomFamily<gql.SchemaExtensionNode[] | null>(
  (path: string) => (get) => {
    return get(getSchemaExtensionPaths(path)).map((path) =>
      get(getSchemaExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.SchemaExtensionNode) => {
    set(getSchemaExtension);
  }
);

//  ScalarTypeExtensionNode

export const getScalarTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ScalarTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getScalarTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.ScalarTypeExtensionNode) => {}
);

export const getScalarTypeExtension = atomFamily<gql.ScalarTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.scalarTypeExtension(
      get(getScalarTypeExtensionName(path)),
      get(getScalarTypeExtensionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeExtensionNode) => {
    set(getScalarTypeExtensionName(path), node.name),
      set(getScalarTypeExtensionDirectives(path), node.directives);
  }
);

export const getScalarTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.scalarTypeExtension(
      get(getScalarTypeExtensionName(path)),
      get(getScalarTypeExtensionDirectives(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeExtensionNode) => {
    set(getScalarTypeExtensionName(path), node.name),
      set(getScalarTypeExtensionDirectives(path), node.directives);
  }
);

export const getScalarTypeExtensions = atomFamily<
  gql.ScalarTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getScalarTypeExtensionPaths(path)).map((path) =>
      get(getScalarTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.ScalarTypeExtensionNode) => {
    set(getScalarTypeExtension);
  }
);

//  ObjectTypeExtensionNode

export const getObjectTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getObjectTypeExtensionInterfaces = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[interfaces]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {}
);

export const getObjectTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {}
);

export const getObjectTypeExtensionFields = atomFamily(
  (path: string) => (get) => {
    return get(getFieldDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {}
);

export const getObjectTypeExtension = atomFamily<gql.ObjectTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.objectTypeExtension(
      get(getObjectTypeExtensionName(path)),
      get(getObjectTypeExtensionInterfaces(path)),
      get(getObjectTypeExtensionDirectives(path)),
      get(getObjectTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {
    set(getObjectTypeExtensionName(path), node.name),
      set(getObjectTypeExtensionInterfaces(path), node.interfaces),
      set(getObjectTypeExtensionDirectives(path), node.directives),
      set(getObjectTypeExtensionFields(path), node.fields);
  }
);

export const getObjectTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.objectTypeExtension(
      get(getObjectTypeExtensionName(path)),
      get(getObjectTypeExtensionInterfaces(path)),
      get(getObjectTypeExtensionDirectives(path)),
      get(getObjectTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {
    set(getObjectTypeExtensionName(path), node.name),
      set(getObjectTypeExtensionInterfaces(path), node.interfaces),
      set(getObjectTypeExtensionDirectives(path), node.directives),
      set(getObjectTypeExtensionFields(path), node.fields);
  }
);

export const getObjectTypeExtensions = atomFamily<
  gql.ObjectTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getObjectTypeExtensionPaths(path)).map((path) =>
      get(getObjectTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.ObjectTypeExtensionNode) => {
    set(getObjectTypeExtension);
  }
);

//  InterfaceTypeExtensionNode

export const getInterfaceTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getInterfaceTypeExtensionInterfaces = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[interfaces]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {}
);

export const getInterfaceTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {}
);

export const getInterfaceTypeExtensionFields = atomFamily(
  (path: string) => (get) => {
    return get(getFieldDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {}
);

export const getInterfaceTypeExtension = atomFamily<gql.InterfaceTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.interfaceTypeExtension(
      get(getInterfaceTypeExtensionName(path)),
      get(getInterfaceTypeExtensionInterfaces(path)),
      get(getInterfaceTypeExtensionDirectives(path)),
      get(getInterfaceTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {
    set(getInterfaceTypeExtensionName(path), node.name),
      set(getInterfaceTypeExtensionInterfaces(path), node.interfaces),
      set(getInterfaceTypeExtensionDirectives(path), node.directives),
      set(getInterfaceTypeExtensionFields(path), node.fields);
  }
);

export const getInterfaceTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.interfaceTypeExtension(
      get(getInterfaceTypeExtensionName(path)),
      get(getInterfaceTypeExtensionInterfaces(path)),
      get(getInterfaceTypeExtensionDirectives(path)),
      get(getInterfaceTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {
    set(getInterfaceTypeExtensionName(path), node.name),
      set(getInterfaceTypeExtensionInterfaces(path), node.interfaces),
      set(getInterfaceTypeExtensionDirectives(path), node.directives),
      set(getInterfaceTypeExtensionFields(path), node.fields);
  }
);

export const getInterfaceTypeExtensions = atomFamily<
  gql.InterfaceTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getInterfaceTypeExtensionPaths(path)).map((path) =>
      get(getInterfaceTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.InterfaceTypeExtensionNode) => {
    set(getInterfaceTypeExtension);
  }
);

//  UnionTypeExtensionNode

export const getUnionTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getUnionTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {}
);

export const getUnionTypeExtensionTypes = atomFamily(
  (path: string) => (get) => {
    return get(getNamedType(`${path}[types]`));
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {}
);

export const getUnionTypeExtension = atomFamily<gql.UnionTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.unionTypeExtension(
      get(getUnionTypeExtensionName(path)),
      get(getUnionTypeExtensionDirectives(path)),
      get(getUnionTypeExtensionTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {
    set(getUnionTypeExtensionName(path), node.name),
      set(getUnionTypeExtensionDirectives(path), node.directives),
      set(getUnionTypeExtensionTypes(path), node.types);
  }
);

export const getUnionTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.unionTypeExtension(
      get(getUnionTypeExtensionName(path)),
      get(getUnionTypeExtensionDirectives(path)),
      get(getUnionTypeExtensionTypes(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {
    set(getUnionTypeExtensionName(path), node.name),
      set(getUnionTypeExtensionDirectives(path), node.directives),
      set(getUnionTypeExtensionTypes(path), node.types);
  }
);

export const getUnionTypeExtensions = atomFamily<
  gql.UnionTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getUnionTypeExtensionPaths(path)).map((path) =>
      get(getUnionTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.UnionTypeExtensionNode) => {
    set(getUnionTypeExtension);
  }
);

//  EnumTypeExtensionNode

export const getEnumTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getEnumTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {}
);

export const getEnumTypeExtensionValues = atomFamily(
  (path: string) => (get) => {
    return get(getEnumValueDefinition(`${path}[values]`));
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {}
);

export const getEnumTypeExtension = atomFamily<gql.EnumTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.enumTypeExtension(
      get(getEnumTypeExtensionName(path)),
      get(getEnumTypeExtensionDirectives(path)),
      get(getEnumTypeExtensionValues(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {
    set(getEnumTypeExtensionName(path), node.name),
      set(getEnumTypeExtensionDirectives(path), node.directives),
      set(getEnumTypeExtensionValues(path), node.values);
  }
);

export const getEnumTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.enumTypeExtension(
      get(getEnumTypeExtensionName(path)),
      get(getEnumTypeExtensionDirectives(path)),
      get(getEnumTypeExtensionValues(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {
    set(getEnumTypeExtensionName(path), node.name),
      set(getEnumTypeExtensionDirectives(path), node.directives),
      set(getEnumTypeExtensionValues(path), node.values);
  }
);

export const getEnumTypeExtensions = atomFamily<
  gql.EnumTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getEnumTypeExtensionPaths(path)).map((path) =>
      get(getEnumTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.EnumTypeExtensionNode) => {
    set(getEnumTypeExtension);
  }
);

//  InputObjectTypeExtensionNode

export const getInputObjectTypeExtensionName = atomFamily<gql.NameNode | null>(
  (path: string) => (get) => {
    return get(getName(`${path}[name]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {
    return set(getName(`${path}[name]`), node.name);
  }
);

export const getInputObjectTypeExtensionDirectives = atomFamily(
  (path: string) => (get) => {
    return get(getDirective(`${path}[directives]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {}
);

export const getInputObjectTypeExtensionFields = atomFamily(
  (path: string) => (get) => {
    return get(getInputValueDefinition(`${path}[fields]`));
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {}
);

export const getInputObjectTypeExtension = atomFamily<gql.InputObjectTypeExtensionNode | null>(
  (path: string) => (get) => {
    return gql.inputObjectTypeExtension(
      get(getInputObjectTypeExtensionName(path)),
      get(getInputObjectTypeExtensionDirectives(path)),
      get(getInputObjectTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {
    set(getInputObjectTypeExtensionName(path), node.name),
      set(getInputObjectTypeExtensionDirectives(path), node.directives),
      set(getInputObjectTypeExtensionFields(path), node.fields);
  }
);

export const getInputObjectTypeExtensionPaths = atomFamily<string[]>(
  (path: string) => (get) => {
    return gql.inputObjectTypeExtension(
      get(getInputObjectTypeExtensionName(path)),
      get(getInputObjectTypeExtensionDirectives(path)),
      get(getInputObjectTypeExtensionFields(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {
    set(getInputObjectTypeExtensionName(path), node.name),
      set(getInputObjectTypeExtensionDirectives(path), node.directives),
      set(getInputObjectTypeExtensionFields(path), node.fields);
  }
);

export const getInputObjectTypeExtensions = atomFamily<
  gql.InputObjectTypeExtensionNode[] | null
>(
  (path: string) => (get) => {
    return get(getInputObjectTypeExtensionPaths(path)).map((path) =>
      get(getInputObjectTypeExtension(path))
    );
  },
  (path: string) => (get, set, node: gql.InputObjectTypeExtensionNode) => {
    set(getInputObjectTypeExtension);
  }
);
