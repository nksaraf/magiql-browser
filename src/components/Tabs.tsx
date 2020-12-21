import React from "react";
import { bw } from "@beamwind/play";
import * as browser from "../lib/browser";
import { tooltip } from "./Toolbar";
import { useAtom } from "../lib/browser";
import Tooltip from "@reach/tooltip";
import { Close, Logo } from "./Icons";
import { tabBreakpoints } from "../Browser";

export const Tabs = () => {
  const [tabs, setTabs] = useAtom(browser.tabs);
  const [currentTab, setCurrentTab] = useAtom(browser.currentTab);

  return (
    <div className={bw`flex flex-row gap-2 pl-3 z-9`}>
      <Tooltip className={bw`${tooltip}`} label="MagiQL IDE">
        <div className={bw`self-center`}>
          <Logo
            className={bw`${`text-graphql-pink`} hover:(mb-0.5 scale-110) h-5.5 w-5.5 group-hover:(mb-0.5 scale-110) cursor-pointer transition-all mb-0`} />
        </div>
      </Tooltip>
      <div
        className={bw`grid lg:(${`grid-cols-${Math.max(
          tabs.length,
          tabBreakpoints[3]
        )}`}) md:(${`grid-cols-${Math.max(
          tabs.length,
          tabBreakpoints[2]
        )}`}) sm:(${`grid-cols-${Math.max(
          tabs.length,
          tabBreakpoints[1]
        )}`}) ${`grid-cols-${Math.max(
          tabs.length,
          tabBreakpoints[0]
        )}`} gap-2 ml-2 flex-1`}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => {
              setCurrentTab(tab);
            }}
            className={bw`flex-1 group cursor-pointer justify-between pr-2 font-graphql flex flex-row items-center relative text-sm ${{
              "bg-blueGray-50 text-blueGray-700 z-10": currentTab === tab,
              "bg-blueGray-200  text-blueGray-500 z-9 hover:(bg-blueGray-100)": currentTab !== tab,
            }} pl-4 py-1.5 rounded-t-lg`}
          >
            <div
              className={bw`absolute left-0 z-8 top-0 w-3 -translate-x-1 translate-y-2 rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200 group-hover:(bg-blueGray-100)": currentTab !== tab,
              }}`}
            ></div>
            <div className={bw`flex-1 truncate select-none`}>{tab}</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setTabs((old) => old.filter((t) => t !== tab));
              }}
              className={bw`px-1 py-1 hover:(bg-blueGray-200) rounded-full relative z-20`}
            >
              <Close
                className={bw`h-3.5 w-3.5 ${{
                  "text-blueGray-700": currentTab === tab,
                  "text-blueGray-400 group-hover:(bg-transparent)": currentTab !== tab,
                }}`} />
            </div>
            <div
              className={bw`absolute right-0 z-8 top-0 w-3 translate-x-1 translate-y-2 -rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200  group-hover:(bg-blueGray-100)": currentTab !== tab,
              }}`}
            ></div>
          </div>
        ))}
        <div
          className={bw`flex flex-row px-1 py-1 sm:(${{
            "block text-blueGray-500": tabs.length < tabBreakpoints[1],
            hidden: tabs.length >= tabBreakpoints[1],
          }}) md:(${{
            "block text-blueGray-500": tabs.length < tabBreakpoints[2],
            hidden: tabs.length >= tabBreakpoints[2],
          }}) lg:(${{
            "block text-blueGray-500": tabs.length < tabBreakpoints[3],
            hidden: tabs.length >= tabBreakpoints[3],
          }}) ${{
            "text-blueGray-500": tabs.length < tabBreakpoints[0],
            hidden: tabs.length >= tabBreakpoints[0],
          }}`}
        >
          <div
            onClick={() => {
              setTabs((old) => {
                for (var i = 1; i < 100; i++) {
                  if (!old.includes(`query${i}`)) {
                    return [...old, `query${i}`];
                  }
                }
              });
            }}
            className={bw`px-2 rounded-full px-2 rounded-full text-xl cursor-pointer transition-all hover:(bg-blueGray-200)`}
          >
            +
          </div>
        </div>
      </div>
      <div className={bw`px-1 py-1`}>
        <div
          onClick={() => {
            setTabs((old) => {
              for (var i = 1; i < 100; i++) {
                if (!old.includes(`query${i}`)) {
                  return [...old, `query${i}`];
                }
              }
            });
          }}
          className={bw`px-2 rounded-full ${{
            "text-blueGray-500 block": tabs.length >= tabBreakpoints[0],
            "text-blueGray-300 hidden": tabs.length < tabBreakpoints[0],
          }}
          sm:(${{
              "text-blueGray-500 block": tabs.length >= tabBreakpoints[1],
              "text-blueGray-300 hidden": tabs.length < tabBreakpoints[1],
            }}) md:(${{
              "text-blueGray-500 block": tabs.length >= tabBreakpoints[2],
              "text-blueGray-300 hidden": tabs.length < tabBreakpoints[2],
            }}) lg:(${{
              "text-blueGray-500 block": tabs.length >= tabBreakpoints[3],
              "text-blueGray-300 hidden": tabs.length < tabBreakpoints[3],
            }}) text-xl cursor-pointer transition-all hover:(bg-blueGray-200)`}
        >
          +
        </div>
      </div>
    </div>
  );
};
