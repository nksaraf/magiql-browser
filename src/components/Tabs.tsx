import React from "react";
import { bw } from "@beamwind/play";
import * as browser from "../lib/browser";
import { tooltip } from "./Toolbar";
import { useAtom } from "../lib/browser";
import Tooltip from "@reach/tooltip";
import { Close, Logo } from "./Icons";
import { tabBreakpoints } from "../Browser";
import { motion } from "framer-motion";

export const Tabs = () => {
  const [tabs, setTabs] = useAtom(browser.tabs);
  const [currentTab, setCurrentTab] = useAtom(browser.currentTab);

  const addTab = browser.useCallback(({ set, snapshot }) => () => {
    const old = snapshot.getLoadable(browser.tabs).contents as string[];
    const oldCurrent = snapshot.getLoadable(browser.currentTab)
      .contents as string;
    const oldSchema = snapshot.getLoadable(
      browser.getTabSchemaConfig(oldCurrent)
    ).contents as any;

    let newTab;

    for (var i = 1; i < 100; i++) {
      if (!old.includes(`query${i}`)) {
        newTab = `query${i}`;
        break;
      }
    }

    set(browser.browser, (old) => ({
      tabs: [...old.tabs, newTab],
      currentTab: newTab,
    }));

    set(browser.getTabSchemaConfig(newTab), oldSchema);
  });

  const deleteTab = browser.useCallback(
    ({ set, snapshot }) => (tab: string) => {
      const { tabs: old, currentTab } = snapshot.getLoadable(browser.browser)
        .contents as any;
      const index = old.findIndex((o) => o === tab);

      if (old.length === 1) {
        return;
      }

      let toDelete: string[] = [];

      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("magiql://" + currentTab)) {
          toDelete.push(localStorage.key(i));
        }
      }

      toDelete.forEach((dele) => {
        localStorage.removeItem(dele);
      });

      set(browser.browser, (old) => ({
        tabs: old.tabs.filter((t) => t !== tab),
        currentTab:
          old.currentTab === tab
            ? index < old.tabs.length - 1
              ? old.tabs[index + 1]
              : old.tabs[index - 1]
            : old.currentTab,
      }));
    }
  );

  const ref = React.useRef();

  return (
    <div className={bw`flex flex-row gap-2 pl-3 z-9`}>
      <Tooltip className={bw`${tooltip}`} label="GraphQL Browser">
        <div className={bw`self-center`}>
          <Logo
            className={bw`${`text-graphql-pink`} hover:(mb-0.5 scale-110) h-5.5 w-5.5 group-hover:(mb-0.5 scale-110) cursor-pointer transition-all mb-0`}
          />
        </div>
      </Tooltip>
      <div
        ref={ref}
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
          <motion.div
            drag="x"
            dragConstraints={ref}
            dragDirectionLock={true}
            layout
            key={tab}
            onClick={() => {
              setCurrentTab(tab);
            }}
            className={bw`flex-1 group cursor-pointer justify-between pr-2 font-graphql flex flex-row items-center relative text-sm ${{
              "bg-blueGray-50 text-blueGray-700 z-10": currentTab === tab,
              "bg-blueGray-200  text-blueGray-500 z-9 hover:(bg-blueGray-100)":
                currentTab !== tab,
            }} pl-4 py-1.5 rounded-t-lg`}
          >
            <div
              className={bw`absolute left-0 z-8 top-0 w-3 -translate-x-1 translate-y-2 rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200 group-hover:(bg-blueGray-100)":
                  currentTab !== tab,
              }}`}
            ></div>
            <div className={bw`flex-1 truncate select-none`}>{tab}</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                deleteTab(tab);
              }}
              className={bw`px-1 py-1 hover:(bg-blueGray-200) rounded-full relative z-20`}
            >
              <Close
                className={bw`h-3.5 w-3.5 ${{
                  "text-blueGray-700": currentTab === tab,
                  "text-blueGray-400 group-hover:(bg-transparent)":
                    currentTab !== tab,
                }}`}
              />
            </div>
            <div
              className={bw`absolute right-0 z-8 top-0 w-3 translate-x-1 translate-y-2 -rotate-15 h-8 ${{
                "bg-blueGray-50": currentTab === tab,
                "bg-blueGray-200  group-hover:(bg-blueGray-100)":
                  currentTab !== tab,
              }}`}
            ></div>
          </motion.div>
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
          <div className={bw``}>
            <div
              onClick={() => {
                addTab();
              }}
              className={bw`px-2 rounded-full w-7 px-2 text-xl cursor-pointer transition-all hover:(bg-blueGray-200)`}
            >
              +
            </div>
          </div>
        </div>
      </div>
      <div className={bw`px-1 py-1`}>
        <div
          onClick={() => {
            addTab();
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
