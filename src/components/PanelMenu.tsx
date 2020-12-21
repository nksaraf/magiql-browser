import React from "react";
import { bw } from "@beamwind/play";
import { Check, VerticalDots } from "./Icons";
import { menu } from "../lib/styles";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePanel, usePanelConfig } from "./Panels";

export function PanelMenu() {
  const [panelConfig] = usePanelConfig();
  const panel = usePanel();
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
                value={panelName}
                className={bw`${menuItem} items-center`}
              >
                <DropdownMenu.ItemIndicator
                  className={bw`absolute left-1.5 translate-y-0.5`}
                >
                  <Check className={bw`w-3 h-3`} />
                </DropdownMenu.ItemIndicator>
                <div>{panelName}</div>
              </DropdownMenu.RadioItem>
            );
          })}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export const menuItem = `cursor-pointer select-none w-32 px-1 pl-5 py-1 font-graphql rounded-sm text-sm border-none text-blueGray-500 hover:(bg-blue-400 text-white)`;
