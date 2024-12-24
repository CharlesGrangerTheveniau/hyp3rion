// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: 'dark'
  },
  modules: [
    "@nuxt/ui", 
    "@nuxt/eslint",
    "@nuxtjs/supabase",
  ],
  css: ['~/assets/css/main.css'],
  supabase: {
    /* redirect: false, */
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/*'], // exclude all routes from middleware
    }
  },
  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2024-11-27"
})