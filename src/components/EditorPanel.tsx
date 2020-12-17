import React from "react";
import { bw } from "@beamwind/play";
import { Editor } from "./editor/Editor";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import * as monacoApi from "monaco-editor";
import { panel } from "../lib/components";

export function EditorPanel({
  options = {},
  children = undefined as React.ReactNode,
  className = "",
  onFocus = () => {},
  onBlur = () => {},
  containerProps = {},
  ...props
}) {
  const [currentTab] = useAtom(ide.currentTab);
  const [sizes] = useAtom(ide.getTabHorizontalRatio(currentTab));
  const [vert] = useAtom(ide.getTabVerticalRatio(currentTab));

  const ref = React.useRef<monacoApi.editor.IStandaloneCodeEditor>();
  React.useEffect(() => {
    ref.current?.layout();
  }, [sizes, vert]);

  const [focused, setIsFocused] = React.useState(false);

  return (
    <div
      className={bw`${panel} relative pb-2 pt-12 ${className}`}
      {...containerProps}
    >
      {children}
      <Editor
        options={{
          scrollbar: { vertical: "hidden" },
          minimap: { enabled: false },
          renderIndentGuides: false,
          lineNumbers: "off",
          ...options,
        }}
        {...props}
        editorDidMount={(editor) => {
          ref.current = editor;
          const dis = editor.onDidFocusEditorText(() => {
            setIsFocused(true);
            onFocus?.();
          });
          const other = editor.onDidBlurEditorText(() => {
            setIsFocused(false);
            onBlur?.();
          });

          const userMount = props.editorDidMount?.(editor) ?? undefined;

          return [dis, other, userMount];
        }}
      />
    </div>
  );
}
