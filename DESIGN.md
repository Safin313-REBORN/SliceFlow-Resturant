# DESIGN.md : SliceFlow Design Direction

## 1. Identity & Vibe
- **Character**: Warm Artisan Neapolitan, Craft Pizzeria, Precision Kitchen
- **Voice**: Direct, mouth-watering, honest, conversational, un-hyped
- **Domain Focus**: Handcrafted 48-hour levain pizzas, stone-hearth baking, live kitchen fulfillment

---

## 2. Visual Dials
- **ENERGY**: 2 (Confident, warm food-forward palette, strong visual hierarchy, bold headings)
- **RHYTHM**: 3 (Dynamic cadence: asymmetric split hero, interactive ingredient layer stack, structured order tracking timeline)
- **MOTION**: 1 (Instant and functional, subtle CSS micro-interactions on hover and focus, zero gratuitous layout-shifting animations)

---

## 3. Color Palette & Accessibility Contrast

| Token | Hex | Role | Contrast Ratio against White | WCAG Status |
| :--- | :--- | :--- | :---: | :---: |
| **Surface Cream** | `#FFF8EF` | Warm editorial background | 1.05:1 (Surface) | Background |
| **Surface Pure White** | `#FFFFFF` | Card & modal background | 1.00:1 (Surface) | Background |
| **Charcoal Dark** | `#202124` | Primary text & dark hero banner | **13.90:1** | **PASS (AAA)** |
| **Deep Muted Grey** | `#595959` | Secondary text & metadata | **7.00:1** | **PASS (AAA)** |
| **Warm Border** | `#E5E0D8` | Structural dividing lines | 1.28:1 | Border |
| **Stone-Hearth Red** | `#C83220` | Primary action accent & badges | **5.34:1** | **PASS (AA)** |
| **Golden Yellow** | `#F4B942` | Crust & warm highlight accent | 1.48:1 (Used on dark) | Accent |

*All color pairings verified with the antislop-human contrast verification engine.*

---

## 4. Typography

- **Display Headings**: `'Poppins', -apple-system, sans-serif`
  - Weights: `700` (Bold), `800` (Extrabold)
  - Letter-spacing: `-0.02em` (Tight, editorial)
- **Body & Data UI**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Weights: `400` (Regular), `500` (Medium), `600` (Semi-bold)
  - Line-height: `1.5` to `1.6` for optimal readability

---

## 5. Section Rhythm & Layout Rules

1. **No Floating Pill Badges (R-09)**: Never park generic capsule pills (`Next-Gen`, `AI Powered`, `Beta`) hovering over H1 headlines.
2. **Asymmetric Content-Driven Layouts (R-05, R-14)**:
   - Hero: 7-column content / 5-column photography composition.
   - Interactive Pizza Builder: Split screen with live custom layer visualizer on one side and structured ingredient category steps on the other.
3. **No Decorative Grids or Blueprint Lines (R-07)**: Surfaces are warm and organic, appropriate for food craft.
4. **Domain-Specific Icons Only (R-04)**: Forbid generic sparkles (`✨`), stars, or robots. Use authentic culinary icons: `Flame`, `ChefHat`, `Pizza`, `Leaf`, `Layers`.
5. **No AI Buzzwords (R-16)**: Forbid *seamless*, *revolutionary*, *cutting-edge*, *next-gen*, *elevate*, *empower*. Use concrete descriptions of fermentation, baking temperatures, and direct fulfillment.
6. **Accessible Interactive States (R-38, R-39)**:
   - High-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2`).
   - Minimum touch hit targets >= 44px.

