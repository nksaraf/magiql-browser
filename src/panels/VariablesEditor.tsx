import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { EditorPanel } from "../components/EditorPanel";
import { InputIcon } from "../components/Icons";
import React from "react";
import { PanelHeader } from "../lib/styles";

export function VariablesEditor() {
  const [currentTab] = useAtom(ide.currentTab);
  const [variablesText, setVariables] = useAtom(
    ide.getTabVariablesFile(currentTab)
  );
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
      path={`/${currentTab}/variables.json`}
    />
  );
}
