import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import React from "react";
import {
  GraphQLField,
  getNamedType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  ValueNode,
  VariableDefinitionNode,
  print,
} from "graphql";
import * as gql from "graphql-ast-types";
import { Arrow, Checkbox, Qualifier } from "./tokens";
import { ast, useSchema } from "./state";
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
} from "./tokens";
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from "@reach/listbox";
import { SelectionSet } from "./SelectionSet";

function ObjectTypeField({ field, path }) {
  const [{ node, isSelected }] = useAtom(ast.getField(path));
  const type = getNamedType(field.type) as GraphQLObjectType;
  const hasArgs = isSelected && node.arguments && node.arguments.length > 0;

  const aliasedField = node?.alias ? (
    <>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{field.name}</Qualifier>
    </>
  ) : (
    <>
      <FieldName>{field.name}</FieldName>
    </>
  );

  const header = isSelected ? (
    hasArgs ? (
      <Tokens gap={0.75}>
        {aliasedField}
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>
        {aliasedField}
        <Punctuation>{"{"}</Punctuation>
      </>
    )
  ) : (
    aliasedField
  );

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        {header}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens className={bw`pl-1`}>
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

  const aliasedField = node?.alias ? (
    <>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{field.name}</Qualifier>
    </>
  ) : (
    <>
      <FieldName>{field.name}</FieldName>
    </>
  );

  const header = isSelected ? (
    hasArgs ? (
      <Tokens gap={0.75}>
        {aliasedField}
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>
        {aliasedField}
        <Punctuation>{"{"}</Punctuation>
      </>
    )
  ) : (
    aliasedField
  );

  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        {header}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens className={bw`pl-1`}>
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

  const aliasedField = node?.alias ? (
    <>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{field.name}</Qualifier>
    </>
  ) : (
    <>
      <FieldName>{field.name}</FieldName>
    </>
  );

  const header = isSelected ? (
    hasArgs ? (
      <Tokens gap={0.75}>
        {aliasedField}
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>
        {aliasedField}
        <Punctuation>{"{"}</Punctuation>
      </>
    )
  ) : (
    aliasedField
  );
  return (
    <Lines>
      <Tokens>
        <Arrow className={bw`text-graphql-field`} isOpen={isSelected} />
        {header}
      </Tokens>
      {hasArgs && isSelected && (
        <Indented>
          <Arguments args={node.arguments} />
        </Indented>
      )}
      {hasArgs && isSelected && (
        <Tokens className={bw`pl-1`}>
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

  const aliasedField = node?.alias ? (
    <>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{field.name}</Qualifier>
    </>
  ) : (
    <>
      <FieldName>{field.name}</FieldName>
    </>
  );

  const header = isSelected ? (
    hasArgs ? (
      <Tokens gap={0.75}>
        {aliasedField}
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>{aliasedField}</>
    )
  ) : (
    aliasedField
  );
  return (
    <Lines>
      <Tokens>
        <Checkbox checked={isSelected} />
        {header}
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
          <ListboxInput
            className={bw`font-mono`}
            // aria-labelledby={labelId}
            value={JSON.stringify(value.value)}
          >
            <ListboxButton
              className={bw`text-graphql-boolean px-1 rounded-xs`}
              arrow={<span className={bw`pl-2`}>↕</span>}
            />
            <ListboxPopover
              className={bw`bg-gray-100 rounded-sm shadow-xl z-1000`}
            >
              <ListboxList
                className={bw`font-mono text-xs text-graphql-boolean`}
              >
                <ListboxOption
                  className={bw`px-2 py-1 text-gray-800`}
                  value="true"
                >
                  {"true"}
                </ListboxOption>
                <ListboxOption
                  className={bw`px-2 py-1 text-gray-800`}
                  value="false"
                >
                  {"false"}
                </ListboxOption>
              </ListboxList>
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
        <Tokens key={arg.name.value}>
          <ArgumentName>{arg.name.value}:</ArgumentName>
          <Value value={arg.value} />
        </Tokens>
      ))}
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

  const aliasedField = node?.alias ? (
    <>
      <FieldName>{node.alias?.value}: </FieldName>
      <Qualifier>{field.name}</Qualifier>
    </>
  ) : (
    <>
      <FieldName>{field.name}</FieldName>
    </>
  );

  const header = isSelected ? (
    hasArgs ? (
      <Tokens gap={0.75}>
        {aliasedField}
        <Punctuation>{"("}</Punctuation>
      </Tokens>
    ) : (
      <>{aliasedField}</>
    )
  ) : (
    aliasedField
  );
  return (
    <Lines>
      <Tokens>
        <Checkbox checked={isSelected} />
        {header}
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
        {node?.alias ? (
          <>
            <FieldName>{node.alias?.value}: </FieldName>
            <Qualifier>{field.name}</Qualifier>
          </>
        ) : (
          <>
            <FieldName>{field.name}</FieldName>
          </>
        )}
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

export function Field({
  path,
  field,
}: {
  path: string;
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
    return <InterfaceTypeField field={field} path={path} />;
  } else if (gql.isUnionTypeDefinition(type.astNode)) {
    return <UnionTypeField field={field} path={path} />;
  }
}
