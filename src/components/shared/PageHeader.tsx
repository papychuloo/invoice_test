"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "emerald" | "rose" | "amber" | "slate";
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = "emerald",
  actions,
  className,
}: PageHeaderProps) {
  const badgeStyles = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    slate: "bg-slate-100 text-slate-800 border-slate-200",
  }[badgeVariant];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 animate-fade-in-up",
        className
      )}
    >
      {/* Title & Organization / Description Info */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {badgeText && (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs",
                badgeStyles
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action buttons / Filters on the right */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
