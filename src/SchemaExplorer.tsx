import { bw, setup } from "@beamwind/play";
import { atom, atomFamily, useAtom, useUpdateAtom } from "./atom";
import { ide } from "./ide";
import React from "react";
import {
  DocumentNode,
  FieldDefinitionNode,
  FieldNode,
  GraphQLField,
  GraphQLSchema,
  OperationDefinitionNode,
  getNamedType,
  GraphQLOutputType,
  SelectionSetNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  GraphQLObjectType,
  GraphQLFieldMap,
  GraphQLAbstractType,
  GraphQLInterfaceType,
} from "graphql";

setup({
  theme: {
    extend: {
      colors: {
        "graphql-field": "#1F61A0",
        "graphql-keyword": "#B11A04",
        "graphql-opname": "#D2054E",
        "graphql-typename": "#CA9800",
      },
      fontFamily: {
        graphql: "Rubik",
      },
      spacing: {
        "0.25": "1px",
        "0.75": "1.5px",
        "9px": "9px",
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

const defaultArrowOpen = (props) => (
  <div className={bw`p-0.75`}>
    <svg
      className={bw`w-9px h-9px`}
      viewBox="0 0 481.721 481.721"
      fill="currentColor"
      // style={{
      //   // enableBackground: "new 0 0 481.721 481.721",
      // }}
      // xmlSpace="preserve"
      // {...props}
    >
      <g>
        <g>
          <path d="M10.467,146.589l198.857,252.903c17.418,30.532,45.661,30.532,63.079,0l198.839-252.866 c3.88-5.533,8.072-15.41,8.923-22.118c2.735-21.738,4.908-65.178-21.444-65.178H23.013c-26.353,0-24.192,43.416-21.463,65.147 C2.395,131.185,6.587,141.051,10.467,146.589z" />
        </g>
      </g>
    </svg>
  </div>
);

const defaultArrowClosed = (props) => (
  <div className={bw`p-0.75`}>
    <svg
      viewBox="0 0 481.721 481.721"
      fill="currentColor"
      className={bw`-rotate-90 w-9px h-9px`}
      // style={{
      //   // enableBackground: "new 0 0 481.721 481.721",
      // }}
      // xmlSpace="preserve"
      // {...props}
    >
      <g>
        <g>
          <path d="M10.467,146.589l198.857,252.903c17.418,30.532,45.661,30.532,63.079,0l198.839-252.866 c3.88-5.533,8.072-15.41,8.923-22.118c2.735-21.738,4.908-65.178-21.444-65.178H23.013c-26.353,0-24.192,43.416-21.463,65.147 C2.395,131.185,6.587,141.051,10.467,146.589z" />
        </g>
      </g>
    </svg>
  </div>
);

const defaultCheckboxChecked = (
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

const defaultCheckboxUnchecked = (
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

function Arrow(props) {
  return props.isOpen ? defaultArrowOpen(props) : defaultArrowClosed(props);
}

function Checkbox(props: { checked: boolean }) {
  return props.checked ? defaultCheckboxChecked : defaultCheckboxUnchecked;
}

const getFieldIsSelected = atomFamily((id: string) => false);

import * as gql from "graphql-ast-types";
import { header, panel } from "./components";

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

const getSelectionSetPaths = atomFamily((id: string) => []);
const getSelection = atomFamily<
  null | FieldNode | FragmentSpreadNode | InlineFragmentNode
>((id: string) => null);

const getSelectionSet = atomFamily(
  (id: string) => (get) => ({
    selectionSet: { selections: get(getSelectionSetPaths(id)) },
  }),
  (parentPath: string) => (get, set, selectionSet: SelectionSetNode) => {
    const paths = selectionSet.selections.map((sel, i) => {
      switch (sel.kind) {
        case "Field": {
          const path = `${parentPath}.${sel.name.value}.${i}`;
          set(getSelection(path), sel);
          if (sel.selectionSet?.selections) {
            set(getSelectionSet(path), sel.selectionSet as any);
          }
          return path;
        }
        case "FragmentSpread": {
          const path = `${parentPath}.${sel.name.value}.${i}`;
          set(getSelection(path), sel);
          return path;
        }
        case "InlineFragment": {
          set(
            getSelection(`${parentPath}.${sel.typeCondition.name.value}.${i}`),
            sel
          );
          return `${parentPath}.${sel.typeCondition.name.value}.${i}`;
        }
      }
    });

    set(getSelectionSetPaths(parentPath), paths);
  }
);

const setQuery = atom(null, (get, set, parsedQuery: DocumentNode) => {
  parsedQuery.definitions.map((def, index) => {
    if (def.kind === "OperationDefinition") {
      const opName = def.name?.value ?? "Operation" + index;
      set(operationNames, (old) => [...old, opName]);
      set(getSelectionSet(opName), def.selectionSet as any);
      set(getOperationMetadata(def.name?.value ?? "Operation" + index), def);
    }
  });
});

const getBasicType = (type: string) => {};

const graphqlNode = `cursor-pointer gap-1.5 select-none flex flex-row items-center py-0.25 font-mono text-xs`;

function Field({
  path,
  parentPath,
  field,
}: {
  path: string;
  parentPath: string;
  field: GraphQLField<any, any>;
}) {
  const schema = useSchema();
  const [{ selectionSet = undefined }] = useAtom(getSelectionSet(parentPath));
  const [node, setIsSelected] = useAtom(
    getSelection(
      selectionSet?.selections?.find((sel) => (sel as any).includes(path)) ??
        path
    )
  );

  const inspectedType = field.type.inspect();
  const type = getNamedType(field.type);

  if (!type.astNode?.kind) {
    // switch (inspectedType) {
    // case "Int": {
    return (
      <div className={bw`${graphqlNode} text-graphql-field `}>
        <Checkbox checked={!!node} />
        {field.name}
      </div>
    );
    // }
    // }/
    // return null;
  }
  switch (type.astNode.kind) {
    case "EnumTypeDefinition": {
      return (
        <div className={bw`${graphqlNode} text-graphql-field text-xs`}>
          {field.name}
          {<div></div>}
        </div>
      );
    }
    case "UnionTypeDefinition": {
      return null;
    }

    case "ObjectTypeDefinition": {
      return (
        <div className={bw`flex flex-col`}>
          <div className={bw`${graphqlNode} text-graphql-field text-xs`}>
            <Arrow isOpen={!!node} />
            {field.name}
          </div>
          <div className={bw`ml-3`}>
            {!!node && (
              <Fields
                fields={(type as GraphQLObjectType).getFields()}
                parentPath={path}
              />
            )}
          </div>
        </div>
      );
    }
    case "InterfaceTypeDefinition": {
      // console.log(schema.getPossibleTypes(field.type));

      return (
        <div className={bw`flex flex-col`}>
          <div className={bw`${graphqlNode} text-graphql-field text-xs`}>
            <Arrow isOpen={!!node} />
            {field.name}
          </div>
          <div className={bw`ml-3`}>
            {!!node &&
              schema
                .getPossibleTypes(field.type as GraphQLInterfaceType)
                .map((type) => {
                  return (
                    <div
                      className={bw`${graphqlNode} text-graphql-typename text-xs`}
                    >
                      <Arrow isOpen={!!node} />
                      {type.name}
                    </div>
                  );
                })}
          </div>
        </div>
      );
    }
    case "ScalarTypeDefinition": {
      return (
        <div className={bw`${graphqlNode} text-graphql-field`}>
          <Arrow isOpen={!!node} />
          {field.name}
        </div>
      );
    }
  }
}

function Fields({
  fields,
  parentPath,
}: {
  fields: GraphQLFieldMap<any, any>;
  parentPath: string;
}) {
  const [{ selectionSet = undefined }] = useAtom(getSelectionSet(parentPath));

  const selections = [...selectionSet.selections];
  return (
    <div className={bw`flex flex-col gap-0.5 pl-1`}>
      {Object.keys(fields).map((field) => (
        <Field
          parentPath={`${parentPath}`}
          path={
            selections.find((sel) =>
              sel.startsWith(`${parentPath}.${field}`)
            ) ?? `${parentPath}.${field}`
          }
          field={fields[field]}
          key={field}
        />
      ))}
    </div>
  );
}

function OperationDefinition({ operationName }: { operationName: string }) {
  const [schema] = useAtom(ide.schema);
  const [operation] = useAtom(getOperationMetadata(operationName));

  switch (operation.operation) {
    case "query": {
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
          <Fields
            fields={schema.getQueryType().getFields()}
            parentPath={operationName}
          />
        </div>
      );
    }
  }

  return null;
}

function Document({ document }) {
  const setter = useUpdateAtom(setQuery);

  React.useEffect(() => {
    setter(document);
  }, [document]);
  return (
    <>
      {document.definitions.map((def, i) => {
        if (gql.isOperationDefinition(def)) {
          return (
            <OperationDefinition
              operationName={
                (def as OperationDefinitionNode).name?.value ?? `Operation${i}`
              }
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

export function SchemaExplorer() {
  const [query] = useAtom(ide.parsedQuery);
  const [schema] = useAtom(ide.schema);
  return (
    <div className={bw`${panel}`}>
      <div className={bw`${header} px-4`}>Explorer</div>
      <div className={bw`px-4 py-3`}>
        {query && schema && <Document document={query} />}
      </div>
    </div>
  );
}
