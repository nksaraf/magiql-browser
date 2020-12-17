import { stdout } from "process";
import shellac from "shellac";
import fs from "fs";
shellac`
  $ vite build --outDir pkg/dist
  $ yarn tsup src/render.tsx src/index.tsx --out-dir pkg/dist --format cjs,esm --legacy-output --external --external @magiql/ide react --external graphql --external react-dom
  $ cp -r render pkg/
  $ cp -r README.md pkg/
  $ yarn tsc 
  await ${async () => {
    const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
    delete pkg.dependencies["react"];
    delete pkg.dependencies["graphql"];
    delete pkg.dependencies["react-dom"];
    delete pkg.scripts;
    fs.writeFileSync("./pkg/package.json", JSON.stringify(pkg, null, 2));
  }}
  `;
