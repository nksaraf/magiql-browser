import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { EditorPanel } from "../components/EditorPanel";
import { Loading, Response } from "../components/Icons";
import { editorPanelHeader } from "../lib/components";

export function ResultsEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [results] = useAtom(ide.getTabResults(currentTab));
  const [queryStatus] = useAtom(ide.queryStatus);
  const [focused, setFocused] = useAtom(ide.focused);

  return (
    <EditorPanel
      header="Response"
      options={{
        readOnly: true,
      }}
      onFocus={() => {
        setFocused("response");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      onChange={() => {}}
      path={`${`/${currentTab}/response.json`}`}
      contents={
        queryStatus === "loading" ? "" : JSON.stringify(results, null, 2)
      }
    >
      <div
        onClick={() => {
          setFocused("response");
        }}
        className={bw`${editorPanelHeader(
          focused === "response"
        )} justify-between`}
      >
        <div className={bw`flex flex-row gap-1.5 items-center`}>
          <div className={bw`h-4.0 w-4.0`}>
            <Response className={bw`h-4.0 w-4.0`} />
          </div>
          <div>Response</div>
        </div>
        {queryStatus === "loading" && (
          <div
            className={bw`text-xs flex flex-row items-center gap-1 ${
              focused ? "text-blueGray-200" : "text-blueGray-600"
            }`}
          >
            <Loading className={bw`animate-spin h-4 w-4`} />
          </div>
        )}
      </div>
    </EditorPanel>
  );
}
