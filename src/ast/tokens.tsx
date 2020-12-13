import { bw } from "@beamwind/play";
import React from "react";
import { graphqlNode } from "./Explorer";

export function FieldName({ children }) {
  return <div className={bw`text-graphql-field`}>{children}</div>;
}
export function Indented({ children }) {
  return <div className={bw`indent`}>{children}</div>;
}
export function Type({ children }) {
  return <div className={bw`text-graphql-typename`}>{children}</div>;
}
export function Keyword({ children }) {
  return <div className={bw`text-graphql-keyword`}>{children}</div>;
}
export function Name({ children }) {
  return <div className={bw`text-graphql-opname`}>{children}</div>;
}
export function Variable({ children }) {
  return <div className={bw`text-graphql-variable`}>${children}</div>;
}
export function ArgumentName({ children }) {
  return <div className={bw`text-graphql-argname`}>${children}</div>;
}
export function Punctuation({ children }) {
  return <div className={bw`text-graphql-punctuation`}>{children}</div>;
}
export function Lines({ children }) {
  return <div className={bw`flex flex-col gap-1`}>{children}</div>;
}
export function Tokens({ children, className = "" }) {
  return <div className={`${bw`${graphqlNode}`} ${className}`}>{children}</div>;
}
