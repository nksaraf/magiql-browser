import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { EditorPanel } from "../components/EditorPanel";
import { Code } from "../components/Icons";
import { editorPanelHeader } from "../lib/components";

export function QueryEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQuery] = useAtom(ide.getTabQueryFile(currentTab));
  const [edited, setLastEditedBy] = useAtom(ide.lastEditedBy);
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      path={`/${currentTab}/query.graphql`}
      language="graphql"
      contents={query}
      onFocus={() => {
        setFocused("editor");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      onChange={(text) => {
        setQuery(text);
        setLastEditedBy("editor");
      }}
    >
      <div
        onClick={() => {
          setFocused("editor");
        }}
        className={bw`${editorPanelHeader(focused === "editor")} gap-1`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Code className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Query Editor</div>
      </div>
    </EditorPanel>
  );
}
