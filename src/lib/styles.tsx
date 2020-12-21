import * as React from "react";

import { bw } from "@beamwind/play";
import * as ContextMenu from "@radix-ui/react-context-menu";

const styledProxy = () => {};

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
} &
  ((Component: any) => StyledComponentTag);

export const styled: Styled = new Proxy(styledProxy, {
  get(target, prop, receiver) {
    if (typeof prop !== "string" || prop.length == 0) {
      throw new Error(`Invalid element ${prop.toString()}`);
    }
    return (s: ArgsBw[0], ...args: any[]) => {
      const Component = function Component({ className, ...props }) {
        const ComponentName: any = prop;
        return (
          <ComponentName
            className={`${bw(
              s,
              ...args.map((arg) =>
                typeof arg === "function" ? arg(props) : arg
              )
            )} ${className}`}
            {...props}
          />
        );
      };

      Component.bw = [s, ...args];
      return Component;
    };
  },
  apply(target, thisArg, argArray) {
    return (s: ArgsBw[0], ...args: any[]) => {
      const Component = function Component({ className, ...props }) {
        const ComponentName: any = argArray[0];
        return (
          <ComponentName
            className={`${bw(s, ...args)} ${className}`}
            {...props}
          />
        );
      };

      Component.bw = [s, ...args];
      return Component;
    };
  },
}) as any;

export const Panel = styled.div`h-full bg-white shadow-xl rounded-md`;

export const StyledHeader = styled.div`
font-graphql select-none group cursor-pointer rounded-t-lg text-sm font-400 bg-blueGray-100 transition-all hover:(text-white bg-blueGray-600) z-1000 text-blueGray-500 py-2 pl-3 pr-1.5 flex flex-row items-center absolute top-0 w-full
`;

export function PanelHeader({ focused, ...props }) {
  return (
    <StyledHeader
      as="div"
      {...props}
      className={`${bw`${
        focused ? "text-blueGray-200 bg-blueGray-600" : ""
      }`} ${props.className}`}
    />
  );
}
export const menu = `relative px-0.5 py-0.5 bg-blueGray-50 border-2 border-blueGray-300 rounded-md shadow-xl`;

export const menuItem = `w-32 px-2 py-1 font-graphql rounded-sm text-sm text-blueGray-900 hover:(bg-blue-400 border-blue-400 text-white)`;
