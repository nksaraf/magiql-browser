import { atom } from "./atom";
import { parse, GraphQLSchema } from "graphql";

const query = atom(localStorage.getItem("use-monaco:query.graphql") ?? "");

const parsedQuery = atom((get) => {
  try {
    return parse(get(query));
  } catch (e) {
    return null;
  }
});

export const ide = {
  query,
  parsedQuery,
  variables: atom(localStorage.getItem("use-monaco:variables.json") ?? ""),
  results: atom({}),
  schema: atom<GraphQLSchema | null>(null),
};
