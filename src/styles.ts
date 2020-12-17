import { setup } from "@beamwind/play";
import { cssomInjector, noOpInjector } from "beamwind";

const getStyleElement = (nonce?: string): HTMLStyleElement => {
  // Hydrate existing style element if available
  // eslint-disable-next-line unicorn/prefer-query-selector
  let element = document.getElementById("__font") as HTMLStyleElement | null;

  if (!element) {
    // Create a new one otherwise
    element = document.createElement("style");

    element.id = "__font";
    nonce && (element.nonce = nonce);

    // eslint-disable-next-line unicorn/prefer-node-append
    document.head.appendChild(element);
  }

  return element;
};

const fontInjector =
  typeof window === "undefined"
    ? noOpInjector()
    : cssomInjector({ target: getStyleElement().sheet });

export const step = setup({
  init(insert, theme) {
    `:root {
  --reach-listbox: 1;
}

:root {
  --reach-tooltip: 1;
}

[data-reach-tooltip] {
  z-index: 1;
  pointer-events: none;
  position: absolute;
  padding: 0.25em 0.5em;
  box-shadow: 2px 2px 10px hsla(0, 0%, 0%, 0.1);
  white-space: nowrap;
  font-size: 85%;
  background: #f0f0f0;
  color: #444;
  border: solid 1px #ccc;
}

[data-reach-listbox-popover] {
  display: block;
  position: absolute;
  min-width: -moz-fit-content;
  min-width: -webkit-min-content;
  min-width: min-content;
  padding: 0.25rem 0;
  background: hsl(0, 0%, 100%);
  outline: none;
  border: solid 1px hsla(0, 0%, 0%, 0.25);
}

[data-reach-listbox-popover]:focus-within {
  box-shadow: 0 0 4px Highlight;
  outline: -webkit-focus-ring-color auto 4px;
}

[data-reach-listbox-popover][hidden] {
  display: none;
}

[data-reach-listbox-list] {
  margin: 0;
  padding: 0;
  list-style: none;
}

[data-reach-listbox-list]:focus {
  box-shadow: none;
  outline: none;
}

[data-reach-listbox-option] {
  display: block;
  margin: 0;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  user-select: none;
}

[data-reach-listbox-option][aria-selected="true"] {
  background: hsl(211, 81%, 46%);
  color: hsl(0, 0%, 100%);
}

[data-reach-listbox-option][data-current] {
  font-weight: bolder;
}

[data-reach-listbox-option][data-current][data-confirming] {
  animation: flash 100ms;
  animation-iteration-count: 1;
}

[data-reach-listbox-option][aria-disabled="true"] {
  opacity: 0.5;
}

[data-reach-listbox-button] {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 10px 2px;
  border: 1px solid;
  border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
  cursor: default;
  user-select: none;
}

[data-reach-listbox-button][aria-disabled="true"] {
  opacity: 0.5;
}

[data-reach-listbox-arrow] {
  margin-left: 0.5rem;
  display: block;
  font-size: 0.5em;
}

[data-reach-listbox-group-label] {
  display: block;
  margin: 0;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  user-select: none;
  font-weight: bolder;
}

@keyframes flash {
  0% {
    background: hsla(211, 81%, 36%, 1);
    color: hsl(0, 0%, 100%);
    opacity: 1;
  }
  50% {
    opacity: 0.5;
    background: inherit;
    color: inherit;
  }
  100% {
    background: hsla(211, 81%, 36%, 1);
    color: hsl(0, 0%, 100%);
    opacity: 1;
  }
}`
      .split("\n\n")
      .forEach(insert);
    insert(`body{margin:0}`);
    fontInjector.insert(
      `@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap');`,
      0
    );
  },
  extends: {},
});
