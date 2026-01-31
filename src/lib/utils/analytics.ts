type EventName =
  | "chapter_started"
  | "chapter_completed"
  | "pwa_installed"
  | "chapter_downloaded";

type EventProps = Record<string, string | number | boolean>;

export function trackEvent(name: EventName, props?: EventProps): void {
  // Plausible analytics integration point
  if (typeof window !== "undefined" && "plausible" in window) {
    const w = window as Record<string, unknown>;
    if (typeof w.plausible === "function") {
      (w.plausible as (name: string, options: Record<string, unknown>) => void)(name, { props });
    }
  }
}
