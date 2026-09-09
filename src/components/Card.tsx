import type { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  title,
  eyebrow,
  right,
  children,
  className,
  padded = true,
}: {
  title?: string;
  eyebrow?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-surface border border-border shadow-card flex flex-col",
        padded && "p-5",
        className
      )}
    >
      {(title || right) && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {eyebrow && (
              <div className="text-[11px] font-mono tracking-wide uppercase text-faint mb-1">{eyebrow}</div>
            )}
            {title && <h3 className="text-[15px] font-bold text-ink">{title}</h3>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
