"use server";

import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/content/site";

const schema = z.object({
  navn: z.string().trim().min(2, "Skriv venligst dit navn."),
  email: z.string().trim().email("Indtast en gyldig e-mailadresse."),
  virksomhed: z.string().trim().optional(),
  behov: z
    .string()
    .trim()
    .min(10, "Skriv gerne et par ord om, hvad du har brug for."),
  // Honeypot: usynligt felt som kun bots udfylder
  website: z.string().max(0).optional(),
});

export type KontaktState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"navn" | "email" | "behov", string>>;
};

export async function sendKontakt(
  _prev: KontaktState,
  formData: FormData,
): Promise<KontaktState> {
  const parsed = schema.safeParse({
    navn: formData.get("navn"),
    email: formData.get("email"),
    virksomhed: formData.get("virksomhed"),
    behov: formData.get("behov"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;

    // Honeypot udfyldt = bot. Vi svarer "success" så den ikke prøver igen.
    if (flat.website) return { status: "success" };

    return {
      status: "error",
      message: "Der mangler et par oplysninger — se de markerede felter.",
      fieldErrors: {
        navn: flat.navn?.[0],
        email: flat.email?.[0],
        behov: flat.behov?.[0],
      },
    };
  }

  const { navn, email, virksomhed, behov } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Sker kun hvis nøglen mangler i miljøet — vi lader det aldrig se ud som
    // om beskeden er sendt, for så mister Markus en reel henvendelse.
    console.error("RESEND_API_KEY mangler — henvendelsen blev ikke sendt.");
    return {
      status: "error",
      message: `Beskeden kunne ikke sendes lige nu. Skriv i stedet til ${site.email} eller ring på ${site.phone}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.KONTAKT_FRA ?? "MNmedia <kontakt@mn-media.dk>",
      to: site.email,
      replyTo: email,
      subject: `Ny henvendelse fra ${navn}${virksomhed ? ` — ${virksomhed}` : ""}`,
      text: [
        `Navn: ${navn}`,
        `E-mail: ${email}`,
        `Virksomhed: ${virksomhed || "—"}`,
        "",
        "Hvad har du brug for?",
        behov,
      ].join("\n"),
    });

    if (error) throw new Error(error.message);

    return {
      status: "success",
      message: "Tak for din henvendelse — jeg vender tilbage hurtigst muligt.",
    };
  } catch (err) {
    console.error("Kunne ikke sende kontaktformular:", err);
    return {
      status: "error",
      message: `Beskeden kunne ikke sendes lige nu. Skriv i stedet til ${site.email} eller ring på ${site.phone}.`,
    };
  }
}
