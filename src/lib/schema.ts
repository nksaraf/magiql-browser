import * as monacoApi from "monaco-editor";

export async function loadSchema(monaco: typeof monacoApi, tab) {
  await new Promise((res, rej) => {
    setTimeout(res, 1000);
  });
  const worker = await monaco.worker.get<{ getSchema: () => Promise<string> }>(
    "graphql",
    monaco.Uri.file(`/${tab}/query.graphql`)
  );
  return await worker.getSchema();
}
