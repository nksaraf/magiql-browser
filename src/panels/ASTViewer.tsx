import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import * as gqlAst from "../ast/atoms";

export function replacer(key, value) {
  // Filtering out properties
  if (key === "metadata") {
    return undefined;
  }

  if (value?.metadata?.isSelected === false) {
    return undefined;
  }
  return value;
}

export function ASTViewer() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));

  return (
    <EditorPanel
      options={{
        readOnly: true,
        fontSize: 10,
      }}
      path={`/${currentTab}/ast.json`}
      contents={JSON.stringify(document, true ? replacer : null, 2)}
    />
  );
}
