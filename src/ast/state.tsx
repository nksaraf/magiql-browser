import { atom, atomFamily, useAtom } from "../atom";
import { ide } from "../ide";
import {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionSetNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  FragmentDefinitionNode,
} from "graphql";

export function useSchema() {
  return useAtom(ide.schema)[0];
}
export const getOperationNode = atomFamily(
  (id: string) => null as OperationDefinitionNode | null
);
export const getFragmentNode = atomFamily(
  (id: string) => null as FragmentDefinitionNode | null
);
const operationNames = atom<string[]>([]);
const fragmentNames = atom<string[]>([]);
const getIsSelected = atomFamily((id: string) => (get) =>
  !!get(getSelection(id))
);
const getSelectionSetPaths = atomFamily((id: string) => []);
const getSelection = atomFamily<
  null | FieldNode | FragmentSpreadNode | InlineFragmentNode
>((id: string) => null);
const getSelectionSet = atomFamily(
  (id: string) => (get) => ({
    selections: get(getSelectionSetPaths(id)),
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
    } else if (def.kind === "FragmentDefinition") {
      const fragName = def.name.value;
      set(fragmentNames, (old) => [...old, fragName]);
      set(getSelectionSet(fragName), def.selectionSet as any);
      set(getFragmentNode(fragName), def);
    }
  });
});

const getField = atomFamily((id: string) => (get) => ({
  node: get(getSelection(id)) as FieldNode,
  isSelected: get(getIsSelected(id)),
}));

export const ast = {
  operationNames,
  getIsSelected,
  write,
  getField,
  getSelection,
  getSelectionSet,
  getSelectionSetPaths,
  getOperationNode,
  getFragmentNode,
  fragmentNames,
};
