import React from "react";
import { bw } from "beamwind";
import { useEditor, UseEditorOptions, useFile } from "use-monaco";

export function Editor({
  path = "index.ts",
  language = undefined,
  defaultContents = "",
  height = "100%",
  contents = undefined,
  onChange = null,
  width = "100%",
  options = {} as UseEditorOptions["options"],
  editorDidMount = (() => {}) as UseEditorOptions["editorDidMount"],
  ...props
}) {
  const model = useFile({
    path,
    defaultContents,
    contents,
    language,
  });
  const editor = useEditor({
    options: {
      automaticLayout: true,
      ...options,
    },
    model,
    onChange,
    editorDidMount,
  });

  return (
    <div
      ref={editor.containerRef}
      {...props}
      style={{ height, width, ...props.style }}
    />
  );
}
