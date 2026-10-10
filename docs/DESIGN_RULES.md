# JalSahayak — Design Rules

> Version: 1.0 | Status: For Future UI Implementation | Last updated: 2026-10-08

---

## Purpose

This file defines design rules and constraints for the JalSahayak UI. **Do NOT implement the UI yet.** These rules will guide implementation when Phase 7+ begins.

---

## 1. Design Philosophy

JalSahayak should look like a **serious geospatial / disaster-management startup product**. It should feel professional, functional, and trustworthy — not flashy, not generic.

**Think:** Focused monitoring tool, not a consumer app.

---

## 2. Layout Rules

### Map-First
- Where geographic context is relevant, the map is the primary element
- Map occupies the majority of the viewport on dam overview and scenario views
- Data panels overlay or sit beside the map — they do not replace it
- Map interactions (click, hover, zoom) are first-class interactions

### No Overcrowding
- Maximum **6 data widgets** visible at once on any screen
- Every element must earn its screen space — if it is not immediately useful, remove it
- Whitespace is a feature, not wasted space
- Information hierarchy: most important data is largest and most prominent

### Navigation
- Maximum **3 levels** of navigation depth
- Primary nav: My Dams → Dam Detail → Sub-views (timeline, scenario, alerts, report)
- Breadcrumbs for orientation
- No hamburger menus on desktop

---

## 3. Visual Rules

### Colors
- **Status colors are sacred — never use them decoratively:**

| Status | Color | Usage |
|---|---|---|
| NORMAL | Green (`#22C55E`) | Status badge, map marker |
| WATCH | Amber/Yellow (`#F59E0B`) | Status badge, map marker |
| ALERT | Orange (`#F97316`) | Status badge, map marker, alert card |
| CRITICAL | Red (`#EF4444`) | Status badge, map marker, alert card |

- **Severity colors for alerts:**

| Severity | Color |
|---|---|
| INFO | Blue (`#3B82F6`) |
| WARNING | Amber (`#F59E0B`) |
| CRITICAL | Red (`#EF4444`) |

- **Do NOT use status/alert colors for buttons, backgrounds, or decorative elements**
- **Synthetic data indicator:** Distinct badge color (purple `#A855F7` or similar) to clearly differentiate demo data

### Typography
- Use a professional sans-serif font (Inter, Roboto, or similar)
- Clear hierarchy: title → subtitle → body → caption
- Monospace for coordinates, IDs, and technical values
- Never use more than 2 font families

### Icons
- Consistent icon set (Lucide, Heroicons, or similar)
- Meaningful icons — not decorative
- Always paired with text labels (no icon-only buttons except well-known actions like close)

---

## 4. Prohibited Design Patterns

| Do NOT | Why |
|---|---|
| Excessive glassmorphism | Not appropriate for serious monitoring tool |
| Unnecessary gradients | Adds visual noise without information |
| Fake AI visuals (pulsing brain, neural networks) | Misleading and unprofessional |
| Excessive cards | Creates visual clutter |
| Unnecessary 3D globe | Performance cost, limited value for dam monitoring |
| Dark-on-dark text | Accessibility issue |
| Auto-playing animations | Distracting in operational environment |
| Decorative illustrations | Not a consumer marketing site |
| Carousel for critical data | Users should see important data immediately |

---

## 5. Component Rules

### Status Badge
```
┌──────────┐
│ ● NORMAL │  (green dot + text)
└──────────┘
```
- Always visible on dam cards and overview
- Color-coded by status level
- Includes timestamp of last update

### Alert Card
```
┌─────────────────────────────────────────┐
│ ⚠ WARNING                    Oct 5     │
│                                         │
│ Unusual reservoir change detected       │
│                                         │
│ Reservoir water spread increased by 12% │
│ Evidence: Observation Oct 1 vs Oct 5    │
│                                         │
│ [View Details]  [Acknowledge]           │
└─────────────────────────────────────────┘
```
- Left border colored by severity
- Title, reason, evidence, actions visible without expanding
- Acknowledged alerts visually muted

### Map Overlays
- Reservoir area: blue outline
- Monitoring area: dashed gray outline
- Flood extent: semi-transparent red fill
- Affected infrastructure: markers with impact indicators
- Change areas: highlighted with before/after toggle

### Dam Card (List View)
```
┌─────────────────────────────────────────┐
│ Koyna Dam                    ● WATCH    │
│ River: Koyna | Maharashtra              │
│ Latest: Oct 5 | Alerts: 1              │
└─────────────────────────────────────────┘
```

---

## 6. Responsive Rules

- **Desktop-first** design (primary use case is desktop in an office/control room)
- **Tablet:** Functional but simplified layouts (stack panels vertically)
- **Mobile:** Read-only view of dam list, status, and alerts. Map views simplified.
- Breakpoints:
  - Desktop: ≥ 1280px
  - Tablet: 768px – 1279px
  - Mobile: < 768px

---

## 7. Accessibility

- WCAG 2.1 AA compliance minimum
- Color contrast ratio ≥ 4.5:1 for text
- All interactive elements keyboard-accessible
- Map controls accessible via keyboard
- Screen reader labels on icons and interactive elements
- Focus indicators visible
- Status communicated through text, not only color (colorblind-safe)

---

## 8. Data Display Rules

- **Coordinates:** Display as `17.3965° N, 73.7537° E` (not raw decimal)
- **Dates:** Display in user's locale; store as UTC
- **Areas:** Display in km² with 1 decimal
- **Depths:** Display in meters with 1 decimal
- **Times:** Display arrival times as `X hours Y minutes`
- **Percentages:** 1 decimal precision
- **Large numbers:** Use thousand separators
- **Missing data:** Show `—` (em dash), never blank or "null"
- **Synthetic data:** Always show `DEMO` badge prominently

---

## 9. Loading & Empty States

- Every data view has a defined loading state (skeleton or spinner)
- Every list view has a defined empty state with helpful message
- Error states show what went wrong and what the user can do
- Never show a blank screen

---

## 10. Print / Export

- Reports must be exportable as PDF
- PDF layout should be clean and professional
- Include JalSahayak branding, dam name, date range
- Maps rendered as static images in PDF
- No interactive elements in exported reports
