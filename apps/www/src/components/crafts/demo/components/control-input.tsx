"use client";

import { useId } from "react";
import { Slider } from "@mikeour/ui/components/slider";
import { Switch } from "@mikeour/ui/components/switch";
import { cn } from "@mikeour/ui/lib/utils";

import type { ControlDef } from "../types";

type ControlInputProps = {
  control: ControlDef;
  value: boolean | number | string;
  onChange: (value: boolean | number | string) => void;
};

export function ControlInput({ control, value, onChange }: ControlInputProps) {
  const id = useId();

  switch (control.type) {
    case "switch":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row-reverse items-center justify-end gap-2.5">
            <label
              className="cursor-pointer text-slate-300 text-sm"
              htmlFor={id}
            >
              {control.label ?? control.name}
            </label>
            <Switch
              id={id}
              checked={value as boolean}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && onChange(checked)
              }
            />
          </div>
          {control.description && (
            <p className="text-slate-500 text-xs">{control.description}</p>
          )}
        </div>
      );

    case "slider":
      return (
        <div className="flex flex-col gap-3">
          {/* Header row: label + value badge */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-slate-400 text-sm" htmlFor={id}>
              {control.label ?? control.name}
            </label>
            <span className="min-w-12 rounded bg-slate-700 px-2 py-0.5 text-center font-mono text-blue-400 text-sm tabular-nums">
              {value}
              {control.unit ?? ""}
            </span>
          </div>
          {/* Slider on its own row */}
          <Slider
            id={id}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={[value as number]}
            onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
          />
          {control.description && (
            <p className="text-slate-500 text-xs">{control.description}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs" htmlFor={id}>
            {control.label ?? control.name}
          </label>
          <select
            id={id}
            className={cn(
              "rounded border border-slate-600 bg-slate-800 px-2 py-1",
              "text-slate-300 text-sm",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            )}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
          >
            {control.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {control.description && (
            <p className="text-slate-500 text-xs">{control.description}</p>
          )}
        </div>
      );

    default: {
      const _exhaustive: never = control;
      throw new Error(`Unknown control type: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
