"use client";

import type { ComponentType } from "react";

import { Caption } from "./components/caption";
import { CodeTabs } from "./components/code-tabs";
import { DesktopPanels, MobilePanels } from "./components/panels";
import { PreviewContainer } from "./components/preview-container";
import { Root } from "./components/root";
import { Toolbar } from "./components/toolbar";
import { useDemoStore } from "./hooks/use-demo-store";
import type {
  ControlDef,
  CreateDemoConfig,
  DemoProps,
  InferControlProps,
  InspectorDef,
} from "./types";

// =============================================================================
// Source URL Builder
// =============================================================================

/**
 * Build source URL from import.meta.url
 *
 * Parses file:// URLs to create either:
 * - VSCode deep link (development): vscode://file/path/to/preview.tsx:1:1
 * - GitHub link (production): https://github.com/.../preview.tsx
 */
function buildSourceUrl(importMetaUrl: string): string | undefined {
  // Only process file:// URLs
  if (!importMetaUrl.startsWith("file://")) {
    return;
  }

  // Strip file:// prefix and get the directory
  const filePath = importMetaUrl.replace("file://", "");
  const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));

  // Check if we're in development (file exists locally)
  // In production builds, we'll use GitHub links
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // VSCode deep link to the preview file
    return `vscode://file${dirPath}/preview.tsx:1:1`;
  }

  // For production, extract relative path and link to GitHub
  const srcIndex = dirPath.indexOf("/src/");
  if (srcIndex === -1) {
    return;
  }

  const relativePath = dirPath.substring(srcIndex + 5); // after "/src/"
  return `https://github.com/mikeour/v2/tree/main/apps/www/src/${relativePath}/preview.tsx`;
}

/**
 * Demo component type.
 */
export type DemoComponent = ComponentType<DemoProps>;

/**
 * Create a type-safe demo component with controls and inspector.
 *
 * @example
 * ```tsx
 * export const ProgressDemo = createDemo({
 *   caption: "Scroll to see the progress update.",
 *   mockBrowser: true,
 *   controls: [
 *     { type: "switch", name: "showShadows", label: "Show Shadows", default: true },
 *     { type: "slider", name: "size", label: "Size", min: 16, max: 64, default: 32 },
 *   ] as const,
 *   inspector: [
 *     { name: "progress", label: "Scroll Progress" },
 *     { name: "velocity", label: "Velocity" },
 *   ] as const,
 *   preview: ({ controls, inspector }) => {
 *     // Type-safe: controls.showShadows is boolean, controls.size is number
 *     // Type-safe: inspector.progress and inspector.velocity are available
 *     return <div>...</div>;
 *   },
 * });
 * ```
 */
export function createDemo<
  const C extends readonly ControlDef[],
  const I extends readonly InspectorDef[],
>(config: Omit<CreateDemoConfig<C, I>, "files">): DemoComponent {
  const {
    caption,
    mockBrowser,
    path,
    controls,
    inspector,
    codeOutput,
    preview: Preview,
  } = config;

  // Pre-compute source URL from import.meta.url (skip if explicitly false)
  const sourceUrl = typeof path === "string" ? buildSourceUrl(path) : undefined;

  function Demo({ code }: DemoProps) {
    const store = useDemoStore(controls, inspector);
    const hasCode = Boolean(code && code.length > 0);

    return (
      <Root>
        {/* Toolbar: code toggle, reset, source link */}
        <Toolbar
          showCode={store.showCode}
          onToggleCode={() => store.setShowCode(!store.showCode)}
          onReset={store.reset}
          hasCode={hasCode}
          sourceUrl={sourceUrl}
        />

        {/* Main content area */}
        <div className="component-bg flex flex-col gap-4 p-4 px-(--gutter) py-4 sm:px-8 sm:py-8 lg:flex-row lg:items-start lg:justify-center">
          {/* Preview */}
          <PreviewContainer
            Preview={Preview}
            controls={store.controls as InferControlProps<C>}
            inspector={inspector ?? ([] as unknown as I)}
            setInspector={store.setInspector}
            resetKey={store.resetKey}
            mockBrowser={mockBrowser}
          />

          {/* Desktop panels (controls + inspector + code output) */}
          <DesktopPanels
            controls={controls}
            controlValues={store.controls}
            onControlChange={store.setControl}
            inspector={inspector}
            inspectorValues={store.inspector}
            codeOutput={codeOutput}
          />
        </div>

        {/* Mobile panels */}
        <MobilePanels
          controls={controls}
          controlValues={store.controls}
          onControlChange={store.setControl}
          inspector={inspector}
          inspectorValues={store.inspector}
          codeOutput={codeOutput}
        />

        {/* Code tabs */}
        {code && <CodeTabs code={code} visible={store.showCode} />}

        {/* Caption */}
        {caption && <Caption>{caption}</Caption>}
      </Root>
    );
  }

  return Demo;
}
