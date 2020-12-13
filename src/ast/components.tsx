import { bw } from "@beamwind/play";
import React from "react";
import { Arrow, Checkbox } from "../components";
import { graphqlNode } from "./Explorer";

export function CollapsableNode({ children, isOpen, className }) {
  return (
    <div className={bw`${graphqlNode} ${className}`}>
      <Arrow isOpen={isOpen} />
      {children}
    </div>
  );
}
export function SelectableNode({ children, className, isSelected }) {
  return (
    <div className={bw`${graphqlNode} ${className}`}>
      <div>
        <Checkbox checked={isSelected} />
      </div>
      <div>{children}</div>
    </div>
  );
}
export function NodeWithSelections({
  isSelected,
  children,
  selections,
  args = [],
  className,
}) {
  return (
    <div className={bw`flex flex-col gap-1`}>
      <CollapsableNode isOpen={isSelected} className={className}>
        {children}
        {isSelected && (
          <div className={bw`font-mono text-xs text-graphql-punctuation`}>
            {"{"}
          </div>
        )}
      </CollapsableNode>
      {isSelected && <div className={bw`ml-4`}>{selections}</div>}
      {isSelected && (
        <div className={bw`font-mono text-xs text-graphql-punctuation`}>
          {"}"}
        </div>
      )}
    </div>
  );
}
