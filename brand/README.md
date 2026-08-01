# Elevate Digitals — brand assets

## Palette

| Role | Hex | Use |
|---|---|---|
| Concrete | `#EDEDEA` | Page background |
| Concrete dark | `#D8D8D3` | Borders, dividers, cards |
| Ink | `#1A1A18` | All body and heading text |
| Grey | `#56585C` | Secondary text |
| Hi-vis | `#C8F31D` | Accent only — buttons, links, active states |

**The one hard rule:** hi-vis only ever carries ink text on top of it. White or light text on `#C8F31D` fails contrast and looks amateur. Dark on lime, or lime as a small accent on concrete. Never lime as a background for light text.

Use the accent sparingly — buttons, active nav, one or two highlights per screen. It stops working the moment it's everywhere.

## The mark

An `E` rotated 90°: the spine lies horizontal, the three arms rise from it in ascending heights. Reads as a letterform up close and as upward movement at favicon size. No gradient, no transparency, no bevels — it holds at 16px and prints in one colour.

## Files

**Lockups** (horizontal, mark + stacked wordmark)
- `logo-horizontal-ink.svg` — on light backgrounds. The default.
- `logo-horizontal-concrete.svg` — on dark backgrounds
- `logo-horizontal-lime-mark.svg` — lime mark, ink type, on light
- `logo-horizontal-lime-mark-on-dark.svg` — lime mark, concrete type, on dark
- `logo-horizontal-ink-800.png` — raster for email signatures

**Mark alone**
- `mark-ink.svg`, `mark-lime.svg` — transparent background

**Icons and social**
- `favicon.svg` + `favicon-180.png` — browser tab and Apple touch icon
- `app-icon.svg` / `app-icon-512.png` — rounded corners, for app-style contexts
- `profile-square.svg` / `profile-square-1000.png` — WhatsApp Business, Instagram, Facebook, LinkedIn. Square corners; every platform crops to a circle itself and the mark sits well inside the safe area.
- `og-image.svg` / `og-image-1200x630.png` — link preview. **Use the PNG.** The SVG's headline text is live text in Archivo; it will fall back to a different font on machines without it.

**Email**
- `email-signature.html` — paste as HTML. Host `logo-horizontal-ink-800.png` on your own domain first and update the `src`; Gmail blocks images hosted on random services.

## Typeface

Archivo — a grotesque built for signage and small sizes. Free on Google Fonts. Use weight 600 for headings and the wordmark, 400–500 for body. If you want one typeface only, use Archivo throughout.

## Clear space

Leave at least the height of the mark's bottom bar as clear space on all sides of the lockup. Don't place the lockup on a photo, don't add a shadow, don't stretch it, don't recolour the mark to anything outside the palette.
