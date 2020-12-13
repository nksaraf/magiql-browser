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
  GraphQLNamedType,
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

import * as gql from "graphql-ast-types";
import { header, panel } from "./components";

function useSchema() {
  return useAtom(ide.schema)[0];
}
function useQuery() {
  return useAtom(ide.parsedQuery)[0];
}

const getOperationNode = atomFamily(
  (id: string) => null as OperationDefinitionNode | null
);

const operationNames = atom<string[]>([]);

const getIsSelected = atomFamily((id: string) => (get) =>
  !!get(getSelection(id))
);

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
          const path = `${parentPath}.${sel.typeCondition.name.value}.${i}`;
          set(getSelection(path), sel);
          if (path) {
            set(getSelectionSet(path), sel.selectionSet as any);
          }
          return `${parentPath}.${sel.typeCondition.name.value}.${i}`;
        }
      }
    });

    set(getSelectionSetPaths(parentPath), paths);
  }
);

const write = atom(null, (get, set, parsedQuery: DocumentNode) => {
  parsedQuery.definitions.map((def, index) => {
    if (def.kind === "OperationDefinition") {
      const opName = def.name?.value ?? "Operation" + index;
      set(operationNames, (old) => [...old, opName]);
      set(getSelectionSet(opName), def.selectionSet as any);
      set(getOperationNode(def.name?.value ?? "Operation" + index), def);
    }
  });
});

const ast = {
  operationNames,
  getIsSelected,
  write,
  getSelection,
  getSelectionSet,
  getSelectionSetPaths,
  getOperationNode,
};

const graphqlNode = `cursor-pointer gap-1.5 select-none flex flex-row items-center font-mono text-xs`;

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
  const [node] = useAtom(ast.getSelection(path));
  const [isSelected] = useAtom(ast.getIsSelected(path));

  const inspectedType = field.type.inspect();
  const type = getNamedType(field.type);

  if (!type.astNode?.kind) {
    // switch (inspectedType) {
    // case "Int": {
    return (
      <div className={bw`${graphqlNode} text-graphql-field`}>
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
        <div className={bw`${graphqlNode} text-graphql-field`}>
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
        <div className={bw`flex flex-col gap-1`}>
          <div className={bw`${graphqlNode} text-graphql-field`}>
            <Arrow isOpen={isSelected} />
            {field.name}
            {isSelected && (
              <div className={bw`font-mono text-xs text-gray-300`}>{"{"}</div>
            )}
          </div>
          {isSelected && (
            <div className={bw`ml-4`}>
              <Fields
                fields={(type as GraphQLObjectType).getFields()}
                parentPath={path}
              />
            </div>
          )}
          {isSelected && (
            <div className={bw`font-mono text-xs text-gray-300`}>{"}"}</div>
          )}
        </div>
      );
    }
    case "InterfaceTypeDefinition": {
      return (
        <InterfaceTypeField
          path={path}
          isSelected={isSelected}
          schema={schema}
          field={field}
          type={type}
        />
      );
    }
    case "ScalarTypeDefinition": {
      return (
        <div className={bw`${graphqlNode} text-graphql-field`}>
          <Arrow isOpen={isSelected} />
          {field.name}
        </div>
      );
    }
  }
}

function InterfaceTypeField({ path, schema, isSelected, field, type }) {
  return (
    <div className={bw`flex flex-col gap-1`}>
      <div className={bw`${graphqlNode} text-graphql-field`}>
        <Arrow isOpen={isSelected} />
        {field.name}
        {isSelected && (
          <div className={bw`font-mono text-xs text-gray-300`}>{"{"}</div>
        )}
      </div>
      {isSelected && (
        <div className={bw`ml-4`}>
          <Fields fields={(type as any).getFields()} parentPath={path} />
          <Types
            types={schema.getPossibleTypes(field.type as GraphQLInterfaceType)}
            parentPath={path}
          />
        </div>
      )}
      {isSelected && (
        <div className={bw`font-mono text-xs text-gray-300`}>{"}"}</div>
      )}
    </div>
  );
}

function InlineFragment({ path, parentPath, type }) {
  const schema = useSchema();
  const [node] = useAtom(ast.getSelection(path));
  const [isSelected] = useAtom(ast.getIsSelected(path));

  return (
    <div className={bw`flex flex-col gap-1`}>
      <div className={bw`${graphqlNode} text-graphql-typename`}>
        <Arrow isOpen={isSelected} />
        {isSelected && (
          <div className={bw`text-gray-300`}>
            ... <span className={bw`text-graphql-keyword`}>on</span>{" "}
          </div>
        )}
        {type.name}
        {isSelected && (
          <div className={bw`font-mono text-xs text-gray-300`}>{"{"}</div>
        )}
      </div>
      {isSelected && (
        <div className={bw`ml-4`}>
          <Fields fields={type.getFields()} parentPath={path} />
        </div>
      )}
    </div>
  );
}

function Types({
  types,
  parentPath,
}: {
  types: readonly GraphQLObjectType<any, any>[];
  parentPath: string;
}) {
  const [{ selectionSet = undefined }] = useAtom(getSelectionSet(parentPath));

  const selections = [...selectionSet.selections];

  let unselectedTypes = [...types];
  const paths = [
    ...selections.map((selection) => {
      const selectedType = types.find((type) =>
        selection.startsWith(`${parentPath}.${type.name}`)
      );

      if (!selectedType) {
        return;
      }

      unselectedTypes = unselectedTypes.filter(
        (type) => type.name !== selectedType.name
      );
      console.log(unselectedTypes);

      return {
        path: selection,
        parentPath: parentPath,
        type: selectedType,
        key: selection,
      };
    }),
  ].filter(Boolean);
  return (
    <div className={bw`flex flex-col gap-1`}>
      {paths.map((path) => (
        <InlineFragment {...path} />
      ))}
      {unselectedTypes.map((type) => (
        <InlineFragment
          parentPath={`${parentPath}`}
          type={type}
          key={`${parentPath}.${type.name}`}
          path={`${parentPath}.${type.name}`}
        />
      ))}
    </div>
  );
}

function Fields({
  fields,
  parentPath,
}: {
  fields: GraphQLFieldMap<any, any>;
  parentPath: string;
}) {
  const [{ selectionSet = undefined }] = useAtom(getSelectionSet(parentPath));
  let fieldList = Object.values(fields);
  let unselectedFields = [...fieldList];
  const selectedPaths = [
    ...(selectionSet?.selections?.map((selection) => {
      const selectedField = fieldList.find((type) =>
        selection.startsWith(`${parentPath}.${type.name}`)
      );

      if (!selectedField) {
        return;
      }

      unselectedFields = unselectedFields.filter(
        (type) => type.name !== selectedField.name
      );

      return {
        path: selection,
        parentPath: parentPath,
        field: selectedField,
        key: selection,
      };
    }) ?? []),
  ].filter(Boolean);

  return (
    <div className={bw`flex flex-col gap-1`}>
      {selectedPaths.map((path) => (
        <Field {...path} />
      ))}
      {unselectedFields.map((field) => (
        <Field
          parentPath={`${parentPath}`}
          path={`${parentPath}.${field.name}`}
          field={field}
          key={`${parentPath}.${field.name}`}
        />
      ))}
    </div>
  );
}

function OperationDefinition({ operationName }: { operationName: string }) {
  const schema = useSchema();
  const [operation] = useAtom(getOperationNode(operationName));

  const getOperationFields = (operation: OperationDefinitionNode) => {
    if (operation.operation === "query") {
      return schema.getQueryType().getFields();
    } else if (operation.operation === "mutation") {
      return schema.getMutationType().getFields();
    } else if (operation.operation === "subscription") {
      return schema.getSubscriptionType().getFields();
    }
  };

  if (!operation) {
    return null;
  }

  return (
    <div className={bw`flex flex-col gap-1`}>
      <div className={bw`flex flex-row gap-1.5`}>
        <div className={bw`font-mono text-xs text-graphql-keyword`}>
          {operation.operation}
        </div>
        <div className={bw`font-mono text-xs text-graphql-typename`}>
          {operation.name?.value}
        </div>
        <div className={bw`font-mono text-xs text-gray-300`}>{"{"}</div>
      </div>
      <div className={bw`ml-2`}>
        <Fields
          fields={getOperationFields(operation)}
          parentPath={operationName}
        />
      </div>
    </div>
  );
}

function Document({ document }: { document: DocumentNode }) {
  const setter = useUpdateAtom(ast.write);

  React.useEffect(() => {
    setter(document);
  }, [document]);
  return (
    <div className={bw`flex flex-col gap-6`}>
      {document.definitions.map((def, i) => {
        if (gql.isOperationDefinition(def)) {
          return (
            <OperationDefinition
              operationName={def.name?.value ?? `Operation${i}`}
              key={i}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export function SchemaExplorer() {
  const [query] = useAtom(ide.parsedQuery);
  const [schema] = useAtom(ide.schema);
  return (
    <div className={bw`${panel} relative`}>
      <div className={bw`${header} absolute top-0 px-4 w-full z-100`}>
        Explorer
      </div>
      <div className={bw`pt-12 pb-3 overflow-scroll h-full`}>
        <div className={bw`px-4`}>
          {query && schema && <Document document={query} />}
        </div>
      </div>
    </div>
  );
}
