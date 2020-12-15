

export interface NameNode {
   kind: 'Name';
  readonly loc?: Location;
  readonly value: string;
}

export interface DocumentNode {
   kind: 'Document';
  readonly loc?: Location;
  readonly definitions: DefinitionNode[];
}

export interface OperationDefinitionNode {
   kind: 'OperationDefinition';
  readonly loc?: Location;
  readonly operation: OperationTypeNode;
  readonly name?: NameNode;
  readonly variableDefinitions?: VariableDefinitionNode[];
  readonly directives?: DirectiveNode[];
  readonly selectionSet: SelectionSetNode;
}

export interface VariableDefinitionNode {
   kind: 'VariableDefinition';
  readonly loc?: Location;
  readonly variable: VariableNode;
  readonly type: TypeNode;
  readonly defaultValue?: ValueNode;
  readonly directives?: DirectiveNode[];
}

export interface VariableNode {
   kind: 'Variable';
  readonly loc?: Location;
  readonly name: NameNode;
}

export interface SelectionSetNode {
  kind: 'SelectionSet';
  loc?: Location;
  selections: SelectionNode[];
}

export interface FieldNode {
   kind: 'Field';
  readonly loc?: Location;
  readonly alias?: NameNode;
  readonly name: NameNode;
  readonly arguments?: ArgumentNode[];
  readonly directives?: DirectiveNode[];
  readonly selectionSet?: SelectionSetNode;
}

export interface ArgumentNode {
   kind: 'Argument';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly value: ValueNode;
}

export interface FragmentSpreadNode {
   kind: 'FragmentSpread';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
}

export interface InlineFragmentNode {
   kind: 'InlineFragment';
  readonly loc?: Location;
  readonly typeCondition?: NamedTypeNode;
  readonly directives?: DirectiveNode[];
  readonly selectionSet: SelectionSetNode;
}

export interface FragmentDefinitionNode {
   kind: 'FragmentDefinition';
  readonly loc?: Location;
  readonly name: NameNode;
  // Note: fragment variable definitions are experimental and may be changed
  // or removed in the future.
  readonly variableDefinitions?: VariableDefinitionNode[];
  readonly typeCondition: NamedTypeNode;
  readonly directives?: DirectiveNode[];
  readonly selectionSet: SelectionSetNode;
}

export interface IntValueNode {
   kind: 'IntValue';
  readonly loc?: Location;
  readonly value: string;
}

export interface FloatValueNode {
   kind: 'FloatValue';
  readonly loc?: Location;
  readonly value: string;
}

export interface StringValueNode {
   kind: 'StringValue';
  readonly loc?: Location;
  readonly value: string;
  readonly block?: boolean;
}

export interface BooleanValueNode {
   kind: 'BooleanValue';
  readonly loc?: Location;
  readonly value: boolean;
}

export interface NullValueNode {
   kind: 'NullValue';
  readonly loc?: Location;
}

export interface EnumValueNode {
   kind: 'EnumValue';
  readonly loc?: Location;
  readonly value: string;
}

export interface ListValueNode {
   kind: 'ListValue';
  readonly loc?: Location;
  readonly values: ValueNode[];
}

export interface ObjectValueNode {
   kind: 'ObjectValue';
  readonly loc?: Location;
  readonly fields: ObjectFieldNode[];
}

export interface ObjectFieldNode {
   kind: 'ObjectField';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly value: ValueNode;
}

export interface DirectiveNode {
   kind: 'Directive';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly arguments?: ArgumentNode[];
}

export interface NamedTypeNode {
   kind: 'NamedType';
  readonly loc?: Location;
  readonly name: NameNode;
}

export interface ListTypeNode {
   kind: 'ListType';
  readonly loc?: Location;
  readonly type: TypeNode;
}

export interface NonNullTypeNode {
   kind: 'NonNullType';
  readonly loc?: Location;
  readonly type: NamedTypeNode | ListTypeNode;
}

export interface SchemaDefinitionNode {
   kind: 'SchemaDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly directives?: DirectiveNode[];
  readonly operationTypes: OperationTypeDefinitionNode[];
}

export interface OperationTypeDefinitionNode {
   kind: 'OperationTypeDefinition';
  readonly loc?: Location;
  readonly operation: OperationTypeNode;
  readonly type: NamedTypeNode;
}

export interface ScalarTypeDefinitionNode {
   kind: 'ScalarTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
}

export interface ObjectTypeDefinitionNode {
   kind: 'ObjectTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly interfaces?: NamedTypeNode[];
  readonly directives?: DirectiveNode[];
  readonly fields?: FieldDefinitionNode[];
}

export interface FieldDefinitionNode {
   kind: 'FieldDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly arguments?: InputValueDefinitionNode[];
  readonly type: TypeNode;
  readonly directives?: DirectiveNode[];
}

export interface InputValueDefinitionNode {
   kind: 'InputValueDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly type: TypeNode;
  readonly defaultValue?: ValueNode;
  readonly directives?: DirectiveNode[];
}

export interface InterfaceTypeDefinitionNode {
   kind: 'InterfaceTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly interfaces?: NamedTypeNode[];
  readonly directives?: DirectiveNode[];
  readonly fields?: FieldDefinitionNode[];
}

export interface UnionTypeDefinitionNode {
   kind: 'UnionTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly types?: NamedTypeNode[];
}

export interface EnumTypeDefinitionNode {
   kind: 'EnumTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly values?: EnumValueDefinitionNode[];
}

export interface EnumValueDefinitionNode {
   kind: 'EnumValueDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
}

export interface InputObjectTypeDefinitionNode {
   kind: 'InputObjectTypeDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly fields?: InputValueDefinitionNode[];
}

export interface DirectiveDefinitionNode {
   kind: 'DirectiveDefinition';
  readonly loc?: Location;
  readonly description?: StringValueNode;
  readonly name: NameNode;
  readonly arguments?: InputValueDefinitionNode[];
  readonly repeatable: boolean;
  readonly locations: NameNode[];
}

export interface SchemaExtensionNode {
   kind: 'SchemaExtension';
  readonly loc?: Location;
  readonly directives?: DirectiveNode[];
  readonly operationTypes?: OperationTypeDefinitionNode[];
}

export interface ScalarTypeExtensionNode {
   kind: 'ScalarTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
}

export interface ObjectTypeExtensionNode {
   kind: 'ObjectTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly interfaces?: NamedTypeNode[];
  readonly directives?: DirectiveNode[];
  readonly fields?: FieldDefinitionNode[];
}

export interface InterfaceTypeExtensionNode {
   kind: 'InterfaceTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly interfaces?: NamedTypeNode[];
  readonly directives?: DirectiveNode[];
  readonly fields?: FieldDefinitionNode[];
}

export interface UnionTypeExtensionNode {
   kind: 'UnionTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly types?: NamedTypeNode[];
}

export interface EnumTypeExtensionNode {
   kind: 'EnumTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly values?: EnumValueDefinitionNode[];
}

export interface InputObjectTypeExtensionNode {
   kind: 'InputObjectTypeExtension';
  readonly loc?: Location;
  readonly name: NameNode;
  readonly directives?: DirectiveNode[];
  readonly fields?: InputValueDefinitionNode[];
}