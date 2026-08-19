import Link from "next/link";
import { Hjoerner } from "@/components/shared/Frame";
import { cn } from "@/lib/cn";

/**
 * Wordmark. Midlertidig indtil Markus' rigtige logo lander.
 *
 * "MN" står inde i søgerens hjørnemarkører — det samme greb som ligger over
 * heroen, over case-billederne og over billedpladserne. Mærket er dermed
 * hentet fra sitets eget formsprog frem for at være en tilfældig form, og
 * "MN" i en ramme kan stå alene som favicon eller profilbillede.
 *
 * Et tegnet MN-monogram med fælles stamme blev prøvet først og skrottet:
 * de to bogstaver smeltede sammen til ét siksak, som læste "IVIVI" og ville
 * være en plet ved 15 px. Rammen løser det samme behov uden at røre
 * bogstavernes læsbarhed.
 *
 * Alt er målt i em, så ramme og ord skalerer sammen med font-size.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MNmedia — til forsiden"
      className={cn(
        "group inline-flex items-center gap-[0.42em] text-lg whitespace-nowrap",
        className,
      )}
    >
      <span className="relative inline-flex items-center px-[0.28em] py-[0.18em]">
        <span className="headline text-[1em] leading-none">MN</span>

        {/* Hjørnerne lyser op ved hover — den eneste bevægelse i mærket */}
        <Hjoerner
          size="size-[0.26em]"
          className="text-grey-400 transition-colors duration-300 group-hover:text-paper"
        />
      </span>

      <span className="headline text-[0.86em] tracking-[0.16em]">media</span>
    </Link>
  );
}
