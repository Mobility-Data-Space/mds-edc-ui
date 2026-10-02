import type { KeyboardEvent } from "react";

// Makes a click-only element such as a card reachable and operable by keyboard.
export const clickableProps = (onClick: () => void) => ({
  role: "button",
  tabIndex: 0,
  onClick,
  onKeyDown: (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  },
});
