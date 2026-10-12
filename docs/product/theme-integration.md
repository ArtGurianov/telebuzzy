# Telebuzzy v1 theme integration

**Status:** Foundation only / opt-in (no runtime activation)
**Visual contract:** [Design Contract v1.0](design-contract-v1.md)

## Scope and rollout

- The new `--tb-*` variables are defined on `:root` and exposed through Tailwind v4 `@theme inline` as `tb-*` utilities, for example `bg-tb-brand-yellow`, `text-tb-ink-primary` and `rounded-tb-card`
- The shared semantic aliases (`--background`, `--primary`, `--ring`, `--main`, `--success`, and the other `@mydaogs/ui` tokens) switch only inside `.tb-theme`
- Do **not** add `.tb-theme` to the global layout yet: the existing body still has a repeated `/bg-image.png` background, a 720 px main container and legacy pages that have not been visually regression-tested
- When redesigning a route, choose an explicit `tb-theme` root scope; when promoting it to the body, remove the old image/background treatment in the same reviewed UI change
- Tailwind aliases and `--tb-*` names are stable v1 foundations; do not scatter arbitrary brand HEX values through JSX
- Design contract is still **Proposal**, not approval to release or change pricing, authorization, or API behavior

## Palette and semantic usage

| Role | Token | Notes |
| --- | --- | --- |
| Main action | `--tb-brand-blue-strong` | White text, contrast ~5.33:1 |
| Decorative blue | `--tb-brand-blue-bright` | Not for small white-background text |
| Decorative pink | `--tb-brand-pink` | Not for small white-background text |
| Highlight | `--tb-brand-yellow` | Pair with `--tb-ink-primary` |
| Primary text | `--tb-ink-primary` | Contrast ~15.13:1 on white |
| Secondary text | `--tb-ink-secondary` | Contrast ~5.82:1 on white |
| Decorative border | `--tb-border-default` | Not sufficient alone for a critical control boundary |
| Strong control border | `--tb-border-strong` | ~4.08:1 on white; ≥3.69:1 on the four approved light surfaces |
| Severity info | `--tb-status-info-bg` / `--tb-status-info-dot` | Background and indicator for informational events |
| Severity warning | `--tb-status-warning-bg` / `--tb-status-warning-dot` | Background and indicator for warnings |
| Severity critical | `--tb-status-critical-bg` / `--tb-status-critical-dot` | Background and indicator for critical events |
| Feedback | `--tb-semantic-success`, `--tb-semantic-warning`, `--tb-semantic-danger` | Use text/icon with color, never color alone |

The `--tb-surface-muted` and `--tb-border-strong` implementation helpers extend the contract palette for UI ergonomics; they do not alter any master asset

## Button and keyboard-focus compatibility (required before activation)

- `@mydaogs/ui@0.9.2` uses `text-main-foreground` for every Button variant, including pale/transparent ones; setting `--main-foreground` to ink globally would make the blue primary unreadable (2.84:1)
- For all **new scoped-theme** buttons, import `TelebuzzyButton` from `@/components/Buttons/TelebuzzyButton` rather than importing a raw kit `Button`
- The adapter adds `tb-button-ink` to `secondary`, `outline`, `flat`, `ghost` and `link` variants; inside `.tb-theme` CSS gives them readable ink even on hover while the primary retains white on blue
- This is not an upstream kit fix: existing kit buttons, kit-owned secondary controls and direct `Button` usages will still need inspection/migration during phase 2; **do not activate `.tb-theme` on routes until every button has been audited**
- The scoped solid 2 px outer focus outline uses `--tb-brand-blue-strong` (≥4.82:1 against white, cream, sky and muted backgrounds), rather than relying on the kit's 50%-alpha ring; high-contrast forced-colors mode uses `Highlight`
- `--border-radius` is set alongside `--radius` inside `.tb-theme` because the kit reads control rounding from the former

## UI kit and typography integration

- Keep the existing `@mydaogs/ui` shadow contract (`--shadow` and the zero-offset shadow controls) unchanged
- The current UI kit uses `--accent-foreground` as a ghost/outline hover background; the scoped theme intentionally supplies a pale sky value, not dark text. Recheck this mapping against the installed kit before activating the theme
- `--color-background`, `--color-primary`, and existing Tailwind semantic mappings continue to read their inherited CSS variables and follow `.tb-theme` when it is applied
- `Fredoka` for display headings is a future `next/font` layout-level change and is **not** loaded by this CSS-only foundation PR
- Required brand PNGs are described with SHA-256 in the design contract but **are not added** to the repository in this foundation PR

## Activation gate

Before applying `.tb-theme` to live routes, confirm:

1. Replace/audit all raw kit Button usages in the activated scope, including hover for secondary / outline / flat / ghost / link; verify all variants in the actual installed kit
2. Screenshot review at 320 / 375 / 768 / 1024 / 1440 / 1920 px and 200% zoom
3. Contrast and keyboard focus of dialogs, secrets, billing and code blocks
4. Existing auth, API key, Telegram and wallet flows remain unchanged
5. Correct asset placement and the rights/pricing/testnet caveats from the design contract are addressed

## Validation for this documentation/CSS PR

- The design contract remains a proposal; master PNGs are not committed here, and the recorded SHA-256 values were validated against the *specific* supplied originals `tt-bg(3).png`, `tt-head.png` and `tt-logo(4).png` (other exports are not guaranteed identical)
- Static checks: theme aliases point to declared tokens, CSS block delimiters balance, legacy semantic declarations remain unmodified; RGB contrast has been evaluated on the four approved light backgrounds
- No route receives `.tb-theme` in this PR, so no intentional visual change to the existing site
- An actual kit button-variant screenshot/regression run and a full frontend build remain outstanding; frontend installs require valid environment variables and register a Telegram webhook during postinstall
