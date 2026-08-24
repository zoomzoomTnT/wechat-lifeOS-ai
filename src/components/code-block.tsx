import { useState } from "react";
import { cn } from "@/lib/cn";

export function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-ink text-paper shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <button
        type="button"
        className="absolute right-2 top-2 h-9 rounded-md px-3 text-xs text-paper/70 hover:text-paper"
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? "已复制" : "复制"}
      </button>
      <pre className="overflow-x-auto p-4 pr-16 font-mono text-[13px] leading-relaxed text-paper/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
