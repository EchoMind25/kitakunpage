import type { SiteConfig } from "@/types/admin";

export const defaultConfig: SiteConfig = {
  site: {
    title: "kitakun03 Webtoon",
    tagline: "Webtoon Reader",
    description:
      "Read kitakun03's webtoon - the fastest, smoothest vertical scrolling webtoon reader.",
    logo: "",
    favicon: "/icons/favicon.svg",
  },
  author: {
    name: "kitakun03",
    bio: "Creating stories through the webtoon format. Every panel is crafted to draw you deeper into the narrative. This platform is built to deliver those panels with zero friction -- just you and the story.",
    avatar: "",
    role: "Creator & Artist",
  },
  social: {
    twitter: "",
    instagram: "",
    patreon: "",
    kofi: "",
    website: "",
  },
  theme: {
    primary: "#0d9488",
    accent: "#7f1d1d",
    background: "#0a0a0a",
    text: "#ffffff",
  },
  landing: {
    heroTitle: "kitakun03",
    heroSubtitle: "Webtoon Reader",
    heroTagline: "Scroll. Read. Immerse.",
    ctaPrimary: { text: "Start Reading", link: "/read/1" },
    ctaSecondary: { text: "Browse Chapters", link: "/chapters" },
    showStats: true,
    stats: [
      { label: "Chapters", value: "2" },
      { label: "Panels", value: "139" },
      { label: "Forever", value: "Free" },
    ],
  },
  about: {
    sections: [
      {
        id: "creator",
        title: "About the Creator",
        content:
          "Creating stories through the webtoon format. Every panel is crafted to draw you deeper into the narrative.",
        visible: true,
      },
      {
        id: "webtoon",
        title: "About the Webtoon",
        content:
          "An action-fantasy webtoon following the journey of a hero navigating between worlds of light and shadow.",
        visible: true,
      },
    ],
  },
  footer: {
    brand: "kitakun03",
    links: [
      { label: "Chapters", href: "/chapters" },
      { label: "About", href: "/about" },
    ],
    copyright: "kitakun03",
  },
  navigation: {
    showChapters: true,
    showAbout: true,
    customLinks: [],
  },
};

/** Client-side: fetch from public path */
export async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch("/webtoon/site-config.json");
    if (!res.ok) return defaultConfig;
    const config = (await res.json()) as Partial<SiteConfig>;
    return { ...defaultConfig, ...config };
  } catch {
    return defaultConfig;
  }
}
