import * as monacoApi from "monaco-editor";

export async function loadSchemaFromWorker(monaco: typeof monacoApi, tab) {
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file(`/${tab}/query.graphql`)
  );
  return await worker.getSchema();
}
