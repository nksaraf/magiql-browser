import React from "react";
import { bw } from "@beamwind/play";
import { Editor } from "./Editor";

export const header = `font-graphql rounded-t-xl font-400 bg-gray-100 text-gray-400 py-2`;

export const panel = `h-full bg-white shadow-xl rounded-xl`;

export function EditorPanel({
  options = {},
  children,
  className = "",
  containerProps = {},
  ...props
}) {
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
      />
    </div>
  );
}
