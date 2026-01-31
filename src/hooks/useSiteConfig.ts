"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/types/admin";
import { fetchSiteConfig, defaultConfig } from "@/lib/config/siteConfig";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSiteConfig().then((c) => {
      setConfig(c);
      setLoaded(true);
    });
  }, []);

  return { config, loaded };
}
