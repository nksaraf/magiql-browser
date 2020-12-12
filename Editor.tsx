import React from "react";
import { bw } from "beamwind";
import { useEditor, useFile } from "use-monaco";

export function Editor({
  path = "index.ts",
  language = undefined,
  defaultContents = "",
  width = "500px",
  height = "500px"
}) {
  const model = useFile({
    path,
    defaultContents,
    language
  });
  const editor = useEditor({
    model
  });

  return <div ref={editor.containerRef} style={{ width, height }} />;
}
