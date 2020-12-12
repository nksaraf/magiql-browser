import { bw, setup } from "@beamwind/play";
import { atom, atomFamily, useAtom, useUpdateAtom } from "./atom";
import { ide } from "./ide";
import React from "react";
import {
  DocumentNode,
  GraphQLField,
  GraphQLSchema,
  OperationDefinitionNode,
} from "graphql";

setup({
  theme: {
    extend: {
      colors: {
        "graphql-field": "#1F61A0",
        "graphql-keyword": "#B11A04",
        "graphql-opname": "#D2054E",
      },
    },
  },
});
const defaultColors = {
  keyword: "#B11A04",
  // OperationName, FragmentName
  def: "#D2054E",
  // FieldName
  property: "#1F61A0",
  // FieldAlias
  qualifier: "#1C92A9",
  // ArgumentName and ObjectFieldName
  attribute: "#8B2BB9",
  number: "#2882F9",
  string: "#D64292",
  // Boolean
  builtin: "#D47509",
  // Enum
  string2: "#0B7FC7",
  variable: "#397D13",
  // Type
  atom: "#CA9800",
};

const defaultArrowOpen = (
  <svg width="12px" height="9px">
    <path fill="#666" d="M 0 2 L 9 2 L 4.5 7.5 z" />
  </svg>
);

const defaultArrowClosed = (
  <svg width="12px" height="9px">
    <path fill="#666" d="M 0 0 L 0 9 L 5.5 4.5 z" />
  </svg>
);

const defaultCheckboxChecked = (
  <svg
    style={{ marginRight: "3px", marginLeft: "-3px" }}
    width="12px"
    height="12px"
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

const defaultCheckboxUnchecked = (
  <svg
    style={{ marginRight: "3px", marginLeft: "-3px" }}
    width="12px"
    height="12px"
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

function Arrow(props) {
  return props.isOpen ? defaultArrowOpen : defaultArrowClosed;
}

function Checkbox(props: { checked: boolean }) {
  return props.checked ? defaultCheckboxChecked : defaultCheckboxUnchecked;
}

const getFieldIsSelected = atomFamily((id: string) => false);

function RootField({ field }: { field: GraphQLField<any, any> }) {
  const [isSelected, setIsSelected] = useAtom(getFieldIsSelected(field.name));
  return (
    <div
      onClick={() => {
        setIsSelected((old) => !old);
      }}
      className={bw`cursor-pointer select-none flex flex-row items-center font-mono text-graphql-field text-xs`}
    >
      <Arrow isOpen={isSelected} />
      {field.name}
    </div>
  );
}

import * as gql from "graphql-ast-types";

function useSchema() {
  return useAtom(ide.schema)[0];
}
function useQuery() {
  return useAtom(ide.parsedQuery)[0];
}

const getOperationMetadata = atomFamily(
  (id: string) => ({} as OperationDefinitionNode)
);
const operationNames = atom<string[]>([]);

const setQuery = atom(null, (get, set, parsedQuery: DocumentNode) => {
  parsedQuery.definitions.map((def, index) => {
    if (def.kind === "OperationDefinition") {
      set(operationNames, (old) => [
        ...old,
        def.name?.value ?? "Operation" + index,
      ]);
      set(getOperationMetadata(def.name?.value ?? "Operation" + index), def);
    }
  });
});

function OperationDefinition({ operationName }: { operationName: string }) {
  const [schema] = useAtom(ide.schema);
  const [operation] = useAtom(getOperationMetadata(operationName));

  switch (operation.operation) {
    case "query": {
      const fields = schema.getQueryType().getFields();
      return (
        <div className={bw`flex flex-col gap-0.5`}>
          <div className={bw`flex flex-row gap-1`}>
            <div className={bw`font-mono text-xs text-graphql-keyword`}>
              {operation.operation}
            </div>
            <div className={bw`font-mono text-xs text-graphql-opname`}>
              {operation.name?.value}
            </div>
          </div>
          <div className={bw`flex flex-col gap-0.5 pl-1`}>
            {Object.keys(fields).map((field) => (
              <RootField field={fields[field]} key={field} />
            ))}
          </div>
        </div>
      );
    }
  }

  return null;
}

export function SchemaExplorer({
  query,
}: {
  schema: GraphQLSchema;
  query: DocumentNode;
}) {
  const setter = useUpdateAtom(setQuery);
  React.useEffect(() => {
    setter(query);
  }, [query]);
  return (
    <>
      {query.definitions.map((def, i) => {
        if (gql.isOperationDefinition(def)) {
          return (
            <OperationDefinition
              operationName={(def as OperationDefinitionNode).name?.value}
              key={i}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
}
