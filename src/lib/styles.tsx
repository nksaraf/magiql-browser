export const header = `font-graphql cursor-pointer rounded-t-lg text-sm font-400 bg-blueGray-100 transition-all hover:(text-white bg-blueGray-600) z-1000 text-blueGray-500 py-2`;

export const panel = `h-full bg-white shadow-xl rounded-lg`;

export const editorPanelHeader = (focused) => `
${header} ${
  focused ? "text-blueGray-200 bg-blueGray-600" : ""
} px-3 flex flex-row items-center absolute top-0 w-full`;
