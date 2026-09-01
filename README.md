# Orynza Website

Static site (no framework, no build step) for **Orynza** — the customer-facing brand of
**Orynza Global LLC** (New Mexico). Sells website design, website graphics design, CV design,
and digital courses/guides.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home |
| `/website-design` | Website Design service — $80 / $200 / $500 tiers |
| `/graphics-design` | Website Graphics Design service — $10 / $50 / $80 tiers |
| `/cv-design` | CV Design service — $30 flat |
| `/courses` | Course catalog — "How to Grow Your Instagram Account" ($29 PDF guide) |
| `/about` | About Orynza / Orynza Global LLC |
| `/contact` | Contact / quote request form (Formspree) |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/refund` | Refund Policy |

Shared styling lives in `styles.css`. Shared behavior lives in `assets/js/`:
- `config.js` — single source of truth for Paddle + Formspree credentials
- `checkout.js` — Paddle Billing v2 checkout wrapper (flag-gated until Paddle approves)
- `main.js` — mobile nav toggle, footer year, contact form handling

## Local preview

No build step needed. From this folder, run either:

```bash
npx serve .
```
or
```bash
python -m http.server 8000
```

Then open the printed local URL in a browser.

## Before going live — checklist

- [ ] Register a domain and point it at your chosen host.
- [ ] Deploy to a static host (Netlify, Cloudflare Pages, GitHub Pages, or similar) and connect the domain.
- [ ] Apply for a Paddle merchant account using this live site (Paddle requires clear pricing + Terms/Privacy/Refund pages before approving — all included here).
- [ ] Once approved, create one Paddle Product/Price per package (8 total: 3 website tiers, 3 graphics tiers, CV design, the Instagram course) and copy each `pri_...` id into `assets/js/config.js`.
- [ ] Paste your Paddle client-side token into `config.js`, flip `PADDLE_ENABLED: true`, and set `PADDLE_ENV: "production"` after testing each checkout in sandbox.
- [ ] Create a free [Formspree](https://formspree.io) account, create one form, and replace `REPLACE_ME` in `config.js` and in the `action` attribute of the form in `/contact`.
- [ ] Fill in the `[bracketed placeholders]` in `/terms`, `/privacy`, and `/refund` (dates, exact refund windows).
- [ ] Have `/terms`, `/privacy`, and `/refund` reviewed by an attorney before publishing.
- [ ] Double-check the CV Design delivery timeline (currently described generically — add a specific number of days once decided).
