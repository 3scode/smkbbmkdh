import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  valid?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  required = false,
  hint,
  error,
  valid = false,
  children,
  className,
}: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": describedBy || undefined,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[15px] font-semibold text-text-primary">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-error">
            *
          </span>
        )}
      </label>
      {child}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-[13px] font-medium text-error"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      {!error && valid && (
        <p className="flex items-center gap-1 text-[13px] text-success">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Terlihat bagus
        </p>
      )}
    </div>
  );
}

export const inputBaseStyles =
  "h-12 w-full rounded-sm border border-border bg-surface px-4 text-base text-text-primary placeholder:text-text-secondary transition-colors hover:border-text-secondary focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-soft disabled:bg-slate-100 disabled:text-text-secondary aria-[invalid=true]:border-error aria-[invalid=true]:bg-[#FEF2F2]";
