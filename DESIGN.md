---
name: Essence Perfume Ecommerce
description: A quiet-luxury ecommerce system for fragrance discovery, checkout, account, and admin workflows.
colors:
  primary: "#6b4f4f"
  primary-hover: "#5f4545"
  secondary: "#a68a64"
  accent: "#e8ddd4"
  background: "#faf7f2"
  surface: "#ffffff"
  text: "#2a2a2a"
  text-secondary: "#6f6f6f"
  border: "#ddd3c9"
  footer: "#3f3030"
  success-bg: "#edf3ec"
  success-text: "#346538"
  window-dot: "#d8cec5"
typography:
  display:
    fontFamily: "\"Playfair Display\", \"Newsreader\", \"Instrument Serif\", serif"
    fontSize: "clamp(46px, 7vw, 76px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "\"Playfair Display\", \"Newsreader\", \"Instrument Serif\", serif"
    fontSize: "clamp(36px, 5vw, 48px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "\"Geist Sans\", \"SF Pro Display\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "\"Geist Sans\", \"SF Pro Display\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "\"Geist Sans\", \"SF Pro Display\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.1em"
  mono:
    fontFamily: "\"Geist Mono\", \"SF Mono\", \"JetBrains Mono\", monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  xxl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
    height: "52px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
    height: "52px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    padding: "0 24px"
---

# Design System: Essence Perfume Ecommerce

## 1. Overview

**Creative North Star: "The Quiet Counter"**

Essence should feel like standing at a refined fragrance counter: calm enough to compare products carefully, tactile enough to trust checkout, and restrained enough that account and admin tasks still feel efficient. The system uses warm neutral surfaces, low-contrast tonal layering, dark ink, and a muted brown primary to support quiet-luxury commerce without turning every screen into a campaign.

This is a product-register system first. The home page and product detail screens may carry editorial fragrance atmosphere, but catalog filtering, cart, checkout, account, and admin workflows must use familiar Ant Design affordances and clear state language. PRODUCT.md explicitly rejects flashy beauty-campaign effects, generic SaaS/admin UI, cluttered marketplace density, loud discount-driven retail patterns, and decorative motion that competes with shopping tasks.

**Key Characteristics:**

- Warm boutique surfaces with strong readable ink and restrained brown action color.
- Serif display type for storefront storytelling, sans and mono stacks for product data, forms, labels, and admin work.
- Tonal lift through borders, surface shifts, and very low shadows rather than dramatic depth.
- Consistent Ant Design-based controls across storefront, account, and admin surfaces.
- Motion that confirms state or reveals product groups without slowing the shopping task.

## 2. Colors

The palette is a restrained fragrance-counter system: one muted brown carries action, warm surfaces carry calm, and secondary tones support product atmosphere only when contrast remains safe.

### Primary

- **Counter Brown** (`primary`): Primary actions, active pagination, badge accents, announcement bars, and key interactive states.
- **Deep Counter Brown** (`primary-hover`): Hover state for primary buttons and high-confidence action feedback.

### Secondary

- **Aged Brass Taupe** (`secondary`): Editorial labels, rating accents, section notes, and brand atmosphere. Do not use it for essential small body copy unless contrast has been verified on the exact background.

### Tertiary

- **Veiled Blush Stone** (`accent`): Product image shelves, soft hover washes, and tonal surfaces behind bottles.
- **Quiet Success Wash** (`success-bg`) and **Herbal Success Ink** (`success-text`): Availability and success state pairing.

### Neutral

- **Storefront Ground** (`background`): Page background and translucent navigation base.
- **Porcelain Surface** (`surface`): Cards, forms, panels, and content wrappers.
- **Reading Ink** (`text`): Default text and headings.
- **Soft Data Ink** (`text-secondary`): Metadata and supporting copy where contrast is safe.
- **Warm Divider** (`border`): Form controls, cards, panels, dividers, and image frames.
- **Footer Oxblood** (`footer`): Footer ground and dark boutique moments.
- **Window Dot Neutral** (`window-dot`): Decorative browser-window dots on hero and product image frames.

### Named Rules

**The Ten Percent Accent Rule.** Counter Brown is strongest when rare. Use it for primary actions, selected state, badges, and critical anchors, not for decorative fills across whole screens.

**The Contrast Before Atmosphere Rule.** Aged Brass Taupe and Soft Data Ink must never carry required instructions, prices, form labels, or errors unless the exact foreground/background pair passes WCAG AA.

## 3. Typography

**Display Font:** Playfair Display with Newsreader, Instrument Serif, and serif fallbacks.
**Body Font:** Geist Sans with SF Pro Display, Helvetica Neue, Arial, and sans-serif fallbacks.
**Label/Mono Font:** Geist Mono with SF Mono, JetBrains Mono, and monospace fallbacks.

**Character:** The pairing is editorial but not ornate: Playfair gives the storefront a fragrance-counter voice, while the sans and mono stacks keep product data, account screens, and admin workflows legible. The current HTML imports Playfair only; if Geist is not available locally, the stack falls through to system sans and mono.

### Hierarchy

- **Display** (600, `clamp(46px, 7vw, 76px)`, 1.04): Hero headlines and major storefront storytelling only.
- **Headline** (600, `clamp(36px, 5vw, 48px)`, 1.1): Page and section headings on home, product, catalog, and account wrappers.
- **Title** (700, `24px`, 1.25): Product prices, panel headings, and meaningful subsection titles.
- **Body** (400, `16px`, 1.6): Product descriptions, form help, account copy, and checkout copy. Long prose should stay under 75ch.
- **Label** (800, `12px`, `0.1em`, uppercase when intentional): Buttons, product metadata, navigation items, stock pills, and concise section labels.
- **Mono Label** (600, `11px`, `0.06em`): Product-card metadata, note lists, and concise measurement-like data.

### Named Rules

**The Serif Boundary Rule.** Playfair belongs to storytelling headings, not inputs, table labels, admin controls, data rows, or button text.

**The Uppercase Rationing Rule.** Uppercase labels are part of the boutique voice, but they must be short, readable, and purposeful. Never use tracked uppercase for paragraphs or error recovery copy.

## 4. Elevation

The elevation language is tonal lift: surfaces separate through warm dividers, restrained backgrounds, and small interaction shadows. Existing code still contains a legacy ambient panel shadow on some bordered cards and wrappers; preserve it only when maintaining those exact surfaces, and do not introduce the border-plus-wide-shadow pairing in new components.

### Shadow Vocabulary

- **Legacy Ambient Panel** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04)`): Existing card, hero visual, product image, menu, reviews, and wrapper surfaces. Treat as maintenance debt, not a new default.
- **Interactive Skim** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)`): Hover response for product cards, brand tiles, theme cards, and back-to-top affordance.

### Named Rules

**The Tonal Lift Rule.** Resting surfaces use a border or a tonal background. Shadows are feedback, not decoration.

**The No Ghost Card Rule.** Do not add a 1px border and a wide decorative shadow to the same new card. Pick the border at rest, then add only Interactive Skim on hover if feedback is needed.

## 5. Components

For every component, preserve the refined-controls feel: restrained, tactile, consistent, and task-first across storefront and admin surfaces.

### Buttons

- **Shape:** Gently squared retail control (`12px` radius).
- **Primary:** Counter Brown background with white text, uppercase 12px/800 label, `0.08em` to `0.1em` tracking, and 52px target height on major CTAs.
- **Hover / Focus:** Use Deep Counter Brown on hover. Keep transitions at 150-250ms for color and transform. Add or preserve visible focus; never rely on color alone.
- **Secondary / Ghost:** Transparent or surface background, Counter Brown text, 1px Counter Brown border, same radius and label language.

### Chips

- **Style:** Stock and semantic chips use pill radius only when they are truly status markers, as with the in-stock state.
- **State:** Status chips require both tonal fill and text color. Never communicate stock, warning, error, or success with color alone.

### Cards / Containers

- **Corner Style:** Existing boutique cards use the large radius token (`20px`). Do not exceed it.
- **Background:** Porcelain Surface at rest; Veiled Blush Stone is reserved for product image wells and soft hover washes.
- **Shadow Strategy:** Follow Elevation. Existing ambient panel shadow may remain on legacy wrappers, but new cards should be border-first and shadow-light.
- **Border:** Warm Divider is the default separator for cards, form controls, image frames, and content panels.
- **Internal Padding:** Use 22-24px for compact card bodies, 28-56px for major content wrappers, and 48-96px for storefront section rhythm.

### Inputs / Fields

- **Style:** Ant Design inputs with Warm Divider border, Porcelain Surface background, Reading Ink text, and small radius (`8px`).
- **Focus:** Preserve a visible border/focus treatment that works on warm backgrounds. Do not suppress focus without replacing it.
- **Error / Disabled:** Errors need text plus icon or helper message; disabled controls should retain readable labels and clear affordance.

### Navigation

- **Style, typography, default/hover/active states, mobile treatment.** The navigation uses a Counter Brown announcement bar, a translucent Storefront Ground shell with backdrop blur, uppercase 12px/700 links, and a centered serif brand wordmark. On mobile, the brand centers and links wrap into two rows; preserve touch target spacing and avoid hiding core shopping links unless a real menu pattern is added.

### Perfume Product Card

Product cards are the catalog's signature component. Keep the image shelf tonal, product metadata compact, perfumer names uppercase and confident, titles calmer, and price readable. The Add to cart action must remain obvious, not buried under hover-only behavior.

### Product Image Frame

Product detail and hero visuals use a framed object-window motif: Veiled Blush Stone image ground, Warm Divider border, small neutral window dots, and contained bottle imagery. Use this motif for fragrance imagery only; do not apply it to admin tables, forms, or transactional panels.

## 6. Do's and Don'ts

### Do:

- **Do** use Counter Brown for the one primary action per local task: add to cart, checkout, submit, save, or selected navigation state.
- **Do** keep storefront copy sensory but concise; product, cart, account, and admin screens must prioritize task clarity.
- **Do** preserve readable body contrast with Reading Ink on Storefront Ground or Porcelain Surface.
- **Do** keep admin and account controls in the same component vocabulary as the storefront, even when the layout becomes denser.
- **Do** provide reduced-motion alternatives and keep reveal animations from gating content visibility.

### Don't:

- **Don't** use flashy beauty-campaign effects, generic SaaS/admin UI, cluttered marketplace density, loud discount-driven retail patterns, or decorative motion that competes with shopping tasks.
- **Don't** use gradient text, side-stripe card accents, glassmorphism as decoration, or repeating stripe backgrounds.
- **Don't** add a new bordered card with `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04)` or any wide decorative shadow; use border at rest and Interactive Skim on hover.
- **Don't** use Playfair for form labels, tables, buttons, stock state, prices, or admin data.
- **Don't** use Aged Brass Taupe or Soft Data Ink for required small text unless the exact contrast pair passes WCAG AA.
- **Don't** exceed the existing large radius token (`20px`) on cards, panels, inputs, or sections. Pill radius is only for true pills and status chips.
