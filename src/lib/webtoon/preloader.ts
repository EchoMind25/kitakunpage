const preloadedImages = new Set<string>();

export function preloadImage(src: string): Promise<void> {
  if (preloadedImages.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedImages.add(src);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function preloadPanelRange(
  panels: { src: string }[],
  startIndex: number,
  count: number
): void {
  const end = Math.min(startIndex + count, panels.length);
  for (let i = startIndex; i < end; i++) {
    preloadImage(panels[i].src);
  }
}

export function isPreloaded(src: string): boolean {
  return preloadedImages.has(src);
}
