import React from "react";
import { bw } from "@beamwind/play";
import { Check, VerticalDots } from "./Icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePanel, usePanelConfig } from "./Panels";
import * as browser from "../lib/browser";

export const menu = `relative px-0.5 py-0.5 bg-blueGray-50 border-white border-2 rounded-md shadow-xl`;

export function PanelMenu() {
  const [panelConfig] = usePanelConfig();
  const panel = usePanel();
  const [currentTab] = browser.useAtom(browser.currentTab);

  const [panels, setPanels] = browser.useAtom(browser.getTabPanels(currentTab));

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={bw`focus:ring-2 focus:ring-blue-400 focus:outline-none active:outline-none transition-all hover:(bg-blueGray-500) rounded-full py-1 px-1`}
      >
        <div>
          <VerticalDots className={bw`w-3.5 h-3.5`} />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={4} className={bw`${menu}`}>
        <DropdownMenu.RadioGroup value={panel.id}>
          {Object.keys(panelConfig).map((panelName) => {
            return (
              <DropdownMenu.RadioItem
                key={panelName}
                onSelect={(e) => {
                  setPanels((old) => {
                    return panels.map((v, i) =>
                      i === panel.x
                        ? v.map((h, j) => (panel.y === j ? panelName : h))
                        : [...v]
                    );
                    // const ver = panels[panel.x][panel.y]
                    // e.target.value;
                  });
                }}
                value={panelName}
                className={bw`${menuItem} items-center`}
              >
                <DropdownMenu.ItemIndicator
                  className={bw`absolute left-1.5 translate-y-0.5`}
                >
                  <Check className={bw`w-3 h-3`} />
                </DropdownMenu.ItemIndicator>
                <div className={bw`flex flex-row gap-2 items-center`}>
                  {React.createElement(panelConfig[panelName]?.icon, {
                    className: bw`w-3.5 h-3.5 -mt-1`,
                  })}
                  <div>{panelConfig[panelName]?.title}</div>
                </div>
              </DropdownMenu.RadioItem>
            );
          })}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export const menuItem = `cursor-pointer select-none w-32 px-1 pl-5 py-1 font-graphql rounded-sm text-sm border-none text-blueGray-500 hover:(bg-blue-400 text-white)`;
