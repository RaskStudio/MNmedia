"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendKontakt, type KontaktState } from "@/app/actions/send-kontakt";
import { ButtonElement } from "@/components/shared/Button";
import { cn } from "@/lib/cn";

const initial: KontaktState = { status: "idle" };

// Felterne er streger, ikke bokse. En understreget linje fylder mindre og
// klæder det redaktionelle udtryk bedre end fire rammer under hinanden — og
// den aktive linje er tydeligere end en ramme der skifter kant.
const felt =
  "w-full border-b bg-transparent px-0 py-3 text-base text-paper placeholder:text-grey-400 transition-colors focus:outline-none";

function Felt({
  label,
  navn,
  type = "text",
  required,
  fejl,
  autoComplete,
  rows,
}: {
  label: string;
  navn: string;
  type?: string;
  required?: boolean;
  fejl?: string;
  autoComplete?: string;
  rows?: number;
}) {
  const props = {
    id: navn,
    name: navn,
    required,
    autoComplete,
    "aria-invalid": fejl ? true : undefined,
    "aria-describedby": fejl ? `${navn}-fejl` : undefined,
    className: cn(
      felt,
      fejl ? "border-red-500/70" : "border-grey-800 focus:border-paper",
    ),
  };

  return (
    <div>
      <label htmlFor={navn} className="label-mono mb-3 block text-grey-400">
        {label}
        {!required && <span className="text-grey-400"> (valgfrit)</span>}
      </label>
      {rows ? (
        <textarea
          {...props}
          rows={rows}
          className={cn(props.className, "resize-y")}
        />
      ) : (
        <input {...props} type={type} />
      )}
      {fejl && (
        <p id={`${navn}-fejl`} className="mt-2 text-sm text-red-400">
          {fejl}
        </p>
      )}
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <ButtonElement
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto disabled:opacity-60"
    >
      {pending ? "Sender…" : "Book møde"}
    </ButtonElement>
  );
}

export function KontaktForm() {
  const [state, formAction] = useActionState(sendKontakt, initial);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border border-grey-800 bg-ink-soft p-10 text-center"
      >
        <p className="headline text-h3">Tak for din henvendelse</p>
        <p className="mt-3 text-sm text-grey-400">
          {state.message ?? "Jeg vender tilbage hurtigst muligt."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <Felt
        label="Navn"
        navn="navn"
        required
        autoComplete="name"
        fejl={state.fieldErrors?.navn}
      />
      <Felt
        label="E-mail"
        navn="email"
        type="email"
        required
        autoComplete="email"
        fejl={state.fieldErrors?.email}
      />
      <Felt label="Virksomhed" navn="virksomhed" autoComplete="organization" />
      <Felt
        label="Hvad har du brug for?"
        navn="behov"
        required
        rows={5}
        fejl={state.fieldErrors?.behov}
      />

      {/* Honeypot — skjult for mennesker, udfyldes af bots */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}

      <Submit />

      <p className="text-xs leading-relaxed text-grey-400">
        Dine oplysninger bruges udelukkende til at besvare din henvendelse og
        deles ikke med tredjepart.
      </p>
    </form>
  );
}
