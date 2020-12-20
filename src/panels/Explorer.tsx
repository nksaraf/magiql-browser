import React from "react";
import { bw } from "@beamwind/play";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/ide";
import { panel, editorPanelHeader } from "../lib/styles";
import { parse, print } from "graphql";
import * as gqlAst from "../ast/atoms";
import { ErrorBoundary } from "react-error-boundary";
import * as gql from "../ast/types";
import { ExplorerIcon } from "../components/Icons";

import { useUpdateAtom } from "../lib/atom";
import * as GQL from "../ast/componnents/components";
import { buildASTSchema } from "graphql";
import { LoadSchema } from "../components/LoadSchema";

export function CurrentDocument() {
  const [currentTab] = useAtom(ide.currentTab);
  const [document] = useAtom(gqlAst.getDocument(currentTab));
  const [schemaText] = useAtom(ide.schemaText);
  const [schema, setSchema] = React.useState(null);
  const setLastEditedBy = useUpdateAtom(ide.lastEditedBy);
  React.useEffect(() => {
    if (schemaText) {
      try {
        setSchema(buildASTSchema(parse(schemaText)));
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }, [schemaText]);

  return (
    <GQL.ASTProvider
      onChange={() => {
        setLastEditedBy("explorer");
      }}
    >
      <GQL.SchemaProvider schema={schema}>
        <GQL.Document node={document} />
      </GQL.SchemaProvider>
    </GQL.ASTProvider>
  );
}

export function Explorer() {
  const [currentTab] = useAtom(ide.currentTab);
  const [query, setQueryText] = useAtom(ide.getTabQueryFile(currentTab));
  const [focused, setFocused] = useAtom(ide.focused);
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
      <div
        onClick={() => {
          setFocused("explorer");
        }}
        className={bw`${panel} relative`}
      >
        <div className={bw`${editorPanelHeader(focused === "explorer")} gap-1`}>
          <div className={bw`h-4.5 w-4.5 -mt-1`}>
            <ExplorerIcon className={bw`h-4.5 w-4.5`} />
          </div>
          <div>Explorer</div>
        </div>
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
      </div>
    </>
  );
}
