import { stdout } from "process";
import shellac from "shellac";
import fs from "fs";

shellac`
  $$ vite build --outDir pkg/dist
  await ${async () => {
    if (process.argv.includes("--publish")) {
      const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
      const [a, b, c] = pkg.version.split(".");
      pkg.version = `${a}.${b}.${Number(c) + 1}`;
      fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
    }
  }}
  $$ yarn tsup src/render.tsx --out-dir pkg/dist --format cjs,esm --legacy-output --external react --external graphql --external react-dom
  $$ cp -r render pkg/
  $$ cp -r README.md pkg/
  $$ yarn tsc
  await ${async () => {
    const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
    delete pkg.dependencies["react"];
    delete pkg.dependencies["graphql"];
    delete pkg.dependencies["react-dom"];
    delete pkg.scripts;
    const [a, b, c] = pkg.version.split(".");
    pkg.version = `${a}.${b}.${Number(c) + 1}`;
    fs.writeFileSync("./pkg/package.json", JSON.stringify(pkg, null, 2));
  }}
 
  `;
