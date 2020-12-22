import { bw } from "@beamwind/play";
import React from "react";
import { Check } from "../components/Icons";
import { styled } from "../lib/styles";

export const graphqlNode = `cursor-pointer select-none flex flex-row items-center font-mono text-xs`;

export const FieldName = styled.div`text-graphql-field`;

export const Indented = styled.div`indent`;
export const Type = styled.div`text-graphql-typename`;
export const Keyword = styled.div`text-graphql-keyword`;
export const Name = styled.div`text-graphql-opname`;
export const Variable = styled.div`text-graphql-variable`;
export const ArgumentName = styled.div`text-graphql-argname`;
export const Punctuation = styled.div`text-blueGray-400`;
export const Qualifier = styled.div`text-graphql-alias`;
export const Lines = styled.div`flex flex-col gap-0.5`;
export const Tokens = styled.div`
  cursor-pointer select-none flex flex-row items-center font-mono text-xs gap-1.5
`;

export function Arrow({ isOpen, className, ...props }: any) {
  return (
    <div
      className={bw`p-0.75 ${
        isOpen ? "group-hover:(-rotate-45)" : "group-hover:(rotate-45)"
      } transition-all`}
    >
      <svg
        viewBox="0 0 481.721 481.721"
        fill="currentColor"
        className={`${bw`${{
          "-rotate-90": !isOpen,
        }} w-9px h-9px`} ${className}`}
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
}

export function Checkbox(props: any) {
  return (
    <div
      style={{ padding: "1px" }}
      {...props}
      className={`${bw`w-3 h-3 rounded-sm ${
        props.checked
          ? "text-blueGray-50 bg-blue-400 group-hover:(text-blueGray-50 bg-blue-200)"
          : "text-blueGray-300 bg-blueGray-300 group-hover:(text-blueGray-600)"
      }`} ${props.className ?? ""}`}
    >
      <Check />
    </div>
  );
}
