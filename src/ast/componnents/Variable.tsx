import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { Tokens } from "../tokens";
import { createAstComponent } from "./components";

export const Variable = createAstComponent<gql.VariableNode>(({ node }) => {
  return (
    <Tokens>
      <div className={bw`text-graphql-variable`}>${node.name.value}</div>
    </Tokens>
  );
});
