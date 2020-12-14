import { stdout } from "process";
import shellac from "shellac";

shellac`
  $ vite build --outDir pkg/dist
  $ yarn tsup src/index.tsx --out-dir pkg/dist --format cjs,esm --legacy-output --external react --external react-dom

  ${(stdout) => console.log(stdout)}
  `;
