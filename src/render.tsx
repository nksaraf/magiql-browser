import manifest from "../pkg/dist/_assets/manifest.json";
import { version } from "../package.json";

const html = ({
  uri,
  cdn = `https://unpkg.com/@magiql/ide@${version}/dist`,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <style>
      #MAGIQL_IDE_CONFIG {
        display: none;
      }
    </style>
    <link rel="icon" href="${cdn}/logo.svg" />
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <div id="MAGIQL_IDE_CONFIG"></div>
    <script>
      document.getElementById('MAGIQL_IDE_CONFIG').innerHTML = JSON.stringify({ uri: ${
        uri.startsWith("/") ? `window.location.origin + "${uri}"` : `"${uri}"`
      } });
    </script>
    <script type="module" src="${cdn}/_assets/${manifest["index.js"]}"></script>
  </body>
</html>
`;

export function renderPlayround(props: { uri: string; cdn?: string }) {
  return html(props);
}

export default renderPlayround;
