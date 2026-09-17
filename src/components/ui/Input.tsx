import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { inputBaseStyles } from "./Field";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, id, ...rest }, ref) => (
    <input
      ref={ref}
      id={id}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputBaseStyles, className)}
      {...rest}
    />
  ),
);
Input.displayName = "Input";
