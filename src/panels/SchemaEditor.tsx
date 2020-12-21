import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import { Graphql } from "../components/Icons";
import { PanelHeader } from "../lib/styles";

export function SchemaEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schema] = useAtom(ide.getTabSchema(currentTab));
  const [focused, setFocused] = useAtom(ide.focusedPanel);

  return (
    <EditorPanel path={`/${currentTab}/schema.graphql`} contents={schema} />
  );
}
