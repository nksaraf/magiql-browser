export interface NodeMetadata {
  path: string;
  kind: string;
  parentPath: string;
  isSelected: boolean;
}

export type ASTNode =
  | NameNode
  | DocumentNode
  | OperationDefinitionNode
  | VariableDefinitionNode
  | VariableNode
  | SelectionSetNode
  | FieldNode
  | ArgumentNode
  | FragmentSpreadNode
  | InlineFragmentNode
  | FragmentDefinitionNode
  | IntValueNode
  | FloatValueNode
  | StringValueNode
  | BooleanValueNode
  | NullValueNode
  | EnumValueNode
  | ListValueNode
  | ObjectValueNode
  | ObjectFieldNode
  | DirectiveNode
  | NamedTypeNode
  | ListTypeNode
  | NonNullTypeNode;

export interface NameNode {
  kind: "Name";
  metadata: NodeMetadata;
  value: string;
}

export interface DocumentNode {
  kind: "Document";
  metadata: NodeMetadata;
  definitions: DefinitionNode[];
}

export interface OperationDefinitionNode {
  kind: "OperationDefinition";
  metadata: NodeMetadata;
  operation: string;
  name?: NameNode;
  variableDefinitions?: VariableDefinitionNode[];
  directives?: DirectiveNode[];
  selectionSet: SelectionSetNode;
}

export interface VariableDefinitionNode {
  kind: "VariableDefinition";
  metadata: NodeMetadata;
  variable: VariableNode;
  type: TypeNode;
  defaultValue?: ValueNode;
  directives?: DirectiveNode[];
}

export interface VariableNode {
  kind: "Variable";
  metadata: NodeMetadata;
  name: NameNode;
}

export interface SelectionSetNode {
  kind: "SelectionSet";
  metadata: NodeMetadata;
  selections: SelectionNode[];
}

export interface FieldNode {
  kind: "Field";
  metadata: NodeMetadata;
  alias?: NameNode;
  name: NameNode;
  arguments?: ArgumentNode[];
  directives?: DirectiveNode[];
  selectionSet?: SelectionSetNode;
}

export interface ArgumentNode {
  kind: "Argument";
  metadata: NodeMetadata;
  name: NameNode;
  value: ValueNode;
}

export interface FragmentSpreadNode {
  kind: "FragmentSpread";
  metadata: NodeMetadata;
  name: NameNode;
  directives?: DirectiveNode[];
}

export interface InlineFragmentNode {
  kind: "InlineFragment";
  metadata: NodeMetadata;
  typeCondition?: NamedTypeNode;
  directives?: DirectiveNode[];
  selectionSet: SelectionSetNode;
}

export interface FragmentDefinitionNode {
  kind: "FragmentDefinition";
  metadata: NodeMetadata;
  name: NameNode;
  // Note: fragment variable definitions are experimental and may be changed
  // or removed in the future.
  variableDefinitions?: VariableDefinitionNode[];
  typeCondition: NamedTypeNode;
  directives?: DirectiveNode[];
  selectionSet: SelectionSetNode;
}

export interface IntValueNode {
  kind: "IntValue";
  metadata: NodeMetadata;
  value: string;
}

export interface FloatValueNode {
  kind: "FloatValue";
  metadata: NodeMetadata;
  value: string;
}

export interface StringValueNode {
  kind: "StringValue";
  metadata: NodeMetadata;
  value: string;
  block?: boolean;
}

export interface BooleanValueNode {
  kind: "BooleanValue";
  metadata: NodeMetadata;
  value: boolean;
}

export interface NullValueNode {
  kind: "NullValue";
  metadata: NodeMetadata;
}

export interface EnumValueNode {
  kind: "EnumValue";
  metadata: NodeMetadata;
  value: string;
}

export interface ListValueNode {
  kind: "ListValue";
  metadata: NodeMetadata;
  values: ValueNode[];
}

export interface ObjectValueNode {
  kind: "ObjectValue";
  metadata: NodeMetadata;
  fields: ObjectFieldNode[];
}

export interface ObjectFieldNode {
  kind: "ObjectField";
  metadata: NodeMetadata;
  name: NameNode;
  value: ValueNode;
}

export interface DirectiveNode {
  kind: "Directive";
  metadata: NodeMetadata;
  name: NameNode;
  arguments?: ArgumentNode[];
}

export interface NamedTypeNode {
  kind: "NamedType";
  metadata: NodeMetadata;
  name: NameNode;
}

export interface ListTypeNode {
  kind: "ListType";
  metadata: NodeMetadata;
  type: TypeNode;
}

export interface NonNullTypeNode {
  kind: "NonNullType";
  metadata: NodeMetadata;
  type: AbstractNode;
}

export type AbstractNode = NamedTypeNode | ListTypeNode;

export type DefinitionNode = OperationDefinitionNode | FragmentDefinitionNode;

export type SelectionNode = FieldNode | FragmentSpreadNode | InlineFragmentNode;

export type ValueNode =
  | VariableNode
  | IntValueNode
  | FloatValueNode
  | StringValueNode
  | BooleanValueNode
  | NullValueNode
  | EnumValueNode
  | ListValueNode
  | ObjectValueNode;

export type TypeNode = NamedTypeNode | ListTypeNode | NonNullTypeNode;
