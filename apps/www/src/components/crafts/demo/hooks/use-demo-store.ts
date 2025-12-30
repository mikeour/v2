"use client";

import { useCallback, useState } from "react";

import type {
  ControlDef,
  ControlValues,
  DemoStore,
  InspectorDef,
  InspectorValues,
} from "../types";

/**
 * Initialize control values from definitions.
 */
function initControlValues(controls?: readonly ControlDef[]): ControlValues {
  const values: ControlValues = {};

  for (const control of controls ?? []) {
    switch (control.type) {
      case "switch":
        values[control.name] = control.default ?? false;
        break;
      case "slider":
        values[control.name] = control.default ?? control.min;
        break;
      case "select":
        values[control.name] = control.default ?? control.options[0] ?? "";
        break;
      default: {
        const _exhaustive: never = control;
        throw new Error(`Unknown control type: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }

  return values;
}

/**
 * Initialize inspector values from definitions.
 */
function initInspectorValues(
  inspector?: readonly InspectorDef[]
): InspectorValues {
  const values: InspectorValues = {};

  for (const item of inspector ?? []) {
    values[item.name] = item.default ?? "—";
  }

  return values;
}

/**
 * Hook to create and manage demo state.
 *
 * Each demo instance gets its own isolated store.
 */
export function useDemoStore(
  controls?: readonly ControlDef[],
  inspector?: readonly InspectorDef[]
): DemoStore {
  // Control values
  const [controlValues, setControlValues] = useState<ControlValues>(() =>
    initControlValues(controls)
  );

  // Inspector values
  const [inspectorValues, setInspectorValues] = useState<InspectorValues>(() =>
    initInspectorValues(inspector)
  );

  // UI state
  const [showCode, setShowCode] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Actions
  const setControl = useCallback(
    (name: string, value: boolean | number | string) => {
      setControlValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const setInspector = useCallback((name: string, value: string) => {
    setInspectorValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setControlValues(initControlValues(controls));
    setInspectorValues(initInspectorValues(inspector));
    setResetKey((k) => k + 1);
  }, [controls, inspector]);

  return {
    controls: controlValues,
    inspector: inspectorValues,
    showCode,
    resetKey,
    setControl,
    setInspector,
    setShowCode,
    reset,
  };
}
