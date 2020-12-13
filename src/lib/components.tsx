import React from "react";
import { bw, setup } from "@beamwind/play";
import { Editor } from "../editor/Editor";
import { useAtom } from "./atom";
import { ide } from "./ide";
import * as monacoApi from "monaco-editor";
setup({ hash: false });

export const header = `font-graphql rounded-t-lg text-sm font-400 bg-gray-100 text-gray-400 py-2`;

export const panel = `h-full bg-white shadow-xl rounded-lg`;

function useResizingEditor() {
  const ref = React.useRef<monacoApi.editor.IStandaloneCodeEditor>();
  const [sizes] = useAtom(ide.horizontalRatio);
  const [vert] = useAtom(ide.verticalRatio);
  React.useEffect(() => {
    ref.current?.layout();
  }, [sizes, vert]);

  return ref;
}

export function EditorPanel({
  options = {},
  children,
  className = "",
  containerProps = {},
  ...props
}) {
  const ref = useResizingEditor();

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
        editorDidMount={(editor) => {
          ref.current = editor;
        }}
        {...props}
      />
    </div>
  );
}
