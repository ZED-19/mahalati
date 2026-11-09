محلاتي (Mahalati) is a fake-MVP installable PWA for a university presentation: Vite + React + TypeScript + Tailwind CSS v4. Interactive UI only, no backend, no auth, no tests.

## Commands

```bash
npm run dev        # dev server (no service worker)
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on :4173, the only way to test install/offline locally
npm run typecheck
npm run lint       # oxlint
npm run icons      # regenerate PWA icons in public/ from public/logo.svg
```

Run lint and build before declaring a task done.

## Layout

- `src/main.tsx`: fonts, router (react-router), service worker registration.
- `src/components/Layout.tsx`: phone-width shell (430px column on wide screens) and the bottom tab bar; tabs differ for customer and owner.
- `src/pages/`: `customer.tsx` (home, map, favorites, my questions), `shop.tsx` (shop page, ask chat), `owner.tsx` (dashboard, inbox, settings).
- `src/data/shops.ts`: all fake data (shops, statuses, hours, map positions, questions).
- `src/store.ts`: zustand store, memory only. A reload resets the demo on purpose.

## Rules

- Arabic UI, RTL everywhere (`<html lang="ar" dir="rtl">`). Times inside Arabic text read as "من 08:00 إلى 21:00", not "08:00 – 21:00" (the dash reverses in RTL).
- Everything must work offline after the first load: no remote fonts, images or scripts. Fonts come from `@fontsource`, icons from `lucide-react`, no emoji.
- Status is always shown with color and a word (مفتوح / مغلق / استراحة); colors live in the `@theme` block of `src/index.css`.
- Tap targets at least 44px; respect `env(safe-area-inset-*)` (`pt-safe` / `pb-safe` helpers).
- PWA config (manifest, precache) is in `vite.config.ts`; Vercel SPA fallback is in `vercel.json`.
