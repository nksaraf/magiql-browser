import React from "react";
import { useMonaco } from "use-monaco";
import * as monacoApi from "monaco-editor";
import { useAtom } from "./atom";
import * as ide from "./ide";

export async function loadSchema(monaco: typeof monacoApi, tab) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file(`/${tab}/query.graphql`)
  );
  return await worker.getSchema();
}

export function LoadSchema() {
  const [currentTab] = useAtom(ide.currentTab);
  const [config, setConfig] = useAtom(ide.getTabSchemaConfig(currentTab));
  const [, setSchema] = useAtom(ide.schemaText);

  const { monaco } = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.worker.updateOptions("graphql", {
        languageConfig: {
          schemaConfig: config,
        },
      });
      loadSchema(monaco, currentTab)
        .then((schema) => {
          setSchema(schema);
        })
        .catch((e) => {
          console.error(e);
          setSchema(null);
        });
    }
  }, [config, monaco]);

  return null;
}
