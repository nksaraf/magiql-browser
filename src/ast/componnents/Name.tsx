import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import { createAstComponent } from "./components";

export const Name = createAstComponent<gql.NameNode>(({ node }) => {
  return <div className={bw`text-graphql-opname`}>{node.value}</div>;
});
Name.displayName = "Name";
