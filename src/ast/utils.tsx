import type {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLSchema,
} from "graphql";

export function getFields({ type, schema }) {
  if (type.astNode.kind === "ObjectTypeDefinition") {
    return Object.values((type as GraphQLObjectType).getFields());
  }
  if (type.astNode.kind === "InterfaceTypeDefinition") {
    Object.values((type as GraphQLInterfaceType).getFields());
  } else if (type.astNode.kind === "UnionTypeDefinition") {
    return [];
  }

  return [];
}

export function getTypes({
  type,
  schema,
}: {
  type: GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType;
  schema: GraphQLSchema;
}) {
  if (type.astNode.kind === "ObjectTypeDefinition") {
    return [];
  }
  if (
    type.astNode.kind === "InterfaceTypeDefinition" ||
    type.astNode.kind === "UnionTypeDefinition"
  ) {
    return schema.getPossibleTypes(type as GraphQLInterfaceType);
  }

  return [];
}
