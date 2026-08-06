import React from "react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
  icon?: string;
  iconFill?: boolean;
  href?: string;
}

export default function NeonButton({
  children,
  variant = "primary",
  icon,
  iconFill = false,
  className,
  href,
  ...props
}: NeonButtonProps) {
  const baseStyles = "group inline-flex items-center justify-between gap-4 pl-6 pr-2 py-2 rounded-full font-meta-mono text-meta-mono transition-premium tracking-wider uppercase active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-glow-purple shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]",
    secondary: "bg-secondary text-white hover:bg-glow-blue shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/30"
  };

  const iconVariants = {
    primary: "bg-white/20 text-white",
    secondary: "bg-white/20 text-white",
    glass: "bg-white/10 text-white"
  };

  const content = (
    <>
      <span className="py-1">{children}</span>
      {icon && (
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-full transition-premium group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105", iconVariants[variant])}>
          <span 
            className="material-symbols-outlined text-[18px]" 
            style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
        </div>
      )}
      {!icon && (
        <div className="w-2" />
      )}
    </>
  );

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
