import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import SplitGrid from "react-split-grid";
import { createContext } from "create-hook-context";
import { Panel, styled } from "../lib/styles";

export const [PanelConfigProvider, usePanelConfig] = createContext(
  ({ panels }: { panels: { [key: string]: PanelConfig } }) => {
    return React.useState(panels);
  },
  null,
  "Panel"
);

type PanelConfig = {
  id: string;
  render: React.FC<{}>;
  title: string;
  x?: number;
  y?: number;
  icon: any;
};

export const [PanelProvider, usePanel] = createContext(
  ({ panel }: { panel: PanelConfig }) => {
    return panel;
  }
);

const EmptyPanel = styled(Panel)`
  bg-blueGray-200
`;

export function VerticalPanels({ index, panels }) {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes, setSizes] = useAtom(ide.getTabVerticalRatio(currentTab));
  const [panelConfig] = usePanelConfig();

  if (panels.length === 1) {
    const config = panelConfig[panels[0]];
    const Panel = config?.render;
    if (!Panel) {
      return (
        <PanelProvider panel={{ id: panels[0], ...config, x: index, y: 0 }}>
          <EmptyPanel />
        </PanelProvider>
      );
    }
    return (
      <PanelProvider panel={{ id: panels[0], ...config, x: index, y: 0 }}>
        <Panel />
      </PanelProvider>
    );
  }

  return (
    <SplitGrid
      direction="column"
      rowMinSize={32}
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
              let Panel = panelConfig[panel]?.render ?? EmptyPanel;

              return (
                <React.Fragment key={panel}>
                  <div className={bw`h-full w-full overflow-scroll`}>
                    <PanelProvider
                      panel={{
                        id: panel,
                        ...panelConfig[panel],
                        x: index,
                        y: i,
                      }}
                    >
                      <Panel />
                    </PanelProvider>
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
