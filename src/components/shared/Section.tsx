import { cn } from "@/lib/cn";

/**
 * Én sektions-primitiv for hele sitet. Al vertikal luft styres herfra, så
 * rytmen aldrig driver fra hinanden på tværs af de fem sider.
 */
export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  container = true,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "footer" | "header";
  container?: boolean;
}) {
  return (
    <Tag id={id} className={cn("py-section", className)}>
      {container ? (
        <div className="mx-auto w-full max-w-320 px-6 md:px-10">{children}</div>
      ) : (
        children
      )}
    </Tag>
  );
}

/**
 * Sektionsmarkør. Mono-label efterfulgt af en hårstreg der løber ud til kanten
 * af kolonnen — samme markering som et klip får på en tidslinje. Den bærer
 * strukturen på alle fem sider, så rytmen genkendes fra side til side.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label-mono mb-6 flex items-center gap-4 text-grey-400",
        className,
      )}
    >
      {children}
      <span aria-hidden className="h-px flex-1 bg-grey-800" />
    </p>
  );
}
