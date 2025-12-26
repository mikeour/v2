"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";
import { Slider } from "@mikeour/ui/components/slider";
import { Switch } from "@mikeour/ui/components/switch";
import { cn } from "@mikeour/ui/lib/utils";
import { type HighlightedCode, Pre } from "codehike/code";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  ExternalLink,
  RotateCcw,
  Settings,
} from "lucide-react";

import { wordWrap } from "./annotations/word-wrap";

// =============================================================================
// Types
// =============================================================================

type Control =
  | { type: "switch"; name: string; label: string; defaultValue?: boolean }
  | {
      type: "slider";
      name: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      defaultValue?: number;
      unit?: string;
    };

const FORMATTERS = {
  decimal: (v: number) => v.toFixed(2),
} as const;

type Inspector = {
  name: string;
  label?: string;
  prop: string;
  format?: keyof typeof FORMATTERS;
  defaultValue?: string;
};

type ControlValues = Record<string, boolean | number>;
type InspectorValues = Record<string, string>;

// =============================================================================
// Context
// =============================================================================

type DemoContextValue = {
  id: string;
  path?: string;
  cwd?: string;
  controls?: Control[];
  inspector?: Inspector[];
  code?: HighlightedCode[];
  values: ControlValues;
  setValues: React.Dispatch<React.SetStateAction<ControlValues>>;
  inspectorValues: InspectorValues;
  inspectorProps: Record<string, (value: number) => void>;
  showCode: boolean;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
  resetKey: number;
  handleReset: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemoContext must be used within DemoRenderer");
  }
  return ctx;
}

// =============================================================================
// Root
// =============================================================================

type RootProps = {
  path?: string;
  cwd?: string;
  controls?: Control[];
  inspector?: Inspector[];
  code?: HighlightedCode[];
  children: ReactNode;
};

function Root({ path, cwd, controls, inspector, code, children }: RootProps) {
  const id = useId();
  const [resetKey, setResetKey] = useState(0);
  const [showCode, setShowCode] = useState(false);

  const getInitialControlValues = () => {
    const initial: ControlValues = {};
    for (const c of controls ?? []) {
      initial[c.name] = c.defaultValue ?? (c.type === "switch" ? false : c.min);
    }
    return initial;
  };

  const getInitialInspectorValues = () => {
    const initial: InspectorValues = {};
    for (const i of inspector ?? []) {
      initial[i.name] = i.defaultValue ?? "—";
    }
    return initial;
  };

  const [values, setValues] = useState<ControlValues>(getInitialControlValues);
  const [inspectorValues, setInspectorValues] = useState<InspectorValues>(
    getInitialInspectorValues
  );

  const handleReset = () => {
    setValues(getInitialControlValues());
    setInspectorValues(getInitialInspectorValues());
    setResetKey((k) => k + 1);
  };

  const inspectorProps: Record<string, (value: number) => void> = {};
  for (const i of inspector ?? []) {
    inspectorProps[i.prop] = (value: number) => {
      const formatter = i.format ? FORMATTERS[i.format] : String;
      setInspectorValues((prev) => ({ ...prev, [i.name]: formatter(value) }));
    };
  }

  return (
    <DemoContext.Provider
      value={{
        id,
        path,
        cwd,
        controls,
        inspector,
        code,
        values,
        setValues,
        inspectorValues,
        inspectorProps,
        showCode,
        setShowCode,
        resetKey,
        handleReset,
      }}
    >
      <figure
        className={cn(
          "code-example overflow-hidden rounded-xl bg-slate-800 lg:mx-[calc(var(--gutter)*-1.75)]",
          "grid grid-cols-1",
          // toolbar only: toolbar(auto) content(auto)
          "has-data-[slot=demo-toolbar]:grid-rows-[auto_auto]",
          // caption only: content(auto) caption(auto)
          "has-data-[slot=demo-caption]:grid-rows-[auto_auto]",
          // toolbar + caption: toolbar(auto) content(auto) caption(auto)
          "has-data-[slot=demo-toolbar]:has-data-[slot=demo-caption]:grid-rows-[auto_auto_auto]",
          // toolbar + code: toolbar(auto) content(auto) code-toolbar(auto) code-content(auto)
          "has-data-[slot=demo-toolbar]:has-data-[slot=demo-code]:grid-rows-[auto_auto_auto_auto]",
          // toolbar + code + caption: toolbar(auto) content(auto) code-toolbar(auto) code-content(auto) caption(auto)
          "has-data-[slot=demo-toolbar]:has-data-[slot=demo-code]:has-data-[slot=demo-caption]:grid-rows-[auto_auto_auto_auto_auto]"
        )}
      >
        {children}
      </figure>
    </DemoContext.Provider>
  );
}

// =============================================================================
// Toolbar (minimal - just utility buttons)
// =============================================================================

function Toolbar() {
  const { code, path, cwd, showCode, setShowCode, handleReset } =
    useDemoContext();

  const hasCode = code && code.length > 0;

  return (
    <div
      className="flex items-center justify-between gap-4 border-slate-700 border-b bg-slate-900/50 px-4 py-2"
      data-slot="demo-toolbar"
    >
      <div className="flex items-center gap-1">
        {hasCode && (
          <button
            aria-label={showCode ? "Hide code" : "Show code"}
            className={cn(
              "rounded p-1.5 transition-colors hover:bg-slate-700",
              showCode
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            )}
            onClick={() => setShowCode((s) => !s)}
            type="button"
          >
            <Code size={16} />
          </button>
        )}
        <button
          aria-label="Reset demo"
          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          onClick={handleReset}
          type="button"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex items-center">
        {path && (
          <a
            aria-label="View source on GitHub"
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            href={
              cwd
                ? `vscode://file/${cwd}/src/${path}/preview.tsx:1:1`
                : `https://github.com/mikeour/v2/tree/main/apps/www/src/${path}/preview.tsx`
            }
            target={cwd ? undefined : "_blank"}
            rel={cwd ? undefined : "noopener noreferrer"}
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Panel
// =============================================================================

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-36 flex-col gap-4 rounded-lg border border-slate-700 border-dashed bg-slate-900/95 p-3 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
        {title}
      </span>

      {children}
    </div>
  );
}

// =============================================================================
// Preview (with floating panels)
// =============================================================================

type PreviewProps = {
  Component: ComponentType;
  isolated?: boolean;
  className?: string;
  mockBrowser?: boolean;
};

function Preview({
  Component,
  isolated = true,
  className,
  mockBrowser,
}: PreviewProps) {
  const {
    id,
    controls,
    inspector,
    values,
    setValues,
    inspectorValues,
    inspectorProps,
    resetKey,
  } = useDemoContext();

  const [mobileExpanded, setMobileExpanded] = useState(false);

  const hasControls = controls && controls.length > 0;
  const hasInspector = inspector && inspector.length > 0;
  const hasInteractivity = hasControls || hasInspector;

  return (
    <div data-slot="demo-preview" className="relative">
      {/* Desktop: Three-column layout */}
      <div
        className={cn(
          "not-prose component-bg relative flex items-start justify-center gap-4",
          isolated && "px-(--gutter) py-8 sm:px-8 sm:py-10"
        )}
      >
        {/* Left panel - Controls (desktop only) */}
        {hasControls && (
          <Panel title="Controls" className={cn("hidden shrink-0 lg:flex")}>
            <div className="flex flex-col gap-3">
              {controls.map((control) => (
                <ControlRenderer
                  control={control}
                  id={`${id}-${control.name}`}
                  key={control.name}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [control.name]: v }))
                  }
                  value={values[control.name]}
                  vertical
                />
              ))}
            </div>
          </Panel>
        )}

        {/* Demo content - grows to fill available space */}
        <div
          className={cn(
            "relative overflow-hidden has-[>[data-fill-width]]:w-full",
            isolated && "rounded-lg",
            mockBrowser && "border border-slate-700 bg-slate-800",
            className
          )}
          data-slot="demo-content"
          key={resetKey}
        >
          {mockBrowser && (
            <div
              className="flex w-full items-center gap-2 border-slate-700 border-b bg-slate-900 px-3 py-2"
              data-slot="mock-browser"
            >
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
              </div>
            </div>
          )}
          <Component {...values} {...inspectorProps} />
        </div>

        {/* Right panel - Inspector (desktop only) */}
        {hasInspector && (
          <Panel title="Values" className={cn("hidden shrink-0 lg:flex")}>
            <div className="flex flex-col gap-2">
              {inspector.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-slate-400 text-xs">
                    {item.label ?? item.name}
                  </span>
                  <span className="min-w-12 rounded bg-slate-700 px-2 py-0.5 text-center font-mono text-blue-400 text-xs tabular-nums">
                    {inspectorValues[item.name]}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>

      {/* Mobile: Bottom sheet trigger */}
      {hasInteractivity && (
        <div className="lg:hidden">
          {/* Collapsed pill */}
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className={cn(
              "flex w-full items-center justify-center gap-2 border-slate-700 border-t bg-slate-900/80 px-4 py-2 text-slate-300 text-sm transition-colors hover:bg-slate-900",
              mobileExpanded && "border-b"
            )}
          >
            <Settings size={14} />
            <span>{mobileExpanded ? "Hide" : "Show"} Controls</span>
            {mobileExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
          </button>

          {/* Expanded content */}
          {mobileExpanded && (
            <div className="grid grid-cols-2 gap-4 border-slate-700 border-t bg-slate-900/95 p-4">
              {/* Controls column */}
              {hasControls && (
                <div className={cn(!hasInspector && "col-span-2")}>
                  <div className="mb-2 font-medium text-slate-500 text-xs uppercase tracking-wider">
                    Controls
                  </div>
                  <div className="flex flex-col gap-3">
                    {controls.map((control) => (
                      <ControlRenderer
                        control={control}
                        id={`${id}-mobile-${control.name}`}
                        key={control.name}
                        onChange={(v) =>
                          setValues((prev) => ({ ...prev, [control.name]: v }))
                        }
                        value={values[control.name]}
                        vertical
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inspector column */}
              {hasInspector && (
                <div className={cn(!hasControls && "col-span-2")}>
                  <div className="mb-2 font-medium text-slate-500 text-xs uppercase tracking-wider">
                    Values
                  </div>
                  <div className="flex flex-col gap-2">
                    {inspector.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-slate-400 text-xs">
                          {item.label ?? item.name}
                        </span>
                        <span className="min-w-12 rounded bg-slate-700 px-2 py-0.5 text-center font-mono text-blue-400 text-xs tabular-nums">
                          {inspectorValues[item.name]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Caption
// =============================================================================

function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption
      className="flex items-center justify-center border-slate-700 border-t bg-slate-900/30 px-4 py-2.5 text-center text-slate-400 text-sm"
      data-slot="demo-caption"
    >
      {children}
    </figcaption>
  );
}

// =============================================================================
// CodeTabs
// =============================================================================

function CodeTabs() {
  const { code, showCode } = useDemoContext();
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!code || code.length === 0 || !showCode) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="row-span-2 grid grid-rows-subgrid border-slate-700 border-t"
      data-slot="demo-code"
    >
      <div
        className="flex items-center justify-between border-slate-700 border-b bg-slate-900/50"
        data-slot="demo-code-toolbar"
      >
        <div className="flex self-stretch">
          {code.map((tab, i) => (
            <button
              className={cn(
                "px-4 py-2 text-sm transition-colors",
                activeTab === i
                  ? "border-blue-500 border-b-2 text-white"
                  : "text-slate-400 hover:text-white"
              )}
              key={tab.meta}
              onClick={() => setActiveTab(i)}
              type="button"
            >
              {tab.meta}
            </button>
          ))}
        </div>
        <button
          aria-label="Copy to clipboard"
          className="mr-2 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          onClick={handleCopy}
          type="button"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="relative">
        <Pre
          className={cn(
            "my-0! overflow-auto bg-slate-800! p-4 text-sm",
            expanded ? "max-h-none" : "max-h-80"
          )}
          code={code[activeTab]}
          handlers={[wordWrap]}
          style={code[activeTab].style}
        />
        <button
          className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-linear-to-t from-slate-800 via-slate-800/90 to-transparent py-4 text-slate-400 transition-colors hover:text-white"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <ChevronDown
            size={20}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// ControlRenderer (internal)
// =============================================================================

function ControlRenderer({
  control,
  value,
  onChange,
  id,
  vertical = false,
}: {
  control: Control;
  value: boolean | number;
  onChange: (v: boolean | number) => void;
  id: string;
  vertical?: boolean;
}) {
  if (control.type === "switch") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5",
          vertical && "flex-row-reverse justify-end"
        )}
      >
        <label className="cursor-pointer text-slate-300 text-sm" htmlFor={id}>
          {control.label}
        </label>

        <Switch
          checked={value as boolean}
          id={id}
          onCheckedChange={(c) => typeof c === "boolean" && onChange(c)}
        />
      </div>
    );
  }

  if (vertical) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-xs" htmlFor={id}>
          {control.label}
        </label>
        <div className="flex items-center gap-2">
          <Slider
            className="w-full"
            id={id}
            max={control.max}
            min={control.min}
            onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
            step={control.step ?? 1}
            value={[value as number]}
          />
          <span className="font-mono text-slate-300 text-xs tabular-nums">
            {value}
            {control.unit ?? "px"}
          </span>
        </div>
      </div>
    );
  }

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
      <span className="font-mono text-slate-300 text-sm tabular-nums">
        {value}
        {control.unit ?? "px"}
      </span>
    </div>
  );
}

// =============================================================================
// Exports
// =============================================================================

export {
  Root as DemoRoot,
  Toolbar as DemoToolbar,
  Preview as DemoPreview,
  Caption as DemoCaption,
  CodeTabs as DemoCodeTabs,
  useDemoContext,
};
