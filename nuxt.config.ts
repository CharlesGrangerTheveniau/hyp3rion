// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  
  
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/3-temp.png' }
      ]
    }
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
  runtimeConfig: {
    public: {
      stripePkKey: process.env.STRIPE_PK_KEY
    }
  },
  compatibilityDate: "2024-11-27"
})


