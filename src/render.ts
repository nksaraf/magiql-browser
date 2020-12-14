import manifest from "../dist/_assets/manifest.json";
import pkg from "../package.json";

const html = ({ uri, cdn = "https://unpkg.com", version = pkg.version }) => `
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
    <link rel="icon" href="${cdn}/@magiql/ide/dist/favicon.ico" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${cdn}/@magiql/ide@${version}/dist/_assets/${manifest["style.css"]}">
  </head>

  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <div id="MAGIQL_IDE_CONFIG">
      { "uri": "${uri}" }
    </div>
    <script type="module" src="${cdn}/@magiql/ide@${version}/dist/_assets/${manifest["index.js"]}"></script>
  </body>
</html>

`;

export function renderGraphQLIDE(props) {
  return html(props);
}

export default renderGraphQLIDE;

// module.exports = async function (fastify, options) {
//   fastify.get("/", async function (req, reply) {
//     reply.type("text/html");
//     return html({
//       // uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
//       uri: "https://poke-api-delta.vercel.app/api/graphql",
//     });
//   });
// };
