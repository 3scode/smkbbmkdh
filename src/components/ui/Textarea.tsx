import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { inputBaseStyles } from "./Field";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, id, ...rest }, ref) => (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputBaseStyles, "h-auto min-h-[120px] py-3", className)}
      {...rest}
    />
  ),
);
Textarea.displayName = "Textarea";
