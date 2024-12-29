// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: 'dark'
  },
  devServer: {
    host: 'dev.th3mis.io',
    port: 3000
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/supabase",
    '@formkit/auto-animate',
    '@pinia/nuxt',
    'nuxt-resend'
  ],
  css: ['~/assets/css/main.css'],
  supabase: {
    /* redirect: false, */
    redirectOptions: {
      login: '/login',
      callback: 'proces',
      exclude: ['/*'], // exclude all routes from middleware
    }
  },
  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2024-11-27"
})