import * as reactPlugin from "vite-plugin-react";
import type { UserConfig } from "vite";
import preactRefresh from "@prefresh/vite";

const config: UserConfig = {
  jsx: "react",
  plugins: [preactRefresh()],
  // plugins: [reactPlugin]
};

export default config;
