# Telebuzzy v1 theme integration

**Status:** Active on every route
**Visual contract:** [Design Contract v1.0](design-contract-v1.md)

## Token layer

- `telebuzzy-frontend/src/app/globals.css` defines the `--tb-*` brand tokens on an unlayered `:root` and maps the shared semantic aliases (`--background`, `--primary`, `--ring`, `--main`, `--success` and the other `@mydaogs/ui` tokens) onto them, so the kit and Tailwind read the brand palette everywhere
- Tailwind v4 `@theme inline` exposes them as `tb-*` utilities, for example `bg-tb-brand-yellow`, `text-tb-ink-primary`, `rounded-tb-card`, `shadow-tb-card`, `ease-tb-out` and `font-display` (Fredoka)
- Do not scatter brand HEX values through JSX; add a token instead
- Fonts are loaded with `next/font` in `src/app/layout.tsx`: Geist Sans (UI/body), Geist Mono (code), Fredoka 600/700 (display headings, `font-display`)

## Palette and semantic usage

| Role | Token | Notes |
| --- | --- | --- |
| Main action | `--tb-brand-blue-strong` | White text, contrast ~5.33:1 (`.tb-cta-blue`) |
| Kit button fill | `--main` = `--tb-brand-yellow` | Ink text, contrast ~10.76:1 |
| Decorative blue | `--tb-brand-blue-bright` | Not for small white-background text |
| Decorative pink | `--tb-brand-pink` | Rings and dots only, not for small text |
| Primary text | `--tb-ink-primary` | Contrast ~15.13:1 on white |
| Secondary text | `--tb-ink-secondary` | Contrast ~5.82:1 on white |
| Decorative border | `--tb-border-default` | Not sufficient alone for a critical control boundary |
| Strong control border | `--tb-border-strong` | ~4.08:1 on white; ≥3.69:1 on the four light surfaces |
| Severity info | `--tb-status-info-bg` / `--tb-status-info-dot` | Background and indicator for informational events |
| Severity warning | `--tb-status-warning-bg` / `--tb-status-warning-dot` | Background and indicator for warnings |
| Severity critical | `--tb-status-critical-bg` / `--tb-status-critical-dot` | Background and indicator for critical events |
| Feedback | `--tb-semantic-success`, `--tb-semantic-warning`, `--tb-semantic-danger` | Use text/icon with color, never color alone |

`--tb-surface-muted` and `--tb-border-strong` extend the contract palette for UI ergonomics

## Buttons and focus

- `@mydaogs/ui@0.9.2` renders every Button variant, including kit-internal ghost buttons such as `CopyToClipboardBtn`, with `text-main-foreground`. `--main-foreground` is therefore ink, which is readable on white, cream, sky and on the yellow `--main` fill of the `default` variant
- Never use `variant="primary"`: ink on `--primary` blue is ~2.84:1
- App CTAs are links or `variant="unset"` buttons with the component classes from `globals.css`: `.tb-cta-blue` (primary), `.tb-cta-white` (secondary), `.tb-cta-yellow` (playful), plus `.tb-pressable` for the `scale(0.97)` press feedback
- `--border-radius` is set alongside `--radius` because the kit reads control rounding from the former
- Focus is a solid 2 px `--tb-brand-blue-strong` outline with 3 px offset (≥4.82:1 on white, cream, sky and muted), replacing the kit's 50%-alpha ring; forced-colors mode uses `Highlight`
- Inside a `.tb-on-dark` container (the `#282B2E` code window) the focus ring is white (14.24:1) instead of blue (2.67:1); its offset keeps it on the dark gap, not on a selected yellow tab

## Backdrop and surfaces

- `src/components/Backdrop/Backdrop.tsx` is a fixed, `aria-hidden`, pointer-transparent layer mounted once in the root layout:
  - `public/tt-bg.webp` fills the viewport top to bottom with `object-cover object-center`, so narrow screens show its middle vertical slice
  - `public/tt-logo.webp` floats near the top and bobs slowly
  - `public/tt-head.webp` peeks up from below the bottom edge, rising and sinking while tipping side to side
- Geometry is shared through `--tb-logo-top`, `--tb-logo-width`, `--tb-logo-height` and `--tb-head-width`; the hero spacer uses them to keep the logo uncovered on first paint and the footer margin uses them to reveal the head at the end of the page
- All readable content sits on `.tb-card` (near-opaque cream) or white surfaces; no text is placed directly on the landscape
- The three WebP files in `public/` are the brand master assets (SHA-256 in the design contract §3); there are no PNG versions. `next/image` derives responsive sizes from them at request time

## Motion

- Backdrop loops are CSS keyframes (off the main thread): an outer wrapper plays a one-off entrance, an inner wrapper loops, so the two transforms never conflict. Loops use a sine-like `--tb-ease-bob`; entrances use `--tb-ease-out`
- Hero content rises in once with a short stagger (`.tb-rise`, `--tb-delay`)
- `prefers-reduced-motion: reduce` removes the loops and movement, keeping opacity fades only
- Hover effects are gated behind `(hover: hover) and (pointer: fine)`

## Review checklist

1. Screenshot review at 320 / 375 / 768 / 1024 / 1440 / 1920 px and 200% zoom
2. Contrast and keyboard focus of dialogs, secrets, billing and code blocks
3. Auth, API key, Telegram and wallet flows behave as specified in the product code
4. Rights/pricing/testnet caveats from the design contract are addressed before a commercial release
