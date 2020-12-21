// @ts-ignore
const manifest = require("../pkg/dist/_assets/manifest.json");
// @ts-ignore
const { version } = require("../package.json");

export function renderBrowser({
  uri,
  cdn = `https://unpkg.com/@magiql/browser@${version}/dist`,
}: {
  uri: string;
  cdn?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>GraphQL Browser - ${uri}</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <style>
      #BROWSER_CONFIG {
        display: none;
      }
    </style>
    <link rel="icon" href="${cdn}/logo.svg" />
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <div id="BROWSER_CONFIG"></div>
    <script>
      document.getElementById('BROWSER_CONFIG').innerHTML = JSON.stringify({ uri: ${
        uri.startsWith("/") ? `window.location.origin + "${uri}"` : `"${uri}"`
      } });
    </script>
    <script type="module" src="${cdn}/_assets/${manifest["index.js"]}"></script>
  </body>
</html>
`;
}

export default renderBrowser;
