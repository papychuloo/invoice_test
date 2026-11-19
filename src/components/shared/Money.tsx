import React from "react";
import { formatFcfa } from "@/lib/money";
import { cn } from "@/lib/utils";

interface MoneyProps {
  amount: number | bigint;
  showCurrency?: boolean;
  compact?: boolean;
  className?: string;
  currencyClassName?: string;
}

export function Money({
  amount,
  showCurrency = true,
  compact = false,
  className,
  currencyClassName,
}: MoneyProps) {
  const formatted = formatFcfa(amount, { showCurrency: false, compact });

  return (
    <span className={cn("inline-flex items-baseline font-semibold tracking-tight", className)}>
      <span>{formatted}</span>
      {showCurrency && (
        <span className={cn("ml-1.5 text-xs font-medium text-slate-500 uppercase", currencyClassName)}>
          FCFA
        </span>
      )}
    </span>
  );
}
