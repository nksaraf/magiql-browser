import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { Indented, Lines, Punctuation, Tokens } from "../tokens";
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import { Variable } from "./Variable";
import { createAstComponent, ObjectFields } from "./components";
import { ListItems } from "./KeyValue";

export const IntValue = createAstComponent<gql.IntValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-number`}>{node.value}</div>
    </Tokens>
  );
});
IntValue.displayName = "IntValue";

export const FloatValue = createAstComponent<gql.FloatValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-number`}>{node.value}</div>
    </Tokens>
  );
});
FloatValue.displayName = "FloatValue";

export const StringValue = createAstComponent<gql.StringValueNode>(
  ({ node }) => {
    return (
      <Tokens>
        <div className={bw`text-graphql-string`}>
          {JSON.stringify(node.value)}
        </div>
      </Tokens>
    );
  }
);
StringValue.displayName = "StringValue";

export const BooleanValue = createAstComponent<gql.BooleanValueNode>(
  ({ node }) => {
    return (
      <ListboxInput
        className={bw`font-mono  rounded-sm`}
        // aria-labelledby={labelId}
        value={JSON.stringify(node.value)}
      >
        <ListboxButton
          className={bw`text-graphql-boolean px-1`}
          arrow={<span className={bw`pl-2`}>↕</span>}
        />
        <ListboxPopover className={bw`bg-gray-100 rounded-sm shadow-xl z-1000`}>
          <ListboxList className={bw`font-mono text-xs text-graphql-boolean`}>
            <ListboxOption className={bw`px-2 py-1 text-gray-800`} value="true">
              {"true"}
            </ListboxOption>
            <ListboxOption
              className={bw`px-2 py-1 text-gray-800`}
              value="false"
            >
              {"false"}
            </ListboxOption>
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    );
  }
);
BooleanValue.displayName = "BooleanValue";

export const NullValue = createAstComponent<gql.NullValueNode>(({ node }) => {
  return <Tokens className={bw`text-graphql-keyword`}>null</Tokens>;
});
NullValue.displayName = "NullValue";

export const EnumValue = createAstComponent<gql.EnumValueNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-keyword`}>{node.value}</div>
    </Tokens>
  );
});
EnumValue.displayName = "EnumValue";

export const ListValue = createAstComponent<gql.ListValueNode>(({ node }) => {
  return (
    <Tokens className={bw`text-graphql-punctuation`}>
      [<ListItems node={node.values} />]
    </Tokens>
  );
});
ListValue.displayName = "ListValue";

export const ObjectValue = createAstComponent<gql.ObjectValueNode>(
  ({ node }) => {
    return (
      <Lines>
        <Punctuation>{"{"}</Punctuation>
        <Indented>
          <ObjectFields node={node.fields} />
        </Indented>
        <Punctuation>{"}"}</Punctuation>
      </Lines>
    );
  }
);
ObjectValue.displayName = "ObjectValue";

export const Value = createAstComponent<gql.ValueNode>(({ node, type }) => {
  if (!node) {
    return null;
  }

  switch (node.kind) {
    case "Variable": {
      return <Variable node={node} type={type} />;
    }
    case "IntValue": {
      return <IntValue node={node} type={type} />;
    }
    case "FloatValue": {
      return <FloatValue node={node} type={type} />;
    }
    case "StringValue": {
      return <StringValue node={node} type={type} />;
    }
    case "BooleanValue": {
      return <BooleanValue node={node} type={type} />;
    }
    case "NullValue": {
      return <NullValue node={node} type={type} />;
    }
    case "EnumValue": {
      return <EnumValue node={node} type={type} />;
    }
    case "ListValue": {
      return <ListValue node={node} type={type} />;
    }
    case "ObjectValue": {
      return <ObjectValue node={node} type={type} />;
    }
  }
});

Value.displayName = "Value";
