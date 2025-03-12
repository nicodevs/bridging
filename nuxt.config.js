import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  ssr: false,
  bridge: {
    vite: true,
    nitro: true
  }
});
