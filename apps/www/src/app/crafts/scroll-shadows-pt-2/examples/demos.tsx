"use client";

import { useState } from "react";
import { Switch } from "@mikeour/ui/switch";
import { cn } from "@mikeour/ui/utils";

import { ExampleContainer } from "~/components/crafts/example-container";
import { ScrollAreaWithShadows } from "./scroll-area";

const ARTICLE_CONTENT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
`.trim();

const CAROUSEL_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  color: [
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-pink-500",
  ][i],
}));

export function InteractiveVerticalDemo() {
  const [shadowsEnabled, setShadowsEnabled] = useState(true);

  return (
    <ExampleContainer
      className="w-full"
      controls={
        <div className="flex items-center justify-center gap-3 py-4 text-white">
          <Switch
            checked={shadowsEnabled}
            onCheckedChange={setShadowsEnabled}
          />
          <span className="text-sm">
            Shadows {shadowsEnabled ? "On" : "Off"}
          </span>
        </div>
      }
    >
      <ScrollAreaWithShadows
        className="h-64 rounded-lg bg-slate-800"
        scrollShadow={shadowsEnabled ? "vertical" : "none"}
      >
        <div className="prose prose-invert prose-sm max-w-none p-4">
          <h3 className="mt-0 text-white">The CSS-Driven Approach</h3>
          {ARTICLE_CONTENT.split("\n\n").map((paragraph, i) => (
            <p className="text-slate-300" key={i}>
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollAreaWithShadows>
    </ExampleContainer>
  );
}

export function InteractiveHorizontalDemo() {
  const [shadowsEnabled, setShadowsEnabled] = useState(true);

  return (
    <ExampleContainer
      className="w-full"
      controls={
        <div className="flex items-center justify-center gap-3 py-4 text-white">
          <Switch
            checked={shadowsEnabled}
            onCheckedChange={setShadowsEnabled}
          />
          <span className="text-sm">
            Shadows {shadowsEnabled ? "On" : "Off"}
          </span>
        </div>
      }
    >
      <ScrollAreaWithShadows
        className="w-full rounded-lg bg-slate-800"
        orientation="horizontal"
        scrollShadow={shadowsEnabled ? "horizontal" : "none"}
      >
        <div className="flex gap-4 p-4">
          {CAROUSEL_ITEMS.map((item) => (
            <div
              className={cn(
                "flex h-32 w-40 shrink-0 items-center justify-center rounded-lg font-bold text-2xl text-white",
                item.color
              )}
              key={item.id}
            >
              {item.id}
            </div>
          ))}
        </div>
      </ScrollAreaWithShadows>
    </ExampleContainer>
  );
}

export function CSSVariablesDemo() {
  const [scrollY, setScrollY] = useState({ start: 0, end: 200 });

  return (
    <ExampleContainer
      className="w-full"
      controls={
        <div className="flex flex-col items-center gap-2 py-4 text-white sm:flex-row sm:justify-evenly">
          <div className="font-mono text-sm">
            <span className="text-slate-400">--overflow-y-start:</span>{" "}
            <span className="text-emerald-400">{scrollY.start}px</span>
          </div>
          <div className="font-mono text-sm">
            <span className="text-slate-400">--overflow-y-end:</span>{" "}
            <span className="text-emerald-400">{scrollY.end}px</span>
          </div>
        </div>
      }
    >
      <div
        className="h-64 overflow-y-auto rounded-lg bg-slate-800 p-4"
        onScroll={(e) => {
          const target = e.currentTarget;
          const start = Math.round(target.scrollTop);
          const end = Math.round(
            target.scrollHeight - target.clientHeight - target.scrollTop
          );
          setScrollY({ start, end });
        }}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <h3 className="mt-0 text-white">Scroll to see values update</h3>
          {ARTICLE_CONTENT.split("\n\n").map((paragraph, i) => (
            <p className="text-slate-300" key={i}>
              {paragraph}
            </p>
          ))}
          {ARTICLE_CONTENT.split("\n\n").map((paragraph, i) => (
            <p className="text-slate-300" key={`extra-${i}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </ExampleContainer>
  );
}

export function ComparisonDemo() {
  return (
    <ExampleContainer className="w-full">
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-center text-slate-400 text-sm">
            Part 1: Framer Motion (opacity)
          </span>
          <div className="relative h-48 overflow-y-auto rounded-lg bg-slate-800">
            {/* Simulated opacity-based shadows */}
            <div className="-mb-8 pointer-events-none sticky top-0 h-8 bg-gradient-to-b from-blue-400/30 to-transparent" />
            <div className="px-4 py-2">
              {ARTICLE_CONTENT.split("\n\n").map((p, i) => (
                <p className="mb-2 text-slate-300 text-sm" key={i}>
                  {p}
                </p>
              ))}
            </div>
            <div className="-mt-8 pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-blue-400/30 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-center text-slate-400 text-sm">
            Part 2: Base UI (data attributes)
          </span>
          <ScrollAreaWithShadows
            className="h-48 rounded-lg bg-slate-800"
            scrollShadow="vertical"
          >
            <div className="px-4 py-2">
              {ARTICLE_CONTENT.split("\n\n").map((p, i) => (
                <p className="mb-2 text-slate-300 text-sm" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </ScrollAreaWithShadows>
        </div>
      </div>
    </ExampleContainer>
  );
}
