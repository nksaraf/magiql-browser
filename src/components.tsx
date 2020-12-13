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

const defaultArrowOpen = ({ className, ...props }) => (
  <div className={bw`p-0.75`}>
    <svg
      className={`${bw`w-9px h-9px`} ${className}`}
      viewBox="0 0 481.721 481.721"
      fill="currentColor"
      // style={{
      //   // enableBackground: "new 0 0 481.721 481.721",
      // }}
      // xmlSpace="preserve"
      {...props}
    >
      <g>
        <g>
          <path d="M10.467,146.589l198.857,252.903c17.418,30.532,45.661,30.532,63.079,0l198.839-252.866 c3.88-5.533,8.072-15.41,8.923-22.118c2.735-21.738,4.908-65.178-21.444-65.178H23.013c-26.353,0-24.192,43.416-21.463,65.147 C2.395,131.185,6.587,141.051,10.467,146.589z" />
        </g>
      </g>
    </svg>
  </div>
);

const defaultArrowClosed = ({ className, ...props }) => (
  <div className={bw`p-0.75`}>
    <svg
      viewBox="0 0 481.721 481.721"
      fill="currentColor"
      className={`${bw`-rotate-90 w-9px h-9px`} ${className}`}
      // style={{
      //   // enableBackground: "new 0 0 481.721 481.721",
      // }}
      // xmlSpace="preserve"
      {...props}
    >
      <g>
        <g>
          <path d="M10.467,146.589l198.857,252.903c17.418,30.532,45.661,30.532,63.079,0l198.839-252.866 c3.88-5.533,8.072-15.41,8.923-22.118c2.735-21.738,4.908-65.178-21.444-65.178H23.013c-26.353,0-24.192,43.416-21.463,65.147 C2.395,131.185,6.587,141.051,10.467,146.589z" />
        </g>
      </g>
    </svg>
  </div>
);

const defaultCheckboxChecked = (props) => (
  <svg
    className={bw`w-3 h-3`}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 16H2V2H16V16ZM14.99 6L13.58 4.58L6.99 11.17L4.41 8.6L2.99 10.01L6.99 14L14.99 6Z"
      fill="#666"
    />
  </svg>
);

const defaultCheckboxUnchecked = (props) => (
  <svg
    className={bw`w-3 h-3`}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
      fill="#CCC"
    />
  </svg>
);

export function Arrow(props) {
  return props.isOpen ? defaultArrowOpen(props) : defaultArrowClosed(props);
}

export function Checkbox(props: { checked: boolean }) {
  return props.checked
    ? defaultCheckboxChecked(props)
    : defaultCheckboxUnchecked(props);
}
