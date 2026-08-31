/**
 * Konstruktionstegning af mærket.
 *
 * Tallene læses ikke ud af Logo.tsx — de er skrevet af her, fordi tegningen
 * skal vise dét, Logo.tsx netop klipper væk: banerne løber uden for
 * versalbåndet, og det er klippet, der giver de flade snit. En tegning, der
 * kun kunne vise det klippede resultat, ville ikke forklare noget.
 *
 * Ændrer geometrien sig i Logo.tsx, skal de tre baner herunder rettes med.
 */
const BANER = [
  "M11 120V-24L62 88L106 -9V120",
  "M106 -9L182 101",
  "M182 -20V120",
];
const STREG = 17;

function Streger({ farve }: { farve: string }) {
  return (
    <g
      fill="none"
      stroke={farve}
      strokeWidth={STREG}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit={8}
    >
      {BANER.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

export function Konstruktion() {
  return (
    <svg
      viewBox="-66 -52 380 220"
      role="img"
      aria-label="Konstruktionstegning af MN-mærket: tre midterlinjer streget op og klippet ved versalhøjde og grundlinje"
      className="block w-full"
    >
      <defs>
        <clipPath id="sg-versalbaand">
          <rect x="0" y="0" width="191" height="100" />
        </clipPath>
      </defs>

      {/* Først det, klippet skærer væk — det ligger bagved i hårstregsgråt. */}
      <Streger farve="var(--color-grey-800)" />

      {[
        { y: 0, navn: "Versalhøjde" },
        { y: 100, navn: "Grundlinje" },
      ].map(({ y, navn }) => (
        <g key={navn}>
          <line
            x1="-58"
            y1={y}
            x2="205"
            y2={y}
            stroke="var(--color-grey-600)"
            strokeWidth="0.7"
            strokeDasharray="4 4"
          />
          <text x="-58" y={y - 4}>
            {navn}
          </text>
        </g>
      ))}

      <line
        x1="106"
        y1="-44"
        x2="106"
        y2="142"
        stroke="var(--color-grey-600)"
        strokeWidth="0.7"
        strokeDasharray="4 4"
      />

      <g clipPath="url(#sg-versalbaand)">
        <Streger farve="var(--color-paper)" />
      </g>

      {/* Stregmålet vises på N's højre stamme, hvor der er luft til en label. */}
      <g stroke="var(--color-grey-600)" strokeWidth="0.7">
        <line x1="173.5" y1="26" x2="190.5" y2="26" />
        <line x1="173.5" y1="21" x2="173.5" y2="31" />
        <line x1="190.5" y1="21" x2="190.5" y2="31" />
        <line x1="190.5" y1="26" x2="203" y2="26" />
        <line x1="191" y1="-25" x2="203" y2="-25" />
        <line x1="191" y1="121" x2="203" y2="121" />
      </g>

      <text x="207" y="28.6">Stregmål {STREG} · 17 %</text>
      <text x="207" y="-22">Skåret af</text>
      <text x="207" y="124">Skåret af</text>
      <text x="106" y="158" textAnchor="middle">
        x = 106 · M og N deler stregen
      </text>

      <style>{`
        text {
          font-family: var(--font-mono);
          font-size: 7px;
          letter-spacing: .12em;
          text-transform: uppercase;
          fill: var(--color-grey-600);
        }
      `}</style>
    </svg>
  );
}
