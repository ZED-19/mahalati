import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// Run once with `npm run icons`; the PNGs in public/ are committed.
export default defineConfig({
  preset: {
    ...preset,
    maskable: { ...preset.maskable, resizeOptions: { background: '#13201C' } },
    apple: { ...preset.apple, resizeOptions: { background: '#13201C' } },
  },
  images: ['public/logo.svg'],
})
