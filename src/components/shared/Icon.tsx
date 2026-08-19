/**
 * Håndtegnede line-ikoner. Bevidst uden ikon-bibliotek: vi bruger seks stykker,
 * og en pakke på 300 kB for det ville koste mere end det smager.
 * Alle deler samme stroke-vægt, så de ser ud som ét sæt.
 */

export type IconName =
  "share" | "camera" | "target" | "spark" | "search" | "compass" | "trend";

const paths: Record<IconName, React.ReactNode> = {
  // SoMe-administration — delings-noder
  share: (
    <>
      <circle cx="17" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17" cy="18.5" r="2.5" />
      <path d="M8.2 10.8 14.8 6.7M8.2 13.2l6.6 4.1" />
    </>
  ),
  // Video og content — kamera
  camera: (
    <>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M15.5 11.2l5-2.7v7l-5-2.7z" />
    </>
  ),
  // Annoncering — skydeskive
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Branding — glimt
  spark: (
    <>
      <path d="M12 3l2.1 5.6 5.6 2.1-5.6 2.1L12 18.4l-2.1-5.6L4.3 10.7l5.6-2.1z" />
      <path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  // Proces 1 — forstå virksomheden
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </>
  ),
  // Proces 2 — udvikle strategi
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.2 8.8l-1.8 4.4-4.4 1.8 1.8-4.4z" />
    </>
  ),
  // Proces 5 — udvikling
  trend: (
    <>
      <path d="M3 16.5l5.5-5.5 3.5 3.5L21 5.5" />
      <path d="M15.5 5.5H21v5.5" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
