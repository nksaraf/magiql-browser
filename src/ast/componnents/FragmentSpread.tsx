import React from "react";
import * as gql from "../types";
import { Checkbox, Punctuation, Tokens } from "../tokens";
import { Name } from "./Name";
import { createAstComponent } from "./components";

export const FragmentSpread = createAstComponent<gql.FragmentSpreadNode>(
  ({ node }) => {
    return (
      <Tokens>
        <div>
          <Checkbox checked={node.metadata.isSelected} />
        </div>
        {node.metadata.isSelected && <Punctuation>...</Punctuation>}
        <Name node={node.name} />
      </Tokens>
    );
  }
);
FragmentSpread.displayName = "FragmentSpread";
