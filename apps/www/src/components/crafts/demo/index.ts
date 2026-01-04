// =============================================================================
// Public API for crafts/demo
// =============================================================================

export type { DemoComponent } from "./create";
// Main factory function
export { createDemo } from "./create";
// NOTE: Demo must be imported directly from "./server" to avoid bundling node:fs
// import { Demo } from "~/components/crafts/demo/server";
// Types for consumers
export type {
  // Code output
  CodeOutputDef,
  // Control definitions
  ControlDef,
  // Props types
  CreateDemoConfig,
  DemoProps,
  // Type inference utilities
  InferControlProps,
  InferInspectorAPI,
  InferInspectorKeys,
  // Inspector definitions
  InspectorDef,
  PreviewProps,
  SelectControlDef,
  SliderControlDef,
  // Subscribable for MotionValue support
  Subscribable,
  SwitchControlDef,
} from "./types";
