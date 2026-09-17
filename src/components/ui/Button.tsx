import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-hover",
  secondary:
    "bg-secondary text-text-primary shadow-sm hover:bg-secondary-hover hover:shadow-md active:bg-secondary-hover",
  outline:
    "border border-primary bg-surface text-primary hover:bg-primary-soft active:bg-primary-soft",
  ghost: "text-primary hover:bg-primary-soft active:bg-primary-soft",
  danger: "bg-error text-white shadow-sm hover:brightness-95 active:brightness-90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-7 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      className,
      disabled,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold tracking-[0.2px] transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.96]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full sm:w-auto",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          iconPosition === "left" && icon
        )}
        {loading ? "Memuat..." : children}
        {!loading && iconPosition === "right" && icon}
      </button>
    );
  },
);
Button.displayName = "Button";
