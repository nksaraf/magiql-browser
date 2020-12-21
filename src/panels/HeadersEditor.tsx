import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import { Helmet } from "../components/Icons";
import { PanelHeader } from "../lib/styles";

export function HeadersEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [headersText, setHeaders] = useAtom(ide.getTabHeadersFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focusedPanel);

  return (
    <EditorPanel
      contents={headersText}
      onChange={(text) => {
        setHeaders(text);
      }}
      path={`/${currentTab}/headers.json`}
    />
  );
}
