import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import {
  Graphql,
  PlayButton,
  Logo,
  Tree,
  Helmet,
  Loading,
  BackButton,
  ForwardButton,
  ErrorIcon,
  Reload,
} from "./Icons";
import * as ide from "../lib/ide";

import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip";
import { useDebouncedCallback, useMonacoContext } from "use-monaco";

const useCurrentQuery = () => {
  const [currentTab] = useAtom(ide.currentTab);
  const [query] = useAtom(ide.getTabQueryFile(currentTab));
  const [variablesText] = useAtom(ide.getTabVariablesFile(currentTab));
  const [headersText] = useAtom(ide.getTabHeadersFile(currentTab));
  const [config] = useAtom(ide.getTabSchemaConfig(currentTab));

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

const useDebounce = (
  value: any,
  operation: Function,
  delay: number = 400,
  ...params: any
) => {
  React.useEffect(() => {
    const handler = setTimeout(() => {
      operation(value, ...params);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);
};

export const tooltip = `bg-blueGray-800 z-100000 text-blueGray-100 border-none rounded-md shadow-lg font-graphql text-xs`;
const iconButton = `h-5.5 w-5.5 group-hover:(mb-0.5 scale-110) cursor-pointer transition-all mb-0`;
export function Toolbar() {
  const [currentTab] = useAtom(ide.currentTab);
  const [result, setResults] = useAtom(ide.getTabResults(currentTab));
  const [queryStatus, setQueryStatus] = useAtom(ide.queryStatus);
  const [schemaStatus, setSchemaStatus] = useAtom(ide.schemaStatus);
  const fetchQuery = useCurrentQuery();
  const [panels, setPanels] = useAtom(ide.getTabPanels(currentTab));
  const [config, setConfig] = useAtom(ide.getTabSchemaConfig(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);
  const [schema] = useAtom(ide.schemaText);
  const monaco = useMonacoContext();

  const [uri, setUri] = React.useState(config.uri);

  // React.useEffect(() => {
  //   if (uri !== config.uri) {
  //     setUri(config.uri);
  //   }
  // }, [config.uri]);

  useDebounce(
    uri,
    () => {
      setConfig((conf) =>
        uri !== conf.uri
          ? {
              ...conf,
              uri: uri,
            }
          : conf
      );
    },
    1000
  );

  return (
    <div
      className={bw`w-full relative flex flex-row items-center gap-4 rounded-md bg-blueGray-50 h-11 py-1.5 px-3 z-11`}
    >
      <BackButton
        className={bw`${`text-blueGray-400`} hover:(mb-0.5 scale-110) ${iconButton}`}
        onClick={() => {
          // setFocused("schema");
          // setPanels((props) =>
          //   props[2].includes("schema")
          //     ? props
          //     : [props[0], props[1], ["schema"]]
          // );
        }}
      />
      <ForwardButton
        className={bw`${`text-blueGray-400`} hover:(mb-0.5 scale-110) ${iconButton}`}
        onClick={() => {
          // setFocused("schema");
          // setPanels((props) =>
          //   props[2].includes("schema")
          //     ? props
          //     : [props[0], props[1], ["schema"]]
          // );
        }}
      />
      <Reload
        className={bw`${`text-blueGray-400`} hover:(mb-0.5 scale-110) ${iconButton} w-5 h-5`}
        onClick={() => {
          // setFocused("schema");
          // setPanels((props) =>
          //   props[2].includes("schema")
          //     ? props
          //     : [props[0], props[1], ["schema"]]
          // );
        }}
      />

      {/* <Tooltip className={bw`${tooltip}`} label="MagiQL IDE">
        <div>
          <Logo
            className={bw`${`text-graphql-pink`} hover:(mb-0.5 scale-110) ${iconButton}`}
            onClick={() => {
              setFocused("schema");
              setPanels((props) =>
                props[2].includes("schema")
                  ? props
                  : [props[0], props[1], ["schema"]]
              );
            }}
          />
        </div>
      </Tooltip> */}
      <div
        className={bw`px-4 flex-1 text-blueGray-600 flex gap-3 flex-row col-span-4 bg-blueGray-200 h-full items-center rounded-md text-center`}
      >
        {schemaStatus === "success" ? (
          <Tooltip
            className={bw`${tooltip}`}
            label={`Schema loaded successfully`}
          >
            <div className={bw`grid items-center w-3.75 h-3.75`}>
              <div className={bw`rounded-full bg-green-500 w-2.5 h-2.5`}></div>
            </div>
          </Tooltip>
        ) : schemaStatus === "error" ? (
          <Tooltip className={bw`${tooltip}`} label={`Couldn't load schema`}>
            <div>
              <ErrorIcon className={bw`w-3.75 h-3.75 text-graphql-pink`} />
            </div>
          </Tooltip>
        ) : (
          <Tooltip className={bw`${tooltip}`} label={`Loading schema`}>
            <div>
              <Loading
                className={bw`animate-spin text-graphql-pink w-3.75 h-3.75`}
              />
            </div>
          </Tooltip>
        )}
        <div className={bw`flex flex-row gap-2 flex-1 items-center`}>
          <input
            className={bw`flex-1 w-full font-graphql text-sm bg-transparent`}
            value={uri}
            key={currentTab}
            onChange={(e) => {
              setSchemaStatus("loading");
              setUri(e.currentTarget.value);
            }}
          />

          {/* {schemaStatus === "loading" && ( */}

          {/* {schemaStatus === "loading" && (
            <div className={bw`flex flex-row gap-2 items-center`}>
              <div className={bw`font-graphql text-xs text-blueGray-300`}>
                Loading schema
              </div>
              <Loading
                className={bw`text-graphql-pink animate-spin h-3.5 w-3.5`}
              />
            </div>
          )} */}
        </div>
      </div>
      <div
        className={bw`py-1 flex flex-row rounded-md items-center rounded-md`}
      >
        <Tooltip className={bw`${tooltip}`} label="Run Query">
          <div
            className={bw`group transition-all hover:(bg-blueGray-200) rounded-md py-1 px-2`}
          >
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
            />
          </div>
        </Tooltip>
        <Tooltip className={bw`${tooltip}`} label="Syntax Tree">
          <div
            className={bw`group transition-all hover:(bg-blueGray-200) rounded-md py-1 px-2`}
          >
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
          <div
            className={bw`group transition-all hover:(bg-blueGray-200) rounded-md py-1 px-2`}
          >
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
          <div
            className={bw`group transition-all hover:(bg-blueGray-200) rounded-md py-1 px-2`}
          >
            <Graphql
              className={bw`${iconButton} ${
                schemaStatus === "success"
                  ? "text-graphql-pink"
                  : "text-blueGray-400"
              } `}
              disabled={schemaStatus !== "success"}
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
