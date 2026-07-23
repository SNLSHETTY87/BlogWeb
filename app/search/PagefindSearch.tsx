"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    PagefindUI: new (options: { element: HTMLElement; showSubResults?: boolean }) => unknown;
  }
}

export default function PagefindSearch() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      try {
        const pagefindUiSrc = "/pagefind/pagefind-ui.js";
        await import(/* webpackIgnore: true */ pagefindUiSrc);
        if (!cancelled && container && window.PagefindUI) {
          new window.PagefindUI({ element: container, showSubResults: true });
        }
      } catch {
        // Search index only exists after `npm run build` has generated /public/pagefind.
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags -- stylesheet only exists after `npm run build` generates /public/pagefind */}
      <link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
      <div ref={containerRef} />
    </>
  );
}
