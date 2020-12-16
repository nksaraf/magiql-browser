import * as gql from "./types";
import { atom, atomFamily } from "../lib/atom";

export const getNodeMetadata = atomFamily<gql.NodeMetadata>((path: string) => ({
  parentPath: "",
  path: path,
  isSelected: false,
  kind: "",
}));

export const getString = atomFamily<string>((path: string) => "");

export const getBoolean = atomFamily<boolean>((path: string) => true);

export const getNumber = atomFamily<number>((path: string) => 0);

//  NameNode

export const getNameValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[value]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[value]"), node);
  }
);

export const getName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return {
      kind: "Name",
      metadata: get(getNodeMetadata(path)),
      value: get(getNameValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getNameValue(path), node.value);
  }
);

//  DocumentNode

export const getDocumentDefinitions = atomFamily<gql.DefinitionNode[]>(
  (path: string) => (get) => {
    return get(getDefinitions(path + "[definitions]"));
  },
  (path: string) => (get, set, node: gql.DefinitionNode[]) => {
    set(getDefinitions(path + "[definitions]"), node);
  }
);

export const getDocument = atomFamily<gql.DocumentNode>(
  (path: string) => (get) => {
    return {
      kind: "Document",
      metadata: get(getNodeMetadata(path)),
      definitions: get(getDocumentDefinitions(path)),
    };
  },
  (path: string) => (get, set, node: gql.DocumentNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getDocumentDefinitions(path), node.definitions);
  }
);

//  OperationDefinitionNode

export const getOperationDefinitionOperation = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[operation]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[operation]"), node);
  }
);

export const getOperationDefinitionName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getOperationDefinitionVariableDefinitions = atomFamily<
  gql.VariableDefinitionNode[]
>(
  (path: string) => (get) => {
    return get(getVariableDefinitions(path + "[variableDefinitions]"));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode[]) => {
    set(getVariableDefinitions(path + "[variableDefinitions]"), node);
  }
);

export const getOperationDefinitionDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getOperationDefinitionSelectionSet = atomFamily<gql.SelectionSetNode>(
  (path: string) => (get) => {
    return get(getSelectionSet(path + "[selectionSet]"));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    return set(getSelectionSet(path + "[selectionSet]"), node);
  }
);

export const getOperationDefinition = atomFamily<gql.OperationDefinitionNode>(
  (path: string) => (get) => {
    return {
      kind: "OperationDefinition",
      metadata: get(getNodeMetadata(path)),
      operation: get(getOperationDefinitionOperation(path)),
      name: get(getOperationDefinitionName(path)),
      variableDefinitions: get(getOperationDefinitionVariableDefinitions(path)),
      directives: get(getOperationDefinitionDirectives(path)),
      selectionSet: get(getOperationDefinitionSelectionSet(path)),
    };
  },
  (path: string) => (get, set, node: gql.OperationDefinitionNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getOperationDefinitionOperation(path), node.operation),
      set(getOperationDefinitionName(path), node.name),
      set(
        getOperationDefinitionVariableDefinitions(path),
        node.variableDefinitions
      ),
      set(getOperationDefinitionDirectives(path), node.directives),
      set(getOperationDefinitionSelectionSet(path), node.selectionSet);
  }
);

//  VariableDefinitionNode

export const getVariableDefinitionVariable = atomFamily<gql.VariableNode>(
  (path: string) => (get) => {
    return get(getVariable(path + "[variable]"));
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    return set(getVariable(path + "[variable]"), node);
  }
);

export const getVariableDefinitionType = atomFamily<gql.TypeNode>(
  (path: string) => (get) => {
    return get(getType(path + "[type]"));
  },
  (path: string) => (get, set, node: gql.TypeNode) => {
    return set(getType(path + "[type]"), node);
  }
);

export const getVariableDefinitionDefaultValue = atomFamily<gql.ValueNode>(
  (path: string) => (get) => {
    return get(getValue(path + "[defaultValue]"));
  },
  (path: string) => (get, set, node: gql.ValueNode) => {
    return set(getValue(path + "[defaultValue]"), node);
  }
);

export const getVariableDefinitionDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getVariableDefinition = atomFamily<gql.VariableDefinitionNode>(
  (path: string) => (get) => {
    return {
      kind: "VariableDefinition",
      metadata: get(getNodeMetadata(path)),
      variable: get(getVariableDefinitionVariable(path)),
      type: get(getVariableDefinitionType(path)),
      defaultValue: get(getVariableDefinitionDefaultValue(path)),
      directives: get(getVariableDefinitionDirectives(path)),
    };
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getVariableDefinitionVariable(path), node.variable),
      set(getVariableDefinitionType(path), node.type),
      set(getVariableDefinitionDefaultValue(path), node.defaultValue),
      set(getVariableDefinitionDirectives(path), node.directives);
  }
);

export const getVariableDefinitionPaths = atomFamily<string[]>(
  (path: string) => []
);

export const getVariableDefinitions = atomFamily<gql.VariableDefinitionNode[]>(
  (path: string) => (get) => {
    return get(getVariableDefinitionPaths(path)).map((subPath) =>
      get(getVariableDefinition(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.VariableDefinitionNode[]) => {
    if (!nodes) {
      set(getVariableDefinitionPaths(path), []);
    } else {
      set(
        getVariableDefinitionPaths(path),
        nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
      );
      nodes.forEach((node, index) => {
        set(
          getVariableDefinition(node.metadata?.path ?? path + "." + index),
          node
        );
      });
    }
  }
);

//  VariableNode

export const getVariableName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getVariable = atomFamily<gql.VariableNode>(
  (path: string) => (get) => {
    return {
      kind: "Variable",
      metadata: get(getNodeMetadata(path)),
      name: get(getVariableName(path)),
    };
  },
  (path: string) => (get, set, node: gql.VariableNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getVariableName(path), node.name);
  }
);

//  SelectionSetNode

export const getSelectionSetSelections = atomFamily<gql.SelectionNode[]>(
  (path: string) => (get) => {
    return get(getSelections(path + "[selections]"));
  },
  (path: string) => (get, set, node: gql.SelectionNode[]) => {
    set(getSelections(path + "[selections]"), node);
  }
);

export const getSelectionSet = atomFamily<gql.SelectionSetNode>(
  (path: string) => (get) => {
    return {
      kind: "SelectionSet",
      metadata: get(getNodeMetadata(path)),
      selections: get(getSelectionSetSelections(path)),
    };
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getSelectionSetSelections(path), node.selections);
  }
);

//  FieldNode

export const getFieldAlias = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[alias]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[alias]"), node);
  }
);

export const getFieldName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getFieldArguments = atomFamily<gql.ArgumentNode[]>(
  (path: string) => (get) => {
    return get(getArguments(path + "[arguments]"));
  },
  (path: string) => (get, set, node: gql.ArgumentNode[]) => {
    set(getArguments(path + "[arguments]"), node);
  }
);

export const getFieldDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getFieldSelectionSet = atomFamily<gql.SelectionSetNode>(
  (path: string) => (get) => {
    return get(getSelectionSet(path + "[selectionSet]"));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    return set(getSelectionSet(path + "[selectionSet]"), node);
  }
);

export const getField = atomFamily<gql.FieldNode>(
  (path: string) => (get) => {
    return {
      kind: "Field",
      metadata: get(getNodeMetadata(path)),
      alias: get(getFieldAlias(path)),
      name: get(getFieldName(path)),
      arguments: get(getFieldArguments(path)),
      directives: get(getFieldDirectives(path)),
      selectionSet: get(getFieldSelectionSet(path)),
    };
  },
  (path: string) => (get, set, node: gql.FieldNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getFieldAlias(path), node.alias),
      set(getFieldName(path), node.name),
      set(getFieldArguments(path), node.arguments),
      set(getFieldDirectives(path), node.directives),
      set(getFieldSelectionSet(path), node.selectionSet);
  }
);

export const getFieldPaths = atomFamily<string[]>((path: string) => []);

export const getFields = atomFamily<gql.FieldNode[]>(
  (path: string) => (get) => {
    return get(getFieldPaths(path)).map((subPath) => get(getField(subPath)));
  },
  (path: string) => (get, set, nodes: gql.FieldNode[]) => {
    if (!nodes) {
      set(getFieldPaths(path), []);
    } else {
      set(
        getFieldPaths(path),
        nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
      );
      nodes.forEach((node, index) => {
        set(getField(node.metadata?.path ?? path + "." + index), node);
      });
    }
  }
);

//  ArgumentNode

export const getArgumentName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getArgumentValue = atomFamily<gql.ValueNode>(
  (path: string) => (get) => {
    return get(getValue(path + "[value]"));
  },
  (path: string) => (get, set, node: gql.ValueNode) => {
    return set(getValue(path + "[value]"), node);
  }
);

export const getArgument = atomFamily<gql.ArgumentNode>(
  (path: string) => (get) => {
    return {
      kind: "Argument",
      metadata: get(getNodeMetadata(path)),
      name: get(getArgumentName(path)),
      value: get(getArgumentValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.ArgumentNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getArgumentName(path), node.name),
      set(getArgumentValue(path), node.value);
  }
);

export const getArgumentPaths = atomFamily<string[]>((path: string) => []);

export const getArguments = atomFamily<gql.ArgumentNode[]>(
  (path: string) => (get) => {
    return get(getArgumentPaths(path)).map((subPath) =>
      get(getArgument(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.ArgumentNode[]) => {
    if (!nodes) {
      set(getArgumentPaths(path), []);
    } else {
      set(
        getArgumentPaths(path),
        nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
      );
      nodes.forEach((node, index) => {
        set(getArgument(node.metadata?.path ?? path + "." + index), node);
      });
    }
  }
);

//  FragmentSpreadNode

export const getFragmentSpreadName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getFragmentSpreadDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getFragmentSpread = atomFamily<gql.FragmentSpreadNode>(
  (path: string) => (get) => {
    return {
      kind: "FragmentSpread",
      metadata: get(getNodeMetadata(path)),
      name: get(getFragmentSpreadName(path)),
      directives: get(getFragmentSpreadDirectives(path)),
    };
  },
  (path: string) => (get, set, node: gql.FragmentSpreadNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getFragmentSpreadName(path), node.name),
      set(getFragmentSpreadDirectives(path), node.directives);
  }
);

//  InlineFragmentNode

export const getInlineFragmentTypeCondition = atomFamily<gql.NamedTypeNode>(
  (path: string) => (get) => {
    return get(getNamedType(path + "[typeCondition]"));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    return set(getNamedType(path + "[typeCondition]"), node);
  }
);

export const getInlineFragmentDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getInlineFragmentSelectionSet = atomFamily<gql.SelectionSetNode>(
  (path: string) => (get) => {
    return get(getSelectionSet(path + "[selectionSet]"));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    return set(getSelectionSet(path + "[selectionSet]"), node);
  }
);

export const getInlineFragment = atomFamily<gql.InlineFragmentNode>(
  (path: string) => (get) => {
    return {
      kind: "InlineFragment",
      metadata: get(getNodeMetadata(path)),
      typeCondition: get(getInlineFragmentTypeCondition(path)),
      directives: get(getInlineFragmentDirectives(path)),
      selectionSet: get(getInlineFragmentSelectionSet(path)),
    };
  },
  (path: string) => (get, set, node: gql.InlineFragmentNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getInlineFragmentTypeCondition(path), node.typeCondition),
      set(getInlineFragmentDirectives(path), node.directives),
      set(getInlineFragmentSelectionSet(path), node.selectionSet);
  }
);

//  FragmentDefinitionNode

export const getFragmentDefinitionName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getFragmentDefinitionVariableDefinitions = atomFamily<
  gql.VariableDefinitionNode[]
>(
  (path: string) => (get) => {
    return get(getVariableDefinitions(path + "[variableDefinitions]"));
  },
  (path: string) => (get, set, node: gql.VariableDefinitionNode[]) => {
    set(getVariableDefinitions(path + "[variableDefinitions]"), node);
  }
);

export const getFragmentDefinitionTypeCondition = atomFamily<gql.NamedTypeNode>(
  (path: string) => (get) => {
    return get(getNamedType(path + "[typeCondition]"));
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    return set(getNamedType(path + "[typeCondition]"), node);
  }
);

export const getFragmentDefinitionDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectives(path + "[directives]"));
  },
  (path: string) => (get, set, node: gql.DirectiveNode[]) => {
    set(getDirectives(path + "[directives]"), node);
  }
);

export const getFragmentDefinitionSelectionSet = atomFamily<gql.SelectionSetNode>(
  (path: string) => (get) => {
    return get(getSelectionSet(path + "[selectionSet]"));
  },
  (path: string) => (get, set, node: gql.SelectionSetNode) => {
    return set(getSelectionSet(path + "[selectionSet]"), node);
  }
);

export const getFragmentDefinition = atomFamily<gql.FragmentDefinitionNode>(
  (path: string) => (get) => {
    return {
      kind: "FragmentDefinition",
      metadata: get(getNodeMetadata(path)),
      name: get(getFragmentDefinitionName(path)),
      variableDefinitions: get(getFragmentDefinitionVariableDefinitions(path)),
      typeCondition: get(getFragmentDefinitionTypeCondition(path)),
      directives: get(getFragmentDefinitionDirectives(path)),
      selectionSet: get(getFragmentDefinitionSelectionSet(path)),
    };
  },
  (path: string) => (get, set, node: gql.FragmentDefinitionNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getFragmentDefinitionName(path), node.name),
      set(
        getFragmentDefinitionVariableDefinitions(path),
        node.variableDefinitions
      ),
      set(getFragmentDefinitionTypeCondition(path), node.typeCondition),
      set(getFragmentDefinitionDirectives(path), node.directives),
      set(getFragmentDefinitionSelectionSet(path), node.selectionSet);
  }
);

//  IntValueNode

export const getIntValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[value]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[value]"), node);
  }
);

export const getIntValue = atomFamily<gql.IntValueNode>(
  (path: string) => (get) => {
    return {
      kind: "IntValue",
      metadata: get(getNodeMetadata(path)),
      value: get(getIntValueValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.IntValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getIntValueValue(path), node.value);
  }
);

//  FloatValueNode

export const getFloatValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[value]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[value]"), node);
  }
);

export const getFloatValue = atomFamily<gql.FloatValueNode>(
  (path: string) => (get) => {
    return {
      kind: "FloatValue",
      metadata: get(getNodeMetadata(path)),
      value: get(getFloatValueValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.FloatValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getFloatValueValue(path), node.value);
  }
);

//  StringValueNode

export const getStringValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[value]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[value]"), node);
  }
);

export const getStringValueBlock = atomFamily<boolean>(
  (path: string) => (get) => {
    return get(getBoolean(path + "[block]"));
  },
  (path: string) => (get, set, node: boolean) => {
    return set(getBoolean(path + "[block]"), node);
  }
);

export const getStringValue = atomFamily<gql.StringValueNode>(
  (path: string) => (get) => {
    return {
      kind: "StringValue",
      metadata: get(getNodeMetadata(path)),
      value: get(getStringValueValue(path)),
      block: get(getStringValueBlock(path)),
    };
  },
  (path: string) => (get, set, node: gql.StringValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getStringValueValue(path), node.value),
      set(getStringValueBlock(path), node.block);
  }
);

//  BooleanValueNode

export const getBooleanValueValue = atomFamily<boolean>(
  (path: string) => (get) => {
    return get(getBoolean(path + "[value]"));
  },
  (path: string) => (get, set, node: boolean) => {
    return set(getBoolean(path + "[value]"), node);
  }
);

export const getBooleanValue = atomFamily<gql.BooleanValueNode>(
  (path: string) => (get) => {
    return {
      kind: "BooleanValue",
      metadata: get(getNodeMetadata(path)),
      value: get(getBooleanValueValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.BooleanValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getBooleanValueValue(path), node.value);
  }
);

//  NullValueNode

export const getNullValue = atomFamily<gql.NullValueNode>(
  (path: string) => (get) => {
    return {
      kind: "NullValue",
      metadata: get(getNodeMetadata(path)),
    };
  },
  (path: string) => (get, set, node: gql.NullValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
  }
);

//  EnumValueNode

export const getEnumValueValue = atomFamily<string>(
  (path: string) => (get) => {
    return get(getString(path + "[value]"));
  },
  (path: string) => (get, set, node: string) => {
    return set(getString(path + "[value]"), node);
  }
);

export const getEnumValue = atomFamily<gql.EnumValueNode>(
  (path: string) => (get) => {
    return {
      kind: "EnumValue",
      metadata: get(getNodeMetadata(path)),
      value: get(getEnumValueValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.EnumValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getEnumValueValue(path), node.value);
  }
);

//  ListValueNode

export const getListValueValues = atomFamily<gql.ValueNode[]>(
  (path: string) => (get) => {
    return get(getValues(path + "[values]"));
  },
  (path: string) => (get, set, node: gql.ValueNode[]) => {
    set(getValues(path + "[values]"), node);
  }
);

export const getListValue = atomFamily<gql.ListValueNode>(
  (path: string) => (get) => {
    return {
      kind: "ListValue",
      metadata: get(getNodeMetadata(path)),
      values: get(getListValueValues(path)),
    };
  },
  (path: string) => (get, set, node: gql.ListValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getListValueValues(path), node.values);
  }
);

//  ObjectValueNode

export const getObjectValueFields = atomFamily<gql.ObjectFieldNode[]>(
  (path: string) => (get) => {
    return get(getObjectFields(path + "[fields]"));
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode[]) => {
    set(getObjectFields(path + "[fields]"), node);
  }
);

export const getObjectValue = atomFamily<gql.ObjectValueNode>(
  (path: string) => (get) => {
    return {
      kind: "ObjectValue",
      metadata: get(getNodeMetadata(path)),
      fields: get(getObjectValueFields(path)),
    };
  },
  (path: string) => (get, set, node: gql.ObjectValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getObjectValueFields(path), node.fields);
  }
);

//  ObjectFieldNode

export const getObjectFieldName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getObjectFieldValue = atomFamily<gql.ValueNode>(
  (path: string) => (get) => {
    return get(getValue(path + "[value]"));
  },
  (path: string) => (get, set, node: gql.ValueNode) => {
    return set(getValue(path + "[value]"), node);
  }
);

export const getObjectField = atomFamily<gql.ObjectFieldNode>(
  (path: string) => (get) => {
    return {
      kind: "ObjectField",
      metadata: get(getNodeMetadata(path)),
      name: get(getObjectFieldName(path)),
      value: get(getObjectFieldValue(path)),
    };
  },
  (path: string) => (get, set, node: gql.ObjectFieldNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getObjectFieldName(path), node.name),
      set(getObjectFieldValue(path), node.value);
  }
);

export const getObjectFieldPaths = atomFamily<string[]>((path: string) => []);

export const getObjectFields = atomFamily<gql.ObjectFieldNode[]>(
  (path: string) => (get) => {
    return get(getObjectFieldPaths(path)).map((subPath) =>
      get(getObjectField(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.ObjectFieldNode[]) => {
    if (!nodes) {
      set(getObjectFieldPaths(path), []);
    } else {
      set(
        getObjectFieldPaths(path),
        nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
      );
      nodes.forEach((node, index) => {
        set(getObjectField(node.metadata?.path ?? path + "." + index), node);
      });
    }
  }
);

//  DirectiveNode

export const getDirectiveName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getDirectiveArguments = atomFamily<gql.ArgumentNode[]>(
  (path: string) => (get) => {
    return get(getArguments(path + "[arguments]"));
  },
  (path: string) => (get, set, node: gql.ArgumentNode[]) => {
    set(getArguments(path + "[arguments]"), node);
  }
);

export const getDirective = atomFamily<gql.DirectiveNode>(
  (path: string) => (get) => {
    return {
      kind: "Directive",
      metadata: get(getNodeMetadata(path)),
      name: get(getDirectiveName(path)),
      arguments: get(getDirectiveArguments(path)),
    };
  },
  (path: string) => (get, set, node: gql.DirectiveNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getDirectiveName(path), node.name),
      set(getDirectiveArguments(path), node.arguments);
  }
);

export const getDirectivePaths = atomFamily<string[]>((path: string) => []);

export const getDirectives = atomFamily<gql.DirectiveNode[]>(
  (path: string) => (get) => {
    return get(getDirectivePaths(path)).map((subPath) =>
      get(getDirective(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.DirectiveNode[]) => {
    if (!nodes) {
      set(getDirectivePaths(path), []);
    } else {
      set(
        getDirectivePaths(path),
        nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
      );
      nodes.forEach((node, index) => {
        set(getDirective(node.metadata?.path ?? path + "." + index), node);
      });
    }
  }
);

//  NamedTypeNode

export const getNamedTypeName = atomFamily<gql.NameNode>(
  (path: string) => (get) => {
    return get(getName(path + "[name]"));
  },
  (path: string) => (get, set, node: gql.NameNode) => {
    return set(getName(path + "[name]"), node);
  }
);

export const getNamedType = atomFamily<gql.NamedTypeNode>(
  (path: string) => (get) => {
    return {
      kind: "NamedType",
      metadata: get(getNodeMetadata(path)),
      name: get(getNamedTypeName(path)),
    };
  },
  (path: string) => (get, set, node: gql.NamedTypeNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getNamedTypeName(path), node.name);
  }
);

//  ListTypeNode

export const getListTypeType = atomFamily<gql.TypeNode>(
  (path: string) => (get) => {
    return get(getType(path + "[type]"));
  },
  (path: string) => (get, set, node: gql.TypeNode) => {
    return set(getType(path + "[type]"), node);
  }
);

export const getListType = atomFamily<gql.ListTypeNode>(
  (path: string) => (get) => {
    return {
      kind: "ListType",
      metadata: get(getNodeMetadata(path)),
      type: get(getListTypeType(path)),
    };
  },
  (path: string) => (get, set, node: gql.ListTypeNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getListTypeType(path), node.type);
  }
);

//  NonNullTypeNode

export const getNonNullTypeType = atomFamily<gql.AbstractNode>(
  (path: string) => (get) => {
    return get(getAbstract(path + "[type]"));
  },
  (path: string) => (get, set, node: gql.AbstractNode) => {
    return set(getAbstract(path + "[type]"), node);
  }
);

export const getNonNullType = atomFamily<gql.NonNullTypeNode>(
  (path: string) => (get) => {
    return {
      kind: "NonNullType",
      metadata: get(getNodeMetadata(path)),
      type: get(getNonNullTypeType(path)),
    };
  },
  (path: string) => (get, set, node: gql.NonNullTypeNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
      return;
    }

    set(getNodeMetadata(path), {
      path,
      parentPath: "",
      kind: node.kind,
      isSelected: true,
    });
    set(getNonNullTypeType(path), node.type);
  }
);

export const getAST = atomFamily<gql.ASTNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "Name": {
        return get(getName(path));
      }
      case "Document": {
        return get(getDocument(path));
      }
      case "OperationDefinition": {
        return get(getOperationDefinition(path));
      }
      case "VariableDefinition": {
        return get(getVariableDefinition(path));
      }
      case "Variable": {
        return get(getVariable(path));
      }
      case "SelectionSet": {
        return get(getSelectionSet(path));
      }
      case "Field": {
        return get(getField(path));
      }
      case "Argument": {
        return get(getArgument(path));
      }
      case "FragmentSpread": {
        return get(getFragmentSpread(path));
      }
      case "InlineFragment": {
        return get(getInlineFragment(path));
      }
      case "FragmentDefinition": {
        return get(getFragmentDefinition(path));
      }
      case "IntValue": {
        return get(getIntValue(path));
      }
      case "FloatValue": {
        return get(getFloatValue(path));
      }
      case "StringValue": {
        return get(getStringValue(path));
      }
      case "BooleanValue": {
        return get(getBooleanValue(path));
      }
      case "NullValue": {
        return get(getNullValue(path));
      }
      case "EnumValue": {
        return get(getEnumValue(path));
      }
      case "ListValue": {
        return get(getListValue(path));
      }
      case "ObjectValue": {
        return get(getObjectValue(path));
      }
      case "ObjectField": {
        return get(getObjectField(path));
      }
      case "Directive": {
        return get(getDirective(path));
      }
      case "NamedType": {
        return get(getNamedType(path));
      }
      case "ListType": {
        return get(getListType(path));
      }
      case "NonNullType": {
        return get(getNonNullType(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.ASTNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "Name": {
        return set(getName(path), node);
      }
      case "Document": {
        return set(getDocument(path), node);
      }
      case "OperationDefinition": {
        return set(getOperationDefinition(path), node);
      }
      case "VariableDefinition": {
        return set(getVariableDefinition(path), node);
      }
      case "Variable": {
        return set(getVariable(path), node);
      }
      case "SelectionSet": {
        return set(getSelectionSet(path), node);
      }
      case "Field": {
        return set(getField(path), node);
      }
      case "Argument": {
        return set(getArgument(path), node);
      }
      case "FragmentSpread": {
        return set(getFragmentSpread(path), node);
      }
      case "InlineFragment": {
        return set(getInlineFragment(path), node);
      }
      case "FragmentDefinition": {
        return set(getFragmentDefinition(path), node);
      }
      case "IntValue": {
        return set(getIntValue(path), node);
      }
      case "FloatValue": {
        return set(getFloatValue(path), node);
      }
      case "StringValue": {
        return set(getStringValue(path), node);
      }
      case "BooleanValue": {
        return set(getBooleanValue(path), node);
      }
      case "NullValue": {
        return set(getNullValue(path), node);
      }
      case "EnumValue": {
        return set(getEnumValue(path), node);
      }
      case "ListValue": {
        return set(getListValue(path), node);
      }
      case "ObjectValue": {
        return set(getObjectValue(path), node);
      }
      case "ObjectField": {
        return set(getObjectField(path), node);
      }
      case "Directive": {
        return set(getDirective(path), node);
      }
      case "NamedType": {
        return set(getNamedType(path), node);
      }
      case "ListType": {
        return set(getListType(path), node);
      }
      case "NonNullType": {
        return set(getNonNullType(path), node);
      }
    }
  }
);

export const getAbstract = atomFamily<gql.AbstractNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "NamedType": {
        return get(getNamedType(path));
      }
      case "ListType": {
        return get(getListType(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.AbstractNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "NamedType": {
        return set(getNamedType(path), node);
      }
      case "ListType": {
        return set(getListType(path), node);
      }
    }
  }
);

export const getDefinition = atomFamily<gql.DefinitionNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "OperationDefinition": {
        return get(getOperationDefinition(path));
      }
      case "FragmentDefinition": {
        return get(getFragmentDefinition(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.DefinitionNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "OperationDefinition": {
        return set(getOperationDefinition(path), node);
      }
      case "FragmentDefinition": {
        return set(getFragmentDefinition(path), node);
      }
    }
  }
);

export const getDefinitionPaths = atomFamily<string[]>((path: string) => []);

export const getDefinitions = atomFamily<gql.DefinitionNode[]>(
  (path: string) => (get) => {
    return get(getDefinitionPaths(path)).map((subPath) =>
      get(getDefinition(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.DefinitionNode[]) => {
    if (!nodes) {
      set(getDefinitionPaths(path), []);
      return;
    }
    set(
      getDefinitionPaths(path),
      nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
    );

    nodes.forEach((node, index) => {
      set(getDefinition(node.metadata?.path ?? path + "." + index), node);
    });
  }
);

export const getSelection = atomFamily<gql.SelectionNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "Field": {
        return get(getField(path));
      }
      case "FragmentSpread": {
        return get(getFragmentSpread(path));
      }
      case "InlineFragment": {
        return get(getInlineFragment(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.SelectionNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "Field": {
        return set(getField(path), node);
      }
      case "FragmentSpread": {
        return set(getFragmentSpread(path), node);
      }
      case "InlineFragment": {
        return set(getInlineFragment(path), node);
      }
    }
  }
);

export const getSelectionPaths = atomFamily<string[]>((path: string) => []);

export const getSelections = atomFamily<gql.SelectionNode[]>(
  (path: string) => (get) => {
    return get(getSelectionPaths(path)).map((subPath) =>
      get(getSelection(subPath))
    );
  },
  (path: string) => (get, set, nodes: gql.SelectionNode[]) => {
    if (!nodes) {
      set(getSelectionPaths(path), []);
      return;
    }
    set(
      getSelectionPaths(path),
      nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
    );

    nodes.forEach((node, index) => {
      set(getSelection(node.metadata?.path ?? path + "." + index), node);
    });
  }
);

export const getValue = atomFamily<gql.ValueNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "Variable": {
        return get(getVariable(path));
      }
      case "IntValue": {
        return get(getIntValue(path));
      }
      case "FloatValue": {
        return get(getFloatValue(path));
      }
      case "StringValue": {
        return get(getStringValue(path));
      }
      case "BooleanValue": {
        return get(getBooleanValue(path));
      }
      case "NullValue": {
        return get(getNullValue(path));
      }
      case "EnumValue": {
        return get(getEnumValue(path));
      }
      case "ListValue": {
        return get(getListValue(path));
      }
      case "ObjectValue": {
        return get(getObjectValue(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.ValueNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "Variable": {
        return set(getVariable(path), node);
      }
      case "IntValue": {
        return set(getIntValue(path), node);
      }
      case "FloatValue": {
        return set(getFloatValue(path), node);
      }
      case "StringValue": {
        return set(getStringValue(path), node);
      }
      case "BooleanValue": {
        return set(getBooleanValue(path), node);
      }
      case "NullValue": {
        return set(getNullValue(path), node);
      }
      case "EnumValue": {
        return set(getEnumValue(path), node);
      }
      case "ListValue": {
        return set(getListValue(path), node);
      }
      case "ObjectValue": {
        return set(getObjectValue(path), node);
      }
    }
  }
);

export const getValuePaths = atomFamily<string[]>((path: string) => []);

export const getValues = atomFamily<gql.ValueNode[]>(
  (path: string) => (get) => {
    return get(getValuePaths(path)).map((subPath) => get(getValue(subPath)));
  },
  (path: string) => (get, set, nodes: gql.ValueNode[]) => {
    if (!nodes) {
      set(getValuePaths(path), []);
      return;
    }
    set(
      getValuePaths(path),
      nodes.map((node, index) => node.metadata?.path ?? path + "." + index)
    );

    nodes.forEach((node, index) => {
      set(getValue(node.metadata?.path ?? path + "." + index), node);
    });
  }
);

export const getType = atomFamily<gql.TypeNode>(
  (path: string) => (get) => {
    const metadata = get(getNodeMetadata(path));
    switch (metadata.kind) {
      case "NamedType": {
        return get(getNamedType(path));
      }
      case "ListType": {
        return get(getListType(path));
      }
      case "NonNullType": {
        return get(getNonNullType(path));
      }
    }
  },
  (path: string) => (get, set, node: gql.TypeNode) => {
    if (!node) {
      set(getNodeMetadata(path), (old) => ({
        ...old,
        parentPath: "",
        isSelected: false,
      }));
    } else {
      set(getNodeMetadata(path), {
        path,
        parentPath: "",
        kind: node.kind,
        isSelected: true,
      });
    }

    switch (node.kind) {
      case "NamedType": {
        return set(getNamedType(path), node);
      }
      case "ListType": {
        return set(getListType(path), node);
      }
      case "NonNullType": {
        return set(getNonNullType(path), node);
      }
    }
  }
);
