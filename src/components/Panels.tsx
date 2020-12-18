import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import SplitGrid from "react-split-grid";
import { createContext } from "create-hook-context";

export const [PanelConfigProvider, usePanelConfig] = createContext(
  ({ panels }: { panels: { [key: string]: React.FC<{}> } }) => {
    return panels;
  }
);

export function VerticalPanels({ index, panels }) {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes, setSizes] = useAtom(ide.getTabVerticalRatio(currentTab));
  const panelConfig = usePanelConfig();

  if (panels.length === 1) {
    const Panel = panelConfig[panels[0]];
    return <Panel />;
  }

  return (
    <SplitGrid
      direction="column"
      gridTemplateRows={sizes[index]}
      onDrag={(a, b, s, d) => {
        setSizes((old) => {
          const n = [...old];
          n[index] = s;
          return n;
        });
      }}
      render={({ getGridProps, getGutterProps }) => {
        return (
          <div className={bw`w-full h-full grid`} {...getGridProps()}>
            {panels.map((panel, i) => {
              const Panel = panelConfig[panel];
              return (
                <React.Fragment key={panel}>
                  <div className={bw`h-full w-full overflow-scroll`}>
                    <Panel />
                  </div>
                  {i < panels.length - 1 && (
                    <div {...getGutterProps("row", i + 1)} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      }}
    />
  );
}

export function HorizontalPanels() {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes, setSizes] = useAtom(ide.getTabHorizontalRatio(currentTab));
  const [panels] = useAtom(ide.getTabPanels(currentTab));

  return (
    <SplitGrid
      direction="row"
      gridTemplateColumns={sizes}
      onDrag={(a, b, s, d) => {
        setSizes(s);
      }}
      render={({ getGridProps, getGutterProps }) => (
        <div className={bw`w-full h-full grid`} {...getGridProps()}>
          {panels.map((panel, i) => (
            <React.Fragment key={JSON.stringify(panel)}>
              <div className={bw`h-full w-full overflow-scroll`}>
                <VerticalPanels panels={panel} index={i} />
              </div>
              {i < panels.length - 1 && (
                <div {...getGutterProps("column", i + i + 1)} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    />
  );
}

export function Panels() {
  return <HorizontalPanels />;
}
