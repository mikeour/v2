"use client";

import { type ComponentType, useEffect, useMemo, useRef } from "react";
import { cn } from "@mikeour/ui/lib/utils";

import type {
  ControlDef,
  InferControlProps,
  InferInspectorAPI,
  InspectorDef,
  InspectorField,
  Subscribable,
  TrackRequest,
} from "../types";

type PreviewContainerProps<
  C extends readonly ControlDef[],
  I extends readonly InspectorDef[],
> = {
  Preview: ComponentType<{
    controls: InferControlProps<C>;
    inspector: InferInspectorAPI<I>;
  }>;
  controls: InferControlProps<C>;
  inspector: readonly InspectorDef[];
  setInspector: (name: string, value: string) => void;
  resetKey: number;
  mockBrowser?: boolean;
  className?: string;
};

export function PreviewContainer<
  C extends readonly ControlDef[],
  I extends readonly InspectorDef[],
>({
  Preview,
  controls,
  inspector,
  setInspector,
  resetKey,
  mockBrowser,
  className,
}: PreviewContainerProps<C, I>) {
  // Track which keys have active subscriptions to prevent duplicates
  const activeSubscriptions = useRef<Set<string>>(new Set());
  // Track requests are collected during render and processed in useEffect
  const trackRequests = useRef<TrackRequest[]>([]);

  // Build the inspector API that captures track() calls
  const inspectorAPI = useMemo(() => {
    const api: Record<string, InspectorField> = {};

    for (const item of inspector) {
      api[item.name] = {
        set: (value: string) => {
          setInspector(item.name, value);
        },
        track: <T,>(source: Subscribable<T>, format: (v: T) => string) => {
          // Skip if already tracking this key
          if (activeSubscriptions.current.has(item.name)) {
            return;
          }
          trackRequests.current.push({
            key: item.name,
            source: source as Subscribable<unknown>,
            format: format as (v: unknown) => string,
          });
        },
      };
    }

    return api as InferInspectorAPI<I>;
  }, [inspector, setInspector]);

  // Process track requests after initial render or reset
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey intentionally triggers re-subscription on demo reset
  useEffect(() => {
    // Skip if no track requests
    if (trackRequests.current.length === 0) {
      return;
    }

    const unsubscribes: (() => void)[] = [];
    const requests = [...trackRequests.current];
    const subscribedKeys: string[] = [];

    // Clear requests immediately to prevent re-processing
    trackRequests.current = [];

    for (const { key, source, format } of requests) {
      // Mark as active
      activeSubscriptions.current.add(key);
      subscribedKeys.push(key);

      // Set initial value
      setInspector(key, format(source.get()));

      // Subscribe to changes
      const unsubscribe = source.on("change", (value) => {
        setInspector(key, format(value));
      });

      unsubscribes.push(unsubscribe);
    }

    // Cleanup subscriptions on unmount or reset
    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
      // Clear active subscriptions so they can be re-registered on reset
      for (const key of subscribedKeys) {
        activeSubscriptions.current.delete(key);
      }
    };
  }, [resetKey, setInspector]);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-center",
        // mockBrowser demos fill available space (full-app previews)
        // non-mockBrowser demos are content-sized (component showcases)
        mockBrowser && "flex-1",
        className
      )}
      data-slot="demo-content"
      key={resetKey}
    >
      <div
        className={cn(
          "relative grid justify-items-center overflow-hidden rounded-lg",
          mockBrowser && "w-full border border-slate-700 bg-slate-800"
        )}
      >
        {mockBrowser && (
          <div
            className="flex w-full shrink-0 items-center gap-2 border-slate-700 border-b bg-slate-900 px-3 py-2"
            data-slot="mock-browser"
          >
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500" />
              <div className="size-3 rounded-full bg-yellow-500" />
              <div className="size-3 rounded-full bg-green-500" />
            </div>
          </div>
        )}
        <Preview controls={controls} inspector={inspectorAPI} />
      </div>
    </div>
  );
}
