"use client";

import { cn } from "@mikeour/ui/lib/utils";

import type {
  CodeOutputDef,
  ControlDef,
  ControlValues,
  InspectorDef,
  InspectorValues,
} from "../types";
import { CodeOutputPanel } from "./code-output";
import { ControlInput } from "./control-input";

// =============================================================================
// Panel Container
// =============================================================================

type PanelProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Panel({ title, children, className }: PanelProps) {
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
// Inspector Compound Components
// =============================================================================

function InspectorRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="group flex flex-col gap-1" data-slot="inspector-root">
      {children}
    </div>
  );
}

function InspectorHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-2 group-has-data-[slot=inspector-description]:items-end"
      data-slot="inspector-header"
    >
      {children}
    </div>
  );
}

function InspectorName({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-slate-400 text-sm" data-slot="inspector-name">
      {children}
    </span>
  );
}

function InspectorValue({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="min-w-12 rounded bg-slate-700 px-2 py-0.5 text-center font-mono text-blue-400 text-sm tabular-nums"
      data-slot="inspector-value"
    >
      {children}
    </span>
  );
}

function InspectorDescription({ children }: { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <p className="text-slate-500 text-xs" data-slot="inspector-description">
      {children}
    </p>
  );
}

const Inspector = {
  Root: InspectorRoot,
  Header: InspectorHeader,
  Name: InspectorName,
  Value: InspectorValue,
  Description: InspectorDescription,
};

// =============================================================================
// Inspector List (shared between desktop and mobile)
// =============================================================================

type InspectorListProps = {
  inspector: readonly InspectorDef[];
  inspectorValues: InspectorValues;
};

function InspectorList({ inspector, inspectorValues }: InspectorListProps) {
  return (
    <div className="flex flex-col gap-2">
      {inspector.map((item) => (
        <Inspector.Root key={item.name}>
          <Inspector.Header>
            <Inspector.Name>{item.label ?? item.name}</Inspector.Name>
            <Inspector.Value>{inspectorValues[item.name]}</Inspector.Value>
          </Inspector.Header>
          <Inspector.Description>{item.description}</Inspector.Description>
        </Inspector.Root>
      ))}
    </div>
  );
}

// =============================================================================
// Controls List (shared between desktop and mobile)
// =============================================================================

type ControlsListProps = {
  controls: readonly ControlDef[];
  controlValues: ControlValues;
  onControlChange: (name: string, value: boolean | number | string) => void;
};

function ControlsList({
  controls,
  controlValues,
  onControlChange,
}: ControlsListProps) {
  return (
    <div className="flex flex-col gap-3">
      {controls.map((control) => (
        <ControlInput
          key={control.name}
          control={control}
          value={controlValues[control.name]}
          onChange={(v) => onControlChange(control.name, v)}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Mobile Section (card-like styling for mobile)
// =============================================================================

type MobileSectionProps = {
  title: string;
  children: React.ReactNode;
};

function MobileSection({ title, children }: MobileSectionProps) {
  return (
    <div
      className="flex min-w-fit flex-[1_1_45%] flex-col gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3"
      data-slot="mobile-section"
    >
      <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
        {title}
      </span>
      {children}
    </div>
  );
}

// =============================================================================
// Desktop Panels
// =============================================================================

type DesktopPanelsProps<C extends readonly ControlDef[]> = {
  controls?: C;
  controlValues: ControlValues;
  onControlChange: (name: string, value: boolean | number | string) => void;
  inspector?: readonly InspectorDef[];
  inspectorValues: InspectorValues;
  codeOutput?: CodeOutputDef<C>;
};

export function DesktopPanels<C extends readonly ControlDef[]>({
  controls,
  controlValues,
  onControlChange,
  inspector,
  inspectorValues,
  codeOutput,
}: DesktopPanelsProps<C>) {
  const hasControls = controls && controls.length > 0;
  const hasInspector = inspector && inspector.length > 0;
  const hasCodeOutput = !!codeOutput;

  if (!(hasControls || hasInspector || hasCodeOutput)) {
    return null;
  }

  return (
    <div className="hidden w-3xs shrink-0 flex-col gap-4 lg:flex">
      {hasControls && (
        <Panel title="Controls">
          <ControlsList
            controls={controls}
            controlValues={controlValues}
            onControlChange={onControlChange}
          />
        </Panel>
      )}

      {hasInspector && (
        <Panel title="Values">
          <InspectorList
            inspector={inspector}
            inspectorValues={inspectorValues}
          />
        </Panel>
      )}

      {hasCodeOutput && (
        <CodeOutputPanel config={codeOutput} controlValues={controlValues} />
      )}
    </div>
  );
}

// =============================================================================
// Mobile Panels
// =============================================================================

type MobilePanelsProps<C extends readonly ControlDef[]> = {
  controls?: C;
  controlValues: ControlValues;
  onControlChange: (name: string, value: boolean | number | string) => void;
  inspector?: readonly InspectorDef[];
  inspectorValues: InspectorValues;
  codeOutput?: CodeOutputDef<C>;
};

export function MobilePanels<C extends readonly ControlDef[]>({
  controls,
  controlValues,
  onControlChange,
  inspector,
  inspectorValues,
  codeOutput,
}: MobilePanelsProps<C>) {
  const hasControls = controls && controls.length > 0;
  const hasInspector = inspector && inspector.length > 0;
  const hasCodeOutput = !!codeOutput;

  if (!(hasControls || hasInspector || hasCodeOutput)) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-4 border-slate-700 border-t bg-slate-900/95 p-4 lg:hidden"
      data-slot="mobile-panels"
    >
      {/* Flex wrap: 2 columns by default, wraps if content needs more space */}
      <div className="flex flex-wrap gap-3">
        {hasControls && (
          <MobileSection title="Controls">
            <ControlsList
              controls={controls}
              controlValues={controlValues}
              onControlChange={onControlChange}
            />
          </MobileSection>
        )}

        {hasInspector && (
          <MobileSection title="Values">
            <InspectorList
              inspector={inspector}
              inspectorValues={inspectorValues}
            />
          </MobileSection>
        )}
      </div>

      {hasCodeOutput && (
        <CodeOutputPanel config={codeOutput} controlValues={controlValues} />
      )}
    </div>
  );
}
