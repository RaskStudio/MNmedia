import type { IconName } from "@/components/shared/Icon";

/** De fire bokse på forsiden — kort overblik, linker videre til /ydelser */
export const serviceHighlights: {
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "SoMe-administration",
    description:
      "Vi håndterer jeres Instagram, Facebook, LinkedIn og TikTok med indhold der passer til jeres virksomhed.",
    icon: "share",
  },
  {
    title: "Video og content",
    description:
      "Vi hjælper med at lave professionelle billeder og video til jeres kanaler. Det gælder lige fra idégenerering, eksekvering og redigering.",
    icon: "camera",
  },
  {
    title: "Annoncering",
    description:
      "Vi opsætter annoncer der rammer jeres målgruppe og skaber henvendelser til jeres virksomhed.",
    icon: "target",
  },
  {
    title: "Branding",
    description:
      "Vi personliggør jeres digitale univers, så I fremstår unikke, professionelle og troværdige online.",
    icon: "spark",
  },
];

/** De tre store kort på /ydelser */
export const services: {
  title: string;
  description: string;
  items: string[];
  icon: IconName;
  /** Bygges af scripts/build-assets.mjs */
  billede: string;
}[] = [
  {
    title: "Branding & Strategi",
    description:
      "Vi hjælper med at definere virksomhedens identitet, værdier og visuelle retning.",
    items: [
      "Brandstrategi",
      "Positionering",
      "Kommunikationsretning",
      "Contentstrategi",
    ],
    icon: "spark",
    billede: "/sider/branding.webp",
  },
  {
    title: "Sociale Medier & Content",
    description:
      "Vi planlægger, producerer og publicerer content, der afspejler virksomhedens DNA.",
    items: [
      "Idéudvikling",
      "Optagelser",
      "Redigering",
      "Contentplan",
      "Sociale medier",
    ],
    icon: "camera",
    billede: "/sider/some.webp",
  },
  {
    title: "Annoncering",
    description:
      "Vi bruger annoncering til at øge synlighed, rækkevidde og skabe flere henvendelser.",
    items: [
      "Meta Ads",
      "Kampagner",
      "Leadgenerering",
      "Optimering",
      "Rapportering",
    ],
    icon: "target",
    billede: "/sider/annoncering.webp",
  },
];

/** Proces-sektionen på /ydelser — fem trin vandret */
export const process: { title: string; description: string; icon: IconName }[] =
  [
    {
      title: "Forstå virksomheden",
      description: "Vi lærer virksomheden, værdierne og målene at kende.",
      icon: "search",
    },
    {
      title: "Udvikle strategi",
      description: "Vi skaber en plan for branding, content og vækst.",
      icon: "compass",
    },
    {
      title: "Produktion",
      description: "Vi står for optagelser, redigering og eksekvering.",
      icon: "camera",
    },
    {
      title: "Synlighed",
      description: "Content kombineres med sociale medier og annoncering.",
      icon: "target",
    },
    {
      title: "Udvikling",
      description: "Vi analyserer resultaterne og optimerer løbende.",
      icon: "trend",
    },
  ];
