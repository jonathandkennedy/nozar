# Nozar Law Landers — Deploy & Operate

## What's here (66 pages)
- Masters: `personal-injury.html` · `car-accident.html` · `motorcycle-accident.html` · `rideshare-accident.html` · `truck-accident.html`
- 60 baked city pages: each master × los-angeles, beverly-hills, glendale, burbank,
  pasadena, van-nuys, encino, long-beach, downey, norwalk, west-covina, pomona
- `index.html` — internal review hub (never send ad traffic here) · `thank-you.html` —
  conversion page · `img/` — Josh photo + favicon
- Every page: EN/ES switch (header toggle + "Se Habla Español" chip), `?lang=es`
  deep-link for Spanish ad groups, italic gold city in the headline, 3-step qualifying
  form, sticky mobile call bar, TCPA consent, honeypot
- ALL pages ring **(310) 620-4400** (the firm's real line). Recommended before launch:
  put a CallRail/tracking number in front of it — one edit in `build-masters.mjs`
  (SHARED.phone/phoneDisplay) + re-run the two build commands swaps every page.
- Positioning: anti-billboard-mill ("You're a case, not a case number"), selective
  caseload, Josh-answers-his-phone (backed by real review quotes), 4.9★/40 Google
  reviews (real numbers, Aug 2026), $6.8M labeled honestly as construction-defect /
  complex civil litigation. **Never invent PI settlement amounts** — the firm has not
  published any.

## Rebuild pipeline (edit → regenerate)
```bash
cd /Users/jonkennedy/retainer-reach/nozar/landers
node build-masters.mjs     # injects geo JSON into car-accident.html, derives the other 4 masters
node generate-geo.mjs --all  # bakes 5 masters × 12 cities
```
Edit shared copy in `car-accident.html` (the base), per-case-type copy and the city
list/serve lines in `build-masters.mjs`. New city = one entry in CITIES + re-run both.

## Repo
Canonical repo: https://github.com/jonathandkennedy/nozar (this folder = repo root,
pushed 2026-08-18). Connect it to Vercel for auto-deploy on push to main.

## Form — Formspree (WIRED + TESTED 2026-08-18)
Endpoint `https://formspree.io/f/mqpzggrq` is live in all 5 masters and all 60 baked
pages; verified 200 `{"ok":true}` via the full browser flow AND direct POST (two
submissions named "TEST Setup Check — ignore" are in the Formspree inbox — seeing
them confirms email delivery too). Emails arrive with subject "NozarLawPPC".
Payload: `{name, phone, when, injured, case_type, geo, page, submitted, _subject}`.
TO DO in Formspree settings: route notifications to an inbox intake watches 24/7,
and restrict allowed domains to the production domain once deployed. Free tier =
50 subs/mo; upgrade (or swap endpoint to a Zapier/Make webhook → CRM + instant SMS)
for production. Speed-to-lead is the whole game: 5-min response = 21x qualification
(MIT).

## Tracking — GTM (WIRED + TESTED 2026-08-18)
Container **GTM-TQJQ9F6C** is live in all 5 masters, all 60 baked pages, and
thank-you.html (`CONFIG.gtmId` in car-accident.html + `GTM_ID` in thank-you.html).
Verified in-browser: gtm.js loads and processes both events —
`call_click` {case_type, geo} on any tel tap, and `lead_form_submit`
{case_type, geo, lang} on thank-you.html. (nozarlaw.com itself has NO GTM/GA4 —
checked 2026-08-18; consider adding this same container to the main site.)
**TO DO inside the GTM container** (it's wired but empty): add a GA4 config tag +
Google Ads conversion tags fired on custom-event triggers `call_click` and
`lead_form_submit`; count calls as conversions (56% of legal conversions are
calls). Use EITHER the lead_form_submit event OR a /thank-you.html page trigger —
not both (double-counts). Meta ads: fire the pixel Lead event on the thank-you
pageview. Publish the container when done.

## TO DO before spending a dollar
1. **GTM tags** — see Tracking above: create GA4 + Ads conversion tags inside
   GTM-TQJQ9F6C and publish the container.
2. **Domain** — in Vercel: import the GitHub repo (static, no build step), then add
   a firm-domain subdomain, e.g. `cases.nozarlaw.com` (CNAME → cname.vercel-dns.com).
   **Never run ads to *.vercel.app** — display URL must match final URL domain.
3. **Client sign-off** — Josh should confirm: the $6.8M line + its labeling, the
   "we limit our caseload" claims (his own site's words), 24/7 answering, and the
   Super Lawyers Rising Stars reference.
4. (Recommended) **Tracking number** — put a CallRail number in front of
   (310) 620-4400: edit SHARED.phone/phoneDisplay in `build-masters.mjs` + the two
   hardcoded numbers in `thank-you.html`, re-run builds, push.

## Campaign guidance (from research/cpc-city-selection.md)
- Tier 1 (cheapest CPC): Glendale+Burbank+Pasadena · Downey+Norwalk (**EN + ES ads**,
  ES final URL = `...?lang=es`) · West Covina+Pomona
- Tier 2: Van Nuys+Encino · Beverly Hills (office; LSA synergy)
- Tier 3: LA head terms ($81–107) · Long Beach PI/truck/moto only (car kw = $403) ·
  rideshare via unbranded geo terms ("rideshare accident lawyer los angeles", comp
  0.02) — never bid national uber/lyft terms ($550–620)
- ES arbitrage: "abogado de accidentes los angeles" $80 vs $375 national.

## Cookies / privacy stance
No cookie banner (US-only; a banner costs conversion). Instead: privacy policy link,
CCPA-style "Do Not Sell or Share" footer link (→ nozarlaw.com/privacy-policy — swap
if the firm creates a dedicated opt-out page), TCPA consent checkbox, full attorney-
advertising disclaimer naming Joshua Nozar, Esq.

## Review data provenance (never fabricate)
4.9★/40 Google reviews pulled 2026-08-18 (CID 5816005195696009120). All testimonial
quotes are verbatim excerpts from real Google reviews: Michelle Y (car master),
Jesse Mendibles (other masters), Dave Askari, Nuria H, Candy Del Palacio (form card).
Refresh the count/quotes when it grows.
