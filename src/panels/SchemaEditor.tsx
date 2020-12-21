import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { EditorPanel } from "../components/EditorPanel";
import { Graphql } from "../components/Icons";
import { editorPanelHeader } from "../lib/styles";

export function SchemaEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schema] = useAtom(ide.getTabSchema(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      path={`/${currentTab}/schema.graphql`}
      language="graphql"
      contents={schema}
      onChange={(text) => {}}
      onFocus={() => {
        setFocused("schema");
      }}
      onBlur={() => {
        setFocused(null);
      }}
    >
      <div
        onClick={() => {
          setFocused("schema");
        }}
        className={bw`${editorPanelHeader(focused === "schema")} gap-1.5`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-1`}>
          <Graphql className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Schema</div>
      </div>
    </EditorPanel>
  );
}
