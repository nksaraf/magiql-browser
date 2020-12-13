import {
  GraphQLObjectType,


  GraphQLInterfaceType
} from "graphql";
import * as gql from "graphql-ast-types";

export const removeSelections = (list, selections, getPath) => {
  let unselected = [...list];
  selections?.forEach((selection) => {
    const selectedField = unselected.find((item) => selection.startsWith(getPath(item))
    );

    if (selectedField) {
      unselected = unselected.filter(
        (type) => type.name !== selectedField.name
      );
    }
  });
  return unselected;
};
export function getFields({ type, schema }) {
  if (gql.isObjectTypeDefinition(type.astNode)) {
    return Object.values((type as GraphQLObjectType).getFields());
  }
  if (gql.isInterfaceTypeDefinition(type.astNode)) {
    Object.values((type as GraphQLInterfaceType).getFields());
  } else if (gql.isUnionTypeDefinition(type.astNode)) {
    return [];
  }

  return [];
}
export function getTypes({ type, schema }) {
  if (gql.isObjectTypeDefinition(type.astNode)) {
    return [];
  }
  if (gql.isInterfaceTypeDefinition(type.astNode)) {
    return schema.getPossibleTypes(type as GraphQLInterfaceType);
  } else if (gql.isUnionTypeDefinition(type.astNode)) {
    return schema.getPossibleTypes(type as GraphQLInterfaceType);
  }

  return [];
}
