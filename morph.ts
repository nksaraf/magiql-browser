import { write } from "fs";
import { Project, TypeAliasDeclaration } from "ts-morph";
import pluralize from "pluralize";
import prettier from "prettier";

const project = new Project();
project.addSourceFileAtPath("node_modules/graphql/language/ast.d.ts");
const source = project.getSourceFile("node_modules/graphql/language/ast.d.ts");
import fs from "fs";
let header = `
import * as gql from './src/ast-types'
import { atom, atomFamily } from './src/lib/atom'

${["string", "boolean", "number"]
  .map((k) => {
    return `export const get${caps(
      k
    )} = atomFamily<${k} | null>((path: string) => null)`;
  })
  .join("\n")}
`;

let text = "";

const pluralsMap = {};

const isResolved = (key) => {
  if (!pluralsMap[key]) {
    pluralsMap[key] = true;
  } else {
    return;
  }
};

function caps(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

fs.writeFileSync(
  "./src/ast-types/types.ts",
  source
    .getInterfaces()
    .map((inter) => {
      if (
        inter.compilerNode.name.text.includes("Node") &&
        !["ASTKindToNode"].includes(inter.compilerNode.name.text)
      ) {
        const astNodeInterfaceName = inter.compilerNode.name.text;
        const interfaceNode = source.getInterface(astNodeInterfaceName);
        const astKind = astNodeInterfaceName.replace("Node", "");
        return `${inter
          .getText()
          .replace("readonly", "")
          .replace(/ReadonlyArray<([a-zA-Z]+)>/g, (a, b) => `${b}[]`)}`;
      }
    })
    .join("\n\n")
);

source.getInterfaces().map((inter) => {
  if (
    inter.compilerNode.name.text.includes("Node") &&
    !["ASTKindToNode"].includes(inter.compilerNode.name.text)
  ) {
    const astNodeInterfaceName = inter.compilerNode.name.text;
    const interfaceNode = source.getInterface(astNodeInterfaceName);
    const astKind = astNodeInterfaceName.replace("Node", "");
    const requiredFields = interfaceNode.getMembers().filter((mem) => {
      let fieldName = mem.compilerNode.name.getText();

      if (
        !["kind", "loc", "description", "repeatable"].includes(fieldName) &&
        !mem.compilerNode.questionToken
      ) {
        return true;
      }
    });

    const optionalFields = interfaceNode.getMembers().filter((mem) => {
      let fieldName = mem.compilerNode.name.getText();

      if (
        [
          ["variableDefinitions", "FragmentDefinitionNode"],
          ["block", "StringValueNode"],
        ].find(([a, b]) => a === fieldName && b === astNodeInterfaceName)
      ) {
        return false;
      }
      if (
        !["kind", "loc", "description", "repeatable"].includes(fieldName) &&
        mem.compilerNode.questionToken
      ) {
        return true;
      }
    });

    const children = [...requiredFields, ...optionalFields];

    const getters = children
      .map((field) => {
        const fieldType = field.compilerNode.type.getText();
        const fieldName = field.compilerNode.name.getText();
        const fieldTypeName = fieldType.startsWith("ReadonlyArray")
          ? fieldType.replace("ReadonlyArray<", "").replace(">", "")
          : fieldType;
        const fieldKind = fieldTypeName.replace("Node", "");
        const isList = fieldType.startsWith("ReadonlyArray");

        if (isList) {
          return `get(get${astKind}${caps(fieldName)}(path))`;
        } else if (["string", "boolean", "number"].includes(fieldType)) {
          return `get(get${astKind}${caps(fieldName)}(path))`;
        } else {
          return `get(get${astKind}${caps(fieldName)}(path))`;
        }
      })
      .join(",\n");

    const setters = children
      .map((field) => {
        const fieldType = field.compilerNode.type.getText();
        const fieldName = field.compilerNode.name.getText();
        const fieldTypeName = fieldType.startsWith("ReadonlyArray")
          ? fieldType.replace("ReadonlyArray<", "").replace(">", "")
          : fieldType;
        const fieldKind = fieldTypeName.replace("Node", "");
        const isList = fieldType.startsWith("ReadonlyArray");

        // List Type Field, eg. variableDefinitions, selections
        if (isList) {
          return `set(get${astKind}${caps(
            fieldName
          )}(path), node.${fieldName})`;
        } else if (["string", "boolean", "number"].includes(fieldType)) {
          return `set(get${astKind}${caps(
            fieldName
          )}(path), node.${fieldName})`;
        } else {
          return `set(get${astKind}${caps(
            fieldName
          )}(path), node.${fieldName})`;
        }
      })
      .join(",\n");

    const atoms = children
      .map((field) => {
        const fieldType = field.compilerNode.type.getText();
        const fieldName = field.compilerNode.name.getText();
        const fieldTypeName = fieldType.startsWith("ReadonlyArray")
          ? fieldType.replace("ReadonlyArray<", "").replace(">", "")
          : fieldType;
        const fieldKind = fieldTypeName.replace("Node", "");
        const isList = fieldType.startsWith("ReadonlyArray");

        // List Type Field, eg. variableDefinitions, selections
        if (isList) {
          return `export const get${astKind}${caps(
            fieldName
          )} = atomFamily((path:string) => get => {
            return get(get${fieldKind}(\`\${path}[${fieldName}]\`))
          }, (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {})`;
        } else if (["string", "boolean", "number"].includes(fieldType)) {
          return `export const get${astKind}${caps(
            fieldName
          )} = atomFamily<${fieldType}>((path:string) => get => {
            return get(get${caps(fieldKind)}(\`\${path}[${fieldName}]\`))
          }, (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
            return set(get${caps(
              fieldKind
            )}(\`\${path}[${fieldName}]\`), node.${fieldName})
          })`;
        } else {
          return `export const get${astKind}${caps(
            fieldName
          )} = atomFamily<gql.${fieldType} | null>((path:string) => get => {
            return get(get${fieldKind}(\`\${path}[${fieldName}]\`))
          }, (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
            return set(get${fieldKind}(\`\${path}[${fieldName}]\`), node.${fieldName})
          })`;
        }
      })
      .join("\n\n");

    text += `\n//  ${astNodeInterfaceName}
    
    ${atoms}

    export const get${astKind} = atomFamily<gql.${astNodeInterfaceName} | null>(
      (path: string) => (get) => {
        return gql.${astKind.charAt(0).toLowerCase() + astKind.substr(1)}(
          ${getters});
       },
      (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
          ${setters}
      }
    );


    export const get${astKind}Paths = atomFamily<string[]>(
      (path: string) => (get) => {
        return gql.${astKind.charAt(0).toLowerCase() + astKind.substr(1)}(
          ${getters});
       },
      (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
          ${setters}
      }
    );
    
    
    export const get${astKind}s = atomFamily<gql.${astNodeInterfaceName}[] | null>(
      (path: string) => (get) => {
        return get(get${astKind}Paths(path)).map(path => get(get${astKind}(path)))

       },
      (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
        set(get${astKind})
      }
    );
    `;
  }
});

source.getTypeAliases().map((type) => {
  if (
    type.compilerNode.name.text.includes("Node") &&
    !["ASTKindToNode"].includes(type.compilerNode.name.text)
  ) {
    const nodeTypeAliasName = type.compilerNode.name.text;
    const interfaceNode = source.getInterface(astNodeInterfaceName);
    const astKind = astNodeInterfaceName.replace("Node", "");

    export const get${astKind}s = atomFamily<gql.${astNodeInterfaceName}[] | null>(
      (path: string) => (get) => {
        return get(get${astKind}Paths(path)).map(path => get(get${astKind}(path)))

       },
      (path: string) => (get, set, node: gql.${astNodeInterfaceName}) => {
        set(get${astKind})
      }
    );
    `;
  }
});

try {
  fs.writeFileSync(
    "out.ts",
    prettier.format(header + "\n" + text, {
      parser: "babel-ts",
    })
  );
} catch (e) {
  fs.writeFileSync("out.ts", header + "\n" + +text);
}
