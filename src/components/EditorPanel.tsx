import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as browser from "../lib/browser";
import { noop, useEditor, UseEditorOptions, useFile } from "use-monaco";
import { Panel, PanelHeader } from "../lib/styles";
import { PanelMenu, PanelMenuTrigger } from "./PanelMenu";
import { usePanel } from "./Panels";
import { VerticalDots } from "./Icons";

export function EditorPanel({
  className = "",
  renderHeader = undefined,
  onFocus = () => {},
  onBlur = () => {},
  containerProps = {},
  path = "index.ts",
  renderActions = () => {},
  language = undefined,
  defaultContents = "",
  height = "100%",
  contents = undefined,
  onChange = noop as UseEditorOptions["onChange"],
  width = "100%",
  options = {} as UseEditorOptions["options"],
  editorDidMount = (() => {}) as UseEditorOptions["editorDidMount"],
  ...props
}) {
  const [currentTab] = useAtom(browser.currentTab);
  const [sizes] = useAtom(browser.getTabHorizontalRatio(currentTab));
  const [vert] = useAtom(browser.getTabVerticalRatio(currentTab));
  const panel = usePanel();
  const [focused, setFocused] = useAtom(browser.focusedPanel);

  const model = useFile({
    path,
    defaultContents,
    contents,
    language,
  });

  const { editor, containerRef } = useEditor({
    options: {
      automaticLayout: true,
      scrollbar: { vertical: "hidden" },
      minimap: { enabled: false },
      renderIndentGuides: false,
      lineNumbers: "off",
      ...options,
    },
    model,
    onChange,
    editorDidMount: (editor) => {
      const dis1 = editor.onDidFocusEditorText(() => {
        panel?.id && setFocused(panel.id);
        onFocus?.();
      });
      const dis2 = editor.onDidBlurEditorText(() => {
        panel?.id && setFocused(null);
        onBlur?.();
      });

      const dis3 = props.editorDidMount?.(editor) ?? undefined;

      return [dis1, dis2, dis3];
    },
  });

  React.useEffect(() => {
    editor?.layout();
  }, [sizes, vert, editor]);

  return (
    <Panel className={bw`relative pb-2 pt-12 ${className}`} {...containerProps}>
      <div
        ref={containerRef}
        {...props}
        style={{ height, width, ...props.style }}
      />
      {renderHeader ? renderHeader() : <CurrentPanelHeader />}
    </Panel>
  );
}

export function CurrentPanelHeader() {
  const [focused, setFocused] = useAtom(browser.focusedPanel);
  const panel = usePanel();

  return (
    <PanelHeader
      onClick={() => {
        panel?.id && setFocused(panel?.id);
      }}
      focused={focused === panel?.id}
      className={bw`justify-between`}
    >
      <PanelMenu mode="context">
        <PanelMenuTrigger mode="context">
          <div className={bw`flex flex-row items-center gap-1.5`}>
            <div className={bw`h-4.5 w-4.5 -mt-1`}>
              {panel.icon ? <panel.icon className={bw`h-4.5 w-4.5`} /> : null}
            </div>
            <div>{panel.title}</div>
          </div>
        </PanelMenuTrigger>
      </PanelMenu>
      <PanelMenu mode="dropdown">
        <PanelMenuTrigger
          mode="dropdown"
          className={bw`focus:ring-2 focus:ring-blue-400 focus:outline-none active:outline-none transition-all hover:(bg-blueGray-500) rounded-full py-1 px-1`}
        >
          <div>
            <VerticalDots className={bw`w-3.5 h-3.5`} />
          </div>
        </PanelMenuTrigger>
      </PanelMenu>
    </PanelHeader>
  );
}
