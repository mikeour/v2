"use client";

import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@mikeour/ui/components/tooltip";
import { cn } from "@mikeour/ui/lib/utils";
import { Code, ExternalLink, RotateCcw } from "lucide-react";

type ToolbarProps = {
  showCode: boolean;
  onToggleCode: () => void;
  onReset: () => void;
  hasCode: boolean;
  /** Pre-computed source URL (VSCode or GitHub) */
  sourceUrl?: string;
};

export function Toolbar({
  showCode,
  onToggleCode,
  onReset,
  hasCode,
  sourceUrl,
}: ToolbarProps) {
  // Determine if this is a local VSCode link or external GitHub link
  const isVSCode = sourceUrl?.startsWith("vscode://");

  return (
    <div
      className="flex items-center justify-between gap-4 border-slate-700 border-b bg-slate-900/50 px-4 py-2"
      data-slot="demo-toolbar"
    >
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {hasCode && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      "rounded p-1.5 transition-colors hover:bg-slate-700",
                      showCode
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                    onClick={onToggleCode}
                  />
                }
              >
                <Code size={16} />
              </TooltipTrigger>
              <TooltipPopup side="top">
                {showCode ? "Hide code" : "Show code"}
              </TooltipPopup>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  onClick={onReset}
                />
              }
            >
              <RotateCcw size={16} />
            </TooltipTrigger>
            <TooltipPopup side="top">Reset demo</TooltipPopup>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          {sourceUrl && (
            <Tooltip>
              <TooltipTrigger
                render={
                  // biome-ignore lint/a11y/useAnchorContent: Icon content is injected by TooltipTrigger via render prop
                  <a
                    aria-label={
                      isVSCode ? "Open in VS Code" : "View source on GitHub"
                    }
                    className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                    href={sourceUrl}
                    target={isVSCode ? undefined : "_blank"}
                    rel={isVSCode ? undefined : "noopener noreferrer"}
                  />
                }
              >
                <ExternalLink size={16} />
              </TooltipTrigger>
              <TooltipPopup side="top">
                {isVSCode ? "Open in VS Code" : "View source on GitHub"}
              </TooltipPopup>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
