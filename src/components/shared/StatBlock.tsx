import type { Fakta, Ydelse } from "@/content/cases";
import { cn } from "@/lib/cn";

/** Tal + label. Bruges både på forsidens case-kort og på case-siderne. */
export function StatBlock({
  fakta,
  className,
}: {
  fakta: Fakta[];
  className?: string;
}) {
  if (fakta.length === 0) return null;

  return (
    <dl className={cn("flex flex-wrap gap-x-10 gap-y-6", className)}>
      {fakta.map((f) => (
        <div key={f.label}>
          <dt className="sr-only">{f.label}</dt>
          <dd>
            <span className="headline block text-2xl md:text-3xl">{f.tal}</span>
            <span className="label-mono mt-2 block text-grey-400">
              {f.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Små tags der viser hvilke ydelser en case omfatter. */
export function ServiceTags({ ydelser }: { ydelser: Ydelse[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {ydelser.map((y) => (
        <li
          key={y}
          className="label-mono border border-grey-800 px-3 py-1.5 text-grey-400"
        >
          {y}
        </li>
      ))}
    </ul>
  );
}
