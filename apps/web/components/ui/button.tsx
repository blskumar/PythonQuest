import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "quest-button",
  secondary: "secondary-button",
  quiet: "auth-link",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`${variants[variant]} ${className}`.trim()} {...props} />;
}
