/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub repository name. The site is served from https://<user>.github.io/<REPO_NAME>/,
// so this single value drives the Vite base path (and, later, the PWA scope and start_url).
const REPO_NAME = 'central-casa-app'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
  build: {
    // The Firebase SDK is most of the bundle. Keeping it in its own chunk means a new
    // app version does not invalidate it in the browser and service worker caches.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'firebase', test: /node_modules[\\/](@firebase|firebase)[\\/]/ }],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'node',
  },
})
