import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Logo({ className, compact = false }) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-3 text-foreground", className)}
      aria-label="Sakīna House — home"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 shrink-0 text-accent transition-transform duration-700 group-hover:rotate-45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <rect x="9.5" y="9.5" width="13" height="13" transform="rotate(0 16 16)" />
        <rect x="9.5" y="9.5" width="13" height="13" transform="rotate(45 16 16)" />
        <circle cx="16" cy="16" r="2" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] tracking-[0.22em] uppercase">
          Sakīna
        </span>
        {!compact && (
          <span className="mt-1 text-[8.5px] uppercase tracking-[0.42em] text-muted-foreground">
            House of Devotion
          </span>
        )}
      </span>
    </Link>
  );
}