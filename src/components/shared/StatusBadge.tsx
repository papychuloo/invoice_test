import React from "react";
import { type InvoiceStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
  showDot?: boolean;
  customLabel?: string;
}

export function StatusBadge({ status, className, showDot = true, customLabel }: StatusBadgeProps) {
  const configs: Record<
    InvoiceStatus,
    { label: string; bg: string; text: string; dot: string; border: string; ring: string }
  > = {
    paid: {
      label: "Payée",
      bg: "bg-emerald-50/90",
      text: "text-emerald-900",
      dot: "bg-emerald-600",
      border: "border-2 border-emerald-500",
      ring: "ring-2 ring-emerald-500/20",
    },
    sent: {
      label: "Envoyée",
      bg: "bg-amber-50/90",
      text: "text-amber-900",
      dot: "bg-amber-600",
      border: "border-2 border-amber-500",
      ring: "ring-2 ring-amber-500/20",
    },
    overdue: {
      label: "En retard",
      bg: "bg-rose-50/90",
      text: "text-rose-900",
      dot: "bg-rose-600",
      border: "border-2 border-rose-500",
      ring: "ring-2 ring-rose-500/20",
    },
    draft: {
      label: "Brouillon",
      bg: "bg-slate-100/90",
      text: "text-slate-800",
      dot: "bg-slate-500",
      border: "border-2 border-slate-400",
      ring: "ring-2 ring-slate-400/20",
    },
  };

  const config = configs[status] || configs.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight shadow-2xs transition-all",
        config.bg,
        config.text,
        config.border,
        config.ring,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0 shadow-2xs",
            config.dot,
            status === "overdue" && "animate-pulse"
          )}
        />
      )}
      <span>{customLabel || config.label}</span>
    </span>
  );
}
