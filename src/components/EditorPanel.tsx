import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { panel } from "../lib/components";
import { noop, useEditor, UseEditorOptions, useFile } from "use-monaco";

export function EditorPanel({
  children = undefined as React.ReactNode,
  className = "",
  onFocus = () => {},
  onBlur = () => {},
  containerProps = {},
  path = "index.ts",
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
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes] = useAtom(ide.getTabHorizontalRatio(currentTab));
  const [vert] = useAtom(ide.getTabVerticalRatio(currentTab));

  const [focused, setIsFocused] = React.useState(false);

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
        setIsFocused(true);
        onFocus?.();
      });
      const dis2 = editor.onDidBlurEditorText(() => {
        setIsFocused(false);
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
    <div
      className={bw`${panel} relative pb-2 pt-12 ${className}`}
      {...containerProps}
    >
      <div
        ref={containerRef}
        {...props}
        style={{ height, width, ...props.style }}
      />
      {children}
    </div>
  );
}
