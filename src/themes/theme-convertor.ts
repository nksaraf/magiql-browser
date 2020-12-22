import type * as monaco from "monaco-editor";

export interface IVSCodeTheme {
  $schema: "vscode://schemas/color-theme";
  type: "dark" | "light";
  colors: { [name: string]: string };
  tokenColors: {
    name?: string;
    scope: string[] | string;
    settings: {
      foreground?: string;
      background?: string;
      fontStyle?: string;
    };
  }[];
}

export type IMonacoThemeRule = monaco.editor.ITokenThemeRule[];
export function convertTheme(
  theme: IVSCodeTheme
): monaco.editor.IStandaloneThemeData {
  const monacoThemeRule: IMonacoThemeRule = [
    {
      token: "unmatched",
      foreground:
        theme.colors["editor.foreground"] ??
        theme.colors["foreground"] ??
        "#bbbbbb",
    },
  ];
  const returnTheme: monaco.editor.IStandaloneThemeData = {
    inherit: false,
    base: "vs-dark",
    colors: {
      ...theme.colors,
      "editor.foreground": "#bbbbbb",
      foreground: "#bbbbbb",
    },
    rules: monacoThemeRule,
    encodedTokensColors: [],
  };

  theme.tokenColors.map((color) => {
    if (typeof color.scope == "string") {
      const split = color.scope.split(",");

      if (split.length > 1) {
        color.scope = split;
        evalAsArray();
        return;
      }

      monacoThemeRule.push(
        Object.assign(
          {},
          Object.fromEntries(
            Object.entries(color.settings).map(([k, v]) =>
              v === "white"
                ? [k, "#ffffff"]
                : v === "inherit"
                ? [k, "#ffffff"]
                : [k, v]
            )
          ),
          {
            // token: color.scope.replace(/\s/g, '')
            token: color.scope,
          }
        )
      );
      return;
    }

    evalAsArray();

    function evalAsArray() {
      (color.scope as string[]).map((scope) => {
        monacoThemeRule.push(
          Object.assign(
            {},
            Object.fromEntries(
              Object.entries(color.settings).map(([k, v]) =>
                v === "white"
                  ? [k, "#ffffff"]
                  : v === "inherit"
                  ? [k, "#ffffff"]
                  : [k, v]
              )
            ),
            {
              token: scope,
            }
          )
        );
      });
    }
  });

  return returnTheme;
}
