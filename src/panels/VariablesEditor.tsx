import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { EditorPanel } from "../components/EditorPanel";
import { InputIcon } from "../components/Icons";
import { editorPanelHeader } from "../lib/styles";

export function VariablesEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [variablesText, setVariables] = useAtom(
    ide.getTabVariablesFile(currentTab)
  );
  const [focused, setFocused] = useAtom(ide.focused);
  // const { monaco } = useMonacoContext();
  // const [document] = useAtom(gqlAst.getDocument(currentTab));
  React.useEffect(() => {
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //   validate: true,
    //   schemas: [
    //     {
    //       uri: "variables",
    //       fileMatch: ["/**/variables.json"],
    //       schema: {
    //         type: "object",
    //         properties: {
    //           profieId: { description: "variable", type: "number" },
    //         },
    //       },
    //     },
    //   ],
    // });
  });

  return (
    <EditorPanel
      contents={variablesText}
      onChange={(text) => {
        setVariables(text);
      }}
      onFocus={() => {
        setFocused("variables");
      }}
      onBlur={() => {
        setFocused(null);
      }}
      path={`/${currentTab}/variables.json`}
    >
      <div
        onClick={() => {
          setFocused("variables");
        }}
        className={bw`${editorPanelHeader(focused === "variables")} gap-1.5`}
      >
        <div className={bw`h-4.0 w-4.0 -mt-0`}>
          <InputIcon className={bw`h-4.0 w-4.0`} />
        </div>
        <div>Variables</div>
      </div>
    </EditorPanel>
  );
}
