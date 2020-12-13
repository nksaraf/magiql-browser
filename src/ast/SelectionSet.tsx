import { bw } from "@beamwind/play";
import { useAtom } from "../atom";
import React from "react";
import {
  FragmentSpreadNode,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
} from "graphql";
import * as gql from "graphql-ast-types";
import { Arrow, Checkbox } from "./tokens";
import { ast, useSchema } from "./state";
import { removeSelections, getFields, getTypes } from "./utils";
import { InlineFragmentNode } from "graphql";
import {
  Lines,
  Tokens,
  Punctuation,
  Indented,
  Keyword,
  Type,
  Name,
} from "./tokens";
import { Field } from "./Field";

function InlineFragment({ path, type }) {
  const schema = useSchema();
  const [node] = useAtom<InlineFragmentNode>(ast.getSelection(path) as any);
  const [isSelected] = useAtom(ast.getIsSelected(path));

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-typename`} isOpen={isSelected} />
        {isSelected && (
          <>
            <Punctuation>...</Punctuation>
            <Keyword>on</Keyword>
          </>
        )}
        <Type>{type.name}</Type>
        {isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={path} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}
function FragmentSpread({ path }) {
  const [node] = useAtom(ast.getSelection(path));
  const [isSelected] = useAtom(ast.getIsSelected(path));

  return (
    <Tokens>
      <div>
        <Checkbox checked={isSelected} />
      </div>
      {isSelected && <Punctuation>...</Punctuation>}
      <Name>{(node as FragmentSpreadNode).name.value}</Name>
    </Tokens>
  );
}
function Selection({ parentPath, path, type }) {
  const [node] = useAtom(ast.getSelection(path));
  const schema = useSchema();

  if (gql.isField(node)) {
    if (type.getFields()[node.name.value]) {
      return <Field field={type.getFields()[node.name.value]} path={path} />;
    }
    return null;
  } else if (gql.isInlineFragment(node)) {
    if (schema.getType(node.typeCondition.name.value)) {
      return (
        <InlineFragment
          type={schema.getType(node.typeCondition.name.value)}
          path={path}
        />
      );
    }
    return null;
  } else if (gql.isFragmentSpread(node)) {
    return <FragmentSpread path={path} />;
  }
  return <>{path}</>;
}
export function SelectionSet({
  parentPath,
  type,
}: {
  type: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;
  parentPath: string;
}) {
  const [selectionSet] = useAtom(ast.getSelectionSet(parentPath));
  const schema = useSchema();

  let unselectedFields = removeSelections(
    getFields({ type, schema }),
    selectionSet?.selections ?? [],
    (item) => `${parentPath}.${item.name}`
  );
  let unselectedTypes = removeSelections(
    [...getTypes({ type, schema })],
    selectionSet?.selections ?? [],
    (item) => `${parentPath}.${item.name}`
  );

  return (
    <Lines>
      {selectionSet?.selections.map((sel) => (
        <Selection path={sel} parentPath={sel} type={type} />
      ))}
      {unselectedFields.map((field) => (
        <Field field={field} path={`${parentPath}.${field.name}`} />
      ))}
      {unselectedTypes.map((type) => (
        <InlineFragment type={type} path={`${parentPath}.${type.name}`} />
      ))}
    </Lines>
  );
}