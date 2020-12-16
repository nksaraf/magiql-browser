import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "./lib/atom";
import { Graphql, PlayButton, Logo, Tree, Helmet } from "./lib/Icons";
import { ide } from "./lib/ide";
import * as icons from "@modulz/radix-icons";
import fetchProgress from "fetch-progress";

import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip";

const useCurrentQuery = () => {
  const [currentTab] = useAtom(ide.currentTab);
  const [query] = useAtom(ide.getTabQueryFile(currentTab));
  const [variablesText] = useAtom(ide.getTabVariablesFile(currentTab));
  const [headersText] = useAtom(ide.getTabHeadersFile(currentTab));
  const [config] = useAtom(ide.schemaConfig);

  return async () => {
    let headers;
    try {
      headers = JSON.parse(headersText);
    } catch (e) {
      headers = {};
    }

    let variables;
    try {
      variables = JSON.parse(variablesText);
    } catch (e) {
      variables = {};
    }

    try {
      const response = await fetch(config?.uri, {
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
        }),
        headers: {
          ["Content-type"]: "application/json",
          ...(headers ?? {}),
        },
      });

      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  };
};

const tooltip = `bg-gray-700 text-white border-none rounded-md shadow-lg font-graphql`;
const iconButton = `h-5.5 w-5.5 hover:(mb-0.5 scale-110) cursor-pointer transition-all mb-0`;
export function Toolbar() {
  const [currentTab] = useAtom(ide.currentTab);
  const [result, setResults] = useAtom(ide.getTabResults(currentTab));
  const [queryStatus, setQueryStatus] = useAtom(ide.queryStatus);
  const fetchQuery = useCurrentQuery();
  const [panels, setPanels] = useAtom(ide.panels);
  const [config] = useAtom(ide.schemaConfig);
  const [focused, setFocused] = useAtom(ide.focused);
  const [schema] = useAtom(ide.schema);
  return (
    <div
      className={bw`w-full flex flex-row items-center gap-4 rounded-md bg-gray-100 h-10 py-1.5 px-3`}
    >
      <div className={bw``}>
        <Logo
          className={bw`${
            schema ? `text-#e10098` : `text-gray-400`
          } hover:(mb-0.5 scale-110) ${iconButton}`}
          // onClick={() => {
          //   setPanels((props) =>
          //     props[2].includes("schema")
          //       ? props
          //       : [props[0], props[1], ["schema"]]
          //   );
          // }}
        />
      </div>
      <div
        className={bw`px-4 flex-1 text-gray-800 flex gap-3 flex-row col-span-4 text-gray-600 bg-gray-200 h-full items-center rounded-md text-center font-graphql text-sm`}
      >
        <div
          className={bw`rounded-full ${
            schema ? `bg-green-500` : `bg-gray-400`
          } w-2 h-2`}
        ></div>
        <div>{config?.uri}</div>
      </div>
      <div
        className={bw`py-1 flex flex-row rounded-md gap-3 items-center rounded-md`}
      >
        <Tooltip className={bw`${tooltip}`} label="Run Query">
          <div>
            <PlayButton
              onClick={async () => {
                setPanels((props) =>
                  props[2].includes("response")
                    ? props
                    : [props[0], props[1], ["response"]]
                );
                setFocused("response");
                setQueryStatus("loading");
                fetchQuery()
                  .then((response) => {
                    setQueryStatus("success");
                    setResults(response);
                  })
                  .catch((err) => {
                    setQueryStatus("error");
                    setResults({ error: err.toString() });
                  });
              }}
              className={bw`${iconButton} ${{
                "text-green-600":
                  queryStatus === "idle" || queryStatus === "success",
                "text-gray-400": queryStatus === "loading",
              }}`}
            />{" "}
          </div>
        </Tooltip>
        <Tooltip className={bw`${tooltip}`} label="Syntax Tree">
          <div>
            {" "}
            <Tree
              onClick={async () => {
                setPanels((props) =>
                  props[2].includes("ast")
                    ? props
                    : [props[0], props[1], ["ast"]]
                );
                setFocused("ast");
              }}
              className={bw`${iconButton} text-blue-600`}
            />{" "}
          </div>
        </Tooltip>
        <Tooltip className={bw`${tooltip}`} label="Headers">
          <div>
            <Helmet
              onClick={async () => {
                setPanels((props) =>
                  props[2].includes("headers")
                    ? props
                    : [props[0], props[1], ["headers"]]
                );
                setFocused("headers");
              }}
              className={bw`${iconButton} text-purple-600`}
            />
          </div>
        </Tooltip>
        <Tooltip className={bw`${tooltip}`} label="Schema">
          <div>
            <Graphql
              className={bw`${iconButton} text-#e10098`}
              onClick={() => {
                setPanels((props) =>
                  props[2].includes("schema")
                    ? props
                    : [props[0], props[1], ["schema"]]
                );
                setFocused("schema");
              }}
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
