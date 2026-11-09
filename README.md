# محلاتي · Mahalati

Check if a shop is open before you travel to it. Interactive demo (fake data, no backend) built as an installable PWA that works offline after the first visit.

## Run

```bash
npm install
npm run dev                      # development
npm run build && npm run preview # production build on http://localhost:4173 (service worker on)
```

## Deploy

Import the repo on Vercel (framework: Vite, output: `dist`), or run `npx vercel --prod`. `vercel.json` handles the SPA fallback.

## Demo flow

Customer asks a shop about a product → Settings (gear on home) → صاحب محل → answer it in الأسئلة and change the status → switch back → the reply and new status show on the list, map and shop page. Reloading resets the demo.
