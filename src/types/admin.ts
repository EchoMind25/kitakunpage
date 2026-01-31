export interface SiteConfig {
  site: {
    title: string;
    tagline: string;
    description: string;
    logo: string;
    favicon: string;
  };
  author: {
    name: string;
    bio: string;
    avatar: string;
    role: string;
  };
  social: {
    twitter: string;
    instagram: string;
    patreon: string;
    kofi: string;
    website: string;
  };
  theme: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    showStats: boolean;
    stats: { label: string; value: string }[];
  };
  about: {
    sections: {
      id: string;
      title: string;
      content: string;
      visible: boolean;
    }[];
  };
  footer: {
    brand: string;
    links: { label: string; href: string }[];
    copyright: string;
  };
  navigation: {
    showChapters: boolean;
    showAbout: boolean;
    customLinks: { label: string; href: string }[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalChapters: number;
  totalPanels: number;
  lastUpdated: string;
  contentSizeBytes: number;
}
