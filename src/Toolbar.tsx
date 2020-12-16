import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "./lib/atom";
import { Graphql, PlayButton, Logo } from "./lib/Icons";
import { ide } from "./lib/ide";
import * as icons from "@modulz/radix-icons";
import fetchProgress from "fetch-progress";

export function Toolbar() {
  const [currentTab] = useAtom(ide.currentTab);
  const [result, setResults] = useAtom(ide.getTabResults(currentTab));
  const [query] = useAtom(ide.getTabQueryFile(currentTab));
  const [panels, setPanels] = useAtom(ide.panels);
  const [config] = useAtom(ide.schemaConfig);
  const [schema] = useAtom(ide.schema);
  return (
    <div
      className={bw`w-full flex flex-row items-center gap-4 rounded-md bg-gray-100 h-10 py-1.5 px-3`}
    >
      <div className={bw``}>
        <Logo
          className={bw`h-5.5 w-5.5 text-#e10098 hover:(mb-0.5) cursor-pointer transition-all mb-0`}
          onClick={() => {
            setPanels((props) =>
              props[2].includes("schema")
                ? props
                : [props[0], props[1], ["schema"]]
            );
          }}
        />
      </div>

      <div
        className={bw`px-4 flex-1 text-gray-800 flex gap-3 flex-row col-span-4 bg-gray-200 h-full items-center rounded-md text-center font-mono text-xs`}
      >
        <div
          className={bw`rounded-full ${
            schema ? `bg-green-500` : `bg-gray-400`
          } w-2 h-2`}
        ></div>
        <div>{config?.uri}</div>
      </div>
      <div className={bw`py-1 flex flex-row gap-3 items-center rounded-md`}>
        <PlayButton
          onClick={async () => {
            setPanels((props) =>
              props[2].includes("response")
                ? props
                : [props[0], props[1], ["response"]]
            );
            fetch(config?.uri, {
              method: "POST",
              body: JSON.stringify({
                query: query,
              }),
              headers: {
                ["Content-type"]: "application/json",
              },
            })
              .then(
                fetchProgress({
                  // implement onProgress method
                  onProgress(progress) {
                    console.log({ progress });
                    // A possible progress report you will get
                    // {
                    //    total: 3333,
                    //    transferred: 3333,
                    //    speed: 3333,
                    //    eta: 33,
                    //    percentage: 33
                    //    remaining: 3333,
                    // }
                  },
                })
              )
              .then((res) => res.json())
              .then(({ data, ...others }) => setResults({ data, ...others }));
          }}
          className={bw`h-5.5 w-5.5 hover:(mb-0.5) cursor-pointer transition-all mb-0 text-blue-600`}
        />
        <icons.Share1Icon
          onClick={async () => {
            setPanels((props) =>
              props[2].includes("ast") ? props : [props[0], props[1], ["ast"]]
            );
          }}
          className={bw`h-5.5 w-5.5 hover:(mb-0.5) cursor-pointer transition-all mb-0 text-purple-600`}
        />
        <div className={bw``}>
          <Graphql
            className={bw`h-5.5 w-5.5 text-#e10098 hover:(mb-0.5) cursor-pointer transition-all mb-0`}
            onClick={() => {
              setPanels((props) =>
                props[2].includes("schema")
                  ? props
                  : [props[0], props[1], ["schema"]]
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
