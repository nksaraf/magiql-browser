import React from "react";
import { bw, setup } from "@beamwind/play";
import { Editor } from "../editor/Editor";
import { useAtom } from "./atom";
import { ide } from "./ide";
import * as monacoApi from "monaco-editor";
import { asDisposable } from "use-monaco";
setup({ hash: false });

export const header = `font-graphql rounded-t-lg text-sm font-400 bg-gray-100 text-gray-400 py-2`;

export const panel = `h-full bg-white shadow-xl rounded-lg`;

export function EditorPanel({
  options = {},
  children = undefined as React.ReactNode,
  className = "",
  onFocus = () => {},
  onBlur = () => {},
  containerProps = {},
  ...props
}) {
  const [sizes] = useAtom(ide.horizontalRatio);
  const [vert] = useAtom(ide.verticalRatio);

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
