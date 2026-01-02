import type { ComponentType } from "react";
import type { HighlightedCode } from "codehike/code";

// =============================================================================
// Control Definitions (User-Facing Config)
// =============================================================================

export type SwitchControlDef = {
  type: "switch";
  name: string;
  label?: string;
  description?: string;
  default?: boolean;
};

export type SliderControlDef = {
  type: "slider";
  name: string;
  label?: string;
  description?: string;
  min: number;
  max: number;
  step?: number;
  default?: number;
  unit?: string;
};

export type SelectControlDef = {
  type: "select";
  name: string;
  label?: string;
  description?: string;
  options: readonly string[];
  default?: string;
};

export type ControlDef = SwitchControlDef | SliderControlDef | SelectControlDef;

// =============================================================================
// Inspector Definitions (User-Facing Config)
// =============================================================================

export type InspectorDef = {
  name: string;
  label?: string;
  description?: string;
  default?: string;
};

// =============================================================================
// Type Inference Utilities
// =============================================================================

/**
 * Infer control props from control definitions array.
 *
 * @example
 * const controls = [
 *   { type: "switch", name: "showShadows", default: true },
 *   { type: "slider", name: "size", min: 0, max: 100 },
 * ] as const;
 *
 * type Props = InferControlProps<typeof controls>;
 * // { showShadows: boolean; size: number }
 */
export type InferControlProps<C extends readonly ControlDef[]> = {
  [K in C[number] as K["name"]]: K extends SwitchControlDef
    ? boolean
    : K extends SliderControlDef
      ? number
      : K extends SelectControlDef
        ? string
        : never;
};

/**
 * Infer inspector keys from inspector definitions array.
 *
 * @example
 * const inspector = [
 *   { name: "progress" },
 *   { name: "velocity" },
 * ] as const;
 *
 * type Keys = InferInspectorKeys<typeof inspector>;
 * // "progress" | "velocity"
 */
export type InferInspectorKeys<I extends readonly InspectorDef[]> =
  I[number]["name"];

// =============================================================================
// Subscribable (for MotionValue support)
// =============================================================================

/**
 * Interface for subscribable values like framer-motion's MotionValue.
 */
export type Subscribable<T> = {
  get(): T;
  on(event: "change", callback: (value: T) => void): () => void;
};

// =============================================================================
// Inspector API (What Preview Receives)
// =============================================================================

/**
 * API for a single inspector field.
 */
export type InspectorField = {
  /** Set the inspector value directly */
  set: (value: string) => void;
  /** Track a subscribable value (like MotionValue) with automatic updates */
  track: <T>(source: Subscribable<T>, format: (v: T) => string) => void;
};

/**
 * Full inspector API inferred from inspector definitions.
 */
export type InferInspectorAPI<I extends readonly InspectorDef[]> = {
  [K in I[number] as K["name"]]: InspectorField;
};

// =============================================================================
// Code Output Definition (Generated Code Panel)
// =============================================================================

/**
 * Configuration for a generated code output panel.
 * The generate function receives current control values and returns code.
 *
 * @example
 * codeOutput: {
 *   label: "Generated CSS",
 *   lang: "css",
 *   generate: (controls) => `.shadow { height: ${controls.size}px; }`,
 * }
 */
export type CodeOutputDef<C extends readonly ControlDef[]> = {
  /** Label shown above the code output */
  label: string;
  /** Language for syntax highlighting */
  lang: string;
  /** Generate code string from current control values */
  generate: (controls: InferControlProps<C>) => string;
};

// =============================================================================
// Preview Props (What the Preview Component Receives)
// =============================================================================

export type PreviewProps<
  C extends readonly ControlDef[],
  I extends readonly InspectorDef[],
> = {
  /** Control values (read-only, from control panel) */
  controls: InferControlProps<C>;
  /** Inspector API (write-only, to inspector panel) */
  inspector: InferInspectorAPI<I>;
};

// =============================================================================
// createDemo Config
// =============================================================================

export type CreateDemoConfig<
  C extends readonly ControlDef[],
  I extends readonly InspectorDef[],
> = {
  /** Caption text displayed below the demo */
  caption?: string;
  /** Show mock browser chrome around preview */
  mockBrowser?: boolean;
  /** Path to demo file via import.meta.url (for source link). Pass `false` to hide. */
  path?: string | false;
  /** Control definitions */
  controls?: C;
  /** Inspector definitions */
  inspector?: I;
  /** Code output panel configuration (generated code) */
  codeOutput?: CodeOutputDef<C>;
  /** Preview component that receives typed { controls, inspector } */
  preview: ComponentType<PreviewProps<C, I>>;
};

// =============================================================================
// Demo Component Props
// =============================================================================

export type DemoProps = {
  /** Highlighted code (injected by server) */
  code?: HighlightedCode[];
};

// =============================================================================
// Internal Store Types
// =============================================================================

export type ControlValues = Record<string, boolean | number | string>;
export type InspectorValues = Record<string, string>;

export type DemoState = {
  controls: ControlValues;
  inspector: InspectorValues;
  showCode: boolean;
  resetKey: number;
};

export type DemoActions = {
  setControl: (name: string, value: boolean | number | string) => void;
  setInspector: (name: string, value: string) => void;
  setShowCode: (show: boolean) => void;
  reset: () => void;
};

export type DemoStore = DemoState & DemoActions;

// =============================================================================
// Track Request (for subscription handling)
// =============================================================================

export type TrackRequest = {
  key: string;
  source: Subscribable<unknown>;
  format: (value: unknown) => string;
};
