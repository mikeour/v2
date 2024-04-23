"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

export function Editor() {
  const files = {
    "./styles.css": `.scroll-shadows {
  background: red;
}
    `,
  };

  return (
    <Sandpack
      files={files}
      theme="dark"
      template="react"
      options={{
        showConsoleButton: false,
        showInlineErrors: true,
        showNavigator: true,
        showLineNumbers: true,
        showTabs: true,
      }}
    />
  );
}
