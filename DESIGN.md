---
version: "1.0"
name: Composed design system
description: A design system composed in DESIGN.md Studio.
mode: dark
productExperience:
  id: news-editorial
  label: News / Editorial
  description: Information discovery and contextual reading.
  primaryObjective: Help people discover, understand, and consume information in context.
  uxPriorities:
    - Headlines and recency
    - Editorial context and hierarchy
    - Categories
  informationHierarchy:
    - Headline
    - Summary or context
    - Recency and relevance
    - Article body
  navigationPrinciples:
    - Separate editorial home, current news, sections, search, and saved content.
    - Keep section and reading context when opening related content.
    - Help people continue reading without interrupting the primary article.
  interactionPrinciples:
    - Prioritize reading while allowing save, share, and follow actions.
    - Preserve reading position and saved items.
    - Make corrections, updates, and sources accessible from the content.
  contentPrinciples:
    - Clearly distinguish headline, summary, body, opinion, and advertising.
    - Show author, date, update, and provenance when they affect interpretation.
    - Optimize long-form readability and editorial hierarchy.
  primaryActions:
    - Browse current news
    - Read
    - Search topics
    - Save or follow
  discoveryPatterns:
    - Editorial front page
    - Topic sections
    - Breaking news
    - Search
  trustAndSafetyConsiderations:
    - Distinguish news, opinion, sponsored material, and generated or edited content.
    - Make corrections, dates, and relevant sources visible.
    - Avoid patterns that encourage sharing without comprehension.
  commonPatterns:
    - Hierarchical front page
    - Focused article page
    - Section navigation
    - Related-context blocks
  patternsToAvoid:
    - Making controls and promotions compete with the article.
    - Treating every story as equally urgent.
    - Hiding date, author, or sponsored nature.
  wireframes:
    nav:
      - Actualidad
      - Cultura
      - Opinión
    icon: news
    views:
      - id: frontpage
        label: Portada
        layout: editorial
        blocks:
          - type: headline
            title: El contexto detrás de la noticia
            art: news
          - type: rail
            title: Más historias
            art: news
            count: 3
        aside:
          - type: newsList
            title: Última hora
            count: 4
      - id: read
        label: Leer con contexto
        layout: reading
        blocks:
          - type: article
            title: Una historia que merece tiempo
            art: news
          - type: rail
            title: Para entender más
            art: news
            count: 3
        aside:
          - type: profile
            title: La autora
            detail: Redacción · 15 sep
          - type: newsList
            title: En esta historia
            count: 3
      - id: follow
        label: Seguir temas
        layout: sidebar
        blocks:
          - type: search
            title: Buscar un tema
          - type: chips
            title: Tus intereses
            items:
              - Cultura
              - Ciencia
              - Tecnología
          - type: newsList
            title: Novedades de tus temas
            count: 5
          - type: rail
            title: Guardado para leer
            art: news
            count: 3
        aside:
          - type: menu
            title: Tu lectura
            items:
              - Mis temas
              - Guardados
              - Historial
              - Autores
  previewIntent:
    locale: es
    primaryObjective: Permitir descubrir, comprender y consumir información con contexto.
    agentFocus:
      - Titulares y actualidad
      - Contexto y jerarquía editorial
      - Categorías
      - Lectura
    informationHierarchy:
      - Titular
      - Resumen o contexto
      - Actualidad y relevancia
      - Cuerpo del contenido
      - Autor y procedencia
      - Contenido relacionado
    navigationPrinciples:
      - Separar inicio editorial, actualidad, secciones, búsqueda y contenido guardado.
      - Mantener el contexto de sección y lectura al abrir contenido relacionado.
      - Facilitar continuar leyendo sin interrumpir el artículo principal.
    interactionPrinciples:
      - Priorizar lectura y permitir guardar, compartir o seguir temas sin dominarla.
      - Conservar posición de lectura y elementos guardados.
      - Hacer que correcciones, actualizaciones y fuentes sean accesibles desde el contenido.
    patternsToAvoid:
      - Hacer competir controles y promociones con el artículo.
      - Tratar todo el contenido como igualmente urgente.
      - Ocultar fecha, autor o naturaleza patrocinada.
      - Interrumpir repetidamente una lectura activa.
sources:
  colors: dataset/hashicorp.json
  typography: dataset/spotify.json
  layout: dataset/supabase.json
  shape: dataset/supabase.json
  elevation: dataset/supabase.json
  buttons: dataset/supabase.json
  inputs: dataset/supabase.json
colors:
  primary: "#000000"
  on-primary: "#ffffff"
  accent-blue: "#2b89ff"
  ink: "#ffffff"
  ink-muted: "#b2b6bd"
  ink-subtle: "#656a76"
  canvas: "#000000"
  surface-1: "#15181e"
  surface-2: "#1f232b"
  surface-3: "#3b3d45"
  hairline: "#3b3d45"
  hairline-soft: "#252830"
  inverse-canvas: "#ffffff"
  inverse-ink: "#000000"
  product-terraform: "#7b42bc"
  product-terraform-bright: "#911ced"
  product-vault: "#ffcf25"
  product-consul: "#e62b1e"
  product-waypoint: "#14c6cb"
  product-waypoint-deep: "#12b6bb"
  product-vagrant: "#1868f2"
  product-nomad: "#00ca8e"
  product-boundary: "#f24c53"
  amber-100: "#fbeabf"
  amber-200: "#bb5a00"
  blue-7: "#101a59"
  semantic-success: "#00ca8e"
  semantic-warning: "#ffcf25"
  semantic-error: "#e62b1e"
  semantic-visited: "#a737ff"
  surface: "#15181e"
colorRoleSources:
  primary: primary
  background: canvas
  card: surface-1
  border: hairline
  foreground: ink
typography:
  section-title:
    fontFamily: DM Sans, sans-serif
    fontSize: 24px (1.50rem)
    fontWeight: "700"
    lineHeight: normal
    letterSpacing: normal
  feature-heading:
    fontFamily: DM Sans, sans-serif
    fontSize: 18px (1.13rem)
    fontWeight: "600"
    lineHeight: 1.30 (tight)
    letterSpacing: normal
  body-bold:
    fontFamily: DM Sans, sans-serif
    fontSize: 16px (1.00rem)
    fontWeight: "700"
    lineHeight: normal
    letterSpacing: normal
  body:
    fontFamily: DM Sans, sans-serif
    fontSize: 16px (1.00rem)
    fontWeight: "400"
    lineHeight: normal
    letterSpacing: normal
  button-uppercase:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: 600–700
    lineHeight: 1.00 (tight)
    letterSpacing: 1.4px–2px
  button:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: "700"
    lineHeight: normal
    letterSpacing: 0.14px
  nav-link-bold:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: "700"
    lineHeight: normal
    letterSpacing: normal
  nav-link:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: "400"
    lineHeight: normal
    letterSpacing: normal
  caption-bold:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: "700"
    lineHeight: 1.50–1.54
    letterSpacing: normal
  caption:
    fontFamily: DM Sans, sans-serif
    fontSize: 14px (0.88rem)
    fontWeight: "400"
    lineHeight: normal
    letterSpacing: normal
  small-bold:
    fontFamily: DM Sans, sans-serif
    fontSize: 12px (0.75rem)
    fontWeight: "700"
    lineHeight: "1.50"
    letterSpacing: normal
  small:
    fontFamily: DM Sans, sans-serif
    fontSize: 12px (0.75rem)
    fontWeight: "400"
    lineHeight: normal
    letterSpacing: normal
  badge:
    fontFamily: DM Sans, sans-serif
    fontSize: 10.5px (0.66rem)
    fontWeight: "600"
    lineHeight: "1.33"
    letterSpacing: normal
  micro:
    fontFamily: DM Sans, sans-serif
    fontSize: 10px (0.63rem)
    fontWeight: "400"
    lineHeight: normal
    letterSpacing: normal
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px
components:
  button:
    borderRadius: 6px
    padding: 8px 16px
    fontWeight: 500
    letterSpacing: 0px
  input:
    borderRadius: 6px
    padding: 8px 12px
  card:
    borderRadius: 12px
    padding: 24px
    boxShadow: 0 1px 3px rgba(0,0,0,0.06)
resolvedCss:
  --background: "#000000"
  --card: "#15181e"
  --popover: "#15181e"
  --foreground: "#ffffff"
  --primary: "#000000"
  --primary-foreground: "#ffffff"
  --border: "#3b3d45"
  --muted-foreground: "#b2b6bd"
  --muted: "color-mix(in srgb, #15181e, #ffffff 7%)"
  --secondary: "#1f232b"
  --secondary-foreground: "#ffffff"
  --accent: "#3b3d45"
  --accent-foreground: "#ffffff"
  --success: "#00ca8e"
  --warning: "#ffcf25"
  --destructive: "#e62b1e"
  --info: "#2b89ff"
  --radius: 8px
  --card-radius: 12px
  --button-radius: 6px
  --input-radius: 6px
  --preview-font: DM Sans, sans-serif
  --heading-font: DM Sans, sans-serif
  --mono-font: "'JetBrains Mono', monospace"
  --body-size: 16px
  --body-weight: 400
  --body-leading: 1.5
  --heading-size: 24px
  --heading-weight: 700
  --heading-tracking: 0px
  --heading-leading: 1.15
  --button-weight: 500
  --button-tracking: 0px
  --button-padding: 8px 16px
  --input-padding: 8px 12px
  --gallery-gap: 16px
  --sample-padding: 24px
  --preview-columns: 2
  --sample-shadow: 0 1px 3px rgba(0,0,0,0.06)
  --input-height: 44px
  --input-bg: "#000000"
  --input-color: "#ffffff"
  --input-border: "#3b3d45"
  --input-focus-width: 2px
  --input-focus-bg: "#000000"
  --input-focus-color: "#000000"
  --input-focus-shadow: "0 0 0 3px color-mix(in srgb, #000000, transparent 80%)"
---

# DESIGN.md

This is an implementation skill, not a screenshot specification. It combines product behavior with a visual system: product rules decide what users need to accomplish, while visual rules decide how the experience should look and feel.

## 1. Design Philosophy

Compose one coherent system from the selected references. Preserve the visual vocabulary of each selected brand without treating any source document as a literal template. Prefer clear hierarchy, accessible interaction, useful density, and deliberate restraint over decorative effects.

### Composition sources

- **Color palette:** HashiCorp
- **Typography:** Spotify
- **Layout and spacing:** Supabase
- **Shape and cards:** Supabase
- **Shadows and depth:** Supabase
- **Buttons:** Supabase
- **Fields and controls:** Supabase

The resolved front matter is the source of truth for implementation. Source excerpts document brand intent, but they do not override decisions assigned to another section.

## 2. Product Objective

**News / Editorial** — Information discovery and contextual reading.

Help people discover, understand, and consume information in context.

### UX priorities

- Headlines and recency
- Editorial context and hierarchy
- Categories

### Primary actions

- Browse current news
- Read
- Search topics
- Save or follow


## 3. Information Architecture

Order information by decision value:

1. Headline
2. Summary or context
3. Recency and relevance
4. Article body

### Content principles

- Clearly distinguish headline, summary, body, opinion, and advertising.
- Show author, date, update, and provenance when they affect interpretation.
- Optimize long-form readability and editorial hierarchy.


## 4. Layout & Spacing

Use a shared spacing rhythm, stable container behavior, and progressive disclosure. Preserve the selected layout system at every viewport; do not flatten it into generic one-column marketing sections.


```json
{
  "spacing": {
    "xxs": "2px",
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px",
    "xxl": "32px",
    "huge": "64px"
  },
  "gridAndContainers": [
    {
      "section": "Layout > Spacing System",
      "guidance": "- **Base unit**: 8px (with 2 / 4 / 12 sub-tokens for fine work). - **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px. - **Section padding**: 64–96px on marketing surfaces. - **Card internal padding**: 32px on feature/pricing cards."
    },
    {
      "section": "Layout > Grid & Container",
      "guidance": "- Marketing pages center in a ~1280px container with no edge-bleed; the brand keeps content inside the box. - Pricing collapses 4-up → 2-up → 1-up at 1024 / 768 breakpoints. - Product UI mockups stack 2-up or render as overlapping panes inside the same container."
    },
    {
      "section": "Layout > Whitespace Philosophy",
      "guidance": "The brand uses generous 64–96px section padding without atmospheric gradients filling the space — the white canvas is the design. The composited product UI mockups break up sections without requiring decoration."
    },
    {
      "section": "Components > Cards & Containers",
      "guidance": "**`card-feature-light`** — feature card on white. - Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}` 12px, 1px `{colors.hairline}` border. **`card-pricing`** — standard pricing tier. - Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border. Title in `{typography.heading-lg}`, price in `{typography.display-md}`, body in `{typography.body-md}`, CTA `button-primary-green` pinned bottom. **`card-pricing-featured`** — inverted dark featured tier. - Background `{colors.canvas-night}`, text `{colors.on-dark}`, otherwise identical structure. **`card-feature-dark`** — feature card with deep dark fill. - Background `{colors.canvas-night}`, text `{colors.on-dark}`, pad"
    }
  ],
  "responsive": {
    "breakpoints": [
      "1440px",
      "1024px",
      "768px",
      "1023px"
    ],
    "guidance": [
      {
        "section": "Responsive Behavior > Breakpoints",
        "content": "| Name | Width | Key Changes |\n|---|---|---|\n| Wide | ≥ 1440px | Full container width; product mockups at full scale |\n| Desktop | 1024–1440px | Default content max-width; pricing 4-up |\n| Tablet | 768–1023px | Pricing 2-up; mockups simplify to single panel |\n| Mobile | < 768px | Pricing 1-up; hamburger nav; display drops 64 → 36px |"
      },
      {
        "section": "Responsive Behavior > Touch Targets",
        "content": "- Buttons hit ≥ 36×36px on mobile; vertical padding scales up to maintain WCAG AA minimum.\n- Form fields stay at 36px minimum height."
      },
      {
        "section": "Responsive Behavior > Collapsing Strategy",
        "content": "- Display tiers stair-step 64 → 48 → 36 → 28 → 22px.\n- Product UI mockups simplify to a single primary panel on mobile.\n- Pricing tiers stair-step 4-up → 2-up → 1-up; dark featured tier always distinguished."
      },
      {
        "section": "Responsive Behavior > Image Behavior",
        "content": "Product UI mockups use `srcset` with desktop / mobile crops; mobile crops focus on the most actionable inner panel."
      }
    ]
  }
}
```


## 5. Typography

Typography establishes hierarchy before color or decoration. Use the selected families and styles as named roles, retain readable line lengths, and avoid introducing remote font requests when local assets are available.


```json
{
  "families": [
    {
      "family": "DM Sans",
      "provider": "Google Fonts",
      "license": "Open-source font",
      "url": "https://fonts.google.com/specimen/DM+Sans"
    }
  ],
  "styles": {
    "section-title": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "24px (1.50rem)",
      "fontWeight": "700",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "feature-heading": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "18px (1.13rem)",
      "fontWeight": "600",
      "lineHeight": "1.30 (tight)",
      "letterSpacing": "normal"
    },
    "body-bold": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "16px (1.00rem)",
      "fontWeight": "700",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "body": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "16px (1.00rem)",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "button-uppercase": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "600–700",
      "lineHeight": "1.00 (tight)",
      "letterSpacing": "1.4px–2px"
    },
    "button": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "700",
      "lineHeight": "normal",
      "letterSpacing": "0.14px"
    },
    "nav-link-bold": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "700",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "nav-link": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "caption-bold": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "700",
      "lineHeight": "1.50–1.54",
      "letterSpacing": "normal"
    },
    "caption": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "14px (0.88rem)",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "small-bold": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "12px (0.75rem)",
      "fontWeight": "700",
      "lineHeight": "1.50",
      "letterSpacing": "normal"
    },
    "small": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "12px (0.75rem)",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    },
    "badge": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "10.5px (0.66rem)",
      "fontWeight": "600",
      "lineHeight": "1.33",
      "letterSpacing": "normal"
    },
    "micro": {
      "fontFamily": "DM Sans, sans-serif",
      "fontSize": "10px (0.63rem)",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal"
    }
  },
  "guidance": [
    {
      "section": "Design System Inspired by Spotify > 3. Typography Rules > Font Families",
      "guidance": "- **Title**: `DM SansTitle`, fallbacks: `InterSp-Arab, InterSp-Hebr, InterSp-Cyrl, InterSp-Grek, InterSp-Deva, Arimo, Arimo, Arimo, Hiragino Sans, Hiragino Kaku Gothic ProN, Meiryo, MS Gothic` - **UI / Body**: `DM Sans`, same fallback stack"
    },
    {
      "section": "Design System Inspired by Spotify > 3. Typography Rules > Hierarchy",
      "guidance": "| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes | |------|------|------|--------|-------------|----------------|-------| | Section Title | DM SansTitle | 24px (1.50rem) | 700 | normal | normal | Bold title weight | | Feature Heading | DM Sans | 18px (1.13rem) | 600 | 1.30 (tight) | normal | Semibold section heads | | Body Bold | DM Sans | 16px (1.00rem) | 700 | normal | normal | Emphasized text | | Body | DM Sans | 16px (1.00rem) | 400 | normal | normal | Standard body | | Button Uppercase | DM Sans | 14px (0.88rem) | 600–700 | 1.00 (tight) | 1.4px–2px | `text-transform: uppercase` | | Button | DM Sans | 14px (0.88rem) | 700 | normal | 0.14px | Standard button | | Nav Link Bold | DM Sans | 14px (0.88rem) | 700 | normal | normal | Navigation | | Nav Link | DM Sans | 14p"
    },
    {
      "section": "Design System Inspired by Spotify > 3. Typography Rules > Principles",
      "guidance": "- **Bold/regular binary**: Most text is either 700 (bold) or 400 (regular), with 600 used sparingly. This creates a clear visual hierarchy through weight contrast rather than size variation. - **Uppercase buttons as system**: Button labels use uppercase + wide letter-spacing (1.4px–2px), creating a systematic \"label\" voice distinct from content text. - **Compact sizing**: The range is 10px–24px — narrower than most systems. Spotify's type is compact and functional, designed for scanning playlists, not reading articles. - **Global script support**: The extensive fallback stack (Arabic, Hebrew, Cyrillic, Greek, Devanagari, CJK) reflects Spotify's 180+ market reach."
    }
  ]
}
```


## 6. Colors

Use color semantically: primary for the most important action, surfaces to group related information, and borders or contrast to establish separation. Check text contrast in every state, especially on primary actions and dark surfaces.


```json
{
  "tokens": {
    "primary": "#000000",
    "on-primary": "#ffffff",
    "accent-blue": "#2b89ff",
    "ink": "#ffffff",
    "ink-muted": "#b2b6bd",
    "ink-subtle": "#656a76",
    "canvas": "#000000",
    "surface-1": "#15181e",
    "surface-2": "#1f232b",
    "surface-3": "#3b3d45",
    "hairline": "#3b3d45",
    "hairline-soft": "#252830",
    "inverse-canvas": "#ffffff",
    "inverse-ink": "#000000",
    "product-terraform": "#7b42bc",
    "product-terraform-bright": "#911ced",
    "product-vault": "#ffcf25",
    "product-consul": "#e62b1e",
    "product-waypoint": "#14c6cb",
    "product-waypoint-deep": "#12b6bb",
    "product-vagrant": "#1868f2",
    "product-nomad": "#00ca8e",
    "product-boundary": "#f24c53",
    "amber-100": "#fbeabf"
  },
  "guidance": [
    {
      "section": "Colors",
      "guidance": "> Source pages: hashicorp.com/en (home), /en/infrastructure-cloud, /en/products/terraform, /en/pricing, /en/resources?contentType=PDF."
    },
    {
      "section": "Colors > Brand & Accent",
      "guidance": "- **Black** ({colors.primary}): The system primary surface. Canvas, footer, comparison tables, hero — all black. - **White** ({colors.on-primary}): Inverse text on black; canvas of `button-primary`. - **Accent Blue** ({colors.accent-blue}): Hyperlinks across the marketing surface. - **Visited Purple** ({colors.semantic-visited}): Visited-link state."
    },
    {
      "section": "Colors > Surface",
      "guidance": "- **Canvas** ({colors.canvas}): Default page background. - **Surface 1** ({colors.surface-1}): Charcoal one step above canvas — feature cards, pricing cards, resource tiles. - **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, secondary buttons, hovered product chrome. - **Surface 3** ({colors.surface-3}): Three steps above — small chips, badges, sub-nav backgrounds. - **Hairline** ({colors.hairline}): 1px borders on cards and dividers. - **Hairline Soft** ({colors.hairline-soft}): Subtler dividers — comparison-table rows. - **Inverse Canvas** ({colors.inverse-canvas}): Pure white — used as the surface of `button-primary` only."
    },
    {
      "section": "Colors > Text",
      "guidance": "- **Ink** ({colors.ink}): All headline and emphasized body type — pure white. - **Ink Muted** ({colors.ink-muted}): Secondary type at #b2b6bd — meta info, footer columns. - **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #656a76 — form helper text, timestamps, footnotes."
    }
  ]
}
```


## 7. Components

Build reusable, accessible primitives first. Buttons and fields own their geometry and states; cards and containers own their surface treatment, spacing, and elevation. Do not copy unrelated visual choices between these categories.

### Shape and cards


```json
{
  "radii": {
    "xs": "4px",
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "cards": {
    "button-primary-green": {
      "backgroundColor": "{colors.primary}",
      "textColor": "{colors.on-primary}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-primary-green-pressed": {
      "backgroundColor": "{colors.primary-deep}",
      "textColor": "{colors.on-primary}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-secondary-outline": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-on-dark": {
      "backgroundColor": "{colors.canvas-night}",
      "textColor": "{colors.on-dark}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-link": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.xs}",
      "padding": "0px"
    },
    "text-input": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 12px"
    },
    "card-feature-light": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.lg}",
      "padding": "32px"
    },
    "card-pricing": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.lg}",
      "padding": "32px"
    },
    "card-pricing-featured": {
      "backgroundColor": "{colors.canvas-night}",
      "textColor": "{colors.on-dark}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.lg}",
      "padding": "32px"
    },
    "card-feature-dark": {
      "backgroundColor": "{colors.canvas-night}",
      "textColor": "{colors.on-dark}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.lg}",
      "padding": "32px"
    },
    "code-block": {
      "backgroundColor": "{colors.canvas-night}",
      "textColor": "{colors.on-dark}",
      "typography": "{typography.code}",
      "rounded": "{rounded.sm}",
      "padding": "16px"
    },
    "pill-tag-green": {
      "backgroundColor": "{colors.primary}",
      "textColor": "{colors.on-primary}",
      "typography": "{typography.micro}",
      "rounded": "{rounded.full}",
      "padding": "2px 8px"
    }
  },
  "guidance": [
    {
      "section": "Components > Buttons",
      "guidance": "**`button-primary-green`** — the signature CTA. - Background `{colors.primary}`, text `{colors.on-primary}` (near-black, NOT white), type `{typography.button-md}`, padding `{spacing.sm} {spacing.lg}` (8px 16px), rounded `{rounded.sm}` 6px. - Pressed state `button-primary-green-pressed` shifts to `{colors.primary-deep}`. **`button-secondary-outline`** — outline alternative on white. - Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}` border, same shape. **`button-on-dark`** — used on dark surfaces / code-block CTAs. - Background `{colors.canvas-night}`, text `{colors.on-dark}`, same shape. **`button-link`** — text-only inline button. - Transparent backgro"
    },
    {
      "section": "Components > Cards & Containers",
      "guidance": "**`card-feature-light`** — feature card on white. - Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}` 12px, 1px `{colors.hairline}` border. **`card-pricing`** — standard pricing tier. - Background `{colors.canvas}`, padding `{spacing.xxl}`, rounded `{rounded.lg}`, 1px `{colors.hairline}` border. Title in `{typography.heading-lg}`, price in `{typography.display-md}`, body in `{typography.body-md}`, CTA `button-primary-green` pinned bottom. **`card-pricing-featured`** — inverted dark featured tier. - Background `{colors.canvas-night}`, text `{colors.on-dark}`, otherwise identical structure. **`card-feature-dark`** — feature card with deep dark fill. - Background `{c"
    },
    {
      "section": "Components > Inputs & Forms",
      "guidance": "**`text-input`** — standard form input. - Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm} {spacing.md}` (8px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline}` border."
    },
    {
      "section": "Components > Navigation",
      "guidance": "**`nav-bar-light`** — top nav across the site. - Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.lg} {spacing.xl}`. Logo on the left, primary nav center, \"Sign In\" link + filled `button-primary-green` on the right."
    }
  ]
}
```


### Elevation


```json
{
  "tokens": {},
  "guidance": [
    {
      "section": "Elevation & Depth",
      "guidance": "| Level | Treatment | Use | |---|---|---| | 0 | Flat, 1px hairline | Default cards | | 1 | `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` | Subtle card lift | | 2 | `box-shadow: 0 8px 24px rgba(0,0,0,0.08)` | Floating composited UI mockups | | 3 | `box-shadow: 0 16px 48px rgba(0,0,0,0.12)` | Modal overlays, deep elevation |"
    },
    {
      "section": "Elevation & Depth > Decorative Depth",
      "guidance": "The brand's depth is **product UI mockups** rather than gradients. Stacked dashboard / SQL editor / log panes composite together with subtle Level 2 shadows to suggest spatial hierarchy."
    }
  ]
}
```


### Buttons


```json
{
  "tokens": {
    "button-primary-green": {
      "backgroundColor": "{colors.primary}",
      "textColor": "{colors.on-primary}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-primary-green-pressed": {
      "backgroundColor": "{colors.primary-deep}",
      "textColor": "{colors.on-primary}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-secondary-outline": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-on-dark": {
      "backgroundColor": "{colors.canvas-night}",
      "textColor": "{colors.on-dark}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 16px"
    },
    "button-link": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.button-md}",
      "rounded": "{rounded.xs}",
      "padding": "0px"
    }
  },
  "guidance": [
    {
      "section": "Components > Buttons",
      "guidance": "**`button-primary-green`** — the signature CTA. - Background `{colors.primary}`, text `{colors.on-primary}` (near-black, NOT white), type `{typography.button-md}`, padding `{spacing.sm} {spacing.lg}` (8px 16px), rounded `{rounded.sm}` 6px. - Pressed state `button-primary-green-pressed` shifts to `{colors.primary-deep}`. **`button-secondary-outline`** — outline alternative on white. - Background `{colors.canvas}`, text `{colors.ink}`, 1px solid `{colors.hairline-strong}` border, same shape. **`button-on-dark`** — used on dark surfaces / code-block CTAs. - Background `{colors.canvas-night}`, text `{colors.on-dark}`, same shape. **`button-link`** — text-only inline button. - Transparent backgro"
    }
  ]
}
```


### Fields and controls


```json
{
  "tokens": {
    "text-input": {
      "backgroundColor": "{colors.canvas}",
      "textColor": "{colors.ink}",
      "typography": "{typography.body-md}",
      "rounded": "{rounded.sm}",
      "padding": "8px 12px"
    }
  },
  "guidance": [
    {
      "section": "Components > Inputs & Forms",
      "guidance": "**`text-input`** — standard form input. - Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, padding `{spacing.sm} {spacing.md}` (8px 12px), rounded `{rounded.sm}` 6px, 1px `{colors.hairline}` border."
    }
  ]
}
```


## 8. Navigation

- Separate editorial home, current news, sections, search, and saved content.
- Keep section and reading context when opening related content.
- Help people continue reading without interrupting the primary article.


## 9. Interaction Patterns

- Prioritize reading while allowing save, share, and follow actions.
- Preserve reading position and saved items.
- Make corrections, updates, and sources accessible from the content.

### Discovery patterns

- Editorial front page
- Topic sections
- Breaking news
- Search


## 10. Responsive / Mobile

Design the smallest useful composition first, then enhance it as space increases. Keep primary actions reachable, preserve context while reflowing content, and do not hide required information behind hover-only interactions. Respect touch targets, keyboard navigation, visible focus, and reduced-motion preferences.

Use the responsive guidance in the layout reference above as the product-specific breakpoint contract.

## 11. Product-specific UX

### Trust and safety

- Distinguish news, opinion, sponsored material, and generated or edited content.
- Make corrections, dates, and relevant sources visible.
- Avoid patterns that encourage sharing without comprehension.

### Recommended patterns

- Hierarchical front page
- Focused article page
- Section navigation
- Related-context blocks


## 12. Do / Don't

Do:

- Use hierarchical front page when it supports the user's task.
- Use focused article page when it supports the user's task.
- Use section navigation when it supports the user's task.
- Use related-context blocks when it supports the user's task.

Don't:

- Making controls and promotions compete with the article.
- Treating every story as equally urgent.
- Hiding date, author, or sponsored nature.



## 13. Agent Implementation Rules

- Implement the values in `resolvedCss` and the resolved component definitions before introducing new tokens.
- Keep color and typography global; apply button, field, card, and layout geometry only to their respective primitives.
- Use accessible shadcn/ui-compatible patterns, semantic HTML, keyboard support, visible focus, and `prefers-reduced-motion`.
- Treat the exported palette mode as part of the product UI. The editor sidebar is not part of the exported design.
- Keep components composable. Add a variant only when it represents a repeatable semantic or behavioral difference.
- Validate contrast, loading, empty, error, disabled, and long-content states before considering a screen complete.
- When information conflicts, prioritize the product objective and information architecture over visual novelty.


### Delivery checklist

- Start each screen by identifying the primary user decision. Make the supporting data, state, and primary action visible without requiring a search for them.
- Build semantic structure before styling: headings for groups, labels for controls, lists for repeated content, tables for comparison, and buttons only for actions.
- Keep user context stable. Preserve filters, drafts, selections, tabs, pagination, scroll position, and focus when a user returns from a detail view whenever it is safe to do so.
- Use responsive layouts as re-composition, not simple shrinking. Move secondary regions below the task, simplify dense rows carefully, and retain labels and status information.
- Design all interaction states deliberately. A component that has no loading, error, disabled, empty, or long-content behavior is incomplete.
- Keep confirmation proportional to consequence. Explain scope and result for destructive or high-impact changes, but do not insert routine confirmation dialogs that slow reversible work.
- Give validation feedback close to the relevant field and in plain language. Preserve entered values after errors unless a security constraint requires otherwise.
- Make asynchronous behavior legible. Keep stable layout during loading, show what changed after a mutation, and offer a recovery path when an operation fails.
- Test with keyboard navigation, zoom, reduced motion, narrow viewports, long translations, empty datasets, slow responses, and content that exceeds the expected size.

### Decision precedence

When a visual choice and a user need conflict, protect the user need. When a source reference and a resolved token conflict, use the resolved token. When a compact mobile layout and a desktop structure conflict, preserve the primary task and defer supporting detail. When an interaction is ambiguous, favor a clear label and visible consequence over cleverness.

### Quality bar

A completed interface should let a first-time user identify where they are, what information is current, what can be changed, and what will happen after the primary action. It should also let a returning user resume work without reconstructing context. Every screen should remain coherent when data is missing, when there is more data than expected, and when an operation is unavailable. The system is successful when its rules make ordinary screens easier to build and exceptional states easier to understand.

### Screen construction workflow

1. Define the screen contract in one sentence: who uses it, what they need to know, and the action that moves their work forward. If the sentence contains several unrelated goals, split the experience or establish a clear primary path.
2. List the decision-critical content before choosing a layout. Promote facts that change a decision; defer reference detail, history, and supporting actions until they are requested or become necessary.
3. Choose the smallest set of semantic regions that supports the workflow: page heading, navigation context, primary content, supporting context, and persistent action area where needed. Avoid card nesting merely to create visual variety.
4. Apply the information hierarchy with the selected type scale and spacing tokens. Use size, position, and grouping to distinguish page title, section heading, item label, value, metadata, and help text.
5. Select reusable components before composing custom controls. A custom element must have a clear semantic role, a complete state model, and a repeatable reason to exist.
6. Implement the happy path and then test interruption: invalid data, no data, loading, network failure, loss of permission, long labels, and a changed selection. Keep the user's orientation and recovery options visible.
7. Recompose for mobile after the information model is stable. Preserve the same priority order, not necessarily the same visual arrangement. Move secondary context below the task and expose it with an explicit control when space is limited.
8. Review the final screen at realistic density. Test the shortest and longest labels, zero and many items, locale expansion, magnification, and browser zoom. A layout that works only with sample copy is not a reusable system.

### Component contracts

A button communicates an action, not navigation disguised as an action. Give it a specific verb, show its busy state without changing its position, and prevent duplicate submission while a request is in flight. Use a link for navigation and make external destinations clear when the context requires it.

A field needs a persistent label, an expected format when ambiguity is likely, an accessible description for constraints, and an error message tied to the field. Placeholder text is an example, not a label. Group related inputs under a visible heading, and do not clear user-entered values after a recoverable validation failure.

A menu exposes a compact set of contextual choices. Keep the trigger label or icon understandable, support keyboard movement and escape, return focus to the trigger, and avoid putting destructive actions beside routine actions without separation. Use a dialog only when the user must make a focused decision before continuing.

A card groups a coherent unit of information or action. It is not a default wrapper for every paragraph. If a region has no independent task, state, or scan boundary, prefer normal page structure and spacing. Keep whole-card clicks, internal links, and nested buttons from competing for the same interaction.

A table supports comparison and operational scanning. Keep headers visible where practical, align numbers for comparison, expose sorting and filtering state, provide an alternative presentation at narrow widths, and retain the row identity when opening details or returning to the list.

### State and feedback rules

Use optimistic updates only when the operation is safe, reversible, and the result is highly predictable. Otherwise, show pending state and confirm the completed result. Success messages should state what changed and disappear only after users have enough time to read them. Errors should state what failed, whether user data was preserved, and the next recovery action.

For empty states, distinguish between first use, no matching results, no permission, temporary unavailability, and completed cleanup. Each condition needs different copy and a different next action. Do not use a generic illustration where a concise explanation and an actionable control would be more useful.

For destructive changes, make consequences proportionate and concrete. Name the affected record or collection, describe the irreversible portion, and show dependent effects when known. Favor undo for low-risk reversible actions; reserve confirmation for changes that cannot be reasonably recovered.

### Accessibility baseline

All functionality must be available with keyboard alone. Focus must be visible against every supported surface and travel in a predictable order. Associate labels, instructions, errors, and status updates programmatically with their controls. Use native controls when possible; when a custom control is necessary, reproduce its expected keyboard behavior and semantic role.

Do not rely on hover, drag, color, sound, or motion as the sole carrier of information. Respect reduced-motion settings by removing nonessential movement, and avoid motion that obscures state changes. Verify text contrast, non-text contrast, touch target size, zoom behavior, and readable focus outlines across the selected palette mode.

Treat these rules as a quality floor. Product-specific requirements may add detail, but they must not weaken clarity, accessibility, recoverability, or the consistency of the selected design system.

## Resolved CSS

```css
:root {
  --background: #000000;
  --card: #15181e;
  --popover: #15181e;
  --foreground: #ffffff;
  --primary: #000000;
  --primary-foreground: #ffffff;
  --border: #3b3d45;
  --muted-foreground: #b2b6bd;
  --muted: color-mix(in srgb, #15181e, #ffffff 7%);
  --secondary: #1f232b;
  --secondary-foreground: #ffffff;
  --accent: #3b3d45;
  --accent-foreground: #ffffff;
  --success: #00ca8e;
  --warning: #ffcf25;
  --destructive: #e62b1e;
  --info: #2b89ff;
  --radius: 8px;
  --card-radius: 12px;
  --button-radius: 6px;
  --input-radius: 6px;
  --preview-font: DM Sans, sans-serif;
  --heading-font: DM Sans, sans-serif;
  --mono-font: 'JetBrains Mono', monospace;
  --body-size: 16px;
  --body-weight: 400;
  --body-leading: 1.5;
  --heading-size: 24px;
  --heading-weight: 700;
  --heading-tracking: 0px;
  --heading-leading: 1.15;
  --button-weight: 500;
  --button-tracking: 0px;
  --button-padding: 8px 16px;
  --input-padding: 8px 12px;
  --gallery-gap: 16px;
  --sample-padding: 24px;
  --preview-columns: 2;
  --sample-shadow: 0 1px 3px rgba(0,0,0,0.06);
  --input-height: 44px;
  --input-bg: #000000;
  --input-color: #ffffff;
  --input-border: #3b3d45;
  --input-focus-width: 2px;
  --input-focus-bg: #000000;
  --input-focus-color: #000000;
  --input-focus-shadow: 0 0 0 3px color-mix(in srgb, #000000, transparent 80%);
}
```

## Local Font Assets

Copy these font family folders from `public/fonts` with their licenses. Load their local stylesheets and do not add runtime Google Fonts requests. Font files are not embedded in this Markdown.

```json
[
  {
    "family": "DM Sans",
    "stylesheet": "/fonts/dm-sans/font.css",
    "files": [
      "/fonts/dm-sans/f4e8a65e4dc0d72d.ttf",
      "/fonts/dm-sans/bd3286149a123f93.ttf",
      "/fonts/dm-sans/9ca12861e40c8add.ttf",
      "/fonts/dm-sans/24ba74e1b36dbe94.ttf",
      "/fonts/dm-sans/1d1b2dc337b4f025.ttf",
      "/fonts/dm-sans/0348c5b8c3060783.ttf",
      "/fonts/dm-sans/70e074455d6b9e0a.ttf",
      "/fonts/dm-sans/e7f62cb72d669686.ttf",
      "/fonts/dm-sans/190e13314888e7c6.ttf",
      "/fonts/dm-sans/fe5eb4d77e035c96.ttf",
      "/fonts/dm-sans/21353ee092ca5f7e.ttf",
      "/fonts/dm-sans/86b5709fc72608e5.ttf",
      "/fonts/dm-sans/0569c822cab6c510.ttf",
      "/fonts/dm-sans/9bd8ba39c9d55e06.ttf",
      "/fonts/dm-sans/18e69125ce1f964e.ttf",
      "/fonts/dm-sans/8257aa2626c379cb.ttf",
      "/fonts/dm-sans/613415ecf5833cac.ttf",
      "/fonts/dm-sans/13523a93dcccf149.ttf"
    ],
    "licenseSource": "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt"
  },
  {
    "family": "JetBrains Mono",
    "stylesheet": "/fonts/jetbrains-mono/font.css",
    "files": [
      "/fonts/jetbrains-mono/407f551cd6eab89d.ttf",
      "/fonts/jetbrains-mono/8cdb8fdaad0072f4.ttf",
      "/fonts/jetbrains-mono/10a2db2b4f2467d0.ttf",
      "/fonts/jetbrains-mono/8a16071270fd8d41.ttf",
      "/fonts/jetbrains-mono/8e656f506864a215.ttf",
      "/fonts/jetbrains-mono/b85424b49e5b4a6e.ttf",
      "/fonts/jetbrains-mono/7029837dc9f88ccc.ttf",
      "/fonts/jetbrains-mono/166a964210cc6404.ttf",
      "/fonts/jetbrains-mono/7109d828b1b0c129.ttf",
      "/fonts/jetbrains-mono/7528dadceedc59c2.ttf",
      "/fonts/jetbrains-mono/b95b576b0912b261.ttf",
      "/fonts/jetbrains-mono/6d83b1a12212ea9e.ttf",
      "/fonts/jetbrains-mono/655ecee898b68ff3.ttf",
      "/fonts/jetbrains-mono/5f6675d606a21f26.ttf",
      "/fonts/jetbrains-mono/c1c656933a1f4b14.ttf",
      "/fonts/jetbrains-mono/32bf30e94c6c5d0b.ttf"
    ],
    "licenseSource": "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt"
  }
]
```

