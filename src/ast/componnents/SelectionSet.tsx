import React from "react";
import * as gql from "../types";
import { useAtom } from "../../lib/atom";
import { Lines } from "../tokens";
import { getFields, getTypes } from "../utils";
import * as ast from "../atoms";
import {
  createAstComponent,
  useUpdateCollection,
  useSchema,
} from "./components";
import { Field } from "./ExpandableField";
import { Selection } from "./Selection";
import { InlineFragment } from "./InlineFragment";
import { FragmentSpread } from "./FragmentSpread";

function UnselectedField({ type, path, fieldtype, onAdd }) {
  const [field] = useAtom(ast.getField(path));

  return (
    <Field
      node={{
        ...(field as any),
        name: {
          kind: "Name",
          metadata: {} as any,
          value: fieldtype.name,
        },
      }}
      onToggle={onAdd}
      type={type}
    />
  );
}
function UnselectedType({ type, path, onAdd }) {
  const [fragment] = useAtom(ast.getInlineFragment(path));

  return (
    <InlineFragment
      node={{
        ...(fragment as any),
        typeCondition: {
          kind: "NamedType",
          metadata: {} as any,
          name: { kind: "Name", value: type.name, metadata: {} as any },
        },
      }}
      onToggle={onAdd}
      type={type}
    />
  );
}

export const SelectionSet = createAstComponent<gql.SelectionSetNode>(
  ({ node, type }) => {
    const schema = useSchema();
    const supportedTypes = schema ? [...getTypes({ type, schema })] : [];
    const fields = schema ? [...getFields({ type, schema })] : [];
    const { addItem, removeItem } = useUpdateCollection({
      node,
      key: "selections",
    });

    const unselectedTypes = supportedTypes.filter(
      (type) =>
        !node.selections.find((sel) =>
          sel.kind === "InlineFragment"
            ? sel.typeCondition.name.value === type.name
            : false
        )
    );
    const unselectedFields = fields.filter(
      (type) =>
        !node.selections.find((sel) =>
          sel.kind === "Field" ? sel.name.value === type.name : false
        )
    );
    return (
      <Lines>
        {node.metadata.isSelected && (
          <>
            {node.selections.map((childNode) => {
              switch (childNode.kind) {
                case "Field": {
                  return (
                    <Field node={childNode} type={type} onToggle={removeItem} />
                  );
                }
                case "FragmentSpread": {
                  return (
                    <FragmentSpread
                      node={childNode}
                      type={type}
                      onToggle={removeItem}
                    />
                  );
                }
                case "InlineFragment": {
                  return (
                    <InlineFragment node={childNode} onToggle={removeItem} />
                  );
                }
              }
            })}
          </>
        )}
        {unselectedTypes.map((sel, index) => (
          <UnselectedType
            type={sel}
            onAdd={addItem}
            key={node.metadata.path + ".type:" + sel.name}
            path={node.metadata.path + ".type:" + sel.name}
          />
        ))}
        {unselectedFields.map((sel, index) => (
          <UnselectedField
            type={type}
            onAdd={addItem}
            fieldtype={sel}
            key={node.metadata.path + ".field:" + sel.name}
            path={node.metadata.path + ".field:" + sel.name}
          />
        ))}
      </Lines>
    );
  }
);

SelectionSet.displayName = "SelectionSet";
