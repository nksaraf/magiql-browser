import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import {
  Arrow,
  Checkbox,
  FieldName,
  Indented,
  Lines,
  Punctuation,
  Qualifier,
  Tokens,
} from "../tokens";
import { getNamedType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType } from "graphql";
import { SelectionSet } from "./SelectionSet";
import { Arguments } from "./Arguments";
import {
  createAstComponent,
  useUpdateCollection,
  withTooltip,
} from "./components";

function ArrowSelectable({
  onClick,
  description,
  isSelected,
  className,
  children,
}) {
  return withTooltip(
    description,
    <Tokens
      onClick={onClick}
      className={`${bw`${{ "opacity-50": !isSelected }} group`} ${className}`}
    >
      <Arrow isOpen={isSelected} />
      {children}
    </Tokens>
  );
}

function CheckboxSelectable({
  onClick,
  description,
  isSelected,
  className,
  children,
}) {
  return withTooltip(
    description,
    <Tokens
      onClick={onClick}
      className={`${bw`${{ "opacity-50": !isSelected }} group`} ${className}`}
    >
      <Checkbox checked={isSelected} />
      {children}
    </Tokens>
  );
}

export const ExpandableField = createAstComponent<gql.FieldNode>(
  ({ node, field = null, onToggle }) => {
    const fieldType = field?.type ? getNamedType(field?.type) : null;
    const hasArgs =
      (node.arguments && node.arguments.length > 0) || field?.args?.length
        ? true
        : false;
    const updateArguments = useUpdateCollection({ node, key: "arguments" });
    const aliasedField = node?.alias?.value ? (
      <Tokens>
        <FieldName>{node.alias?.value}: </FieldName>
        <Qualifier>{node.name.value}</Qualifier>
      </Tokens>
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
        <ArrowSelectable
          description={field?.description}
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
          className={bw`text-graphql-field`}
          isSelected={node.metadata.isSelected}
        >
          {header}
        </ArrowSelectable>
        {hasArgs && node.metadata.isSelected && (
          <Indented>
            <Arguments
              onAdd={updateArguments.addItem}
              onRemove={updateArguments.removeItem}
              node={node.arguments}
              parentPath={node.metadata.path}
              field={field}
            />
          </Indented>
        )}
        {node.metadata.isSelected && (
          <>
            {hasArgs && (
              <Tokens className={bw`pl-1`}>
                <Punctuation>{") {"}</Punctuation>
              </Tokens>
            )}
            <Indented>
              <SelectionSet node={node.selectionSet} parentType={fieldType} />
            </Indented>
            <Tokens>
              <Punctuation>{"}"}</Punctuation>
            </Tokens>
          </>
        )}
      </Lines>
    );
  }
);
ExpandableField.displayName = "ExpandableField";

export const Field = createAstComponent<
  gql.FieldNode,
  { parentType: GraphQLObjectType | GraphQLInterfaceType }
>(({ node, parentType, onToggle }) => {
  let field;
  const updateArguments = useUpdateCollection({ node, key: "arguments" });

  if (parentType) {
    field = parentType.getFields()[node.name.value];
    if (!field?.type) {
      return null;
    }
  }

  const fieldType = field ? getNamedType(field.type) : null;

  if (
    [
      "InterfaceTypeDefinition",
      "UnionTypeDefinition",
      "ObjectTypeDefinition",
    ].includes((fieldType as GraphQLNamedType)?.astNode?.kind)
  ) {
    return <ExpandableField node={node} field={field} onToggle={onToggle} />;
  }

  if ((node.selectionSet?.selections ?? []).length > 0) {
    return <ExpandableField node={node} />;
  }

  const hasArgs =
    (node.arguments && node.arguments.length > 0) || field?.args?.length
      ? true
      : false;

  const aliasedField = node?.alias?.value ? (
    <Tokens>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{node.name.value}</Qualifier>
    </Tokens>
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
      {withTooltip(
        parentType?.description,
        <div>
          <Tokens
            onClick={() => onToggle(node)}
            className={bw`${{
              "opacity-50": !node.metadata.isSelected,
            }} group`}
          >
            <Checkbox
              className={bw`text-graphql-field`}
              checked={node.metadata.isSelected}
            />
            {header}
          </Tokens>
        </div>
      )}
      {node.metadata.isSelected && hasArgs && (
        <>
          <Indented>
            <Arguments
              onAdd={updateArguments.addItem}
              onRemove={updateArguments.removeItem}
              parentPath={node.metadata.path}
              node={node.arguments}
              field={field}
            />
          </Indented>
          <Tokens>
            <Punctuation>)</Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
});
Field.displayName = "Field";
