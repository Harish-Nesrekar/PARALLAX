import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  arrow?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  className,
  ...props
}: Props) {
  return (
    <Link
      href={href}
      className={cn("button", `button-${variant}`, className)}
      {...props}
    >
      <span>{children}</span>
      {arrow && <ArrowUpRight size={16} strokeWidth={1.7} />}
    </Link>
  );
}
