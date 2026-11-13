"use client";

import { useEffect } from "react";

export function Protection() {
  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault();

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editable =
        target?.isContentEditable ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (editable) return;

      const key = event.key.toLowerCase();
      const blockedKeys = ["c", "s", "p", "u", "i", "j", "k", "o", "n", "m"];
      const wantsToCopy = (event.ctrlKey || event.metaKey) && blockedKeys.includes(key);

      if (wantsToCopy || key === "f12" || key === "printscreen") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("dragstart", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
