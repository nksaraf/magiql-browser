import { write } from "fs";
import { Project, TypeAliasDeclaration } from "ts-morph";
import pluralize from "pluralize";
import prettier from "prettier";

const project = new Project();
project.addSourceFileAtPath("src/components/ast/types.ts");
const source = project.getSourceFile("src/components/ast/types.ts");
import fs from "fs";
function caps(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
const atomFamily = ({ name, type, get, set = undefined }) => {
  return `export const ${name} = atomFamily<${type}>((path: string) => ${get}${
    set ? `, (path: string) => ${set}` : ""
  })`;
};

let atoms = `
import * as gql from './types'
import { atom, atomFamily } from '../../lib/atom'

const getParentPath = (path) => {
  const parts = path.split('.');
  return parts.slice(0, parts.length-1).join('.');
}

${atomFamily({
  name: "getNodeMetadata",
  type: "gql.NodeMetadata",
  get: `({ parentPath: getParentPath(path), path: path, isSelected: false, kind: "" })`,
})}


${["string", "boolean", "number"]
  .map((typeName) => {
    return `
    ${
      // getString, getBoolean
      atomFamily({
        name: `get${caps(typeName)}`,
        type: typeName,
        get: `${{ string: '""', boolean: "true", number: "0" }[typeName]}`,
      })
    }

    ${
      // getStrings, getBooleans
      source.getText().includes(`${typeName}[]`)
        ? atomFamily({
            name: `get${caps(typeName)}s`,
            type: `${typeName}[]`,
            get: `[]`,
          })
        : ""
    }
    `;
  })
  .join("\n")}


  ${source
    .getInterfaces()
    .map((inter) => {
      if (
        inter.compilerNode.name.text.includes("Node") &&
        !["ASTKindToNode", "NodeMetadata"].includes(
          inter.compilerNode.name.text
        )
      ) {
        const astNodeInterfaceName = inter.compilerNode.name.text;
        const interfaceNode = source.getInterface(astNodeInterfaceName);
        const astKind = astNodeInterfaceName.replace("Node", "");

        const children = interfaceNode.getMembers().filter((mem) => {
          let fieldName = mem.compilerNode.name.getText();

          if (
            !["kind", "loc", "metadata", "description", "repeatable"].includes(
              fieldName
            )
          ) {
            return true;
          }
        });

        return `\n
    //  ${astNodeInterfaceName}
    
    ${children
      .map((field) => {
        const fieldType = field.compilerNode.type.getText();
        const fieldName = field.compilerNode.name.getText();
        const fieldTypeName = fieldType.endsWith("[]")
          ? fieldType.replace("[]", "").replace(">", "")
          : fieldType;
        const fieldKind = fieldTypeName.replace("Node", "");
        const isList = fieldType.endsWith("[]");

        // List Type Field, eg. variableDefinitions, selections
        if (isList) {
          return atomFamily({
            type: `gql.${fieldTypeName}[]`,
            name: `get${astKind}${caps(fieldName)}`,
            get: `get => {
            return get(get${fieldKind}s(path + '.${fieldName}'))
          }`,
            set: `(get, set, node: gql.${fieldTypeName}[]) => {
              set(get${fieldKind}s(path + '.${fieldName}'), node)
            }`,
          });
        } else if (["string", "boolean", "number"].includes(fieldType)) {
          return atomFamily({
            type: fieldType,
            name: `get${astKind}${caps(fieldName)}`,
            get: `get => {
            return get(get${caps(fieldKind)}(path + '.${fieldName}'))
          }`,
            set: `(get, set, node: ${fieldType}) => {
            return set(get${caps(fieldKind)}(path + '.${fieldName}'), node)
          }`,
          });
        } else {
          return atomFamily({
            type: `gql.${fieldType}`,
            name: `get${astKind}${caps(fieldName)}`,
            get: `get => {
              return get(get${fieldKind}(path + '.${fieldName}'))
            }`,
            set: `(get, set, node: gql.${fieldType}) => {
              return set(get${fieldKind}(path + '.${fieldName}'), node)
            }`,
          });
        }
      })
      .join("\n\n")}

    ${atomFamily({
      name: `get${astKind}`,
      type: `gql.${astNodeInterfaceName}`,
      get: `(get) => {
        return {
          kind: "${astKind}",
          metadata: get(getNodeMetadata(path)),
          ${children
            .map((field) => {
              const fieldName = field.compilerNode.name.getText();
              return `${fieldName}: get(get${astKind}${caps(fieldName)}(path))`;
            })
            .join(",\n")}
        }         
       }`,
      set: `(get, set, node: gql.${astNodeInterfaceName}) => {
        if (!node) {
          ${children
            .map((field) => {
              const fieldName = field.compilerNode.name.getText();
              return `set(get${astKind}${caps(fieldName)}(path), null)`;
            })
            .join(",\n")}
          set(getNodeMetadata(path),(old) => ({ ...old, isSelected: false }));
          return;
        }

        set(getNodeMetadata(path), (old) => ({ ...old, kind: node.kind, isSelected: true }));
        ${children
          .map((field) => {
            const fieldName = field.compilerNode.name.getText();
            return `set(get${astKind}${caps(
              fieldName
            )}(path), node.${fieldName})`;
          })
          .join(",\n")}
      }`,
    })}

      ${
        source.getText().includes(`${astNodeInterfaceName}[]`)
          ? atomFamily({
              name: `get${astKind}Paths`,
              type: `string[]`,
              get: `[]`,
            })
          : ""
      }

      ${
        source.getText().includes(`${astNodeInterfaceName}[]`)
          ? atomFamily({
              name: `get${astKind}s`,
              type: `gql.${astNodeInterfaceName}[]`,
              get: `(get) => {
          return get(get${astKind}Paths(path)).map(subPath => get(get${astKind}(subPath)))
  
         }`,
              set: `(get, set, nodes: gql.${astNodeInterfaceName}[]) => {
          

          if (!nodes) {
            get(get${astKind}Paths(path)).map(path => set(get${astKind}(path), null));
            set(get${astKind}Paths(path), []);
          }
          else { 
            const oldPaths = get(get${astKind}Paths(path));
            const paths = nodes.map((node, index) => (path + '.' + index));

            for (var p in oldPaths) {
              if (!paths.includes(p)) {
                set(get${astKind}(p), null)
              }
            }

            set(get${astKind}Paths(path), paths);
            nodes.forEach((node, index) => {
              set(get${astKind}(paths[index]), node);
            })

          }
        }`,
            })
          : ""
      }
    `;
      }
    })
    .join("\n")}

${source
  .getTypeAliases()
  .map((type) => {
    if (
      type.compilerNode.name.text.includes("Node") &&
      !["ASTKindToNode"].includes(type.compilerNode.name.text)
    ) {
      const nodeTypeAliasName = type.compilerNode.name.text;
      const astKind = type.compilerNode.name.text.replace("Node", "");

      const subTypes = type.compilerNode.type
        .getText()
        .replace(/\| /g, "")
        .replace(/\n /g, "")
        .split(" ");

      return `
      
      ${atomFamily({
        name: `get${astKind}`,
        type: `gql.${nodeTypeAliasName}`,
        get: `(get) => {
          const metadata = get(getNodeMetadata(path))
          switch (metadata.kind) {
            ${subTypes
              .map((type) => {
                return `case "${type.replace("Node", "")}": {
                return get(get${type.replace("Node", "")}(path));
              }`;
              })
              .join("\n")}
          } 
  
         }`,
        set: `(get, set, node: gql.${nodeTypeAliasName}) => {
          if (!node) {
            const kind = get(getNodeMetadata(path)).kind;
            set(getNodeMetadata(path), (old) => ({ ...old,  isSelected: false  }))
            switch (kind) {
              ${subTypes
                .map((type) => {
                  return `case "${type.replace("Node", "")}": {
                  return set(get${type.replace("Node", "")}(path), null);
                }`;
                })
                .join("\n")}
              }
              return;
          } else {
            set(getNodeMetadata(path), (old) => ({...old,  kind: node.kind, isSelected: true }))
          }

          switch (node.kind) {
            ${subTypes
              .map((type) => {
                return `case "${type.replace("Node", "")}": {
                return set(get${type.replace("Node", "")}(path), node);
              }`;
              })
              .join("\n")}

          }
        }`,
      })}
      

    ${
      source.getText().includes(`${nodeTypeAliasName}[]`)
        ? atomFamily({
            name: `get${astKind}Paths`,
            type: `string[]`,
            get: `[]`,
          })
        : ""
    }

    ${
      source.getText().includes(`${nodeTypeAliasName}[]`)
        ? atomFamily({
            name: `get${astKind}s`,
            type: `gql.${nodeTypeAliasName}[]`,
            get: `(get) => {
        return get(get${astKind}Paths(path)).map(subPath => get(get${astKind}(subPath)))

       }`,
            set: `(get, set, nodes: gql.${nodeTypeAliasName}[]) => {
              if (!nodes) {
                get(get${astKind}Paths(path)).map(path => set(get${astKind}(path), null));
                set(get${astKind}Paths(path), []);
              }
              else { 
                const oldPaths = get(get${astKind}Paths(path));
                const paths = nodes.map((node, index) => (path + '.' + index));
    
                for (var p in oldPaths) {
                  if (!paths.includes(p)) {
                    set(get${astKind}(p), null)
                  }
                }
    
                set(get${astKind}Paths(path), paths);
                nodes.forEach((node, index) => {
                  set(get${astKind}(paths[index]), node);
                })
    
              }
      }`,
          })
        : ""
    } `;
    }
  })
  .join("\n\n")}`;

try {
  fs.writeFileSync(
    "./src/components/ast/atoms.ts",
    prettier.format(atoms, {
      parser: "babel-ts",
    })
  );
} catch (e) {
  fs.writeFileSync("./src/components/ast/atoms.ts", atoms);
}

// function createComponent({ name, type, body }) {
//   return `export const ${name} = createAstComponent<${type}>(({
//     node
//   }) => {
//     ${body}
//   })

//   ${name}.displayName = "${name}";
//   `;
// }

// const components = `
// import React from 'react';
// import * as gql from '../ast-types'
// import { atom, atomFamily } from '../lib/atom'
// import { bw } from '@beamwind/play'

// function createAstComponent<T>(Component: React.FC<{ node: T, [key: string]: any }>) {
//   return Component;
// }

//   ${source
//     .getInterfaces()
//     .map((inter) => {
//       if (
//         inter.compilerNode.name.text.includes("Node") &&
//         !["ASTKindToNode", "NodeMetadata"].includes(
//           inter.compilerNode.name.text
//         )
//       ) {
//         const astNodeInterfaceName = inter.compilerNode.name.text;
//         const interfaceNode = source.getInterface(astNodeInterfaceName);
//         const astKind = astNodeInterfaceName.replace("Node", "");

//         const children = interfaceNode.getMembers().filter((mem) => {
//           let fieldName = mem.compilerNode.name.getText();
//           if (
//             ![
//               "kind",
//               "block",
//               "loc",
//               "metadata",
//               "description",
//               "repeatable",
//             ].includes(fieldName)
//           ) {
//             return true;
//           }
//         });

//         return `\n

//     ${createComponent({
//       name: `${astKind}`,
//       type: `gql.${astNodeInterfaceName}`,
//       body: `

//       return <div className={bw\`\`}>
//       ${children
//         .map((field) => {
//           const fieldType = field.compilerNode.type.getText();
//           const fieldName = field.compilerNode.name.getText();
//           const fieldTypeName = fieldType.endsWith("[]")
//             ? fieldType.replace("[]", "").replace(">", "")
//             : fieldType;
//           const fieldKind = fieldTypeName.replace("Node", "");
//           const isList = fieldType.endsWith("[]");

//           if (isList) {
//             return `<${fieldKind}s node={node.${fieldName}} />`;
//           } else if (["string", "boolean", "number"].includes(fieldType)) {
//             return `<div>{JSON.stringify(node.${fieldName})}</div>`;
//           } else {
//             return `<${fieldKind} node={node.${fieldName}} />`;
//           }
//         })
//         .join("\n")}
//       </div>`,
//     })}

//       ${
//         source.getText().includes(`${astNodeInterfaceName}[]`)
//           ? createComponent({
//               name: `${astKind}s`,
//               type: `gql.${astNodeInterfaceName}[]`,
//               body: `
//         return <div>{node.map(childNode => <${astKind} key={childNode.metadata.path} node={childNode} />)}</div>`,
//             })
//           : ""
//       }
//     `;
//       }
//     })
//     .join("\n")}

// ${source
//   .getTypeAliases()
//   .map((type) => {
//     if (
//       type.compilerNode.name.text.includes("Node") &&
//       !["ASTKindToNode"].includes(type.compilerNode.name.text)
//     ) {
//       const nodeTypeAliasName = type.compilerNode.name.text;
//       const astKind = type.compilerNode.name.text.replace("Node", "");

//       const subTypes = type.compilerNode.type
//         .getText()
//         .replace(/\| /g, "")
//         .replace(/\n /g, "")
//         .split(" ");

//       return `

//       ${createComponent({
//         name: `${astKind}`,
//         type: `gql.${nodeTypeAliasName}`,
//         body: `
//           switch (node.kind) {
//             ${subTypes
//               .map((type) => {
//                 return `case "${type.replace("Node", "")}": {
//                 return <${type.replace("Node", "")} node={node} />;
//               }`;
//               })
//               .join("\n")}
//           }`,
//       })}

//     ${createComponent({
//       name: `${astKind}s`,
//       type: `gql.${nodeTypeAliasName}[]`,
//       body: `
// return <div>{node.map(childNode => <${astKind} key={childNode.metadata.path} node={childNode} />)}</div>`,
//     })} `;
//     }
//   })
//   .join("\n\n")}`;

// try {
//   fs.writeFileSync(
//     "components.raw.tsx",
//     prettier.format(components, {
//       parser: "babel-ts",
//     })
//   );
// } catch (e) {
//   fs.writeFileSync("components.raw.tsx", components);
// }

// Replicating types without readonly
// fs.writeFileSync(
//   "./src/ast-types/types.ts",
//   prettier.format(
//     `export interface NodeMetadata {
//     path: string;
//     kind: string;
//     parentPath: string;
//     isSelected: boolean;
//   }` +
//       source
//         .getInterfaces()
//         .map((type) => {
//           if (
//             type.compilerNode.name.text.includes("Node") &&
//             !["ASTKindToNode"].includes(type.compilerNode.name.text)
//           ) {
//             const astNodeInterfaceName = type.compilerNode.name.text;
//             const interfaceNode = source.getInterface(astNodeInterfaceName);
//             const astKind = astNodeInterfaceName.replace("Node", "");
//             return `${type
//               .getText()
//               .replace(/readonly /g, "")
//               .replace("loc?: Location", `metadata: NodeMetadata\n`)
//               .replace(/ReadonlyArray<([a-zA-Z]+)>/g, (a, b) => `${b}[]`)}`;
//           }
//         })
//         .join("\n\n") +
//       source
//         .getTypeAliases()
//         .map((inter) => {
//           if (
//             inter.compilerNode.name.text.includes("Node") &&
//             !["ASTKindToNode"].includes(inter.compilerNode.name.text)
//           ) {
//             const astNodeInterfaceName = inter.compilerNode.name.text;
//             const interfaceNode = source.getInterface(astNodeInterfaceName);
//             const astKind = astNodeInterfaceName.replace("Node", "");
//             return `${inter
//               .getText()
//               .replace("readonly", "")
//               .replace(/ReadonlyArray<([a-zA-Z]+)>/g, (a, b) => `${b}[]`)}`;
//           }
//         })
//         .join("\n\n"),
//     { parser: "babel-ts" }
//   )
// );
