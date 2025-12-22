"use client";

import { useId, useState } from "react";
import { Slider } from "@mikeour/ui/components/slider";
import { Switch } from "@mikeour/ui/components/switch";
import { cn } from "@mikeour/ui/lib/utils";

type SwitchControl = {
  type: "switch";
  name: string;
  label: string;
  defaultValue?: boolean;
};

type SliderControl = {
  type: "slider";
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
};

type Control = SwitchControl | SliderControl;

type InspectorItem = {
  name: string;
  label: string;
  defaultValue?: string;
};

type ControlValues = Record<string, boolean | number>;
type InspectorValues = Record<string, string>;

type RenderProps = {
  values: ControlValues;
  inspector: InspectorValues;
  setInspector: (name: string, value: string) => void;
};

type ExampleContainerProps = {
  isolated?: boolean;
  className?: string;
  controls?: Control[];
  inspector?: InspectorItem[];
  caption?: string;
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode);
};

export function ExampleContainer({
  isolated = true,
  className,
  controls,
  inspector,
  caption,
  children,
}: ExampleContainerProps) {
  const id = useId();

  const [controlValues, setControlValues] = useState<ControlValues>(() => {
    const initial: ControlValues = {};
    for (const control of controls ?? []) {
      if (control.type === "switch") {
        initial[control.name] = control.defaultValue ?? false;
      } else if (control.type === "slider") {
        initial[control.name] = control.defaultValue ?? control.min;
      }
    }
    return initial;
  });

  const [inspectorValues, setInspectorValues] = useState<InspectorValues>(
    () => {
      const initial: InspectorValues = {};
      for (const item of inspector ?? []) {
        initial[item.name] = item.defaultValue ?? "—";
      }
      return initial;
    }
  );

  const setInspector = (name: string, value: string) => {
    setInspectorValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderProps: RenderProps = {
    values: controlValues,
    inspector: inspectorValues,
    setInspector,
  };

  const hasControls = controls && controls.length > 0;
  const hasInspector = inspector && inspector.length > 0;
  const hasToolbar = hasControls || hasInspector;

  return (
    <figure
      className={cn(
        "grid grid-cols-1 grid-rows-[auto]", // default fallback
        "has-data-[slot=example-toolbar]:grid-rows-[1fr_auto]",
        "has-data-[slot=example-caption]:grid-rows-[auto_1fr]",
        "has-data-[slot=example-toolbar]:has-data-[slot=example-caption]:grid-rows-[1fr_auto_1fr]",
        "code-example overflow-hidden rounded-xl bg-slate-800",
        "lg:mx-[calc(var(--gutter)*-1.75)]"
      )}
    >
      {/* Toolbar - controls left, inspector right */}
      {hasToolbar && (
        <div
          className="flex flex-wrap items-center justify-center gap-4 border-slate-700 border-b bg-slate-900/50 px-4 py-3"
          data-slot="example-toolbar"
        >
          {/* Controls */}
          {hasControls ? (
            <div className="flex flex-wrap items-center gap-5">
              {controls.map((control) => (
                <ControlRenderer
                  control={control}
                  id={`${id}-${control.name}`}
                  key={control.name}
                  onChange={(value) =>
                    setControlValues((prev) => ({
                      ...prev,
                      [control.name]: value,
                    }))
                  }
                  value={controlValues[control.name]}
                />
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Inspector - visual cards */}
          {hasInspector && (
            <div className="flex flex-wrap items-center gap-3">
              {inspector.map((item) => (
                <div
                  className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5"
                  key={item.name}
                >
                  <span className="text-base text-slate-300">{item.label}</span>
                  <span className="min-w-8 rounded bg-slate-700 px-2 py-0.5 text-center font-mono text-blue-400 text-sm tabular-nums">
                    {inspectorValues[item.name]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Demo content */}
      <div
        className={cn(
          "not-prose component-bg relative flex items-center justify-center",
          isolated && "px-(--gutter) py-8 sm:py-12"
        )}
        data-slot="example-content"
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isolated && "rounded-lg",
            className
          )}
          data-slot="example-content-inner"
        >
          {typeof children === "function" ? children(renderProps) : children}
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <figcaption
          className="flex basis-full items-center justify-center border-slate-700 border-t bg-slate-900/30 px-4 py-2.5 text-center text-slate-400 text-sm"
          data-slot="example-caption"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ControlRenderer({
  control,
  value,
  onChange,
  id,
}: {
  control: Control;
  value: boolean | number;
  onChange: (value: boolean | number) => void;
  id: string;
}) {
  if (control.type === "switch") {
    return (
      <div className="flex items-center gap-2.5">
        <Switch
          checked={value as boolean}
          id={id}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              onChange(checked);
            }
          }}
        />
        <label className="cursor-pointer text-slate-300 text-sm" htmlFor={id}>
          {control.label}
        </label>
      </div>
    );
  }

  if (control.type === "slider") {
    return (
      <div className="flex items-center gap-2.5">
        <label className="shrink-0 text-slate-400 text-sm" htmlFor={id}>
          {control.label}
        </label>
        <Slider
          className="w-20"
          id={id}
          max={control.max}
          min={control.min}
          onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
          step={control.step ?? 1}
          value={[value as number]}
        />
        <span className="min-w-10 font-mono text-slate-300 text-sm tabular-nums">
          {value}
          {control.unit ?? "px"}
        </span>
      </div>
    );
  }

  return null;
}
