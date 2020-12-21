import React from "react";
import { bw } from "@beamwind/play";
import { Check, VerticalDots } from "./Icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { usePanel, usePanelConfig } from "./Panels";
import * as browser from "../lib/browser";
import { AnimatePresence, motion } from "framer-motion";

export const menu = `relative px-0.5 py-1 bg-white border-white border-1 rounded-md shadow-2xl`;

const renderers = {
  context: ContextMenu,
  dropdown: DropdownMenu,
};

export function PanelMenuTrigger({
  mode = "context",
  children,
  renderer: Menu = renderers[mode],
  ...props
}) {
  return <Menu.Trigger {...props}>{children}</Menu.Trigger>;
}

export function PanelMenu({
  mode = "context",
  children,
  renderer: Menu = renderers[mode],
}) {
  const [panelConfig] = usePanelConfig();
  const panel = usePanel();
  const [currentTab] = browser.useAtom(browser.currentTab);

  const [panels, setPanels] = browser.useAtom(browser.getTabPanels(currentTab));

  return (
    <Menu.Root>
      {children}
      {/* <AnimatePresence> */}
      <Menu.Content
        key="menu-content"
        align="end"
        sideOffset={4}
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // exit={{ opacity: 0 }}
        // as={motion.div}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 7px 25px 2px",
        }}
        className={bw`${menu}`}
      >
        <Menu.RadioGroup value={panel.id}>
          {Object.keys(panelConfig).map((panelName) => {
            return (
              <Menu.RadioItem
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
                <Menu.ItemIndicator
                  className={bw`absolute left-2 translate-y-0.5 group-hover:(text-white) text-blue-500 `}
                >
                  <Check className={bw`w-3.5 h-3.5`} />
                </Menu.ItemIndicator>
                <div
                  className={bw`flex font-graphql flex-row gap-2 items-center`}
                >
                  {React.createElement(panelConfig[panelName]?.icon, {
                    className: bw`w-3.5 h-3.5 -mt-0.5`,
                  })}
                  <div>{panelConfig[panelName]?.title}</div>
                </div>
              </Menu.RadioItem>
            );
          })}
        </Menu.RadioGroup>
      </Menu.Content>
      {/* </AnimatePresence> */}
    </Menu.Root>
  );
}

export const menuItem = `cursor-pointer select-none group w-48 px-1 pl-8 py-1 font-graphql rounded-sm text-sm border-none text-blueGray-500 hover:(outline-none bg-blue-500 text-white)`;
