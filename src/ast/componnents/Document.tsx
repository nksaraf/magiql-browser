import React from "react";
import * as gql from "../types";
import { bw } from "@beamwind/play";
import {
  createAstComponent,
  useUpdateCollection,
  useUpdateNode,
} from "./components";
import { OperationDefinition } from "./OperationDefinition";
import { FragmentDefinition } from "./FragmentDefinition";
import { Lines } from "../tokens";

export const Document = createAstComponent<gql.DocumentNode>(({ node }) => {
  const updateDef = useUpdateCollection({ node, key: "definitions" });

  return (
    <div className={bw`flex flex-col gap-6`}>
      <>
        {node.definitions.map((childNode) => {
          switch (childNode.kind) {
            case "OperationDefinition": {
              return (
                <OperationDefinition
                  node={childNode}
                  onClick={() => updateDef.removeItem(childNode)}
                />
              );
            }
            case "FragmentDefinition": {
              return (
                <FragmentDefinition
                  node={childNode}
                  onClick={() => updateDef.removeItem(childNode)}
                />
              );
            }
          }
        })}
        <Lines>
          <OperationDefinition
            onClick={() =>
              updateDef.addItem({
                operation: "query",
                kind: "OperationDefinition",
                metadata: {
                  isSelected: false,
                } as any,
                name: { kind: "Name", metadata: {}, value: "MyQuery" },
                selectionSet: {
                  kind: "SelectionSet",
                  metadata: {
                    isSelected: false,
                  } as any,
                  selections: [],
                },
              })
            }
            node={{
              operation: "query",
              kind: "OperationDefinition",
              metadata: {
                isSelected: false,
              } as any,
              selectionSet: {
                kind: "SelectionSet",
                metadata: {
                  isSelected: false,
                } as any,
                selections: [],
              },
            }}
          />
          <OperationDefinition
            onClick={() =>
              updateDef.addItem({
                operation: "mutation",
                kind: "OperationDefinition",
                metadata: {
                  isSelected: false,
                } as any,
                name: { kind: "Name", metadata: {}, value: "MyMutation" },
                selectionSet: {
                  kind: "SelectionSet",
                  metadata: {
                    isSelected: false,
                  } as any,
                  selections: [],
                },
              })
            }
            node={{
              operation: "mutation",
              kind: "OperationDefinition",
              metadata: {
                isSelected: false,
              } as any,
              selectionSet: {
                kind: "SelectionSet",
                metadata: {
                  isSelected: false,
                } as any,
                selections: [],
              },
            }}
          />
          <OperationDefinition
            onClick={() =>
              updateDef.addItem({
                operation: "subscription",
                kind: "OperationDefinition",
                metadata: {
                  isSelected: false,
                } as any,
                name: { kind: "Name", metadata: {}, value: "MySubscription" },
                selectionSet: {
                  kind: "SelectionSet",
                  metadata: {
                    isSelected: false,
                  } as any,
                  selections: [],
                },
              })
            }
            node={{
              operation: "subscription",
              kind: "OperationDefinition",
              metadata: {
                isSelected: false,
              } as any,
              selectionSet: {
                kind: "SelectionSet",
                metadata: {
                  isSelected: false,
                } as any,
                selections: [],
              },
            }}
          />
        </Lines>
        {/* <FragmentDefinition
          node={{
            kind: "FragmentDefinition",
            metadata: {
              isSelected: false,
            } as any,
            selectionSet: {
              kind: "SelectionSet",
              metadata: {
                isSelected: false,
              } as any,
              selections: [],
            },
            typeCondition: 
          }}
        /> */}
      </>
    </div>
  );
});
Document.displayName = "Document";
