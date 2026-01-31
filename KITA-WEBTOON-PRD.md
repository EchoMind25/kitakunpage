# **PRD: kitakun03 Webtoon Platform**
**Project Code**: KITA-WEBTOON  
**Version**: 2.0 - Vertical Scroll, Infinite Scale  
**Owner**: Braxton  
**Status**: Pre-Development  
**Last Updated**: January 30, 2026

---

## **1. EXECUTIVE SUMMARY**

### **1.1 Vision**
Build the fastest, smoothest vertical scrolling webtoon reader that scales to hundreds of chapters and thousands of panels without breaking a sweat. Zero loading screens, zero jank, zero complexity—just pure reading flow.

### **1.2 Core Objectives**
- **Infinite Vertical Scroll**: Seamless reading within chapters, never break immersion
- **Scale to Maximum**: Architecture handles 500+ chapters, 50,000+ panels efficiently
- **Performance**: 60fps scroll on mid-range devices, sub-1.5s initial load
- **Mobile-First PWA**: Installable, offline chapters, home screen worthy
- **Memory Efficient**: Read for hours without browser slowdown or crashes

### **1.3 Non-Goals (v1.0)**
- User accounts / authentication
- Comments / community features
- Multi-webtoon platform
- Creator dashboard / CMS
- Monetization (ads, subscriptions)
- Social sharing beyond basic Open Graph

---

## **2. TECHNICAL ARCHITECTURE**

### **2.1 Technology Stack**

```
Frontend Framework:    Next.js 14+ (App Router, React Server Components)
Virtual Scrolling:     TanStack Virtual (react-virtual) v3+
State Management:      Zustand v4+ (global state)
Persistence:           IndexedDB (Dexie.js) for reading progress
Styling:               Tailwind CSS v3+
Image Optimization:    Sharp (build-time) + Cloudflare Images (runtime)
Hosting:               Vercel Edge Network (or Cloudflare Pages)
CDN:                   Cloudflare Images + R2 Storage
PWA:                   Workbox v7+ (service worker)
Analytics:             Plausible (self-hosted or cloud, privacy-first)
Monitoring:            Sentry (error tracking, performance monitoring)
```

**Stack Rationale:**

| Technology | Why This Choice |
|------------|-----------------|
| **TanStack Virtual** | Only renders visible panels + buffer. Handles 10,000+ panels without DOM bloat. Critical for webtoon scroll. |
| **Next.js App Router** | Server Components reduce client JS. Streaming SSR for faster initial load. |
| **IndexedDB (Dexie)** | Store reading position offline. No 5MB localStorage limit. Supports offline chapter downloads. |
| **Cloudflare Images** | Auto-resize, auto-format (WebP/AVIF), global CDN. $1/100k requests. Better than self-hosting images. |
| **Zustand** | Lightweight (1KB), zero boilerplate. Perfect for scroll position, chapter state. |
| **No Framer Motion** | Animation libs kill scroll performance. CSS-only transitions. |

### **2.2 File Structure**

```
kitakun03-webtoon/
├─ public/
│  ├─ webtoon/
│  │  ├─ chapters/
│  │  │  ├─ 001/
│  │  │  │  ├─ panels/
│  │  │  │  │  ├─ 001.webp
│  │  │  │  │  ├─ 002.webp
│  │  │  │  │  └─ ...
│  │  │  │  └─ metadata.json
│  │  │  ├─ 002/
│  │  │  │  └─ ...
│  │  │  └─ ...
│  │  ├─ thumbnails/
│  │  │  ├─ chapter-001.webp
│  │  │  └─ ...
│  │  └─ index.json          # Master chapter index
│  ├─ fonts/
│  ├─ icons/
│  └─ manifest.json          # PWA manifest
├─ src/
│  ├─ app/
│  │  ├─ (routes)/
│  │  │  ├─ read/
│  │  │  │  └─ [chapter]/
│  │  │  │     └─ page.tsx   # Main reader
│  │  │  ├─ chapters/
│  │  │  │  └─ page.tsx      # Chapter browser
│  │  │  └─ about/
│  │  │     └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx            # Landing/latest chapter
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ reader/
│  │  │  ├─ VirtualPanelList.tsx      # Core virtualized scroller
│  │  │  ├─ PanelImage.tsx            # Optimized panel component
│  │  │  ├─ ChapterDivider.tsx        # Visual chapter separator
│  │  │  ├─ ScrollProgress.tsx        # Reading progress bar
│  │  │  └─ ChapterEndCard.tsx        # Next/prev chapter CTA
│  │  ├─ navigation/
│  │  │  ├─ HeaderOverlay.tsx         # Auto-hide header
│  │  │  ├─ ChapterDrawer.tsx         # Chapter list drawer
│  │  │  └─ QuickNav.tsx              # Jump to top/bottom
│  │  ├─ chapters/
│  │  │  ├─ ChapterGrid.tsx
│  │  │  └─ ChapterCard.tsx
│  │  └─ ui/
│  │     ├─ Button.tsx
│  │     ├─ Spinner.tsx
│  │     └─ ErrorBoundary.tsx
│  ├─ lib/
│  │  ├─ webtoon/
│  │  │  ├─ virtualScroll.ts          # Virtual scroll config
│  │  │  ├─ preloader.ts              # Image preloading strategy
│  │  │  ├─ memoryManager.ts          # Cleanup unused panels
│  │  │  └─ chapterLoader.ts          # Load metadata
│  │  ├─ storage/
│  │  │  ├─ db.ts                     # IndexedDB setup (Dexie)
│  │  │  ├─ readingProgress.ts        # Save/load scroll position
│  │  │  └─ offlineCache.ts           # SW cache operations
│  │  └─ utils/
│  │     ├─ imageOptimizer.ts
│  │     └─ analytics.ts
│  ├─ hooks/
│  │  ├─ useInfiniteScroll.ts
│  │  ├─ useReadingProgress.ts
│  │  ├─ useKeyboardNav.ts
│  │  └─ useSwipeGesture.ts
│  ├─ store/
│  │  └─ readerStore.ts               # Zustand store
│  └─ types/
│     ├─ webtoon.ts
│     └─ index.ts
├─ scripts/
│  ├─ optimize-chapter.js             # Image processing automation
│  ├─ generate-thumbnails.js
│  └─ validate-metadata.js
├─ public/
│  └─ sw.js                           # Service worker
├─ next.config.js
├─ tailwind.config.js
└─ package.json
```

### **2.3 Data Schema**

#### **Master Index** (`/public/webtoon/index.json`)
```json
{
  "webtoon": {
    "title": "Webtoon Title",
    "author": "kitakun03",
    "description": "Brief description of the webtoon",
    "genre": ["Action", "Fantasy"],
    "status": "ongoing",
    "publishedDate": "2026-02-01",
    "updatedDate": "2026-01-30",
    "totalChapters": 145,
    "coverImage": "/webtoon/cover.webp",
    "chapters": [
      {
        "id": 1,
        "title": "Chapter 1: The Beginning",
        "publishDate": "2026-02-01",
        "panelCount": 67,
        "thumbnail": "/webtoon/thumbnails/chapter-001.webp",
        "status": "published"
      },
      {
        "id": 2,
        "title": "Chapter 2: Rising Action",
        "publishDate": "2026-02-08",
        "panelCount": 72,
        "thumbnail": "/webtoon/thumbnails/chapter-002.webp",
        "status": "published"
      }
    ]
  },
  "version": "2.0",
  "lastBuildDate": "2026-01-30T10:00:00Z"
}
```

#### **Chapter Metadata** (`/public/webtoon/chapters/001/metadata.json`)
```json
{
  "chapterId": 1,
  "title": "Chapter 1: The Beginning",
  "publishDate": "2026-02-01",
  "panels": [
    {
      "id": 1,
      "filename": "001.webp",
      "width": 800,
      "height": 1200,
      "fileSize": 145600,
      "blurHash": "LGF5]+Yk^6#M@-5c,1J5@[or[Q6."
    },
    {
      "id": 2,
      "filename": "002.webp",
      "width": 800,
      "height": 2400,
      "fileSize": 287300,
      "blurHash": "L6Pj0^jE.AyE_3t7t7R**0o#DgR4"
    }
  ],
  "totalPanels": 67,
  "estimatedReadTime": 12,
  "prevChapter": null,
  "nextChapter": 2,
  "author": "kitakun03",
  "notes": "Optional author notes"
}
```

#### **IndexedDB Schema** (Dexie.js)
```typescript
// Reading progress database
const db = new Dexie('KitaWebtoonDB');

db.version(1).stores({
  readingProgress: 'chapterId, scrollPosition, timestamp, panelIndex',
  offlineChapters: 'chapterId, downloadedAt, expiresAt, data',
  settings: 'key, value'
});

// Example record
{
  chapterId: 5,
  scrollPosition: 3456,        // Pixels from top
  panelIndex: 23,              // Current panel in view
  timestamp: 1706620800000,    // Last read timestamp
  completionPercent: 34.2      // % through chapter
}
```

---

## **3. CORE FEATURES**

### **3.1 Infinite Vertical Scroll Reader**

#### **Implementation: Virtual Scrolling**

**Why Virtual Scrolling:**
- Rendering all panels in DOM = 50,000+ nodes = browser crash
- Virtual scrolling = render only visible panels + buffer (30-50 nodes max)
- User scrolls through 500 panels, browser only ever renders ~40

**TanStack Virtual Configuration:**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: panels.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: (index) => {
    // Dynamic height based on panel metadata
    return panels[index].height || 1200;
  },
  overscan: 5,  // Render 5 panels above/below viewport
  measureElement: (element) => element.getBoundingClientRect().height,
});
```

#### **Scroll Behavior**
```
User viewport:
┌────────────────────┐
│   Panel 23 (full)  │ ← Rendered
│   Panel 24 (full)  │ ← Rendered
│   Panel 25 (part)  │ ← Rendered (overscan)
└────────────────────┘
     Panel 26         ← Rendered (overscan)
     Panel 27         ← Rendered (overscan)
     Panel 28         ← Not rendered (unmounted)
     ...
```

**Performance Target:**
- 60fps smooth scroll on iPhone 12 / Pixel 5
- No jank on rapid scroll (fling)
- Scroll position restore on navigation (back button)

#### **Panel Loading Strategy**

**1. Initial Load (Chapter Opens):**
```
Load immediately:
- Panel 1-3 (first screen)
- BlurHash placeholders for panels 4-10

Preload (low priority):
- Panels 4-10 (next screens)

Do not load:
- Panels 11+ until scroll approaches
```

**2. Progressive Loading (As User Scrolls):**
```typescript
// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const panelId = entry.target.dataset.panelId;
      loadPanelImage(panelId);
      
      // Preload next 5 panels
      preloadPanels(panelId + 1, panelId + 5);
      
      // Unload panels far behind (memory management)
      unloadPanels(panelId - 20, panelId - 10);
    }
  });
}, {
  root: null,
  rootMargin: '200% 0px 200% 0px',  // Load 2 screens ahead/behind
  threshold: 0.01
});
```

**3. Memory Management:**
```typescript
// Unload panels that are 20+ positions behind scroll
function cleanupDistantPanels(currentPanelIndex: number) {
  const panelsToCleanup = loadedPanels.filter(
    p => Math.abs(p.index - currentPanelIndex) > 20
  );
  
  panelsToCleanup.forEach(panel => {
    // Remove from DOM (virtual scroller handles this)
    // Clear image blob URLs
    if (panel.blobUrl) {
      URL.revokeObjectURL(panel.blobUrl);
    }
    // Mark as unloaded in state
    markPanelUnloaded(panel.id);
  });
}
```

#### **Scroll Performance Optimization**

**CSS Optimizations:**
```css
/* Enable GPU acceleration */
.panel-container {
  will-change: transform;
  transform: translateZ(0);
  contain: layout style paint;
}

/* Prevent layout thrashing */
.panel-image {
  content-visibility: auto;
  contain-intrinsic-size: 800px 1200px;
}

/* Smooth scroll */
.scroll-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

**React Optimizations:**
```typescript
// Memoize panel components
const PanelImage = memo(({ panel }) => {
  return (
    <div className="panel-wrapper" style={{ height: panel.height }}>
      <img 
        src={panel.src}
        alt={`Panel ${panel.id}`}
        loading="lazy"
        decoding="async"
        style={{ contentVisibility: 'auto' }}
      />
    </div>
  );
});
```

### **3.2 Chapter Dividers**

**Visual Separator Between Chapters:**
```
┌────────────────────┐
│   Panel 67         │ ← End of Chapter 1
├────────────────────┤
│  CHAPTER 1 END     │ ← Divider
│  ━━━━━━━━━━━━━━━   │
│  [Continue to Ch2] │
│  [Back to Chapters]│
├────────────────────┤
│   Panel 1          │ ← Start of Chapter 2
└────────────────────┘
```

**Implementation:**
```typescript
// Detect chapter boundaries in virtual list
{virtualizer.getVirtualItems().map((virtualRow) => {
  const panel = panels[virtualRow.index];
  
  return (
    <div key={virtualRow.key} ref={virtualRow.measureElement}>
      {panel.isChapterStart && (
        <ChapterDivider 
          chapterNum={panel.chapterId}
          title={panel.chapterTitle}
          onContinue={() => scrollToPanel(virtualRow.index)}
        />
      )}
      <PanelImage panel={panel} />
    </div>
  );
})}
```

### **3.3 Navigation UI**

#### **Auto-Hide Header**
```
Default state (on load):
┌────────────────────────────┐
│ [☰] Chapter 5  [⋮] Settings│ ← Visible 3s
└────────────────────────────┘

User scrolls down:
┌────────────────────────────┐
│                            │ ← Hidden
└────────────────────────────┘

User scrolls up slightly or taps top:
┌────────────────────────────┐
│ [☰] Chapter 5  [⋮] Settings│ ← Reappears
└────────────────────────────┘
```

**Scroll Detection:**
```typescript
const [isHeaderVisible, setIsHeaderVisible] = useState(true);
let lastScrollY = 0;

const handleScroll = throttle(() => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY < 100) {
    setIsHeaderVisible(true);  // Always show near top
  } else if (currentScrollY > lastScrollY) {
    setIsHeaderVisible(false); // Scrolling down
  } else {
    setIsHeaderVisible(true);  // Scrolling up
  }
  
  lastScrollY = currentScrollY;
}, 100);
```

#### **Chapter Drawer**

**Slide-in drawer from left:**
```
┌─────────────┬────────────────┐
│ CHAPTERS    │                │
│ ┌─────────┐ │   Panel 45     │
│ │ Ch 1    │ │                │
│ │ Ch 2    │ │   Panel 46     │
│ │ Ch 3 ⭐ │ │                │
│ │ Ch 4    │ │   Panel 47     │
│ │ Ch 5 ●  │ │                │
│ └─────────┘ │                │
└─────────────┴────────────────┘
  ← Current       ⭐ = Unread
                  ● = Reading
```

**Features:**
- Tap chapter → instant jump to top of that chapter
- Current reading position indicator
- Unread badge
- Swipe from left edge to open

#### **Progress Indicator**

**Thin bar at top:**
```
[━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ] 68%
 ↑ Progress through current chapter
```

**Implementation:**
```typescript
const progressPercent = (currentPanelIndex / totalPanels) * 100;

<div className="progress-bar-container">
  <div 
    className="progress-bar-fill"
    style={{ width: `${progressPercent}%` }}
  />
</div>
```

### **3.4 Reading Progress Persistence**

#### **Auto-Save Scroll Position**

**Behavior:**
- Save scroll position every 2 seconds while reading
- Save on chapter navigation
- Save on page close/refresh
- Restore position on return

**Implementation:**
```typescript
import { useDebouncedCallback } from 'use-debounce';

const saveProgress = useDebouncedCallback(async (chapterId, scrollPos, panelIndex) => {
  await db.readingProgress.put({
    chapterId,
    scrollPosition: scrollPos,
    panelIndex,
    timestamp: Date.now(),
    completionPercent: (panelIndex / totalPanels) * 100
  });
}, 2000);

// On scroll
useEffect(() => {
  const handleScroll = () => {
    const scrollPos = window.scrollY;
    const currentPanel = getCurrentPanelInView();
    
    saveProgress(chapterId, scrollPos, currentPanel.index);
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [chapterId]);

// On load - restore position
useEffect(() => {
  const restorePosition = async () => {
    const saved = await db.readingProgress.get(chapterId);
    if (saved) {
      window.scrollTo(0, saved.scrollPosition);
    }
  };
  
  restorePosition();
}, [chapterId]);
```

#### **Continue Reading**

**Landing page shows last-read chapter:**
```
┌────────────────────────────┐
│  Welcome back!             │
│                            │
│  Continue Reading:         │
│  ┌──────────────────────┐  │
│  │ Chapter 5            │  │
│  │ 68% complete         │  │
│  │ [Continue →]         │  │
│  └──────────────────────┘  │
│                            │
│  Latest Chapter:           │
│  ┌──────────────────────┐  │
│  │ Chapter 12 (NEW)     │  │
│  │ [Read →]             │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

### **3.5 Chapter Browser**

**Grid Layout (Mobile):**
```
┌─────────┬─────────┐
│ Ch 1    │ Ch 2    │
│ [thumb] │ [thumb] │
│ 67 pnls │ 72 pnls │
│ Feb 1   │ Feb 8   │
├─────────┼─────────┤
│ Ch 3    │ Ch 4    │
│ [thumb] │ [thumb] │
│ ● 45%   │ ✓ Read  │
│ Feb 15  │ Feb 22  │
└─────────┴─────────┘
```

**Sort/Filter (v1.1):**
- Newest first (default)
- Oldest first
- Unread only
- Completed only

**Thumbnail Generation:**
```bash
# Auto-generate from first panel
sharp input/001.webp \
  --resize 400 600 \
  --extract top \
  --webp quality=80 \
  --output thumbnails/chapter-001.webp
```

---

## **4. PERFORMANCE REQUIREMENTS**

### **4.1 Core Web Vitals**

| Metric | Target | Critical | Measurement |
|--------|--------|----------|-------------|
| **LCP (Largest Contentful Paint)** | < 1.5s | Yes | First panel loads |
| **FID (First Input Delay)** | < 50ms | Yes | Header tap response |
| **CLS (Cumulative Layout Shift)** | < 0.05 | Yes | No panel size jumps |
| **INP (Interaction to Next Paint)** | < 100ms | Yes | Scroll smoothness |
| **TTFB (Time to First Byte)** | < 400ms | No | Edge cache hit |

### **4.2 Scroll Performance**

**Frame Rate:**
- Target: 60fps (16.67ms per frame)
- Minimum: 30fps on low-end devices
- Measurement: Chrome DevTools Performance profiler

**Scroll Jank Prevention:**
```typescript
// Bad - blocks main thread
window.addEventListener('scroll', () => {
  updateProgressBar();  // Expensive DOM operation
  saveScrollPosition(); // Database write
});

// Good - debounced + RAF
window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    updateProgressBar();  // Batched with paint
  });
  
  debouncedSave();  // Throttled DB write
});
```

### **4.3 Image Loading Performance**

**Load Time Targets:**
```
First panel (viewport):     < 500ms (3G)
Next 3 panels (preload):    < 1s (3G)
Thumbnail grid:             < 800ms for 20 thumbs
```

**Image Optimization Pipeline:**
```bash
# Original: 2000x3000px PNG (4.2MB)
# Step 1: Resize to max 800px width
# Step 2: Convert to WebP (quality 85)
# Step 3: Generate AVIF fallback (quality 80)
# Result: 800x1200px WebP (145KB) - 97% reduction
```

**Responsive Images:**
```html
<picture>
  <source 
    type="image/avif" 
    srcset="panel-001.avif"
  />
  <source 
    type="image/webp" 
    srcset="panel-001.webp"
  />
  <img 
    src="panel-001.jpg"
    alt="Panel 1"
    loading="lazy"
    decoding="async"
    width="800"
    height="1200"
  />
</picture>
```

### **4.4 Memory Management**

**Memory Budget:**
```
Initial page load:     < 50MB heap
After reading 5 chapters:   < 150MB heap
After 1 hour reading:       < 200MB heap
```

**Memory Leak Prevention:**
```typescript
// Unload images outside viewport
useEffect(() => {
  const cleanup = setInterval(() => {
    const activePanels = getVisiblePanelIds();
    const loadedPanels = getAllLoadedPanels();
    
    loadedPanels.forEach(panel => {
      if (!activePanels.includes(panel.id)) {
        if (panel.blobUrl) {
          URL.revokeObjectURL(panel.blobUrl);
        }
        unloadPanel(panel.id);
      }
    });
  }, 30000);  // Every 30s
  
  return () => clearInterval(cleanup);
}, []);
```

### **4.5 Bundle Size**

**JavaScript Bundles:**
```
First Load JS:         < 150KB gzipped
Route JS (reader):     < 80KB gzipped
Route JS (chapters):   < 40KB gzipped
Total JS:              < 250KB gzipped
```

**CSS:**
```
Global styles:         < 20KB gzipped
Tailwind (purged):     < 15KB gzipped
```

**Optimization:**
- Code splitting by route
- Dynamic imports for heavy components
- Tree-shake unused libraries
- No heavy animation libraries (Framer Motion = 50KB)

---

## **5. PWA IMPLEMENTATION**

### **5.1 Manifest Configuration**

**`/public/manifest.json`:**
```json
{
  "name": "kitakun03 Webtoon",
  "short_name": "Webtoon",
  "description": "Read kitakun03's webtoon",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["entertainment", "books"],
  "iarc_rating_id": "placeholder"
}
```

### **5.2 Service Worker Strategy**

**Cache Strategy:**
```typescript
// Workbox configuration
{
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.yoursite\.com\/webtoon\/chapters\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'webtoon-panels',
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.yoursite\.com\/webtoon\/(index|metadata)\.json/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'webtoon-metadata',
        expiration: {
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
}
```

### **5.3 Offline Chapter Downloads**

**User Flow:**
```
1. User opens Chapter 5
2. Taps "Download for Offline"
3. Progress indicator: "Downloading 67 panels..."
4. All panels cached in Service Worker + IndexedDB
5. Chapter available offline (airplane mode)
```

**Implementation:**
```typescript
async function downloadChapter(chapterId: number) {
  const metadata = await fetchChapterMetadata(chapterId);
  const panels = metadata.panels;
  
  // Download all panels
  const downloads = panels.map(panel => 
    fetch(panel.url).then(res => res.blob())
  );
  
  const blobs = await Promise.all(downloads);
  
  // Store in IndexedDB
  await db.offlineChapters.put({
    chapterId,
    downloadedAt: Date.now(),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    panels: blobs.map((blob, i) => ({
      id: panels[i].id,
      blob,
      url: URL.createObjectURL(blob)
    }))
  });
  
  // Update UI
  toast.success(`Chapter ${chapterId} downloaded!`);
}
```

**Storage Limits:**
```
Chrome (Android):   ~50-100GB available
Safari (iOS):       ~50GB available
Firefox:            ~20-50GB available

Strategy:
- Allow 3-5 chapters offline (~300MB total)
- Auto-delete oldest downloaded chapters
- Warn user before download if >500MB
```

### **5.4 Install Prompt**

**Trigger Conditions:**
- User has scrolled through 2+ chapters
- User has visited site 3+ times
- User is on mobile device
- PWA is not already installed

**Prompt UI:**
```
┌────────────────────────────┐
│  Enjoying the webtoon?     │
│                            │
│  Install to read offline   │
│  and get new chapter       │
│  notifications!            │
│                            │
│  [Install] [Not Now]       │
└────────────────────────────┘
```

**Implementation:**
```typescript
useEffect(() => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Check eligibility
    const visits = getVisitCount();
    const chaptersRead = getChaptersRead();
    
    if (visits >= 3 || chaptersRead >= 2) {
      setShowInstallPrompt(true);
    }
  });
  
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        analytics.track('pwa_installed');
      }
      
      deferredPrompt = null;
      setShowInstallPrompt(false);
    }
  };
}, []);
```

---

## **6. SCALABILITY ARCHITECTURE**

### **6.1 Handling 500+ Chapters**

**Problem:**
- Loading 500 chapter metadata files = 500 requests = slow
- DOM with 500 chapter cards = laggy scroll

**Solution 1: Paginated Chapter List**
```typescript
// Load 50 chapters at a time
const CHAPTERS_PER_PAGE = 50;

const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['chapters'],
  queryFn: ({ pageParam = 0 }) => 
    fetchChapters(pageParam * CHAPTERS_PER_PAGE, CHAPTERS_PER_PAGE),
  getNextPageParam: (lastPage, pages) => 
    lastPage.hasMore ? pages.length : undefined,
});

// Infinite scroll on chapter browser
<InfiniteScroll
  dataLength={chapters.length}
  next={fetchNextPage}
  hasMore={hasNextPage}
  loader={<Spinner />}
>
  {chapters.map(ch => <ChapterCard chapter={ch} />)}
</InfiniteScroll>
```

**Solution 2: Virtualized Chapter Grid**
```typescript
// Only render visible chapter cards
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: 500,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 280, // Chapter card height
  overscan: 5,
});
```

### **6.2 CDN & Image Hosting**

**Cloudflare Images Setup:**
```
1. Upload original panels to Cloudflare R2
2. Use Cloudflare Images for resizing/optimization
3. URL structure:
   https://imagedelivery.net/{account_hash}/{image_id}/public

4. Variants for responsive:
   /thumbnail (400x600)
   /mobile (800x1200)
   /desktop (1200x1800)
```

**Cost Analysis:**
```
Cloudflare Images Pricing:
- Storage: $5/month for 100k images
- Delivery: $1 per 100k requests

For 500 chapters × 70 panels = 35,000 images:
- Storage: ~$2/month
- Delivery (1M views/month): ~$10/month
Total: ~$12/month
```

**Alternative: Self-Hosted + Cloudflare CDN**
```
1. Store images on Vercel/Netlify
2. Use Cloudflare as free CDN proxy
3. Next.js Image Optimization API

Cost: $0 (Vercel free tier: 1GB/1K images)
```

### **6.3 Build-Time Optimization**

**Problem:** 
- Building 35,000 image pages = 2+ hour build time
- Vercel 45min build limit

**Solution: Incremental Static Regeneration (ISR)**
```typescript
// app/read/[chapter]/page.tsx
export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  // Only pre-build latest 10 chapters at build time
  const latestChapters = await getLatestChapters(10);
  
  return latestChapters.map(ch => ({
    chapter: ch.id.toString(),
  }));
}

// Older chapters build on-demand, then cached
```

**Fallback Strategy:**
```
1. Latest 10 chapters: Pre-built (SSG)
2. Chapters 11-100: Built on first request (ISR)
3. Chapters 101+: Built on first request (ISR)
4. All cached after first build
```

### **6.4 Database Migration Path**

**When to Add Database:**
- User accounts needed
- Comments/ratings required
- Analytics beyond basic pageviews

**Recommended: Turso (SQLite on Edge)**
```sql
-- Minimal schema
CREATE TABLE reading_progress (
  user_id TEXT,
  chapter_id INTEGER,
  scroll_position INTEGER,
  panel_index INTEGER,
  updated_at INTEGER,
  PRIMARY KEY (user_id, chapter_id)
);

CREATE TABLE chapters (
  id INTEGER PRIMARY KEY,
  title TEXT,
  published_at INTEGER,
  panel_count INTEGER,
  status TEXT
);
```

**Why Turso:**
- SQLite = serverless, edge-deployed
- Free tier: 8GB storage, 1B row reads/month
- 10ms latency globally (vs 100ms+ Postgres)
- No connection pool hell

---

## **7. CONTENT MANAGEMENT**

### **7.1 Upload Workflow (Manual - v1.0)**

**Process:**
```
1. Artist exports chapter panels as PNG/JPG
   - Naming: 001.png, 002.png, ... 067.png
   - Resolution: 1600-2000px width recommended

2. Braxton runs optimization script:
   $ npm run new-chapter --id=15 --input=./raw-panels

3. Script performs:
   - Resize to 800px width (maintains aspect ratio)
   - Convert to WebP (quality 85)
   - Generate AVIF (quality 80)
   - Create blur placeholders (blurhash)
   - Generate thumbnail
   - Create metadata.json
   - Update master index.json

4. Verify locally:
   $ npm run dev
   Navigate to /read/15

5. Deploy:
   $ git add .
   $ git commit -m "Add chapter 15"
   $ git push
   Vercel auto-deploys in ~2 minutes

6. Clear CDN cache (if using Cloudflare):
   $ curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache"
```

### **7.2 Optimization Script**

**`scripts/new-chapter.js`:**
```javascript
#!/usr/bin/env node

import sharp from 'sharp';
import { encode } from 'blurhash';
import fs from 'fs-extra';
import path from 'path';
import { program } from 'commander';

program
  .requiredOption('--id <number>', 'Chapter ID')
  .requiredOption('--input <path>', 'Input directory with panels')
  .option('--title <string>', 'Chapter title', '')
  .parse();

const opts = program.opts();
const chapterId = String(opts.id).padStart(3, '0');
const outputDir = `public/webtoon/chapters/${chapterId}`;
const panelsDir = `${outputDir}/panels`;

async function processChapter() {
  console.log(`Processing Chapter ${opts.id}...`);
  
  // Create directories
  await fs.ensureDir(panelsDir);
  
  // Get all panel files
  const files = await fs.readdir(opts.input);
  const imageFiles = files
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort();
  
  const panelMetadata = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const panelNum = String(i + 1).padStart(3, '0');
    
    console.log(`  Processing panel ${panelNum}...`);
    
    const inputPath = path.join(opts.input, file);
    const webpPath = `${panelsDir}/${panelNum}.webp`;
    const avifPath = `${panelsDir}/${panelNum}.avif`;
    
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Resize and convert to WebP
    await sharp(inputPath)
      .resize(800, null, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    // Convert to AVIF
    await sharp(inputPath)
      .resize(800, null, { fit: 'inside' })
      .avif({ quality: 80, effort: 6 })
      .toFile(avifPath);
    
    // Generate blurhash
    const { data, info } = await sharp(inputPath)
      .resize(32, 32, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const blurhash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4,
      4
    );
    
    // Get file size
    const stats = await fs.stat(webpPath);
    
    panelMetadata.push({
      id: i + 1,
      filename: `${panelNum}.webp`,
      width: Math.min(800, metadata.width),
      height: Math.floor((Math.min(800, metadata.width) / metadata.width) * metadata.height),
      fileSize: stats.size,
      blurHash: blurhash,
    });
  }
  
  // Generate thumbnail (from first panel)
  await sharp(path.join(opts.input, imageFiles[0]))
    .resize(400, 600, { fit: 'cover', position: 'top' })
    .webp({ quality: 80 })
    .toFile(`public/webtoon/thumbnails/chapter-${chapterId}.webp`);
  
  // Create metadata.json
  const chapterMetadata = {
    chapterId: parseInt(opts.id),
    title: opts.title || `Chapter ${opts.id}`,
    publishDate: new Date().toISOString().split('T')[0],
    panels: panelMetadata,
    totalPanels: panelMetadata.length,
    estimatedReadTime: Math.ceil(panelMetadata.length * 0.18), // ~11s per panel avg
    prevChapter: parseInt(opts.id) > 1 ? parseInt(opts.id) - 1 : null,
    nextChapter: null, // Set manually or auto-detect
    author: 'kitakun03',
    notes: '',
  };
  
  await fs.writeJSON(
    `${outputDir}/metadata.json`,
    chapterMetadata,
    { spaces: 2 }
  );
  
  // Update master index
  const indexPath = 'public/webtoon/index.json';
  const index = await fs.readJSON(indexPath);
  
  index.webtoon.chapters.push({
    id: parseInt(opts.id),
    title: chapterMetadata.title,
    publishDate: chapterMetadata.publishDate,
    panelCount: chapterMetadata.totalPanels,
    thumbnail: `/webtoon/thumbnails/chapter-${chapterId}.webp`,
    status: 'published',
  });
  
  index.webtoon.totalChapters = index.webtoon.chapters.length;
  index.webtoon.updatedDate = new Date().toISOString().split('T')[0];
  
  await fs.writeJSON(indexPath, index, { spaces: 2 });
  
  console.log(`✓ Chapter ${opts.id} processed!`);
  console.log(`  Panels: ${panelMetadata.length}`);
  console.log(`  Output: ${outputDir}`);
}

processChapter().catch(console.error);
```

**Usage:**
```bash
# Install dependencies
npm install sharp blurhash commander fs-extra

# Process new chapter
npm run new-chapter -- \
  --id=15 \
  --input=./chapter-15-raw \
  --title="The Great Reveal"
```

### **7.3 Batch Operations**

**Bulk Upload (Backfill Existing Chapters):**
```bash
# Process chapters 1-50
for i in {1..50}; do
  npm run new-chapter -- --id=$i --input=./chapters/chapter-$i
done
```

**Re-optimize Existing Chapters (Quality Update):**
```javascript
// scripts/reoptimize-all.js
const chapters = await fs.readdir('public/webtoon/chapters');

for (const chapter of chapters) {
  console.log(`Reoptimizing chapter ${chapter}...`);
  const inputDir = `public/webtoon/chapters/${chapter}/panels`;
  // Re-run optimization with new settings
  await processChapter(chapter, inputDir);
}
```

### **7.4 Validation Script**

**`scripts/validate-metadata.js`:**
```javascript
// Check for common issues before deploy
async function validateWebtoon() {
  const index = await fs.readJSON('public/webtoon/index.json');
  const errors = [];
  
  // Check all chapters have metadata
  for (const chapter of index.webtoon.chapters) {
    const metaPath = `public/webtoon/chapters/${String(chapter.id).padStart(3, '0')}/metadata.json`;
    
    if (!await fs.pathExists(metaPath)) {
      errors.push(`Missing metadata: Chapter ${chapter.id}`);
    }
  }
  
  // Check panel file existence
  for (const chapter of index.webtoon.chapters) {
    const chapterId = String(chapter.id).padStart(3, '0');
    const meta = await fs.readJSON(`public/webtoon/chapters/${chapterId}/metadata.json`);
    
    for (const panel of meta.panels) {
      const panelPath = `public/webtoon/chapters/${chapterId}/panels/${panel.filename}`;
      if (!await fs.pathExists(panelPath)) {
        errors.push(`Missing panel: Ch${chapter.id} - ${panel.filename}`);
      }
    }
  }
  
  // Check thumbnails
  for (const chapter of index.webtoon.chapters) {
    if (!await fs.pathExists(`public${chapter.thumbnail}`)) {
      errors.push(`Missing thumbnail: Chapter ${chapter.id}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Validation failed:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  
  console.log('✓ Validation passed!');
}
```

---

## **8. IMPLEMENTATION ROADMAP**

### **Phase 1: Core Reader (Weeks 1-2)**

**Goals:**
- Working vertical scroll reader
- Virtual scrolling implemented
- Basic navigation

**Tasks:**
1. **Project Setup (Day 1-2)**
   - Initialize Next.js 14 project
   - Install dependencies (TanStack Virtual, Zustand, Dexie, Sharp)
   - Configure Tailwind CSS
   - Setup file structure

2. **Virtual Scroll Implementation (Day 3-5)**
   - Build VirtualPanelList component
   - Implement TanStack Virtual config
   - Add scroll position tracking
   - Test with 100+ test panels

3. **Image Loading (Day 6-8)**
   - PanelImage component with lazy loading
   - Intersection Observer setup
   - Preloading strategy (ahead/behind)
   - BlurHash placeholders

4. **Basic Navigation (Day 9-10)**
   - Auto-hide header
   - Progress bar
   - Scroll-to-top button
   - Keyboard shortcuts (arrows, space)

5. **Testing & Optimization (Day 11-14)**
   - Performance profiling (Chrome DevTools)
   - Memory leak detection
   - 60fps scroll verification
   - Mobile testing (iOS/Android)

**Deliverable:** Working reader with smooth scroll, 100-panel test chapter

---

### **Phase 2: Chapter Management (Week 3)**

**Goals:**
- Multi-chapter support
- Chapter browser
- Reading progress

**Tasks:**
1. **Data Layer (Day 15-16)**
   - IndexedDB setup (Dexie)
   - Reading progress save/restore
   - Chapter metadata loader

2. **Chapter Browser (Day 17-18)**
   - Grid layout (virtualized)
   - Chapter cards with thumbnails
   - Continue reading badge
   - Latest chapter highlight

3. **Chapter Navigation (Day 19-20)**
   - Chapter drawer (slide-in)
   - Chapter dividers in reader
   - Next/previous chapter flow
   - Jump to chapter

4. **Progress Tracking (Day 21)**
   - Auto-save scroll position
   - Completion percentage
   - Last-read chapter indicator

**Deliverable:** Multi-chapter reader with progress tracking

---

### **Phase 3: PWA & Offline (Week 4)**

**Goals:**
- Installable PWA
- Offline reading
- Service worker caching

**Tasks:**
1. **PWA Manifest (Day 22-23)**
   - Create manifest.json
   - Generate app icons (192, 512)
   - Configure theme colors
   - Add screenshots

2. **Service Worker (Day 24-26)**
   - Workbox setup
   - Cache strategies (stale-while-revalidate)
   - Offline fallback page
   - Update notifications

3. **Offline Downloads (Day 27-28)**
   - Download chapter UI
   - IndexedDB blob storage
   - Download progress indicator
   - Storage quota management

4. **Install Prompt (Day 29)**
   - beforeinstallprompt handler
   - Custom install UI
   - Analytics tracking

**Deliverable:** Installable PWA with offline chapters

---

### **Phase 4: Performance & Polish (Week 5)**

**Goals:**
- Lighthouse score 95+
- Production optimization
- Final UX polish

**Tasks:**
1. **Image Optimization (Day 30-31)**
   - WebP/AVIF generation script
   - Cloudflare Images setup (or self-hosted)
   - Responsive image sizes
   - Compression tuning

2. **Performance Audit (Day 32-33)**
   - Lighthouse tests
   - Core Web Vitals optimization
   - Bundle size reduction
   - Code splitting verification

3. **UX Polish (Day 34-35)**
   - Smooth transitions
   - Loading states
   - Error boundaries
   - 404 page
   - About page

4. **Final Testing (Day 36-38)**
   - Cross-browser (Chrome, Safari, Firefox)
   - Cross-device (iOS, Android)
   - 3G network testing
   - Accessibility audit

**Deliverable:** Production-ready webtoon platform

---

### **Phase 5: Launch Prep (Week 6)**

**Goals:**
- Content upload
- Deployment
- Monitoring

**Tasks:**
1. **Content Upload (Day 39-40)**
   - Process initial chapters (1-10)
   - Run validation script
   - Generate thumbnails
   - Verify metadata

2. **Deployment (Day 41-42)**
   - Vercel project setup
   - Domain configuration
   - SSL certificate
   - CDN setup (Cloudflare)

3. **Monitoring (Day 43)**
   - Sentry error tracking
   - Plausible analytics
   - Performance monitoring
   - Uptime monitoring (UptimeRobot)

4. **Final QA (Day 44-45)**
   - Production smoke tests
   - Load testing (Artillery.io)
   - Security audit
   - Documentation

**Deliverable:** Live production site

---

## **9. TECHNICAL SPECIFICATIONS**

### **9.1 Browser Support**

**Primary (95% support):**
- Chrome/Edge 90+
- Safari 14+ (iOS/macOS)
- Firefox 88+
- Samsung Internet 14+

**Secondary (graceful degradation):**
- Chrome/Edge 80-89
- Safari 13
- Firefox 78-87

**Not Supported:**
- IE11 (dead, 0.3% usage)
- Opera Mini (proxy browser, limited JS)

### **9.2 Device Support**

**Mobile (priority):**
- iOS 14+ (iPhone 8 and newer)
- Android 8+ (2GB+ RAM)
- Screen sizes: 375px - 428px width

**Tablet:**
- iPad (7th gen+)
- Android tablets 10"+

**Desktop:**
- 1024px+ width
- Mouse + keyboard support

### **9.3 Accessibility**

**WCAG 2.1 Level AA Compliance:**
- Keyboard navigation (Tab, Arrow keys, Space, Esc)
- Screen reader support (ARIA labels)
- Minimum contrast ratio 4.5:1
- Focus indicators visible
- Alt text for all panels (optional, artist-provided)

**Implementation:**
```tsx
// Semantic HTML
<nav aria-label="Chapter navigation">
  <button aria-label="Previous chapter">←</button>
  <span aria-live="polite">Chapter 5 of 12</span>
  <button aria-label="Next chapter">→</button>
</nav>

// Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') scrollToPrevPanel();
    if (e.key === 'ArrowDown') scrollToNextPanel();
    if (e.key === 'Home') scrollToTop();
    if (e.key === 'End') scrollToBottom();
    if (e.key === 'Escape') closeDrawer();
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### **9.4 SEO Optimization**

**Meta Tags (per chapter):**
```tsx
// app/read/[chapter]/page.tsx
export async function generateMetadata({ params }) {
  const chapter = await getChapter(params.chapter);
  
  return {
    title: `${chapter.title} - kitakun03 Webtoon`,
    description: `Read ${chapter.title} online. ${chapter.totalPanels} panels.`,
    openGraph: {
      title: chapter.title,
      description: `Read ${chapter.title}`,
      images: [chapter.thumbnail],
      type: 'article',
      publishedTime: chapter.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: chapter.title,
      images: [chapter.thumbnail],
    },
  };
}
```

**Structured Data (JSON-LD):**
```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ComicSeries",
  "name": "kitakun03 Webtoon",
  "author": {
    "@type": "Person",
    "name": "kitakun03"
  },
  "numberOfEpisodes": 145,
  "genre": "Fantasy"
}
</script>
```

### **9.5 Analytics Events**

**Track Key Metrics:**
```typescript
// Plausible custom events
analytics.track('chapter_started', { chapterId: 5 });
analytics.track('chapter_completed', { chapterId: 5, timeSpent: 480 });
analytics.track('pwa_installed');
analytics.track('chapter_downloaded', { chapterId: 5 });
analytics.track('reader_mode_changed', { mode: 'vertical_scroll' });
```

**Conversion Funnels:**
1. **Reading Funnel:**
   - Landing → Chapter Browser → Chapter Start → 25% → 50% → 75% → Complete

2. **Retention Funnel:**
   - First Visit → Second Visit → Third Visit → PWA Install → Weekly Active

---

## **10. HOSTING & DEPLOYMENT**

### **10.1 Vercel Configuration**

**`vercel.json`:**
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["iad1", "sfo1", "sin1"],
  "headers": [
    {
      "source": "/webtoon/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

### **10.2 Cloudflare CDN Setup**

**DNS Configuration:**
```
Type: CNAME
Name: webtoon
Target: cname.vercel-dns.com
Proxy: Enabled (orange cloud)
```

**Cloudflare Settings:**
- SSL/TLS: Full (strict)
- Auto Minify: JS, CSS, HTML
- Brotli: Enabled
- HTTP/3 (QUIC): Enabled
- WebP conversion: Enabled
- Image Resizing: Enabled

**Cache Rules:**
```
Rule 1: Cache Everything (images)
  URL Path: /webtoon/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 year

Rule 2: Bypass Cache (API/metadata)
  URL Path: /api/*
  Cache Level: Bypass
```

### **10.3 Environment Variables**

**`.env.local` (development):**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_URL=https://plausible.io
NEXT_PUBLIC_CDN_URL=http://localhost:3000/webtoon
```

**Vercel Environment (production):**
```bash
NEXT_PUBLIC_SITE_URL=https://webtoon.yoursite.com
NEXT_PUBLIC_ANALYTICS_URL=https://plausible.io
NEXT_PUBLIC_CDN_URL=https://cdn.yoursite.com/webtoon
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### **10.4 CI/CD Pipeline**

**GitHub Actions (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate metadata
        run: npm run validate
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## **11. COST ANALYSIS**

### **11.1 Monthly Operating Costs (Estimated)**

**Scenario 1: Low Traffic (10k readers/month)**
```
Hosting (Vercel Free):              $0
CDN (Cloudflare Free):              $0
Image Storage (Vercel):             $0 (under 1GB)
Analytics (Plausible):              $9/month
Domain (.com):                      $1/month (amortized)
Total:                              $10/month
```

**Scenario 2: Medium Traffic (100k readers/month)**
```
Hosting (Vercel Pro):               $20/month
CDN (Cloudflare Pro):               $20/month
Image Storage (R2):                 $3/month (30GB)
Image Delivery (Cloudflare Images): $10/month (1M requests)
Analytics (Plausible):              $9/month
Error Tracking (Sentry):            $26/month
Total:                              $88/month
```

**Scenario 3: High Traffic (1M readers/month)**
```
Hosting (Vercel Pro):               $20/month
CDN (Cloudflare Business):          $200/month
Image Storage (R2):                 $15/month (150GB)
Image Delivery:                     $100/month (10M requests)
Analytics (Plausible):              $19/month
Error Tracking (Sentry):            $26/month
Total:                              $380/month
```

### **11.2 Cost Optimization Strategies**

1. **Self-Host Images:**
   - Use Vercel's built-in CDN (free under limits)
   - Saves $10-100/month on Cloudflare Images

2. **Static Site Export:**
   - Export to static HTML (`next export`)
   - Host on Cloudflare Pages (free, unlimited bandwidth)
   - Saves $20/month on Vercel Pro

3. **Plausible Self-Hosted:**
   - $9/month → $0 (run on $5 VPS)
   - Requires Docker/VPS maintenance

**Recommended for Launch:**
- Start with Scenario 1 (Vercel Free + Cloudflare Free)
- Upgrade to Scenario 2 when traffic justifies
- Monitor costs monthly, optimize as needed

---

## **12. RISK ANALYSIS**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Browser crashes on low-end devices** | Medium | High | Virtual scrolling, memory cleanup, progressive enhancement |
| **Slow image loading on 3G** | High | Medium | WebP/AVIF compression, aggressive preloading, blur placeholders |
| **PWA install prompt doesn't show** | Medium | Low | Follow Chrome criteria exactly, provide manual install instructions |
| **Storage quota exceeded (offline)** | Low | Medium | Limit to 3-5 chapters, auto-delete oldest, warn before download |
| **Build time exceeds limits (500+ chapters)** | Medium | High | ISR (Incremental Static Regeneration), build only latest 10 chapters |
| **CDN costs explode with viral traffic** | Low | High | Set Cloudflare spending limits, cache aggressively, rate limiting |
| **Artist uploads wrong format/size** | High | Low | Automated validation script, clear documentation, error messages |
| **Metadata corruption/mismatch** | Low | Medium | Validation script in CI/CD, automated tests, backup copies |

---

## **13. FUTURE ENHANCEMENTS (Post-v1.0)**

### **13.1 Planned Features (v1.1 - v2.0)**

**v1.1 (Month 2-3):**
- Dark/Light theme toggle
- Reading mode preferences (panel spacing, background color)
- Chapter bookmarks
- Share chapter URL (with panel position)
- 3D page flip animation (optional, performance permitting)

**v1.2 (Month 4-6):**
- User accounts (optional, for syncing across devices)
- Comments system (per chapter)
- Creator dashboard for kitakun03 (upload UI)
- Push notifications for new chapters

**v2.0 (Month 7-12):**
- Multi-language support
- Webtoon variants (alternative endings, bonus chapters)
- Merchandise shop integration
- Patreon/Ko-fi integration for support

### **13.2 Potential Monetization (If Needed)**

**Non-Intrusive Options:**
1. **Ko-fi/Patreon Link:**
   - "Support the artist" button
   - No paywall, voluntary support

2. **Early Access:**
   - Latest chapter free after 1 week
   - Supporters get immediate access
   - Implemented via simple timestamp check

3. **Digital Downloads:**
   - PDF/EPUB exports for offline reading
   - Pay-what-you-want pricing

4. **Merchandise:**
   - Link to print-on-demand store
   - No inventory management needed

**Explicitly Avoid:**
- Intrusive ads (banner ads, pop-ups)
- Hard paywalls (ruins accessibility)
- Premium tiers (unnecessary complexity)

---

## **14. SUCCESS METRICS**

### **14.1 Launch Metrics (First 3 Months)**

**Traffic Goals:**
| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Unique Visitors | 500 | 2,000 | 5,000 |
| Page Views | 5,000 | 25,000 | 75,000 |
| Avg Session Duration | 8 min | 12 min | 15 min |

**Engagement:**
- Bounce Rate: < 40%
- Chapters Read per Session: > 2
- Return Visitor Rate: > 30%

**Technical:**
- Lighthouse Performance: 95+
- Core Web Vitals: All Green
- Error Rate: < 0.1%
- Uptime: 99.9%

**PWA Adoption:**
- Install Rate: 5% (month 1) → 15% (month 3)
- Offline Chapter Downloads: 2% of users

### **14.2 Long-Term Goals (Year 1)**

**Growth:**
- 50,000 monthly readers
- 500,000 monthly page views
- 10,000 PWA installs

**Retention:**
- Weekly Active Users: 5,000+
- Monthly Active Users: 20,000+
- 7-day retention: > 40%

**Virality:**
- Social shares: 1,000+/month
- Organic search traffic: 60%+
- Direct traffic: 30%+

---

## **15. NEXT STEPS**

### **Immediate Actions (This Week)**

1. **Confirm Requirements:**
   - [ ] Review PRD with kitakun03
   - [ ] Confirm visual style preferences
   - [ ] Determine initial chapter count (for launch)

2. **Technical Setup:**
   - [ ] Create GitHub repository
   - [ ] Initialize Next.js project
   - [ ] Install core dependencies
   - [ ] Setup Tailwind + base styles

3. **Content Preparation:**
   - [ ] Receive sample panels from artist
   - [ ] Test optimization script
   - [ ] Verify panel dimensions/format

4. **Procurement:**
   - [ ] Register domain name
   - [ ] Create Vercel account
   - [ ] Setup Cloudflare account
   - [ ] Obtain any necessary API keys

### **Week 1 Deliverables**

- [ ] Working Next.js project (local dev server)
- [ ] Virtual scroll demo with 10 test panels
- [ ] Image optimization script tested
- [ ] Basic reader UI (no styling yet)

### **Approval Checklist**

Before development begins, confirm:
- [ ] Architecture approved (Next.js + TanStack Virtual)
- [ ] Hosting plan selected (Vercel Free/Pro)
- [ ] Budget approved ($10-100/month)
- [ ] Timeline realistic (5-6 weeks to launch)
- [ ] Content pipeline ready (artist can export panels)

---

## **16. APPENDIX**

### **16.1 Technology Alternatives Considered**

**Why Not Gatsby?**
- Static generation doesn't handle 500+ chapters well
- Slower build times than Next.js ISR
- Smaller ecosystem for React Server Components

**Why Not Remix?**
- Great for server-heavy apps, overkill for static content
- Vercel deployment less optimized than Next.js

**Why Not React-Window/React-Virtualized?**
- TanStack Virtual is newer, better performance
- Better TypeScript support
- More actively maintained

**Why Not WordPress?**
- PHP overhead for simple content display
- Harder to optimize for performance
- Database adds unnecessary complexity

### **16.2 Glossary**

**BlurHash:** Algorithm that creates tiny blurred placeholders for images (< 30 bytes)
**CLS:** Cumulative Layout Shift - measures visual stability
**Edge Network:** CDN servers distributed globally for low latency
**FCP:** First Contentful Paint - when first content appears
**FID:** First Input Delay - time until page becomes interactive
**ISR:** Incremental Static Regeneration - build pages on-demand
**LCP:** Largest Contentful Paint - when main content loads
**PWA:** Progressive Web App - installable web application
**SSG:** Static Site Generation - pre-build all pages at build time
**SSR:** Server-Side Rendering - generate pages on request
**TTFB:** Time to First Byte - server response speed
**Virtual Scrolling:** Only render visible items in long lists

### **16.3 Reference Links**

**Documentation:**
- Next.js: https://nextjs.org/docs
- TanStack Virtual: https://tanstack.com/virtual
- Workbox: https://developer.chrome.com/docs/workbox
- Dexie.js: https://dexie.org

**Tools:**
- Lighthouse: https://pagespeed.web.dev
- WebPageTest: https://www.webpagetest.org
- BlurHash: https://blurha.sh

**Inspiration:**
- Webtoon (official): https://www.webtoons.com
- Tapas: https://tapas.io
- LINE Manga: https://manga.line.me

---

**Document Version:** 2.0  
**Last Updated:** January 30, 2026  
**Author:** Braxton (Echo Mind Automation)  
**Status:** Ready for Development

---

**Approval:**

Reviewed by: _________________  
Date: _________________  
Approved: [ ] Yes [ ] No  
Notes: ________________________________________________
