import React from "react";
import { useMonaco, useMonacoContext } from "use-monaco";
import { useAtom } from "../lib/atom";
import * as ide from "../lib/browser";
import { loadSchemaFromWorker } from "../lib/schema";

import flru from "flru";

const uriCache = flru(10);

export function useSchemaLoader() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schemaStatus, setSchemaStatus] = useAtom(ide.schemaStatus);
  const [config, setConfig] = useAtom(ide.getTabSchemaConfig(currentTab));
  const [, setSchema] = useAtom(ide.getTabSchema(currentTab));
  const { monaco } = useMonacoContext();

  return React.useCallback(
    ({ force = false } = {}) => {
      if (!force && uriCache.has(config.uri)) {
        setSchemaStatus("stale");
        setSchema(uriCache.get(config.uri));
        // loadSchemaFromWorker(monaco, currentTab)
        //   .then((schema) => {
        //     setSchema(schema);
        //     uriCache.set(config.uri, schema);
        //     setSchemaStatus("success");
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //     setSchema(null);
        //     setSchemaStatus("error");
        //   });
      } else {
        setSchemaStatus("loading");
        if (monaco) {
          loadSchemaFromWorker(monaco, currentTab)
            .then((schema) => {
              setSchema(schema);
              uriCache.set(config.uri, schema);
              setSchemaStatus("success");
            })
            .catch((e) => {
              console.log(e);
              setSchema(null);
              setSchemaStatus("error");
            });
        }
      }
    },
    [setSchemaStatus, setSchema, config.uri, monaco]
  );
}

export function LoadSchema() {
  const [currentTab] = useAtom(ide.currentTab);
  const [schemaStatus, setSchemaStatus] = useAtom(ide.schemaStatus);
  const [config, setConfig] = useAtom(ide.getTabSchemaConfig(currentTab));
  const [, setSchema] = useAtom(ide.getTabSchema(currentTab));
  const loadSchema = useSchemaLoader();
  const { monaco } = useMonacoContext();

  React.useEffect(() => {
    if (monaco) {
      monaco.worker.updateOptions("graphql", {
        languageConfig: {
          schemaConfig: {
            uri: config.uri,
          },
        },
      });

      loadSchema();
    }
  }, [config.uri, monaco, loadSchema]);

  return null;
}
