export const header = `font-graphql cursor-pointer rounded-t-lg text-sm font-400 bg-blueGray-100 transition-all hover:(text-white bg-blueGray-600) z-1000 text-blueGray-500 py-2`;

export const panel = `h-full bg-white shadow-xl rounded-lg`;

export const editorPanelHeader = (focused) => `
${header} ${
  focused ? "text-blueGray-200 bg-blueGray-600" : ""
} px-3 flex flex-row items-center absolute top-0 w-full`;

import * as React from "react";

import { bw } from "@beamwind/play";

const styledProxy = {};

type BW = typeof bw;
type ArgsBw = Parameters<BW>;

interface StyledComponentTag {
  (...args: ArgsBw): React.FC<{
    className?: string;
    [key: string]: any;
  }>;
}

type Styled = {
  [K in keyof React.ReactHTML]: StyledComponentTag;
};

export const styled: Styled = new Proxy(styledProxy, {
  get(target, prop, receiver) {
    console.log(target, prop, receiver);
    if (typeof prop !== "string" || prop.length == 0) {
      throw new Error(`Invalid element ${prop.toString()}`);
    }
    return (...args: ArgsBw) => {
      return function Component({ className, ...props }) {
        const ComponentName: any = prop;
        return (
          <ComponentName className={`${bw(...args)} ${className}`} {...props} />
        );
      };
    };
  },
}) as any;

const Root = styled.div`bg-red-200`;

console.log(Root);
