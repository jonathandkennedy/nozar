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

## TO DO before spending a dollar
1. **Form endpoint** — `CONFIG.formEndpoint` is EMPTY (form shows success but sends
   nothing). Create a Formspree form (or Zapier/Make webhook → CRM + instant SMS),
   paste the URL into `CONFIG.formEndpoint` in `car-accident.html`, re-run both build
   commands. Payload: `{name, phone, when, injured, case_type, geo, page, submitted,
   _subject:"NozarLawPPC"}`. Speed-to-lead is the whole game: 5-min response = 21x
   qualification (MIT).
2. **GTM container** — `CONFIG.gtmId` in `car-accident.html` AND `GTM_ID` in
   `thank-you.html` are empty. One container for all pages. Events already pushed:
   `call_click` (any tel tap, with case_type+geo) and `lead_form_submit` (fires on
   thank-you.html with case_type/geo/lang). Wire GA4 + Google Ads conversions to
   those; count calls as conversions (56% of legal conversions are calls). Use EITHER
   the event OR a /thank-you.html page trigger — not both (double-counts).
3. **Domain** — deploy to Vercel (`npx vercel --prod`, static, no build step) behind a
   firm-domain subdomain, e.g. `cases.nozarlaw.com` (CNAME → cname.vercel-dns.com).
   **Never run ads to *.vercel.app** — display URL must match final URL domain.
4. **Client sign-off** — Josh should confirm: the $6.8M line + its labeling, the
   "we limit our caseload" claims (his own site's words), 24/7 answering, and the
   Super Lawyers Rising Stars reference.

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
