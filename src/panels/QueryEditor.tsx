import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import { Code } from "../components/Icons";
import { PanelHeader } from "../lib/styles";
import { PanelMenu } from "../components/PanelMenu";

export function QueryEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQuery] = useAtom(ide.getTabQueryFile(currentTab));
  const [edited, setLastEditedBy] = useAtom(ide.lastEditedBy);
  const [focused, setFocused] = useAtom(ide.focusedPanel);

  return (
    <EditorPanel
      path={`/${currentTab}/query.graphql`}
      contents={query}
      onChange={(text) => {
        setQuery(text);
        setLastEditedBy("editor");
      }}
    />
  );
}
