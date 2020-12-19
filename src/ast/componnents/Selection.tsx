import React from "react";
import * as gql from "../types";
import { FragmentSpread } from "./FragmentSpread";
import { InlineFragment } from "./InlineFragment";
import { createAstComponent } from "./components";
import { Field } from "./ExpandableField";

export const Selection = createAstComponent<gql.SelectionNode>(
  ({ node, type, onToggle }) => {
    switch (node.kind) {
      case "Field": {
        return <Field node={node} type={type} onToggle={onToggle} />;
      }
      case "FragmentSpread": {
        return <FragmentSpread node={node} type={type} onToggle={onToggle} />;
      }
      case "InlineFragment": {
        return <InlineFragment node={node} onToggle={onToggle} />;
      }
    }
  }
);
Selection.displayName = "Selection";
