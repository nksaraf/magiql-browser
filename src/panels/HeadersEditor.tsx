import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { EditorPanel } from "../components/EditorPanel";
import { Helmet } from "../components/Icons";
import { editorPanelHeader } from "../lib/components";

export function HeadersEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [headersText, setHeaders] = useAtom(ide.getTabHeadersFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      contents={headersText}
      onChange={(text) => {
        setHeaders(text);
      }}
      onFocus={() => {
        setFocused("headers");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      path={`/${currentTab}/headers.json`}
    >
      <div
        onClick={() => {
          setFocused("headers");
        }}
        className={bw`${editorPanelHeader(focused === "headers")} gap-1`}
      >
        <div className={bw`h-4.5 w-4.5 -mt-1`}>
          <Helmet className={bw`h-4.5 w-4.5`} />
        </div>
        <div>Headers</div>
      </div>
    </EditorPanel>
  );
}
