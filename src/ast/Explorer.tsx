import { bw } from "@beamwind/play";
import { useAtom, useUpdateAtom } from "../atom";
import { ide } from "../ide";
import React from "react";
import {
  DocumentNode,
  FieldDefinitionNode,
  GraphQLField,
  GraphQLSchema,
  OperationDefinitionNode,
  getNamedType,
  GraphQLOutputType,
  FragmentSpreadNode,
  GraphQLObjectType,
  GraphQLFieldMap,
  GraphQLAbstractType,
  validate,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  assertAbstractType,
  ValueNode,
  VariableNode,
  VariableDefinitionNode,
  printType,
  typeFromAST,
  print,
} from "graphql";
import * as gql from "graphql-ast-types";
import { Arrow, Checkbox, header, panel } from "../components";
import { ErrorBoundary } from "react-error-boundary";
import { ast, useSchema, getOperationNode, getFragmentNode } from "./state";
import "./theme";
import { SelectableNode, NodeWithSelections } from "./components";
import { removeSelections, getFields, getTypes } from "./utils";
import { InlineFragmentNode } from "graphql";
import {
  Lines,
  Tokens,
  FieldName,
  Punctuation,
  Indented,
  Variable,
  Keyword,
  ArgumentName,
  Type,
  Name,
} from "./tokens";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import {
  Listbox,
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from "@reach/listbox";

export const graphqlNode = `cursor-pointer gap-1.5 select-none flex flex-row items-center font-mono text-xs`;

function ObjectTypeField({ field, path }) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const type = getNamedType(field.type) as GraphQLObjectType;
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && isSelected && <Punctuation>(</Punctuation>}
        {!hasArgs && isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens>
          <Punctuation>{") {"}</Punctuation>
        </Tokens>
      )}
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={path} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function InterfaceTypeField({ path, field }) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const type = getNamedType(field.type) as GraphQLInterfaceType;
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && isSelected && <Punctuation>(</Punctuation>}
        {!hasArgs && isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens>
          <Punctuation>{") {"}</Punctuation>
        </Tokens>
      )}
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={path} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function UnionTypeField({ path, field }) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const type = getNamedType(field.type) as GraphQLUnionType;
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && isSelected && <Punctuation>(</Punctuation>}
        {!hasArgs && isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens>
          <Punctuation>{") {"}</Punctuation>
        </Tokens>
      )}
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={path} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function ScalarField({
  field,
  path,
}: {
  field: GraphQLField<any, any>;
  path: string;
}) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Checkbox checked={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && <Punctuation>(</Punctuation>}
      </Tokens>
      {hasArgs && (
        <>
          <Indented>
            <Arguments args={node.arguments} />
          </Indented>
          <Tokens>
            <Punctuation>)</Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

function Value({ value }: { value: ValueNode }) {
  // let labelId = `taco-label--${useId()}`;

  if (gql.isVariable(value)) {
    return (
      <Tokens>
        <Variable>{value.name.value}</Variable>
      </Tokens>
    );
  } else if (gql.isIntValue(value)) {
    return (
      <Tokens>
        <span className={bw`text-graphql-number`}>{value.value}</span>
      </Tokens>
    );
  } else if (gql.isFloatValue(value)) {
    return (
      <Tokens>
        <span className={bw`text-graphql-number`}>{value.value}</span>
      </Tokens>
    );
  } else if (gql.isStringValue(value)) {
    return (
      <Tokens>
        <span className={bw`text-graphql-string`}>"{value.value}"</span>
      </Tokens>
    );
  } else if (gql.isBooleanValue(value)) {
    return (
      <Tokens>
        <div>
          {/* <VisuallyHidden id={labelId}>Choose a taco</VisuallyHidden> */}
          <ListboxInput
            className={bw`text-graphql-boolean`}
            // aria-labelledby={labelId}
            value={"default"}
            // onChange={(value) => setValue(value)}
          >
            <ListboxButton className={bw`text-graphql-boolean`} arrow={<span></span>} />
            <ListboxPopover>
              <ListboxList>
                <ListboxOption value="default">Choose a taco</ListboxOption>
                <ListboxOption value="asada">Carne Asada</ListboxOption>
                <ListboxOption value="pollo">Pollo</ListboxOption>
                <ListboxOption value="pastor">Pastor</ListboxOption>
                <ListboxOption value="lengua">Lengua</ListboxOption>
              </ListboxList>
              <div
                style={{
                  padding: "10px 10px 0",
                  marginTop: 10,
                  borderTop: "1px solid gray",
                }}
              >
                <p>I really like tacos. I hope you enjoy them as well!</p>
              </div>
            </ListboxPopover>
          </ListboxInput>
        </div>
      </Tokens>
    );
  } else if (gql.isNullValue(value)) {
    return (
      <Tokens>
        <Keyword>{"null"}</Keyword>
      </Tokens>
    );
  } else return null;
}

function Arguments({ args }) {
  return (
    <Lines>
      {args?.map((arg) => (
        <Tokens>
          <ArgumentName>{arg.name.value}:</ArgumentName>
          <Value value={arg.value} />
        </Tokens>
      ))}
    </Lines>
  );
}

function VariableDefinitions({ vars }) {
  const schema = useSchema();
  return (
    <Lines>
      {vars?.map((variable) => {
        // const type = typeFromAST(
        //   schema,
        //   (variable as VariableDefinitionNode).type as any
        // );
        return (
          <Tokens>
            <Variable>
              {(variable as VariableDefinitionNode).variable.name.value}:
            </Variable>
            <Type>{print((variable as VariableDefinitionNode).type)}</Type>
          </Tokens>
        );
      })}
    </Lines>
  );
}

function BuiltInField({
  field,
  path,
}: {
  field: GraphQLField<any, any>;
  path: string;
}) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));

  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Checkbox checked={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && <Punctuation>(</Punctuation>}
      </Tokens>
      {hasArgs && (
        <>
          <Indented>
            <Arguments args={node.arguments} />
          </Indented>
          <Tokens>
            <Punctuation>)</Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

function EnumField({
  field,
  path,
}: {
  field: GraphQLField<any, any>;
  path: string;
}) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  return (
    <Lines>
      <Tokens>
        <Checkbox checked={isSelected} />
        <FieldName>{field.name}</FieldName>
        {hasArgs && <Punctuation>(</Punctuation>}
      </Tokens>
      {hasArgs && (
        <>
          <Indented>
            <Arguments args={node.arguments} />
          </Indented>
          <Tokens>
            <Punctuation>)</Punctuation>
          </Tokens>
        </>
      )}
    </Lines>
  );
}

function Field({
  path,
  parentPath,
  field,
}: {
  path: string;
  parentPath: string;
  field: GraphQLField<any, any>;
}) {
  const type = getNamedType(field.type);
  // Inbuilt type
  if (!type.astNode?.kind) {
    return <BuiltInField field={field} path={path} />;
  } else if (gql.isScalarTypeDefinition(type.astNode)) {
    return <ScalarField field={field} path={path} />;
  } else if (gql.isEnumTypeDefinition(type.astNode)) {
    return <EnumField field={field} path={path} />;
  } else if (gql.isObjectTypeDefinition(type.astNode)) {
    return <ObjectTypeField field={field} path={path} />;
  } else if (gql.isInterfaceTypeDefinition(type.astNode)) {
    return <InterfaceTypeField path={path} field={field} />;
  } else if (gql.isUnionTypeDefinition(type.astNode)) {
    return <UnionTypeField path={path} field={field} />;
  }
}

function InlineFragment({ path, parentPath, type }) {
  const schema = useSchema();
  const [node] = useAtom<InlineFragmentNode>(ast.getSelection(path) as any);
  const [isSelected] = useAtom(ast.getIsSelected(path));

  return (
    <Lines>
      <Tokens className={bw`text-graphql-typename`}>
        <Arrow isOpen={isSelected} />
        {isSelected && (
          <>
            <Punctuation>...</Punctuation>
            <Keyword>on</Keyword>
          </>
        )}
        <Type>{type.name}</Type>
        {isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={path} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function FragmentSpread({ path }) {
  const [node] = useAtom(ast.getSelection(path));
  const [isSelected] = useAtom(ast.getIsSelected(path));

  return (
    <Tokens>
      <div>
        <Checkbox checked={isSelected} />
      </div>
      {isSelected && <Punctuation>...</Punctuation>}
      <Name>{(node as FragmentSpreadNode).name.value}</Name>
    </Tokens>
  );
}

function Selection({ parentPath, path, type }) {
  const [node] = useAtom(ast.getSelection(path));
  const schema = useSchema();

  if (gql.isField(node)) {
    if (type.getFields()[node.name.value]) {
      return (
        <Field
          field={type.getFields()[node.name.value]}
          path={path}
          parentPath={parentPath}
        />
      );
    }
    return null;
  } else if (gql.isInlineFragment(node)) {
    if (schema.getType(node.typeCondition.name.value)) {
      return (
        <InlineFragment
          type={schema.getType(node.typeCondition.name.value)}
          path={path}
          parentPath={parentPath}
        />
      );
    }
    return null;
  } else if (gql.isFragmentSpread(node)) {
    return <FragmentSpread path={path} />;
  }
  return <>{path}</>;
}

function SelectionSet({
  parentPath,
  type,
}: {
  type: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType;
  parentPath: string;
}) {
  const [selectionSet] = useAtom(ast.getSelectionSet(parentPath));
  const schema = useSchema();

  let unselectedFields = removeSelections(
    getFields({ type, schema }),
    selectionSet?.selections ?? [],
    (item) => `${parentPath}.${item.name}`
  );
  let unselectedTypes = removeSelections(
    [...getTypes({ type, schema })],
    selectionSet?.selections ?? [],
    (item) => `${parentPath}.${item.name}`
  );

  return (
    <Lines>
      {selectionSet?.selections.map((sel) => (
        <Selection path={sel} parentPath={sel} type={type} />
      ))}
      {unselectedFields.map((field) => (
        <Field
          field={field}
          path={`${parentPath}.${field.name}`}
          parentPath={parentPath}
        />
      ))}
      {unselectedTypes.map((type) => (
        <InlineFragment
          type={type}
          path={`${parentPath}.${type.name}`}
          parentPath={parentPath}
        />
      ))}
    </Lines>
  );
}

function OperationDefinition({ operationName }: { operationName: string }) {
  const schema = useSchema();
  const [operation] = useAtom(getOperationNode(operationName));

  const getOperationType = (operation: OperationDefinitionNode) => {
    if (operation.operation === "query") {
      return schema.getQueryType();
    } else if (operation.operation === "mutation") {
      return schema.getMutationType();
    } else if (operation.operation === "subscription") {
      return schema.getSubscriptionType();
    }
  };

  if (!operation) {
    return null;
  }

  let isSelected = true;

  const hasVars = !!operation.variableDefinitions?.length;

  const type = getOperationType(operation);

  if (!type) {
    return null;
  }

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-opname`} isOpen={isSelected} />
        <Keyword>{operation.operation}</Keyword>
        <Name>{operation.name?.value}</Name>
        {hasVars && isSelected && <Punctuation>{"("}</Punctuation>}
        {!hasVars && isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {hasVars && isSelected && (
        <Indented>
          <VariableDefinitions vars={operation.variableDefinitions} />
        </Indented>
      )}
      {hasVars && isSelected && (
        <Tokens>
          <Punctuation>
            <span className={bw`pl-1`}>{") {"}</span>
          </Punctuation>
        </Tokens>
      )}
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={operationName} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function FragmentDefinition({ fragmentName }: { fragmentName: string }) {
  const schema = useSchema();
  const [fragment] = useAtom(getFragmentNode(fragmentName));

  if (!fragment) {
    return null;
  }

  const type = schema.getType(
    fragment.typeCondition.name.value
  ) as GraphQLObjectType;

  let isSelected = true;

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        <Keyword>fragment</Keyword>
        <Name>{fragmentName}</Name>
        <Keyword>on</Keyword>
        <Type>{fragment.typeCondition.name.value}</Type>
        {isSelected && <Punctuation>{"{"}</Punctuation>}
      </Tokens>
      {isSelected && (
        <Indented>
          <SelectionSet parentPath={fragment.name.value} type={type} />
        </Indented>
      )}
      {isSelected && (
        <Tokens>
          <Punctuation>{"}"}</Punctuation>
        </Tokens>
      )}
    </Lines>
  );
}

function Document({ document }: { document: DocumentNode }) {
  const setter = useUpdateAtom(ast.write);
  const schema = useSchema();
  React.useEffect(() => {
    setter(document);
  }, [document, schema]);
  return (
    <div className={bw`flex flex-col gap-6`}>
      {document.definitions.map((def, i) => {
        if (gql.isOperationDefinition(def)) {
          return (
            <OperationDefinition
              operationName={def.name?.value ?? `Operation${i}`}
              key={def.name?.value ?? `Operation${i}`}
            />
          );
        } else if (gql.isFragmentDefinition(def)) {
          return (
            <FragmentDefinition
              fragmentName={def.name.value}
              key={def.name.value}
            />
          );
        }
      })}
    </div>
  );
}

export function Explorer() {
  const [query] = useAtom(ide.parsedQuery);
  const [schema] = useAtom(ide.schema);
  return (
    <div className={bw`${panel} relative`}>
      <div className={bw`${header} absolute top-0 px-4 w-full z-100`}>
        Explorer
      </div>
      <div className={bw`pt-12 pb-3 overflow-scroll w-full h-full`}>
        <div className={bw`px-4`}>
          <ErrorBoundary
            fallbackRender={({ error }) => (
              <pre className={bw`font-mono text-xs text-red-400`}>
                {error.stack}
              </pre>
            )}
          >
            {query && schema && <Document document={query} />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
