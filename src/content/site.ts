export const site = {
  name: "MNmedia",
  tagline:
    "Branding, sociale medier og annoncering for virksomheder der leverer.",
  url: "https://mn-media.dk",
  email: "markus@nikolaisen.dk",
  phone: "+45 42 75 33 60",
  phoneHref: "+4542753360",
  address: {
    street: "Helgenæsgade 7, 2. th",
    postal: "8000",
    city: "Aarhus C",
    country: "Danmark",
  },
  socials: [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/mn-mediaa/" },
    { name: "Instagram", href: "https://www.instagram.com/mnmediaaa/" },
    // TODO: Facebook-URL mangler fra Markus
  ],
} as const;

export const nav = [
  { label: "Ydelser", href: "/ydelser" },
  { label: "Cases", href: "/cases" },
  { label: "Om MNmedia", href: "/om" },
] as const;
