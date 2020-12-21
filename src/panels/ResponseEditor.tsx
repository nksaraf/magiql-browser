import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import { Loading, Response } from "../components/Icons";
import { PanelHeader } from "../lib/styles";

export function ResponseEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [results] = useAtom(ide.getTabResults(currentTab));
  const [queryStatus] = useAtom(ide.queryStatus);
  const [focused, setFocused] = useAtom(ide.focusedPanel);

  return (
    <EditorPanel
      options={{
        readOnly: true,
      }}
      onChange={() => {}}
      path={`/${currentTab}/response.json`}
      contents={
        queryStatus === "loading" ? "" : JSON.stringify(results, null, 2)
      }
      renderActions={() => {
        return queryStatus === "loading" ? (
          <div
            className={bw`text-xs flex flex-row items-center gap-1 ${
              focused ? "text-blueGray-200" : "text-blueGray-600"
            }`}
          >
            <Loading className={bw`animate-spin h-4 w-4`} />
          </div>
        ) : null;
      }}
    />
  );
}
