import { clsx } from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";

type Common = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

type ButtonProps = { as?: "button" } & ComponentProps<"button"> & Common;
type LinkProps = { as: "link" } & ComponentProps<typeof Link> & Common;
type Props = ButtonProps | LinkProps;

export function Button(props: Props) {
  const { variant = "primary", size = "md", className: userClassName } = props;
  const className = clsx(
    "inline-flex items-center justify-center rounded-xl font-semibold transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e77b]/30",
    size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm",
    variant === "primary" &&
      "bg-gradient-to-r from-[#00e77b] to-[#b9ff2f] text-black hover:from-[#1dff8e] hover:to-[#c8ff55] shadow-sm",
    variant === "secondary" &&
      "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    variant === "ghost" &&
      "bg-transparent text-white/85 hover:bg-white/10 hover:text-white",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "no-underline",
    userClassName,
  );

  if (props.as === "link") {
    const { as: _as, variant: _v, size: _s, className: _c, ...rest } = props;
    return <Link {...rest} className={className} />;
  }

  const { as: _as, variant: _v, size: _s, className: _c, ...rest } = props;
  return <button {...rest} className={className} />;
}

