import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

// Padding hører til varianten, ikke basen: to konkurrerende px-utilities ville
// afgøres af rækkefølgen i det genererede stylesheet, hvilket er skrøbeligt.
//
// Samme fælde gælder display: basen sætter inline-flex, så et "hidden" sendt
// ind via className vinder ikke. Skal knappen skjules, så pak den i en
// wrapper der skjules — se Header.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Lilla er reserveret til denne ene knap — det er dét, der giver den vægt.
  primary: "bg-accent text-paper hover:bg-accent-hover px-7 py-3.5",
  secondary:
    "border border-grey-800 text-paper hover:border-grey-400 px-7 py-3.5",
  ghost: "text-grey-400 hover:text-paper py-1",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function ButtonElement({
  children,
  variant = "primary",
  className,
  ...rest
}: {
  variant?: Variant;
} & React.ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/** Pil brugt i "se alle cases"-typen links. */
export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
