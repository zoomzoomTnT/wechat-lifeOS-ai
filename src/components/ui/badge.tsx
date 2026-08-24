import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "ink",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "ink" | "pine" | "paper" | "warn" | "ok";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tone === "ink" && "bg-ink/8 text-fg",
        tone === "pine" && "bg-accent/12 text-accent-2",
        tone === "paper" && "bg-surface-2 text-muted",
        tone === "warn" && "bg-warn/15 text-warn",
        tone === "ok" && "bg-ok/15 text-ok",
        className,
      )}
      {...props}
    />
  );
}
