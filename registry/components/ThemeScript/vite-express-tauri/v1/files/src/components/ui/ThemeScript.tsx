"use client";

import * as React from "react";

export interface ThemeScriptProps {
  defaultTheme?: "light" | "dark";
  storageKey?: string;
}

export function ThemeScript({ defaultTheme = "dark", storageKey = "theme" }: ThemeScriptProps) {
  const code = `(function(){try{var saved=localStorage.getItem("${storageKey}");var next=(saved==="light"||saved==="dark")?saved:"${defaultTheme}";document.documentElement.setAttribute("data-theme",next);}catch(e){document.documentElement.setAttribute("data-theme","${defaultTheme}");}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: code,
      }}
    />
  );
}
