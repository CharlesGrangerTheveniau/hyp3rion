// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: 'dark'
  },
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
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
      callback: '/confirm',
      exclude: ['/*'], // exclude all routes from middleware
    }
  },
  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2024-11-27"
})