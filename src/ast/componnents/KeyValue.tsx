import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import {
  Arrow,
  Checkbox,
  Indented,
  Lines,
  Punctuation,
  Tokens,
} from "../tokens";
import {
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLList,
  isInputObjectType,
  isListType,
  isNonNullType,
  isObjectType,
  isWrappingType,
} from "graphql";
import { Value } from "./Value";
import { defaultValue } from "./Argument";
import {
  useUpdateCollection,
  ObjectFields,
  createAstComponent,
} from "./components";

export function KeyWithObjectValue({
  name,
  value,
  valueType,
  isSelected,
  onToggle = () => {},
  isLast,
}: {
  valueType: GraphQLInputObjectType;
  [key: string]: any;
}) {
  const update = useUpdateCollection({ node: value, key: "fields" });
  const fields = valueType?.getFields();

  return (
    <Lines>
      <Tokens
        onClick={onToggle}
        className={bw`text-graphql-argname ${{
          "opacity-50": !isSelected,
        }}group`}
      >
        <Arrow isOpen={isSelected} />
        <div>{name.value}: </div>
        {isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {isSelected && value && (
        <>
          <Indented>
            <Lines>
              {(value as gql.ObjectValueNode).fields.map((childNode, index) => {
                const fieldType = fields?.[childNode.name.value]?.type;
                return (
                  <KeyValue
                    onToggle={() => {
                      update.removeItem(childNode);
                    }}
                    valueType={fieldType}
                    name={childNode.name}
                    value={childNode.value}
                    isSelected={childNode.metadata.isSelected}
                    isLast={index}
                  />
                );
              })}
            </Lines>

            {fields &&
              Object.keys(fields).map((field, index) => {
                return (
                  <KeyValue
                    name={{
                      kind: "Name",
                      value: fields[field].name,
                      metadata: { isSelected: false },
                    }}
                    onToggle={() => {
                      update.addItem({
                        kind: "ObjectField",
                        name: {
                          kind: "Name",
                          value: fields[field].name,
                          metadata: { isSelected: false },
                        },
                        value: defaultValue(fields[field].type),
                      });
                    }}
                    value={null}
                    valueType={fields[field].type}
                    isSelected={false}
                    isLast={true}
                  />
                );
              })}
          </Indented>
          <Tokens>
            <Punctuation>
              {"}"}
              {isLast ? null : ","}
            </Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

export function KeyWithListValue({
  name,
  value,
  valueType,
  isSelected,
  onToggle = () => {},
  isLast,
}: {
  valueType: GraphQLList<any>;
  [key: string]: any;
}) {
  const update = useUpdateCollection({ node: value, key: "values" });
  const itemType = valueType?.ofType;

  return (
    <Lines>
      <Tokens
        onClick={onToggle}
        className={bw`text-graphql-argname  ${{
          "opacity-50": !isSelected,
        }}group`}
      >
        <Arrow isOpen={isSelected} />
        <div>{name.value}: </div>
        {isSelected && <Punctuation>{"["}</Punctuation>}
      </Tokens>
      {isSelected && (
        <>
          <Indented>
            <ListItems
              onAdd={update.addItem}
              onRemove={update.removeItem}
              itemType={itemType}
              node={(value as gql.ListValueNode).values}
            />
            {itemType && (
              <ListItem
                itemType={itemType}
                isLast={true}
                onToggle={() => {
                  update.addItem(defaultValue(itemType));
                }}
                node={defaultValue(itemType)}
              />
            )}
          </Indented>
          <Tokens>
            <Punctuation>
              {"]"}
              {isLast ? null : ","}
            </Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

export function KeyValue({
  name,
  value,
  isSelected,
  valueType = null,
  onToggle = () => {},
  isLast,
}) {
  if (value?.kind === "ListValue" || (valueType && isListType(valueType))) {
    return (
      <KeyWithListValue
        name={name}
        valueType={valueType}
        onToggle={onToggle}
        value={value}
        isSelected={isSelected}
        isLast={isLast}
      />
    );
  } else if (
    value?.kind === "ObjectValue" ||
    (valueType && isInputObjectType(valueType))
  ) {
    return (
      <KeyWithObjectValue
        valueType={valueType}
        name={name}
        onToggle={onToggle}
        value={value}
        isSelected={isSelected}
        isLast={isLast}
      />
    );
  } else {
    return (
      <Tokens>
        <Tokens
          onClick={onToggle}
          className={bw`${{
            "opacity-50": !isSelected,
          }} text-graphql-argname group`}
        >
          <Checkbox checked={isSelected} />
          <div className={bw`text-graphql-argname`}>{name.value}: </div>
        </Tokens>
        {value && isSelected && <Value node={value} type={valueType} />}
      </Tokens>
    );
  }
}

export function unwrapInputType(inputType: GraphQLInputType) {
  let unwrappedType = inputType;
  while (isWrappingType(unwrappedType)) {
    unwrappedType = unwrappedType.ofType;
  }
  return unwrappedType;
}

function ListItemList({ node: childNode, onToggle, isLast, itemType }) {
  const updateList = useUpdateCollection({ node: childNode, key: "values" });
  return (
    <Lines>
      <Tokens
        className={bw`group text-graphql-argname ${{
          "opacity-50": !childNode.metadata.isSelected,
        }}`}
      >
        <Arrow isOpen={childNode.metadata.isSelected} onClick={onToggle} />
        {childNode.metadata.isSelected && <Punctuation>[</Punctuation>}
      </Tokens>
      {childNode.metadata.isSelected && (
        <Indented>
          <ListItems
            node={childNode.values}
            onRemove={updateList.removeItem}
            onAdd={updateList.addItem}
          />
        </Indented>
      )}
      {childNode.metadata.isSelected && (
        <Tokens>
          <Punctuation>]</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}
function ListItemObject({ node: childNode, onToggle, isLast, itemType }) {
  const updateList = useUpdateCollection({ node: childNode, key: "fields" });
  const fields = itemType?.getFields();
  console.log({ itemType, fields });

  return (
    <Lines>
      <Tokens
        className={bw`group text-graphql-argname ${{
          "opacity-50": !childNode.metadata.isSelected,
        }}`}
      >
        <Arrow isOpen={childNode.metadata.isSelected} onClick={onToggle} />
        <Punctuation>{"{"}</Punctuation>
        {!childNode.metadata.isSelected && <Punctuation>{"}"}</Punctuation>}
      </Tokens>
      {childNode.metadata.isSelected && (
        <>
          <Indented>
            <Lines>
              {(childNode as gql.ObjectValueNode).fields.map((child, index) => {
                const fieldType = fields?.[child.name.value]?.type;
                return (
                  <KeyValue
                    onToggle={() => {
                      updateList.removeItem(child);
                    }}
                    valueType={fieldType}
                    name={child.name}
                    value={child.value}
                    isSelected={child.metadata.isSelected}
                    isLast={index}
                  />
                );
              })}
              {fields &&
                Object.keys(fields).map((field, index) => {
                  return (
                    <KeyValue
                      name={{
                        kind: "Name",
                        value: fields[field].name,
                        metadata: { isSelected: false },
                      }}
                      onToggle={() => {
                        updateList.addItem({
                          kind: "ObjectField",
                          name: {
                            kind: "Name",
                            value: fields[field].name,
                            metadata: { isSelected: false },
                          },
                          value: defaultValue(fields[field].type),
                        });
                      }}
                      value={null}
                      valueType={fields[field].type}
                      isSelected={false}
                      isLast={true}
                    />
                  );
                })}
            </Lines>
          </Indented>
          <Tokens>
            <Punctuation>{"}"}</Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

function ListItem({ node: childNode, onToggle, isLast, itemType }) {
  itemType = isNonNullType(itemType) ? itemType.ofType : itemType;
  if (childNode.kind === "ListValue") {
    return (
      <ListItemList
        node={childNode}
        onToggle={onToggle}
        isLast={isLast}
        itemType={itemType}
      />
    );
  } else if (childNode.kind === "ObjectValue") {
    return (
      <ListItemObject
        node={childNode}
        onToggle={onToggle}
        isLast={isLast}
        itemType={itemType}
      />
    );
  }

  return (
    <Tokens
      onClick={onToggle}
      className={bw`group text-graphql-argname ${{
        "opacity-50": !childNode.metadata.isSelected,
      }}`}
      key={childNode.metadata.path}
    >
      <Checkbox checked={childNode.metadata.isSelected} />
      <Tokens className={bw`gap-0`}>
        <Value node={childNode} />
        {isLast ? "," : ""}
      </Tokens>
    </Tokens>
  );
}

export const ListItems = createAstComponent<gql.ValueNode[]>(
  ({ node, onAdd, onRemove, itemType }) => {
    if (!node) {
      return null;
    }

    return (
      <Lines>
        {node.map((childNode, index) => {
          return (
            <ListItem
              itemType={itemType}
              isLast={index < node.length - 1}
              node={childNode}
              onToggle={() => onRemove(childNode)}
            />
          );
        })}
      </Lines>
    );
  }
);
