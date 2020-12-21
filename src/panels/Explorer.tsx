import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { parse, print } from "graphql";
import * as gqlAst from "../ast/atoms";
import { ErrorBoundary } from "react-error-boundary";
import * as gql from "../ast/types";
import { ExplorerIcon } from "../components/Icons";

import { useUpdateAtom } from "../lib/atom";
import * as GQL from "../ast/componnents/components";
import * as Document from "../ast/componnents/Document";
import { buildASTSchema } from "graphql";
import { LoadSchema } from "../components/LoadSchema";
import flru from "flru";
import { PanelHeader, Panel } from "../lib/styles";

const schemaCache = flru(10);

export function CurrentDocument() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));
  const [schemaText] = useAtom(ide.getTabSchema(currentTab));
  const [schema, setSchema] = React.useState(null);
  const setLastEditedBy = useUpdateAtom(ide.lastEditedBy);

  console.log(schema);

  React.useEffect(() => {
    if (schemaText) {
      if (!schemaCache.has(schemaText)) {
        try {
          const parsedSchema = buildASTSchema(parse(schemaText));
          schemaCache.set(schemaText, parsedSchema);
          setSchema(parsedSchema);
        } catch (e) {
          setSchema(null);
          return;
        }
      } else {
        setSchema(schemaCache.get(schemaText));
        return;
      }
    } else {
      return;
    }
  }, [schemaText]);

  return (
    <GQL.ASTProvider
      onChange={() => {
        setLastEditedBy("explorer");
      }}
    >
      <GQL.SchemaProvider schema={schema}>
        <Document.Document node={document} />
      </GQL.SchemaProvider>
    </GQL.ASTProvider>
  );
}

export function Explorer() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQueryText] = useAtom(ide.getTabQueryFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focusedPanel);
  const [document, setDocument] = useAtom(gqlAst.getDocument(`${currentTab}`));
  const [lasEditedBy] = useAtom(ide.lastEditedBy);

  React.useEffect(() => {
    try {
      const parsedQuery = parse(query) as gql.DocumentNode;
      setDocument(parsedQuery);
    } catch (e) {
      console.error(e);
    }
  }, [query, setDocument]);

  React.useEffect(() => {
    if (document && lasEditedBy === "explorer") {
      setQueryText(print(document as any));
    }
  }, [document, setQueryText, lasEditedBy]);

  React.useEffect(() => {
    if (lasEditedBy === "explorer") {
      setFocused("explorer");
    }
  }, [lasEditedBy]);

  return (
    <>
      <LoadSchema />
      <Panel
        onClick={() => {
          setFocused("explorer");
        }}
        className={bw`relative`}
      >
        <PanelHeader
          focused={focused === "explorer"}
          className={bw`gap-1`}
        >
          <div className={bw`h-4.5 w-4.5 -mt-1`}>
            <ExplorerIcon className={bw`h-4.5 w-4.5`} />
          </div>
          <div>Explorer</div>
        </PanelHeader>
        <div className={bw`pt-12 pb-3 overflow-scroll w-full h-full`}>
          <div className={bw`px-4`}>
            <ErrorBoundary
              resetKeys={[document]}
              fallbackRender={({ error }) => (
                <pre className={bw`font-mono text-xs text-red-400`}>
                  {error.stack}
                </pre>
              )}
            >
              <CurrentDocument />
            </ErrorBoundary>
          </div>
        </div>
      </Panel>
    </>
  );
}
