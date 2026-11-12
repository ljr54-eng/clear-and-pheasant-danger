# Clear and Pheasant Danger 2026 — v0.9

Static Netlify site with Supabase shared event synchronization. Deploy the **contents** of this folder to your existing hunt Netlify site (not Pack 331).

## Live synchronization
Uses the separate `public.pheasant_2026_events` table in the existing Supabase project, with anonymous Supabase Auth, row-level security, and Realtime. Syncs shots, harvests, double-kill bonuses, messages, GPS pins, and Battle Log stories. Offline local entries are queued until the app is online again. This is a shared group preview, not secure hunter authentication: four-digit PINs live in frontend code and anonymous sessions do not establish hunter identity. Other users can claim a hunter name. Guest is read-only in the app UI, not a security boundary. Do not share sensitive GPS pins publicly.

## Known limitations
Votes, Patriarch's Favor, and editable About text still remain local to the browser pending a more robust permissions model. Realtime updates need network connectivity. Data conflicts from edits to existing shots across different devices are not yet robustly resolved. The original full-card image files still contain the old subtitle in their embedded pixels; the application branding no longer displays it separately. These image assets require a dedicated precision edit before they can be considered subtitle-free.

## Scores
Rooster +10, grouse +25, other legal +20, unrecovered rooster +5, hen incident -15, double kill +20, unique daily longest +10, unique daily most shots +7. Pops is noncompeting.
