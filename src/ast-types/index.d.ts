// AUTO-GENERATED

import {
  NameNode,
  DocumentNode,
  OperationDefinitionNode,
  VariableDefinitionNode,
  VariableNode,
  SelectionSetNode,
  FieldNode,
  ArgumentNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  FragmentDefinitionNode,
  IntValueNode,
  FloatValueNode,
  StringValueNode,
  BooleanValueNode,
  NullValueNode,
  EnumValueNode,
  ListValueNode,
  ObjectValueNode,
  ObjectFieldNode,
  DirectiveNode,
  NamedTypeNode,
  ListTypeNode,
  NonNullTypeNode,
  SchemaDefinitionNode,
  OperationTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  UnionTypeDefinitionNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  InputObjectTypeDefinitionNode,
  TypeExtensionDefinitionNode,
  DirectiveDefinitionNode,
  OperationTypeNode,
  ASTNode,
  DefinitionNode,
  ValueNode,
  SelectionNode,
  TypeNode,
  TypeSystemDefinitionNode,
  TypeDefinitionNode,
} from "./types";

export * from "./types";

export function name(value: string): NameNode;
export function isName(node: any): node is NameNode;
export function assertName(node: any): node is NameNode;
export function document(definitions: Array<DefinitionNode>): DocumentNode;
export function isDocument(node: any): node is DocumentNode;
export function assertDocument(node: any): node is DocumentNode;
export function operationDefinition(
  operation: OperationTypeNode,
  selectionSet: SelectionSetNode,
  name: NameNode | null | undefined,
  variableDefinitions: Array<VariableDefinitionNode> | null | undefined,
  directives: Array<DirectiveNode> | null | undefined
): OperationDefinitionNode;
export function isOperationDefinition(
  node: any
): node is OperationDefinitionNode;
export function assertOperationDefinition(
  node: any
): node is OperationDefinitionNode;
export function variableDefinition(
  variable: VariableNode,
  type: TypeNode,
  defaultValue: ValueNode | null | undefined
): VariableDefinitionNode;
export function isVariableDefinition(node: any): node is VariableDefinitionNode;
export function assertVariableDefinition(
  node: any
): node is VariableDefinitionNode;
export function variable(name: NameNode): VariableNode;
export function isVariable(node: any): node is VariableNode;
export function assertVariable(node: any): node is VariableNode;
export function selectionSet(
  selections: Array<SelectionNode>
): SelectionSetNode;
export function isSelectionSet(node: any): node is SelectionSetNode;
export function assertSelectionSet(node: any): node is SelectionSetNode;
export function field(
  name: NameNode,
  alias: NameNode | null | undefined,
  arguments: Array<ArgumentNode> | null | undefined,
  directives: Array<DirectiveNode> | null | undefined,
  selectionSet: SelectionSetNode | null | undefined
): FieldNode;
export function isField(node: any): node is FieldNode;
export function assertField(node: any): node is FieldNode;
export function argument(name: NameNode, value: ValueNode): ArgumentNode;
export function isArgument(node: any): node is ArgumentNode;
export function assertArgument(node: any): node is ArgumentNode;
export function fragmentSpread(
  name: NameNode,
  directives: Array<DirectiveNode> | null | undefined
): FragmentSpreadNode;
export function isFragmentSpread(node: any): node is FragmentSpreadNode;
export function assertFragmentSpread(node: any): node is FragmentSpreadNode;
export function inlineFragment(
  selectionSet: SelectionSetNode,
  typeCondition: NamedTypeNode | null | undefined,
  directives: Array<DirectiveNode> | null | undefined
): InlineFragmentNode;
export function isInlineFragment(node: any): node is InlineFragmentNode;
export function assertInlineFragment(node: any): node is InlineFragmentNode;
export function fragmentDefinition(
  name: NameNode,
  typeCondition: NamedTypeNode,
  selectionSet: SelectionSetNode,
  directives: Array<DirectiveNode> | null | undefined
): FragmentDefinitionNode;
export function isFragmentDefinition(node: any): node is FragmentDefinitionNode;
export function assertFragmentDefinition(
  node: any
): node is FragmentDefinitionNode;
export function intValue(value: string): IntValueNode;
export function isIntValue(node: any): node is IntValueNode;
export function assertIntValue(node: any): node is IntValueNode;
export function floatValue(value: string): FloatValueNode;
export function isFloatValue(node: any): node is FloatValueNode;
export function assertFloatValue(node: any): node is FloatValueNode;
export function stringValue(value: string): StringValueNode;
export function isStringValue(node: any): node is StringValueNode;
export function assertStringValue(node: any): node is StringValueNode;
export function booleanValue(value: boolean): BooleanValueNode;
export function isBooleanValue(node: any): node is BooleanValueNode;
export function assertBooleanValue(node: any): node is BooleanValueNode;
export function nullValue(): NullValueNode;
export function isNullValue(node: any): node is NullValueNode;
export function assertNullValue(node: any): node is NullValueNode;
export function enumValue(value: string): EnumValueNode;
export function isEnumValue(node: any): node is EnumValueNode;
export function assertEnumValue(node: any): node is EnumValueNode;
export function listValue(values: Array<ValueNode>): ListValueNode;
export function isListValue(node: any): node is ListValueNode;
export function assertListValue(node: any): node is ValueNode;
export function objectValue(fields: Array<ObjectFieldNode>): ObjectValueNode;
export function isObjectValue(node: any): node is ObjectValueNode;
export function assertObjectValue(node: any): node is ObjectValueNode;
export function objectField(name: NameNode, value: ValueNode): ObjectFieldNode;
export function isObjectField(node: any): node is ObjectFieldNode;
export function assertObjectField(node: any): node is ObjectFieldNode;
export function directive(
  name: NameNode,
  arguments: Array<ArgumentNode> | null | undefined
): DirectiveNode;
export function isDirective(node: any): node is DirectiveNode;
export function assertDirective(node: any): node is DirectiveNode;
export function namedType(name: NameNode): NamedTypeNode;
export function isNamedType(node: any): node is NamedTypeNode;
export function assertNamedType(node: any): node is NamedTypeNode;
export function listType(type: TypeNode): ListTypeNode;
export function isListType(node: any): node is ListTypeNode;
export function assertListType(node: any): node is TypeNode;
export function nonNullType(
  type: NamedTypeNode | ListTypeNode
): NonNullTypeNode;
export function isNonNullType(node: any): node is NonNullTypeNode;
export function assertNonNullType(node: any): node is NonNullTypeNode;
export function schemaDefinition(
  directives: Array<DirectiveNode>,
  operationTypes: Array<OperationTypeDefinitionNode>
): SchemaDefinitionNode;
export function isSchemaDefinition(node: any): node is SchemaDefinitionNode;
export function assertSchemaDefinition(node: any): node is SchemaDefinitionNode;
export function operationTypeDefinition(
  operation: OperationTypeNode,
  type: NamedTypeNode
): OperationTypeDefinitionNode;
export function isOperationTypeDefinition(
  node: any
): node is OperationTypeDefinitionNode;
export function assertOperationTypeDefinition(
  node: any
): node is OperationTypeDefinitionNode;
export function scalarTypeDefinition(
  name: NameNode,
  directives: Array<DirectiveNode> | null | undefined
): ScalarTypeDefinitionNode;
export function isScalarTypeDefinition(
  node: any
): node is ScalarTypeDefinitionNode;
export function assertScalarTypeDefinition(
  node: any
): node is ScalarTypeDefinitionNode;
export function objectTypeDefinition(
  name: NameNode,
  fields: Array<FieldDefinitionNode>,
  interfaces: Array<NamedTypeNode> | null | undefined,
  directives: Array<DirectiveNode> | null | undefined
): ObjectTypeDefinitionNode;
export function isObjectTypeDefinition(
  node: any
): node is ObjectTypeDefinitionNode;
export function assertObjectTypeDefinition(
  node: any
): node is ObjectTypeDefinitionNode;
export function fieldDefinition(
  name: NameNode,
  arguments: Array<InputValueDefinitionNode>,
  type: TypeNode,
  directives: Array<DirectiveNode> | null | undefined
): FieldDefinitionNode;
export function isFieldDefinition(node: any): node is FieldDefinitionNode;
export function assertFieldDefinition(node: any): node is FieldDefinitionNode;
export function inputValueDefinition(
  name: NameNode,
  type: TypeNode,
  defaultValue: ValueNode | null | undefined,
  directives: Array<DirectiveNode> | null | undefined
): InputValueDefinitionNode;
export function isInputValueDefinition(
  node: any
): node is InputValueDefinitionNode;
export function assertInputValueDefinition(
  node: any
): node is InputValueDefinitionNode;
export function interfaceTypeDefinition(
  name: NameNode,
  fields: Array<FieldDefinitionNode>,
  directives: Array<DirectiveNode> | null | undefined
): InterfaceTypeDefinitionNode;
export function isInterfaceTypeDefinition(
  node: any
): node is InterfaceTypeDefinitionNode;
export function assertInterfaceTypeDefinition(
  node: any
): node is InterfaceTypeDefinitionNode;
export function unionTypeDefinition(
  name: NameNode,
  types: Array<NamedTypeNode>,
  directives: Array<DirectiveNode> | null | undefined
): UnionTypeDefinitionNode;
export function isUnionTypeDefinition(
  node: any
): node is UnionTypeDefinitionNode;
export function assertUnionTypeDefinition(
  node: any
): node is UnionTypeDefinitionNode;
export function enumTypeDefinition(
  name: NameNode,
  values: Array<EnumValueDefinitionNode>,
  directives: Array<DirectiveNode> | null | undefined
): EnumTypeDefinitionNode;
export function isEnumTypeDefinition(node: any): node is EnumTypeDefinitionNode;
export function assertEnumTypeDefinition(
  node: any
): node is EnumTypeDefinitionNode;
export function enumValueDefinition(
  name: NameNode,
  directives: Array<DirectiveNode> | null | undefined
): EnumValueDefinitionNode;
export function isEnumValueDefinition(
  node: any
): node is EnumValueDefinitionNode;
export function assertEnumValueDefinition(
  node: any
): node is EnumValueDefinitionNode;
export function inputObjectTypeDefinition(
  name: NameNode,
  fields: Array<InputValueDefinitionNode>,
  directives: Array<DirectiveNode> | null | undefined
): InputObjectTypeDefinitionNode;
export function isInputObjectTypeDefinition(
  node: any
): node is InputObjectTypeDefinitionNode;
export function assertInputObjectTypeDefinition(
  node: any
): node is InputObjectTypeDefinitionNode;
export function typeExtensionDefinition(
  definition: ObjectTypeDefinitionNode
): TypeExtensionDefinitionNode;
export function isTypeExtensionDefinition(
  node: any
): node is TypeExtensionDefinitionNode;
export function assertTypeExtensionDefinition(
  node: any
): node is TypeExtensionDefinitionNode;
export function directiveDefinition(
  name: NameNode,
  locations: Array<NameNode>,
  arguments: Array<InputValueDefinitionNode> | null | undefined
): DirectiveDefinitionNode;
export function isDirectiveDefinition(
  node: any
): node is DirectiveDefinitionNode;
export function assertDirectiveDefinition(
  node: any
): node is DirectiveDefinitionNode;

export function is(nodeName: string, node: any): boolean;
